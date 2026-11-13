// Shared Time Credit history (used by the Wallet page and Admin > Adjust Balance).
// amount: positive = credits added, negative = credits taken.
// type: "welcome" | "earned" | "spent" | "held" | "refunded" | "admin"
// For each user, the amounts add up to their credits in mockUsers.js.

export const initialTransactions = [
  // Sara Ahmed (id 2) -> balance 5
  { id: 1, userId: 2, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-09-05" },
  { id: 2, userId: 2, type: "earned", amount: 3, requestId: null, description: "English Conversation sessions", date: "2026-10-12" },
  { id: 3, userId: 2, type: "earned", amount: 2, requestId: null, description: "Web Design Basics with Najlaa Alanzi", date: "2026-10-20" },
  { id: 4, userId: 2, type: "spent", amount: -2, requestId: "REQ-003", description: "Portrait Photography with Ahmed Ali", date: "2026-11-04" },

  // Ahmed Ali (id 4) -> balance 12
  { id: 5, userId: 4, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-10-01" },
  { id: 6, userId: 4, type: "earned", amount: 2, requestId: "REQ-003", description: "Portrait Photography for Sara Ahmed", date: "2026-11-04" },
  { id: 7, userId: 4, type: "admin", amount: 8, requestId: null, description: "Balance adjusted by admin", date: "2026-11-06" },

  // Najlaa Alanzi (id 3) -> balance 0
  { id: 8, userId: 3, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-10-03" },
  { id: 9, userId: 3, type: "spent", amount: -2, requestId: null, description: "Web Design Basics with Sara Ahmed", date: "2026-10-20" },

  // Mohammed Saad (id 5) -> balance 3
  { id: 10, userId: 5, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-09-10" },
  { id: 11, userId: 5, type: "earned", amount: 2, requestId: "REQ-005", description: "Python Basics for Fatimah Bahri", date: "2026-11-06" },
  { id: 12, userId: 5, type: "held", amount: -1, requestId: "REQ-002", description: "Held for English Conversation with Sara Ahmed", date: "2026-11-02" },

  // Nora Khalid (id 6) -> balance 2
  { id: 13, userId: 6, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-11-08" },

  // Fatimah Bahri (id 7) -> balance 2
  { id: 14, userId: 7, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-09-20" },
  { id: 15, userId: 7, type: "earned", amount: 2, requestId: null, description: "Math Tutoring sessions", date: "2026-10-15" },
  { id: 16, userId: 7, type: "spent", amount: -2, requestId: "REQ-005", description: "Python Basics with Mohammed Saad", date: "2026-11-06" },
];
