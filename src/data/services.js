// Services offered by members.
// Price: 1 hour = 1 Time Credit.
// providerId points to a user id in mockUsers.js.
// rating and reviewsCount are calculated from reviews.js.

export const initialServices = [
  {
    id: 1,
    title: "Python Basics",
    category: "Programming",
    providerId: 5, // Mohammed Saad
    durationHours: 2,
    credits: 2,
    description: "Learn the basics of Python programming: variables, loops and functions, with practice examples.",
    status: "Active",
  },
  {
    id: 2,
    title: "Logo Design",
    category: "Graphic Design",
    providerId: 6, // Nora Khalid
    durationHours: 1,
    credits: 1,
    description: "Create a simple and professional logo for your project or club.",
    status: "Active",
  },
  {
    id: 3,
    title: "English Conversation",
    category: "Languages",
    providerId: 2, // Sara Ahmed
    durationHours: 1,
    credits: 1,
    description: "Practice English speaking and conversation skills in a relaxed session.",
    status: "Active",
  },
  {
    id: 4,
    title: "Web Design Basics",
    category: "Web Design",
    providerId: 2, // Sara Ahmed
    durationHours: 2,
    credits: 2,
    description: "Build your first web page with HTML and CSS, step by step.",
    status: "Active",
  },
  {
    id: 5,
    title: "Portrait Photography",
    category: "Photography",
    providerId: 4, // Ahmed Ali
    durationHours: 2,
    credits: 2,
    description: "Learn lighting and posing basics for great portrait photos with any camera.",
    status: "Active",
  },
  {
    id: 6,
    title: "Short Video Editing",
    category: "Video Editing",
    providerId: 3, // Najlaa Alanzi (suspended, so this service is hidden)
    durationHours: 1,
    credits: 1,
    description: "Edit short videos for social media: cuts, music and captions.",
    status: "Hidden",
  },
  {
    id: 7,
    title: "Math Tutoring",
    category: "Tutoring",
    providerId: 7, // Fatimah Bahri
    durationHours: 1,
    credits: 1,
    description: "Help with calculus and statistics homework and exam preparation.",
    status: "Active",
  },
];
