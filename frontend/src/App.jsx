import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import Register from "./pages/Auth/Register";
import ComponentGallery from "./pages/ComponentGallery";
import CheckEmail from "./pages/Auth/CheckEmail";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import DashboardRouter from "./pages/dashboards/DashboardRouter";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import SellerDashboard from "./pages/dashboards/SellerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<ComponentGallery />} /> */}
        <Route path="/register" element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        } />
        <Route path="/check-email" element={
          <ProtectedRoute allowUnverified={true}>
            <CheckEmail />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={
          <ProtectedRoute allowUnverified={true}>
            <VerifyEmail />
          </ProtectedRoute>
        } />
        <Route path="/login" element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        } />
        <Route path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          } />
        <Route path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          } />
        <Route
          path="/reset-password/:uid/:token"
          element={
            <ResetPassword />
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/dashboard/customer"
            element={<CustomerDashboard />}
          />

          <Route
            path="/dashboard/seller"
            element={<SellerDashboard />}
          />

          <Route
            path="/dashboard/admin"
            element={<AdminDashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
