import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import SellerRoute from "./routes/SellerRoute";
import AdminRoute from "./routes/AdminRoute";
import Register from "./pages/Auth/Register";
import ComponentGallery from "./pages/ComponentGallery";
import CheckEmail from "./pages/Auth/CheckEmail";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";
import CompleteProfile from "./pages/Auth/CompleteProfile";
import ChangePassword from "./pages/account/ChangePassword";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import Settings from "./pages/account/Settings";
import SellerOnboarding from "./pages/account/SellerOnboarding";
import SellerStatus from "./pages/account/SellerStatus";

import DashboardLayout from "./components/dashboard/DashboardLayout";

import DashboardRouter from "./pages/dashboards/DashboardRouter";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import SellerDashboard from "./pages/dashboards/SellerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import Profile from "./pages/account/Profile";
import SellerProfile from "./pages/account/SellerProfile";
import SellerVerification from "./pages/account/SellerVerification";

import AdminIdVerifications from "./pages/admin/AdminIdVerifications";
import AdminIdVerificationDetail from "./pages/admin/AdminIdVerificationDetail";
import AdminRegistrationVerifications from "./pages/admin/AdminRegistrationVerifications";
import AdminRegistrationVerificationDetail from "./pages/admin/AdminRegistrationVerificationDetail";

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
          <ProtectedRoute allowUnverified={true} allowIncompleteProfile={true}>
            <CheckEmail />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={
          <ProtectedRoute allowUnverified={true} allowIncompleteProfile={true}>
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
            <ProtectedRoute allowIncompleteProfile={true}>
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





        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={<DashboardRouter />}
          />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard/customer"
              element={<CustomerDashboard />}
            />

            <Route
              path="/account/profile"
              element={<Profile />}
            />

            <Route
              path="/account/change-password"
              element={<ChangePassword />}
            />

            <Route
              path="/account/settings"
              element={<Settings />}
            />


          </Route>
        </Route>

        <Route element={<ProtectedRoute allowCustomerOnly={true} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/account/become-seller"
              element={<SellerOnboarding />}
            />
          </Route>
        </Route>



        <Route element={<SellerRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/seller/dashboard"
              element={<SellerDashboard />}
            />

            <Route
              path="/account/seller-profile"
              element={<SellerProfile />}
            />

            <Route
              path="/seller/dashboard"
              element={<SellerDashboard />}
            />

          </Route>
        </Route>

        <Route element={<SellerRoute allowSellerOnly={true} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/account/seller-status"
              element={<SellerStatus />}
            />

            <Route
              path="/account/seller-verification"
              element={<SellerVerification />}
            />

          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/id-verifications"
              element={<AdminIdVerifications />}
            />

            <Route
              path="/admin/id-verifications/:id"
              element={<AdminIdVerificationDetail />}
            />

            <Route
              path="/admin/registration-verifications"
              element={<AdminRegistrationVerifications />}
            />

            <Route
              path="/admin/registration-verifications/:id"
              element={<AdminRegistrationVerificationDetail />}
            />

          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
