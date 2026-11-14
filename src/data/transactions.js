// Time Credit history.
// amount: positive = credits added, negative = credits taken.
// type: "welcome" | "earned" | "spent" | "held" | "refunded" | "admin"
// Every session entry points to a request in requests.js (requestId).
// For each user, the amounts add up to their credits in mockUsers.js.

export const initialTransactions = [
  // Sara Ahmed (id 2) -> 2 + 1 + 2 + 2 - 2 = 5
  { id: 1, userId: 2, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-09-05" },
  { id: 2, userId: 2, type: "earned", amount: 1, requestId: "REQ-007", description: "English Conversation for Ahmed Ali", date: "2026-10-12" },
  { id: 3, userId: 2, type: "earned", amount: 2, requestId: "REQ-008", description: "Web Design Basics for Najlaa Alanzi", date: "2026-10-20" },
  { id: 4, userId: 2, type: "earned", amount: 2, requestId: "REQ-010", description: "Web Design Basics for Ahmed Ali", date: "2026-10-25" },
  { id: 5, userId: 2, type: "spent", amount: -2, requestId: "REQ-003", description: "Portrait Photography with Ahmed Ali", date: "2026-11-04" },

  // Ahmed Ali (id 4) -> 2 + 13 - 1 - 1 - 2 - 1 + 2 = 12
  { id: 6, userId: 4, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-10-01" },
  { id: 7, userId: 4, type: "admin", amount: 13, requestId: null, description: "Balance adjusted by admin", date: "2026-10-08" },
  { id: 8, userId: 4, type: "spent", amount: -1, requestId: "REQ-007", description: "English Conversation with Sara Ahmed", date: "2026-10-12" },
  { id: 9, userId: 4, type: "spent", amount: -1, requestId: "REQ-009", description: "Math Tutoring with Fatimah Bahri", date: "2026-10-15" },
  { id: 10, userId: 4, type: "spent", amount: -2, requestId: "REQ-010", description: "Web Design Basics with Sara Ahmed", date: "2026-10-25" },
  { id: 11, userId: 4, type: "spent", amount: -1, requestId: "REQ-011", description: "Math Tutoring with Fatimah Bahri", date: "2026-10-28" },
  { id: 12, userId: 4, type: "earned", amount: 2, requestId: "REQ-003", description: "Portrait Photography for Sara Ahmed", date: "2026-11-04" },

  // Najlaa Alanzi (id 3) -> 2 - 2 = 0
  { id: 13, userId: 3, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-10-03" },
  { id: 14, userId: 3, type: "spent", amount: -2, requestId: "REQ-008", description: "Web Design Basics with Sara Ahmed", date: "2026-10-20" },

  // Mohammed Saad (id 5) -> 2 - 1 + 2 = 3
  { id: 15, userId: 5, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-09-10" },
  { id: 16, userId: 5, type: "held", amount: -1, requestId: "REQ-002", description: "Held for English Conversation with Sara Ahmed", date: "2026-11-02" },
  { id: 17, userId: 5, type: "earned", amount: 2, requestId: "REQ-005", description: "Python Basics for Fatimah Bahri", date: "2026-11-06" },

  // Nora Khalid (id 6) -> 2
  { id: 18, userId: 6, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-10-28" },

  // Fatimah Bahri (id 7) -> 2 + 1 + 1 - 2 = 2
  { id: 19, userId: 7, type: "welcome", amount: 2, requestId: null, description: "Welcome credits", date: "2026-09-20" },
  { id: 20, userId: 7, type: "earned", amount: 1, requestId: "REQ-009", description: "Math Tutoring for Ahmed Ali", date: "2026-10-15" },
  { id: 21, userId: 7, type: "earned", amount: 1, requestId: "REQ-011", description: "Math Tutoring for Ahmed Ali", date: "2026-10-28" },
  { id: 22, userId: 7, type: "spent", amount: -2, requestId: "REQ-005", description: "Python Basics with Mohammed Saad", date: "2026-11-06" },
];
