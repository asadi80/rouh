import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicSite from "./site/PublicSite";
import DoctorProfile from "./site/DoctorProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main clinic website */}
        <Route path="/" element={<PublicSite />} />

        {/* Individual doctor profile */}
        <Route path="/doctors/:id" element={<DoctorProfile />} />

        {/* Fallback */}
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}