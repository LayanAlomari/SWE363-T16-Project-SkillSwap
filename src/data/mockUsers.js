// Mock users for the front-end prototype (no backend in this milestone).
// New accounts are saved in the browser's localStorage so they survive a page refresh.

const STORAGE_KEY = "skillswap_users_v2";
const CURRENT_USER_KEY = "skillswap_current_user";

export const INITIAL_CREDITS = 2;

// Shared users for the whole app (login, profiles, admin pages).
// Profile fields: bio, skills, wantsToLearn, availability (null = unavailable that day).
const noAvailability = { Sunday: null, Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null, Saturday: null };

const defaultUsers = [
  {
    id: 1, name: "Admin", email: "admin@skillswap.com", password: "admin123",
    role: "admin", status: "Active", credits: 0, joined: "Sep 2026",
    headline: "Skill Swap Administrator", bio: "", skills: [], wantsToLearn: [], languages: [], availability: noAvailability,
  },
  {
    id: 2, name: "Sara Ahmed", email: "sara@email.com", password: "sara123",
    role: "user", status: "Active", credits: 5, joined: "Sep 2026",
    headline: "English teacher · Web design hobbyist · Riyadh",
    bio: "I teach English conversation and love building simple websites. Happy to help beginners in both.",
    skills: ["English Tutoring", "Web Design"], wantsToLearn: ["Photography", "Graphic Design"], languages: ["Arabic", "English"],
    availability: { ...noAvailability, Sunday: "6:00 – 9:00 PM", Monday: "7:00 – 9:00 PM", Saturday: "2:00 – 6:00 PM" },
  },
  {
    id: 3, name: "Najlaa Alanzi", email: "najlaa@email.com", password: "najlaa123",
    role: "user", status: "Suspended", credits: 0, joined: "Oct 2026",
    headline: "Video editor · Jeddah",
    bio: "I edit short videos for social media.",
    skills: ["Video Editing"], wantsToLearn: ["Web Design"], languages: ["Arabic"],
    availability: noAvailability,
  },
  {
    id: 4, name: "Ahmed Ali", email: "ahmed@email.com", password: "ahmed123",
    role: "user", status: "Active", credits: 12, joined: "Oct 2026",
    headline: "Photographer · Dammam",
    bio: "Portrait and product photographer. I enjoy teaching lighting and posing basics.",
    skills: ["Photography"], wantsToLearn: ["Web Design", "Programming"], languages: ["Arabic", "English"],
    availability: { ...noAvailability, Tuesday: "5:00 – 8:00 PM", Thursday: "5:00 – 8:00 PM" },
  },
  {
    id: 5, name: "Mohammed Saad", email: "mohammed@email.com", password: "mohammed123",
    role: "user", status: "Active", credits: 3, joined: "Sep 2026",
    headline: "Computer science student · Riyadh",
    bio: "I help beginners start programming with Python.",
    skills: ["Programming"], wantsToLearn: ["English Conversation"], languages: ["Arabic", "English"],
    availability: { ...noAvailability, Wednesday: "4:00 – 7:00 PM", Thursday: "6:00 – 9:00 PM" },
  },
  {
    id: 6, name: "Nora Khalid", email: "nora@email.com", password: "nora123",
    role: "user", status: "Active", credits: 2, joined: "Nov 2026",
    headline: "Graphic designer · Riyadh",
    bio: "New to Skill Swap. I design logos and social media posts.",
    skills: ["Graphic Design"], wantsToLearn: ["Photography"], languages: ["Arabic", "English"],
    availability: { ...noAvailability, Sunday: "6:00 – 8:00 PM" },
  },
  {
    id: 7, name: "Fatimah Bahri", email: "fatimah@example.com", password: "fatimah123",
    role: "user", status: "Active", credits: 2, joined: "Sep 2026",
    headline: "Math student · Khobar",
    bio: "I tutor calculus and statistics, and I am learning to code.",
    skills: ["Tutoring"], wantsToLearn: ["Programming"], languages: ["Arabic", "English"],
    availability: { ...noAvailability, Monday: "4:00 – 6:00 PM", Friday: "2:00 – 5:00 PM" },
  },
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
