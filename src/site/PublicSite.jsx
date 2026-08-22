import { ClinicDataProvider, useClinicData } from "../contexts/ClinicDataContext";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Services from "../components/Services";
import WhyUs from "../components/WhyUs";
import WorkingHours from "../components/WorkingHours";
import Doctors from "../components/Doctors";
import Location from "../components/Location";
import Social from "../components/Social";
import Footer from "../components/Footer";
import QuickActions from "../components/QuickActions";
import PulseDivider from "../components/PulseDivider";

function SiteContent() {
  const { loading } = useClinicData();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-faint)",
          fontSize: 15,
        }}
      >
        جارٍ التحميل...
      </div>
    );
  }

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Doctors />
        <div className="container">
          <PulseDivider flat />
        </div>
        <WorkingHours />
        <Location />
        <Social />
      </main>
      <Footer />
      <QuickActions />
    </>
  );
}

export default function PublicSite() {
  return (
    <ClinicDataProvider>
      <SiteContent />
    </ClinicDataProvider>
  );
}
