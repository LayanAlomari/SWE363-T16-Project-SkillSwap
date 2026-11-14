// Notifications. Each one belongs to one user (userId).
// New ones are created by the request actions in AppContext.
// link = the page that opens when the notification is clicked.

export const initialNotifications = [
  // Sara Ahmed (id 2)
  { id: 1, userId: 2, title: "New service request", description: "Ahmed Ali requested Web Design Basics.", link: "/requests", read: false, date: "2026-11-10" },
  { id: 2, userId: 2, title: "New review", description: "Ahmed Ali rated English Conversation 5 stars.", link: "/profile", read: true, date: "2026-10-12" },

  // Mohammed Saad (id 5)
  { id: 3, userId: 5, title: "Request accepted", description: "Sara Ahmed accepted your request for English Conversation.", link: "/requests?tab=sent", read: false, date: "2026-11-02" },
  { id: 4, userId: 5, title: "Credits received", description: "You received 2 credits for Python Basics with Fatimah Bahri.", link: "/wallet", read: true, date: "2026-11-06" },

  // Ahmed Ali (id 4)
  { id: 5, userId: 4, title: "Rate your session", description: "How was Web Design Basics with Sara Ahmed? Leave a rating.", link: "/requests?tab=sent", read: false, date: "2026-10-25" },
  { id: 6, userId: 4, title: "Request rejected", description: "Mohammed Saad couldn't take your request for Python Basics.", link: "/requests?tab=sent", read: true, date: "2026-11-04" },

  // Nora Khalid (id 6)
  { id: 7, userId: 6, title: "New service request", description: "Sara Ahmed requested Logo Design.", link: "/requests", read: false, date: "2026-11-01" },

  // Fatimah Bahri (id 7)
  { id: 8, userId: 7, title: "Rate your session", description: "How was Python Basics with Mohammed Saad? Leave a rating.", link: "/requests?tab=sent", read: false, date: "2026-11-06" },

  // Admin (id 1)
  { id: 9, userId: 1, title: "New member", description: "Nora Khalid joined Skill Swap.", link: "/admin/users", read: false, date: "2026-10-28" },
  { id: 10, userId: 1, title: "Account suspended", description: "Najlaa Alanzi's account was suspended.", link: "/admin/users", read: true, date: "2026-11-05" },
];
