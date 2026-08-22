import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Auth/Register";
import ComponentGallery from "./pages/ComponentGallery";
import CheckEmail from "./pages/Auth/CheckEmail";
import VerifyEmail from "./pages/Auth/VerifyEmail";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComponentGallery />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
