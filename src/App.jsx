import { Routes, Route, Navigate } from "react-router-dom";

// Authentication pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useApp } from "./context/AppContext";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// User pages
import Home from "./pages/user/Home";
import ProtectedRoute from "./components/common/ProtectedRoute";
import UserDashboard from "./pages/user/UserDashboard";
import MyServices from "./pages/user/MyServices";
import Requests from "./pages/user/Requests";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import Wallet from "./pages/user/Wallet";
import PageLayout from "./components/common/PageLayout";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Browse from "./pages/user/Browse";
import HowItWorks from "./pages/user/HowItWorks";
import ServiceDetails from "./pages/user/ServiceDetails";

// Admin pages
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetails from "./pages/admin/UserDetails";
import AdjustBalance from "./pages/admin/AdjustBalance";
import ManageCategories from "./pages/admin/ManageCategories";
import ManageRequests from "./pages/admin/ManageRequests";
import CreditSettings from "./pages/admin/CreditSettings";
import AdminAccount from "./pages/admin/AdminAccount";


export default function App() {
  const { currentUser } = useApp(); 
  return (
      <Routes>

      {/* Public pages */}
     <Route
 

  path="/"
  element={
    currentUser?.role === "admin" ? (
      <Navigate to="/admin" replace />
    ) : currentUser?.role === "user" ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Home />
    )
  }


/>
     <Route path="/browse" element={<Browse />} />
     <Route path="/how-it-works" element={<HowItWorks />} />
     <Route path="/services/:id" element={<ServiceDetails />} />
  

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* User pages */}
      <Route path="/dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
      <Route path="/my-services" element={<ProtectedRoute role="user"><MyServices /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute role="user"><Requests /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute role="user"><EditProfile /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute role="user"><Wallet /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute role="user"><PageLayout><Notifications /></PageLayout></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute role="user"><PageLayout><Messages /></PageLayout></ProtectedRoute>} />
      {/* Other members' profiles can be viewed without logging in */}
      <Route path="/users/:id" element={<Profile />} />


{/* Admin Routes */}
<Route
  path="/admin"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <ManageUsers />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users/:id"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <UserDetails />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/users/:id/balance"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <AdjustBalance />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/requests"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <ManageRequests />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/categories"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <ManageCategories />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/credits"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <CreditSettings />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/account"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <AdminAccount />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/messages"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Messages />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/notifications"
  element={
    <ProtectedRoute role="admin">
      <AdminLayout>
        <Notifications />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

    </Routes>
  );
}
