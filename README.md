# Skill Swap – Skill-Swap Barter Board

**SWE 363 – Web Engineering · Team 16 · Phase 4 (Front-End)**

Skill Swap is a platform where members trade skills instead of money. A member offers a service (for example, "I'll explain algorithms for one hour") and gets help from another member in return (for example, "UI design review" or "video editing"). Every hour of help earns **Time Credits**, and members spend those credits to request help from others.

This repository contains the **interactive front-end prototype** built with React. It runs entirely in the browser using sample data, so no backend or database is needed for this phase.

- **Figma design (view only):** https://www.figma.com/design/PULbcpnYm7mu9WqVJTsveO/SWE363
- **Figma prototype:** https://www.figma.com/proto/PULbcpnYm7mu9WqVJTsveO/SWE363?node-id=7-70&starting-point-node-id=7%3A70

---

## Features

**Visitors**
- Home page, How It Works, browse and search services by category
- Service details page, with a login prompt when a visitor tries to request a service

**Members (users)**
- Sign up (with welcome Time Credits), log in, forgot password and reset password
- Dashboard with available credits, credits on hold, services and sessions
- My Services: add, edit and delete offered services
- Request a service (online or in person, with date and time)
- Requests: accept, reject, cancel, confirm a completed session and rate it
- Wallet with credit balance and credit history
- Profile and edit profile (skills, languages, availability), public member profiles
- Messages and notifications

**Admin**
- Admin dashboard with platform statistics and recent activity
- Manage users (view details, suspend or activate, adjust credit balance)
- Manage requests and categories
- Time Credit settings (welcome credits and credits per hour)
- Admin account, messages and notifications

All pages are responsive and work on desktop and mobile.

---

## Tech Stack and Dependencies

| Tool | Purpose |
|------|---------|
| [React 18](https://react.dev/) | UI library |
| [Vite 6](https://vitejs.dev/) | Development server and build tool |
| [React Router 6](https://reactrouter.com/) | Page routing |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [lucide-react](https://lucide.dev/) | Icons |

The exact versions are listed in `package.json`.

---

## Setup and Installation

### Requirements
- [Node.js](https://nodejs.org/) version 18 or newer (the LTS version is recommended)
- npm (installed with Node.js)
- Git

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/LayanAlomari/SWE363-T16-Project-SkillSwap.git
   cd SWE363-T16-Project-SkillSwap
   ```

2. **Install the dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the app** at the address shown in the terminal, usually http://localhost:5173

### Other commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production version into the `dist` folder |
| `npm run preview` | Serves the production build locally |

### Environment variables
None. This phase does not use any API keys or `.env` files.

---

## Usage

### Test accounts

| Email | Password | Notes |
| --- | --- | --- |
| sara@email.com | sara123 | Best account for trying the user features: has services and both sent and received requests, 5 credits |
| ahmed@email.com | ahmed123 | 12 credits |
| mohammed@email.com | mohammed123 | Has an accepted request waiting |
| nora@email.com | nora123 | New member, 2 credits |
| fatimah@example.com | fatimah123 | 2 credits |
| najlaa@email.com | najlaa123 | Suspended: shows the "account has been suspended" message |
| admin@skillswap.com | admin123 | Admin account |

You can also create a new account from **Sign Up**.

### Example walkthrough

1. Open the home page and click **Browse** to search the available services.
2. Open a service and click **Request**. As a visitor you will be asked to log in.
3. Log in as `sara@email.com` and request the service, choosing online or in person and a date and time.
4. Log out, log in as the service provider, and accept the request from **Requests**.
5. After the session, the provider marks it as done, then the member who requested it confirms and rates it. The held Time Credits move to the provider and appear in the **Wallet**.
6. Log in as `admin@skillswap.com` to manage users, requests, categories and the Time Credit settings.
7. To test password recovery, open **Forgot Password?** on the login page, enter a registered email, then use the demo reset link to choose a new password.

### About the data
The app uses sample data from `src/data` and saves changes in the browser's **local storage**, so they stay after a refresh. To return to the original sample data, clear the site's local storage in your browser's developer tools and reload the page.

---

## Project Structure

```
SWE363-T16-Project-SkillSwap/
├── index.html
├── package.json
├── vite.config.js
├── AI_USAGE.md            # AI usage log for Phase 4
└── src/
    ├── main.jsx           # App entry point
    ├── App.jsx            # Routes
    ├── index.css          # Tailwind and brand colours
    ├── assets/            # Logo and images
    ├── context/           # AppContext: shared app state
    ├── data/              # Sample data (users, services, requests, ...)
    ├── components/
    │   ├── common/        # Navbar, footer, page layout, protected routes
    │   ├── auth/          # Shared parts of the login and sign-up pages
    │   ├── user/          # Service cards, request cards, forms, ...
    │   └── admin/         # Admin layout, navbar, stats cards, modals
    └── pages/
        ├── auth/          # Login, Register, Forgot and Reset Password
        ├── user/          # Home, Browse, Service Details, Dashboard, ...
        ├── admin/         # Admin dashboard and management pages
        ├── Messages.jsx
        └── Notifications.jsx
```

---

## Team Members and Roles

| Member | Role |
|--------|------|
| Layan Alomari | Shared app state and data (AppContext), shared components and routing, user dashboard, My Services, Requests, Profile, Wallet, Messages and Notifications, integration |
| Fatimah Bahri | Home, How It Works, Browse services, Service Details and the request service flow |
| Layan Althagafi | Admin pages: dashboard, users, user details, adjust balance, requests, categories, credit settings and admin account |
| Razan Almubarak | Project setup, authentication pages (Login, Register, Forgot Password, Reset Password), shared auth components and README |

---

## AI Usage

AI tools were used during this phase. Details of every use are recorded in [`AI_USAGE.md`](AI_USAGE.md) and in the team's AI Declaration.
