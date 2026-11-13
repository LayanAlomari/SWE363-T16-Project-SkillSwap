// Shared skill categories (used by Browse, the service form and Admin > Manage Categories).
// The number of services in each category is counted from services.js, not stored here.

export const initialCategories = [
  { id: 1, name: "Programming" },
  { id: 2, name: "Graphic Design" },
  { id: 3, name: "Languages" },
  { id: 4, name: "Photography" },
  { id: 5, name: "Video Editing" },
  { id: 6, name: "Tutoring" },
];

// Just the names, for dropdowns and filters: ["Programming", "Graphic Design", ...]
export const categoryNames = initialCategories.map((c) => c.name);
