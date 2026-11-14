# AI Usage Log

## Phase 4 – Front-End
| ID  | Member | Tool (model) | Purpose | Files affected |
|-----|--------|--------------|---------|----------------|
| C01 | Layan Alomari | Claude (Opus 5.5) | Shared demo data and app state (users, services, requests, credits, reviews, notifications, messages) | src/data/*.js, src/context/AppContext.jsx |
| C02 | Layan Alomari | Claude (Opus 5.5) | Connecting login and register to the shared app state | src/main.jsx, src/pages/auth/Login.jsx, src/pages/auth/Register.jsx |
| C03 | Layan Alomari | Claude (Opus 5.5) | Shared components, brand colors and routing (navbar with avatar menu and notification bell, footer, layout, protected routes) | src/components/common/*.jsx, src/index.css, src/App.jsx |
| C04 | Layan Alomari | Claude (Opus 5.5) | User Dashboard | src/pages/user/UserDashboard.jsx |
| C05 | Layan Alomari | Claude (Opus 5.5) | My Services: add, edit and delete services, category search, session length dropdown | src/pages/user/MyServices.jsx, src/components/user/ServiceForm.jsx, src/components/user/CategoryCombobox.jsx, src/components/user/SelectMenu.jsx |
| C06 | Layan Alomari | Claude (Opus 5.5) | Requests: accept, reject, cancel, mark as done, session confirmation and rating | src/pages/user/Requests.jsx, src/components/user/RequestCard.jsx, src/components/user/RateModal.jsx, src/components/user/Stars.jsx |
| C07 | Layan Alomari | Claude (Opus 5.5) | Profile and Edit Profile: skills, languages and availability | src/pages/user/Profile.jsx, src/pages/user/EditProfile.jsx, src/components/user/TagInput.jsx |
| C08 | Layan Alomari | Claude (Opus 5.5) | Wallet and credit history | src/pages/user/Wallet.jsx |
| C09 | Layan Alomari | Claude (Opus 5.5) | Connecting Messages and Notifications to the shared data and matching their design | src/pages/Messages.jsx, src/pages/Notifications.jsx | 
| C10 | Fatimah Bahri | ChatGPT | Browse services, search and category filters, service details, and request service workflow | src/pages/Browse.jsx, src/pages/ServiceDetails.jsx, src/components/ServiceCard.jsx, src/components/RequestModal.jsx |
| C11 | Fatimah Bahri | ChatGPT | Login-required popup for guests and request form for logged-in users, including online and in-person sessions, date, time, meeting link, and location | src/components/LoginRequiredModal.jsx, src/components/RequestForm.jsx, src/pages/ServiceDetails.jsx |
| C12 | Fatimah Bahri | ChatGPT | Connecting service requests to the shared AppContext, including sending, accepting, rejecting, and cancelling requests | src/context/AppContext.jsx, src/components/RequestForm.jsx, src/pages/Requests.jsx |
| C13 | Fatimah Bahri | ChatGPT | Responsive layouts, removing duplicate pages, and refining the final user experience | src/pages/, src/components/, src/styles/ |
