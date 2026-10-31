
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClinicDataProvider } from "./contexts/ClinicDataContext";
import PublicSite from "./site/PublicSite";
import DoctorProfile from "./site/DoctorProfile";

export default function App() {
  return (
    <BrowserRouter>
      <ClinicDataProvider>
        <Routes>
          <Route path="/" element={<PublicSite />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
        </Routes>
      </ClinicDataProvider>
    </BrowserRouter>
  );
}
