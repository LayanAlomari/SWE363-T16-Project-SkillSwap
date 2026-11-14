// Shared chat messages between two members.
// A conversation is all the messages between the same two users (fromId / toId).
// read = whether the receiver (toId) has opened it. sentAt = date and time it was sent.

export const initialMessages = [
  // Ahmed Ali (4) <-> Sara Ahmed (2): his pending Web Design request (REQ-006)
  { id: 1, fromId: 4, toId: 2, text: "Hi Sara! I just sent you a request for Web Design Basics.", sentAt: "2026-11-10T16:05:00", read: true },
  { id: 2, fromId: 2, toId: 4, text: "Hi Ahmed! I saw it, what would you like to build?", sentAt: "2026-11-10T16:20:00", read: true },
  { id: 3, fromId: 4, toId: 2, text: "A simple portfolio page for my photography. Is Saturday at 4 PM okay?", sentAt: "2026-11-10T16:24:00", read: false },

  // Mohammed Saad (5) <-> Sara Ahmed (2): accepted English Conversation (REQ-002)
  { id: 4, fromId: 5, toId: 2, text: "Thanks for accepting! I have a job interview next week.", sentAt: "2026-11-02T19:10:00", read: true },
  { id: 5, fromId: 2, toId: 5, text: "Great, we'll practice common interview questions. See you Tuesday at 7!", sentAt: "2026-11-02T19:30:00", read: true },

  // Sara Ahmed (2) <-> Nora Khalid (6): pending Logo Design (REQ-001)
  { id: 6, fromId: 2, toId: 6, text: "Hi Nora, I requested your Logo Design service for my study club.", sentAt: "2026-11-01T18:00:00", read: false },

  // Fatimah Bahri (7) <-> Mohammed Saad (5): completed Python Basics (REQ-005)
  { id: 7, fromId: 7, toId: 5, text: "Thank you for the Python session, it was really clear!", sentAt: "2026-11-06T20:15:00", read: true },
  { id: 8, fromId: 5, toId: 7, text: "Happy it helped! Keep practicing loops.", sentAt: "2026-11-06T20:40:00", read: true },
];
