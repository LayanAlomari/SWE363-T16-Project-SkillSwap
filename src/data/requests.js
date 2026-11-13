// Shared service requests (seeker asks a provider for a service).
//
// Status flow and credit rule:
//   Pending   -> request sent, no credits move yet
//   Accepted  -> provider accepted, the seeker's credits are HELD
//   Completed -> provider marked it done, held credits move to the provider
//   Rejected  -> provider rejected (held credits, if any, go back to the seeker)
//   Cancelled -> seeker cancelled before completion (held credits go back)

export const initialRequests = [
  {
    id: "REQ-001",
    serviceId: 2, // Logo Design
    seekerId: 2, // Sara Ahmed
    providerId: 6, // Nora Khalid
    credits: 1,
    status: "Pending",
    date: "2026-11-01",
    sessionTime: "Sun, Nov 16 · 6:00 PM",
    message: "I need a logo for my study club.",
    rated: false,
  },
  {
    id: "REQ-002",
    serviceId: 3, // English Conversation
    seekerId: 5, // Mohammed Saad
    providerId: 2, // Sara Ahmed
    credits: 1,
    status: "Accepted",
    date: "2026-11-02",
    sessionTime: "Mon, Nov 17 · 7:00 PM",
    message: "I want to practice for a job interview.",
    rated: false,
  },
  {
    id: "REQ-003",
    serviceId: 5, // Portrait Photography
    seekerId: 2, // Sara Ahmed
    providerId: 4, // Ahmed Ali
    credits: 2,
    status: "Completed",
    date: "2026-11-03",
    sessionTime: "Tue, Nov 4 · 5:00 PM",
    message: "",
    rated: true,
  },
  {
    id: "REQ-004",
    serviceId: 1, // Python Basics
    seekerId: 4, // Ahmed Ali
    providerId: 5, // Mohammed Saad
    credits: 2,
    status: "Rejected",
    date: "2026-11-04",
    sessionTime: "Wed, Nov 5 · 4:00 PM",
    message: "",
    rated: false,
  },
  {
    id: "REQ-005",
    serviceId: 1, // Python Basics
    seekerId: 7, // Fatimah Bahri
    providerId: 5, // Mohammed Saad
    credits: 2,
    status: "Completed",
    date: "2026-11-05",
    sessionTime: "Thu, Nov 6 · 6:00 PM",
    message: "",
    rated: false,
  },
  {
    id: "REQ-006",
    serviceId: 4, // Web Design Basics
    seekerId: 4, // Ahmed Ali
    providerId: 2, // Sara Ahmed
    credits: 2,
    status: "Pending",
    date: "2026-11-10",
    sessionTime: "Sat, Nov 22 · 4:00 PM",
    message: "Can we focus on making a portfolio page?",
    rated: false,
  },
];
