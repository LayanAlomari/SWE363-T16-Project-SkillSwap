// Mock users for the front-end prototype (no backend in this milestone).
// New accounts are saved in the browser's localStorage so they survive a page refresh.

const STORAGE_KEY = "skillswap_users";
const CURRENT_USER_KEY = "skillswap_current_user";

export const INITIAL_CREDITS = 2;

const defaultUsers = [
  { id: 1, name: "Admin", email: "admin@skillswap.com", password: "admin123", role: "admin", status: "Active", credits: 0 },
  { id: 2, name: "Sara Ahmed", email: "sara@email.com", password: "sara123", role: "user", status: "Active", credits: 5 },
  { id: 3, name: "Najlaa Alanzi", email: "najlaa@email.com", password: "najlaa123", role: "user", status: "Suspended", credits: 0 },
];

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (e.g. private mode); the app still works for this session.
  }
}

export function getUsers() {
  return readStorage(STORAGE_KEY, defaultUsers);
}

export function findUserByEmail(email) {
  return getUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function addUser({ name, email, password }) {
  const users = getUsers();
  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    password,
    role: "user",
    status: "Active",
    credits: INITIAL_CREDITS,
  };
  writeStorage(STORAGE_KEY, [...users, newUser]);
  return newUser;
}

export function updatePassword(email, newPassword) {
  const users = getUsers().map((u) =>
    u.email.toLowerCase() === email.toLowerCase() ? { ...u, password: newPassword } : u
  );
  writeStorage(STORAGE_KEY, users);
}

export function setCurrentUser(user) {
  writeStorage(CURRENT_USER_KEY, user);
}

export function getCurrentUser() {
  return readStorage(CURRENT_USER_KEY, null);
}
