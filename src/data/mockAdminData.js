export const initialUsers = [
  {
    id: 1,
    name: "Sara Ahmed",
    email: "sara@email.com",
    credits: 5,
    status: "Active",
    services: 3,
    joined: "Sep 2026",
    skills: "English Tutoring, Web Design",
  },
  {
    id: 2,
    name: "Ahmed Ali",
    email: "ahmed@email.com",
    credits: 12,
    status: "Active",
    services: 2,
    joined: "Oct 2026",
    skills: "Photography",
  },
  {
    id: 3,
    name: "Najlaa Alanzi",
    email: "najlaa@email.com",
    credits: 0,
    status: "Suspended",
    services: 1,
    joined: "Oct 2026",
    skills: "Video Editing",
  },
  {
    id: 4,
    name: "Mohammed Saad",
    email: "mohammed@email.com",
    credits: 3,
    status: "Active",
    services: 4,
    joined: "Sep 2026",
    skills: "Programming",
  },
];
export const initialCategories = [
  { id: 1, name: "Programming", services: 12 },
  { id: 2, name: "Design", services: 9 },
  { id: 3, name: "Languages", services: 15 },
  { id: 4, name: "Photography", services: 6 },
];

export const adminChats = [
  {
    id: 1,
    name: "Sara Ahmed",
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hello Sara, we noticed an issue with your Time Credits balance. Please review your account.",
      },
      {
        id: 2,
        from: "other",
        text: "Thank you for letting me know. I will check my balance.",
      },
    ],
  },
  {
    id: 2,
    name: "Mohammed Ali",
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hello Mohammed, your account has been successfully reactivated.",
      },
      {
        id: 2,
        from: "other",
        text: "Thank you for your support!",
      },
    ],
  },
  {
    id: 3,
    name: "Najlaa Alanzi",
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hello Najlaa, your account has been temporarily suspended. Please contact support if you need assistance.",
      },
    ],
  },
];



export const userChats = [
  {
    id: 1,
    name: "Ahmed Ali",
    messages: [
      {
        id: 1,
        from: "other",
        text: "Hi! Is your programming service available tomorrow?",
      },
      {
        id: 2,
        from: "me",
        text: "Yes! Tomorrow at 4 PM works for me.",
      },
    ],
  },
  {
    id: 2,
    name: "Nora Khalid",
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hi Nora, I would like to request your graphic design service.",
      },
      {
        id: 2,
        from: "other",
        text: "Sure! I'd be happy to help.",
      },
    ],
  },
  {
    id: 3,
    name: "Admin Support",
    messages: [
      {
        id: 1,
        from: "me",
        text: "Hello, I need help with my Time Credits balance.",
      },
      {
        id: 2,
        from: "other",
        text: "Hello! We will review your account and get back to you.",
      },
    ],
  },
];






export const adminNotifications = [
  {
    id: 1,
    title: "New User Registered",
    description: "A new user has joined Skill Swap.",
    read: false,
  },
  {
    id: 2,
    title: "Account Suspended",
    description: "Najlaa Alanzi's account has been suspended.",
    read: false,
  },
  {
    id: 3,
    title: "Platform Activity",
    description: "A service exchange has been completed.",
    read: true,
  },
];

export const userNotifications = [
  {
    id: 1,
    title: "New Service Request",
    description: "Sara Ahmed requested your programming service.",
    read: false,
  },
  {
    id: 2,
    title: "Request Accepted",
    description: "Your service request has been accepted.",
    read: false,
  },
  {
    id: 3,
    title: "Credits Received",
    description: "You received 2 Time Credits.",
    read: true,
  },
];