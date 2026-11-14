// Shared reviews. A seeker can review a request once it is Completed.
// Shown on the provider's profile and on the service.
// A service's rating and number of reviews are calculated from this list (in AppContext).

export const initialReviews = [
  { id: 1, requestId: "REQ-003", serviceId: 5, reviewerId: 2, providerId: 4, stars: 5, comment: "Ahmed explained lighting really clearly. My photos look so much better now.", date: "2026-11-04" },
  { id: 2, requestId: "REQ-007", serviceId: 3, reviewerId: 4, providerId: 2, stars: 5, comment: "Very patient and friendly. I feel more confident speaking English.", date: "2026-10-12" },
  { id: 3, requestId: "REQ-008", serviceId: 4, reviewerId: 3, providerId: 2, stars: 4, comment: "Helpful session. I built my first page, but it ran a bit over time.", date: "2026-10-20" },
  { id: 4, requestId: "REQ-009", serviceId: 7, reviewerId: 4, providerId: 7, stars: 4, comment: "Fatimah made statistics much easier to understand.", date: "2026-10-15" },
];
