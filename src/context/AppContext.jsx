import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getUsers, saveUsers, addUser, getCurrentUser, setCurrentUser } from "../data/mockUsers";
import { initialServices } from "../data/services";
import { initialRequests } from "../data/requests";
import { initialTransactions } from "../data/transactions";
import { initialReviews } from "../data/reviews";
import { initialCategories } from "../data/categories";
import { initialNotifications } from "../data/notifications";
import { initialMessages } from "../data/messages";

// Shared app data and the actions that change it.
const AppContext = createContext(null);

// State that is also saved in localStorage.
function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage not available: keep the data in memory only.
    }
  }, [key, value]);
  return [value, setValue];
}

const STORAGE_KEYS = ["skillswap_services", "skillswap_requests", "skillswap_transactions", "skillswap_reviews", "skillswap_categories", "skillswap_notifications", "skillswap_messages"];
// Version of the demo data. When it changes, old saved data is cleared.
const DATA_VERSION = "7";
try {
  if (localStorage.getItem("skillswap_data_version") !== DATA_VERSION) {
    [...STORAGE_KEYS, "skillswap_users_v2"].forEach((k) => localStorage.removeItem(k));
    localStorage.setItem("skillswap_data_version", DATA_VERSION);
  }
} catch {
  // localStorage not available.
}

// Finishing a session: the provider marks it done, then the seeker confirms it.
// If the seeker doesn't answer within CONFIRM_HOURS, it is completed automatically.
export const AWAITING = "Awaiting confirmation";
export const CONFIRM_HOURS = 48;
export const confirmDeadline = (r) => new Date(new Date(r.markedDoneAt).getTime() + CONFIRM_HOURS * 3600 * 1000);

const ACTIVE_STATUSES = ["Pending", "Accepted", AWAITING];
// Today's local date as "YYYY-MM-DD".
const today = () => new Date().toLocaleDateString("en-CA");
const ok = (message) => ({ ok: true, message });
const fail = (error) => ({ ok: false, error });

export function AppProvider({ children }) {
  // ---------- Data ----------
  const [users, setUsers] = useState(getUsers);
  const [currentUserId, setCurrentUserId] = useState(() => getCurrentUser()?.id ?? null);
  const [savedServices, setServices] = usePersistentState("skillswap_services", initialServices);
  const [requests, setRequests] = usePersistentState("skillswap_requests", initialRequests);
  const [transactions, setTransactions] = usePersistentState("skillswap_transactions", initialTransactions);
  const [reviews, setReviews] = usePersistentState("skillswap_reviews", initialReviews);
  const [categories, setCategories] = usePersistentState("skillswap_categories", initialCategories);
  const [notifications, setNotifications] = usePersistentState("skillswap_notifications", initialNotifications);
  const [messages, setMessages] = usePersistentState("skillswap_messages", initialMessages);

  // Save users to localStorage whenever they change.
  useEffect(() => saveUsers(users), [users]);

  // Each service's rating and review count, calculated from the reviews.
  const allServices = savedServices.map((s) => {
    const own = reviews.filter((r) => r.serviceId === s.id);
    const average = own.length ? own.reduce((sum, r) => sum + r.stars, 0) / own.length : 0;
    return { ...s, rating: Math.round(average * 10) / 10, reviewsCount: own.length };
  });
  // Deleted services are kept for old requests but hidden from all lists.
  const services = allServices.filter((s) => s.status !== "Deleted");

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const getUser = (id) => users.find((u) => u.id === id);
  const getService = (id) => allServices.find((s) => s.id === id);
  const getRequest = (id) => requests.find((r) => r.id === id);

  // ---------- Helpers ----------
  function changeCredits(userId, amount) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, credits: u.credits + amount } : u)));
  }
  // Adds a notification for one user.
  function notify(userId, title, description, link) {
    setNotifications((prev) => [
      { id: Date.now() + Math.random(), userId, title, description, link, read: false, date: today() },
      ...prev,
    ]);
  }
  function addTransaction(userId, type, amount, requestId, description) {
    setTransactions((prev) => [
      { id: Date.now() + Math.random(), userId, type, amount, requestId, description, date: today() },
      ...prev,
    ]);
  }
  function updateRequest(id, patch) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function nextRequestId() {
    const highest = Math.max(0, ...requests.map((r) => Number(r.id.split("-")[1]) || 0));
    return "REQ-" + String(highest + 1).padStart(3, "0");
  }

  // ---------- Account ----------
  function registerUser(data) {
    const user = addUser(data); // saves the user with the welcome credits
    const joined = new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }); // e.g. "Nov 2026"
    setUsers(getUsers().map((u) => (u.id === user.id ? { ...u, joined } : u)));
    addTransaction(user.id, "welcome", user.credits, null, "Welcome credits"); // first entry in the credit history
    return { ...user, joined };
  }
  function login(user) {
    setUsers(getUsers()); // reload users from localStorage
    setCurrentUser(user);
    setCurrentUserId(user.id);
  }
  function logout() {
    setCurrentUser(null);
    setCurrentUserId(null);
  }
  function updateUser(id, patch) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  }
  function updateProfile(patch) {
    if (!currentUser) return fail("Please log in first.");
    if (patch.name !== undefined && patch.name.trim().length < 3) return fail("Please enter your full name.");
    if ((patch.headline?.length ?? 0) > 80 || (patch.bio?.length ?? 0) > 300) return fail("Your headline or bio is too long.");
    updateUser(currentUser.id, patch);
    return ok("Profile updated successfully.");
  }

  // ---------- My Services ----------
  // data = { title, category, durationHours, description }. Price rule: 1 hour = 1 Time Credit.
  function addService(data) {
    if (!currentUser) return fail("Please log in first.");
    setServices((prev) => [
      ...prev,
      { ...data, id: Date.now(), providerId: currentUser.id, credits: data.durationHours, status: "Active" },
    ]);
    return ok(`"${data.title}" was added to your services.`);
  }
  function editService(id, data) {
    const service = getService(id);
    if (!service || service.providerId !== currentUserId) return fail("You can only edit your own services.");
    // Requests that were already sent keep the price they were sent with.
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...data, credits: data.durationHours } : s)));
    return ok("Your changes were saved.");
  }
  function deleteService(id) {
    const service = getService(id);
    if (!service || service.providerId !== currentUserId) return fail("You can only delete your own services.");
    const hasActiveRequests = requests.some((r) => r.serviceId === id && ACTIVE_STATUSES.includes(r.status));
    if (hasActiveRequests) return fail("This service has active requests. Complete or reject them before deleting it.");
    const hasHistory = requests.some((r) => r.serviceId === id);
    setServices((prev) =>
      hasHistory
        ? prev.map((s) => (s.id === id ? { ...s, status: "Deleted" } : s)) // keep it for old requests
        : prev.filter((s) => s.id !== id)
    );
    return ok(`"${service.title}" was deleted.`);
  }

  // ---------- Requests (credit rule: held on accept, moved on complete, returned on cancel) ----------
  function sendRequest(serviceId, sessionTime, message = "") {
    const service = getService(serviceId);
    if (!currentUser) return fail("Please log in or create an account to request this service.");
    if (!service) return fail("Service not found.");
    if (service.providerId === currentUser.id) return fail("You cannot request your own service.");
    if (currentUser.credits < service.credits) return { ...fail("Not enough Time Credits."), notEnoughCredits: true };
    setRequests((prev) => [
      ...prev,
      {
        id: nextRequestId(), serviceId, seekerId: currentUser.id, providerId: service.providerId,
        credits: service.credits, status: "Pending", date: today(), sessionTime, message, rated: false,
      },
    ]);
    notify(service.providerId, "New service request", `${currentUser.name} requested ${service.title}.`, "/requests");
    return ok("Request sent! The provider will be notified.");
  }

  function acceptRequest(id) {
    const r = getRequest(id);
    if (!r || r.status !== "Pending") return fail("This request can no longer be accepted.");
    if (r.providerId !== currentUserId) return fail("Only the member offering this service can accept it.");
    const seeker = getUser(r.seekerId);
    if (seeker.credits < r.credits) return fail(`${seeker.name} no longer has enough credits for this request.`);
    changeCredits(r.seekerId, -r.credits);
    addTransaction(r.seekerId, "held", -r.credits, r.id, `Held for ${getService(r.serviceId)?.title} with ${getUser(r.providerId)?.name}`);
    updateRequest(id, { status: "Accepted" });
    notify(r.seekerId, "Request accepted", `${getUser(r.providerId)?.name} accepted your request for ${getService(r.serviceId)?.title}.`, "/requests?tab=sent");
    return ok("Request accepted. The credits are now held until the session is done.");
  }

  function rejectRequest(id) {
    const r = getRequest(id);
    if (!r || r.status !== "Pending") return fail("This request can no longer be rejected.");
    if (r.providerId !== currentUserId) return fail("Only the member offering this service can reject it.");
    updateRequest(id, { status: "Rejected" });
    notify(r.seekerId, "Request rejected", `${getUser(r.providerId)?.name} couldn't take your request for ${getService(r.serviceId)?.title}.`, "/requests?tab=sent");
    return ok(`Request from ${getUser(r.seekerId)?.name} rejected.`);
  }

  function cancelRequest(id) {
    const r = getRequest(id);
    if (r?.status === AWAITING) return fail("This session was marked as done. Confirm it, or tell us it didn't happen.");
    if (!r || !["Pending", "Accepted"].includes(r.status)) return fail("This request can no longer be cancelled.");
    if (r.seekerId !== currentUserId && currentUser?.role !== "admin") return fail("Only the member who sent this request can cancel it.");
    if (r.status === "Accepted") {
      changeCredits(r.seekerId, r.credits);
      addTransaction(r.seekerId, "refunded", r.credits, r.id, `Refund for cancelled ${getService(r.serviceId)?.title}`);
    }
    updateRequest(id, { status: "Cancelled" });
    notify(r.providerId, "Request cancelled", `${getUser(r.seekerId)?.name} cancelled their request for ${getService(r.serviceId)?.title}.`, "/requests");
    return ok(r.status === "Accepted" ? `Request cancelled. ${r.credits} credit${r.credits > 1 ? "s were" : " was"} returned to your balance.` : "Request cancelled.");
  }

  // Step 1 (provider): the session took place
  function markDone(id) {
    const r = getRequest(id);
    if (!r || r.status !== "Accepted") return fail("Only accepted sessions can be marked as done.");
    if (r.providerId !== currentUserId) return fail("Only the member offering this service can mark it as done.");
    updateRequest(id, { status: AWAITING, markedDoneAt: new Date().toISOString(), notYet: false });
    notify(r.seekerId, "Please confirm your session", `${getUser(r.providerId)?.name} marked ${getService(r.serviceId)?.title} as done. Did it take place?`, "/requests?tab=sent");
    return ok(`Marked as done. ${getUser(r.seekerId)?.name} will be asked to confirm.`);
  }

  // Step 2 (seeker): confirm it, and the held credits go to the provider
  function confirmDone(id) {
    const r = getRequest(id);
    if (!r || r.status !== AWAITING) return fail("This session is not waiting for your confirmation.");
    if (r.seekerId !== currentUserId) return fail("Only the member who requested this session can confirm it.");
    finishRequest(r);
    return ok(`Thanks for confirming! ${r.credits} credit${r.credits > 1 ? "s were" : " was"} sent to ${getUser(r.providerId)?.name}.`);
  }

  // Step 2 (seeker): the session didn't happen, so it goes back to Accepted and the credits stay held
  function reportNotDone(id) {
    const r = getRequest(id);
    if (!r || r.status !== AWAITING) return fail("This session is not waiting for your confirmation.");
    if (r.seekerId !== currentUserId) return fail("Only the member who requested this session can do this.");
    updateRequest(id, { status: "Accepted", markedDoneAt: null, notYet: true }); // notYet: shown to the provider
    notify(r.providerId, "Session not confirmed", `${getUser(r.seekerId)?.name} said ${getService(r.serviceId)?.title} hasn't happened yet.`, "/requests");
    return ok(`Okay, the session is back to Accepted and your credits are still held. ${getUser(r.providerId)?.name} will see that it hasn't happened yet.`);
  }

  // Moves the held credits to the provider (on confirm or automatically).
  // A request can only be finished once, so credits are never transferred twice.
  const finished = useRef(new Set());
  function finishRequest(r) {
    if (finished.current.has(r.id)) return;
    finished.current.add(r.id);
    const title = getService(r.serviceId)?.title;
    updateRequest(r.id, { status: "Completed" });
    setTransactions((prev) =>
      prev.map((t) =>
        t.requestId === r.id && t.type === "held"
          ? { ...t, type: "spent", description: `${title} with ${getUser(r.providerId)?.name}`, date: today() }
          : t
      )
    );
    changeCredits(r.providerId, r.credits);
    addTransaction(r.providerId, "earned", r.credits, r.id, `${title} for ${getUser(r.seekerId)?.name}`);
    notify(r.providerId, "Credits received", `You received ${r.credits} credit${r.credits > 1 ? "s" : ""} for ${title} with ${getUser(r.seekerId)?.name}.`, "/wallet");
  }

  // Fallback: complete sessions the seeker didn't confirm within CONFIRM_HOURS (checked every minute)
  useEffect(() => {
    function autoComplete() {
      requests
        .filter((r) => r.status === AWAITING && Date.now() >= confirmDeadline(r).getTime())
        .forEach(finishRequest);
    }
    autoComplete();
    const timer = setInterval(autoComplete, 60 * 1000);
    return () => clearInterval(timer);
  }, [requests]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- Reviews ----------
  function addReview(requestId, stars, comment = "") {
    const r = getRequest(requestId);
    if (!r || r.status !== "Completed") return fail("You can only rate completed sessions.");
    if (r.rated) return fail("You have already rated this session.");
    if (r.seekerId !== currentUserId) return fail("Only the member who requested the service can rate it.");
    if (!stars || stars < 1 || stars > 5) return fail("Please choose a rating from 1 to 5 stars.");
    setReviews((prev) => [
      { id: Date.now(), requestId, serviceId: r.serviceId, reviewerId: r.seekerId, providerId: r.providerId, stars, comment: comment.trim(), date: today() },
      ...prev,
    ]);
    updateRequest(requestId, { rated: true }); // the service's rating updates automatically
    notify(r.providerId, "New review", `${getUser(r.seekerId)?.name} rated ${getService(r.serviceId)?.title} ${stars} star${stars > 1 ? "s" : ""}.`, "/profile");
    return ok("Thank you! Your rating has been submitted.");
  }

  // ---------- Admin actions ----------
  function setUserStatus(id, status) {
    updateUser(id, { status });
    setServices((prev) =>
      prev.map((s) =>
        s.providerId === id && s.status !== "Deleted" ? { ...s, status: status === "Suspended" ? "Hidden" : "Active" } : s
      )
    );
  }
  function adjustBalance(userId, amount, reason) {
    const user = getUser(userId);
    if (!user) return fail("User not found.");
    if (user.credits + amount < 0) return fail("Insufficient credits.");
    changeCredits(userId, amount);
    addTransaction(userId, "admin", amount, null, reason);
    notify(userId, "Balance updated", `An admin ${amount > 0 ? "added" : "removed"} ${Math.abs(amount)} credit${Math.abs(amount) > 1 ? "s" : ""}: ${reason}`, "/wallet");
    return ok("Balance updated successfully.");
  }
  function addCategory(name) {
    const value = name.trim();
    if (!value) return fail("Enter a category name.");
    if (categories.some((c) => c.name.toLowerCase() === value.toLowerCase())) return fail("Category already exists.");
    setCategories((prev) => [...prev, { id: Date.now(), name: value }]);
    return ok("Category added.");
  }
  function renameCategory(id, name) {
    const value = name.trim();
    const old = categories.find((c) => c.id === id);
    if (!value) return fail("Enter a category name.");
    if (categories.some((c) => c.id !== id && c.name.toLowerCase() === value.toLowerCase())) return fail("Category already exists.");
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: value } : c)));
    setServices((prev) => prev.map((s) => (s.category === old?.name ? { ...s, category: value } : s)));
    return ok("Category updated.");
  }
  function deleteCategory(id) {
    const cat = categories.find((c) => c.id === id);
    if (services.some((s) => s.category === cat?.name)) return fail("This category still has services. Move or delete them first.");
    setCategories((prev) => prev.filter((c) => c.id !== id));
    return ok("Category deleted.");
  }

  // ---------- Notifications ----------
  const myNotifications = notifications
    .filter((n) => n.userId === currentUserId)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id); // newest first
  const unreadCount = myNotifications.filter((n) => !n.read).length;
  function markNotificationRead(id) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }
  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => (n.userId === currentUserId ? { ...n, read: true } : n)));
  }
  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // ---------- Messages (chat between two members) ----------
  // My conversations, newest first: [{ otherId, user, messages (oldest first), last, unread }]
  const myConversations = Object.values(
    messages
      .filter((m) => m.fromId === currentUserId || m.toId === currentUserId)
      .reduce((groups, m) => {
        const otherId = m.fromId === currentUserId ? m.toId : m.fromId;
        (groups[otherId] ||= { otherId, messages: [] }).messages.push(m);
        return groups;
      }, {})
  )
    .map((c) => {
      const sorted = [...c.messages].sort((a, b) => a.sentAt.localeCompare(b.sentAt));
      return {
        ...c,
        user: getUser(c.otherId),
        messages: sorted,
        last: sorted[sorted.length - 1],
        unread: sorted.filter((m) => m.toId === currentUserId && !m.read).length,
      };
    })
    .sort((a, b) => b.last.sentAt.localeCompare(a.last.sentAt));
  const unreadMessages = myConversations.reduce((sum, c) => sum + c.unread, 0);

  function sendMessage(toId, text) {
    const value = text.trim();
    const to = getUser(toId);
    if (!currentUser) return fail("Please log in first.");
    if (!value) return fail("Write a message first.");
    if (value.length > 1000) return fail("Messages can be at most 1000 characters.");
    if (!to || to.id === currentUserId) return fail("You can't message this member.");
    if (to.status !== "Active") return fail("This member's account isn't active.");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), fromId: currentUserId, toId, text: value, sentAt: new Date().toISOString(), read: false },
    ]);
    return ok("Message sent.");
  }
  // Opening a conversation marks the messages I received in it as read
  function markConversationRead(otherId) {
    if (!messages.some((m) => m.fromId === otherId && m.toId === currentUserId && !m.read)) return;
    setMessages((prev) => prev.map((m) => (m.fromId === otherId && m.toId === currentUserId ? { ...m, read: true } : m)));
  }

  // ---------- Reset to the demo data ----------
  function resetDemoData() {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
    setServices(initialServices);
    setRequests(initialRequests);
    setTransactions(initialTransactions);
    setReviews(initialReviews);
    setCategories(initialCategories);
    setNotifications(initialNotifications);
    setMessages(initialMessages);
  }

  const value = {
    users, currentUser, services, requests, transactions, reviews, categories,
    getUser, getService, getRequest,
    registerUser, login, logout, updateUser, updateProfile,
    addService, editService, deleteService,
    sendRequest, acceptRequest, rejectRequest, cancelRequest, markDone, confirmDone, reportNotDone,
    addReview,
    setUserStatus, adjustBalance, addCategory, renameCategory, deleteCategory,
    myNotifications, unreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification,
    myConversations, unreadMessages, sendMessage, markConversationRead,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
