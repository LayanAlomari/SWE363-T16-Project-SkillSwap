import { createContext, useContext, useEffect, useState } from "react";
import { getUsers, saveUsers, addUser, getCurrentUser, setCurrentUser } from "../data/mockUsers";
import { initialServices } from "../data/services";
import { initialRequests } from "../data/requests";
import { initialTransactions } from "../data/transactions";
import { initialReviews } from "../data/reviews";
import { initialCategories } from "../data/categories";

// One shared place for the app's data. Every page reads from here and changes data
// only through the actions below, so all pages stay in sync.
const AppContext = createContext(null);

// Saves a piece of data in the browser so changes survive a page refresh.
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
      // Storage unavailable (e.g. private mode): the app still works for this visit.
    }
  }, [key, value]);
  return [value, setValue];
}

const STORAGE_KEYS = ["skillswap_services", "skillswap_requests", "skillswap_transactions", "skillswap_reviews", "skillswap_categories"];
// When the demo data files change, increase this number so every browser
// drops its old saved copy and loads the new data.
const DATA_VERSION = "5";
try {
  if (localStorage.getItem("skillswap_data_version") !== DATA_VERSION) {
    [...STORAGE_KEYS, "skillswap_users_v2"].forEach((k) => localStorage.removeItem(k));
    localStorage.setItem("skillswap_data_version", DATA_VERSION);
  }
} catch {
  // Storage unavailable: nothing saved to clear.
}

const ACTIVE_STATUSES = ["Pending", "Accepted"];
const today = () => new Date().toISOString().slice(0, 10);
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

  // Users are saved with Razan's helper so login always sees the latest data (e.g. a suspension).
  useEffect(() => saveUsers(users), [users]);

  // Each service's rating and number of reviews are calculated from the reviews,
  // so they always match what is shown on profiles.
  const allServices = savedServices.map((s) => {
    const own = reviews.filter((r) => r.serviceId === s.id);
    const average = own.length ? own.reduce((sum, r) => sum + r.stars, 0) / own.length : 0;
    return { ...s, rating: Math.round(average * 10) / 10, reviewsCount: own.length };
  });
  // Deleted services are kept (so old requests and the wallet still show their name),
  // but they are left out of every list.
  const services = allServices.filter((s) => s.status !== "Deleted");

  const currentUser = users.find((u) => u.id === currentUserId) || null;
  const getUser = (id) => users.find((u) => u.id === id);
  const getService = (id) => allServices.find((s) => s.id === id);
  const getRequest = (id) => requests.find((r) => r.id === id);

  // ---------- Small helpers used by the actions ----------
  function changeCredits(userId, amount) {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, credits: u.credits + amount } : u)));
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
    const user = addUser(data); // Razan's function: saves the new user with the welcome credits
    setUsers(getUsers());
    return user;
  }
  function login(user) {
    setUsers(getUsers()); // pick up anyone who registered since the app opened
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
    if (patch.name !== undefined && !patch.name.trim()) return fail("Full name is required.");
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
    return ok("Request sent! The provider will be notified.");
  }

  function acceptRequest(id) {
    const r = getRequest(id);
    if (!r || r.status !== "Pending") return fail("This request can no longer be accepted.");
    const seeker = getUser(r.seekerId);
    if (seeker.credits < r.credits) return fail(`${seeker.name} no longer has enough credits for this request.`);
    changeCredits(r.seekerId, -r.credits);
    addTransaction(r.seekerId, "held", -r.credits, r.id, `Held for ${getService(r.serviceId)?.title} with ${getUser(r.providerId)?.name}`);
    updateRequest(id, { status: "Accepted" });
    return ok("Request accepted. The credits are now held until the session is done.");
  }

  function rejectRequest(id) {
    const r = getRequest(id);
    if (!r || r.status !== "Pending") return fail("This request can no longer be rejected.");
    updateRequest(id, { status: "Rejected" });
    return ok("Request rejected.");
  }

  function cancelRequest(id) {
    const r = getRequest(id);
    if (!r || !ACTIVE_STATUSES.includes(r.status)) return fail("This request can no longer be cancelled.");
    if (r.status === "Accepted") {
      changeCredits(r.seekerId, r.credits);
      addTransaction(r.seekerId, "refunded", r.credits, r.id, `Refund for cancelled ${getService(r.serviceId)?.title}`);
    }
    updateRequest(id, { status: "Cancelled" });
    return ok("Request cancelled.");
  }

  function completeRequest(id) {
    const r = getRequest(id);
    // Only an Accepted request can be completed, so credits can never be transferred twice (NFR 15).
    if (!r || r.status !== "Accepted") return fail("This request has already been completed or is not accepted yet.");
    const title = getService(r.serviceId)?.title;
    updateRequest(id, { status: "Completed" });
    setTransactions((prev) =>
      prev.map((t) =>
        t.requestId === id && t.type === "held"
          ? { ...t, type: "spent", description: `${title} with ${getUser(r.providerId)?.name}` }
          : t
      )
    );
    changeCredits(r.providerId, r.credits);
    addTransaction(r.providerId, "earned", r.credits, id, `${title} for ${getUser(r.seekerId)?.name}`);
    return ok(`Session completed! ${r.credits} credit${r.credits > 1 ? "s" : ""} transferred.`);
  }

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
    return ok("Thank you! Your rating has been submitted.");
  }

  // ---------- Admin actions (for Layan2's pages) ----------
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

  // ---------- Testing helper: put all sample data back ----------
  function resetDemoData() {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
    setServices(initialServices);
    setRequests(initialRequests);
    setTransactions(initialTransactions);
    setReviews(initialReviews);
    setCategories(initialCategories);
  }

  const value = {
    users, currentUser, services, requests, transactions, reviews, categories,
    getUser, getService, getRequest,
    registerUser, login, logout, updateUser, updateProfile,
    addService, editService, deleteService,
    sendRequest, acceptRequest, rejectRequest, cancelRequest, completeRequest,
    addReview,
    setUserStatus, adjustBalance, addCategory, renameCategory, deleteCategory,
    resetDemoData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
