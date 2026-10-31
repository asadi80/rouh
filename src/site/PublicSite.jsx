//src/site/PuplicSite
import { useState } from "react";

import {
  ClinicDataProvider,
  useClinicData,
} from "../contexts/ClinicDataContext";
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
import MentalHealthTest from "../components/MentalHealthTest";

function SiteContent() {
  const [showMentalHealthTest, setShowMentalHealthTest] = useState(false);
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
        <section id="mentalltest" className="mentalltest">
          <div className="container">
            {!showMentalHealthTest ? (
              <div className="mental-health-intro">
                <h2>اطمئن على صحتك النفسية</h2>
                <p>
                  أجب عن مجموعة من الأسئلة القصيرة للحصول على تقييم أولي لمستوى
                  الصحة النفسية.
                </p>

                <button
                  type="button"
                  className="mental-health-start-btn"
                  onClick={() => setShowMentalHealthTest(true)}
                >
                  ابدأ الاختبار
                </button>
              </div>
            ) : (
              <div className="mental-health-test-wrapper">
                <button
                  type="button"
                  className="mental-health-close-btn"
                  onClick={() => setShowMentalHealthTest(false)}
                >
                  إغلاق الاختبار ✕
                </button>

                <MentalHealthTest />
              </div>
            )}
          </div>
        </section>
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
