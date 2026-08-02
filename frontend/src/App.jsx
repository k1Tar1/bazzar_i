import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import ComponentGallery from "./pages/ComponentGallery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComponentGallery />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
