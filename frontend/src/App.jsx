import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";
import Register from "./pages/Auth/Register";
import ComponentGallery from "./pages/ComponentGallery";
import CheckEmail from "./pages/Auth/CheckEmail";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import Login from "./pages/Auth/Login";

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
