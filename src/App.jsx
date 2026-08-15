import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import WorkingHours from "./components/WorkingHours";
import Doctors from "./components/Doctors";
import Location from "./components/Location";
import Social from "./components/Social";
import Footer from "./components/Footer";
import QuickActions from "./components/QuickActions";
import PulseDivider from "./components/PulseDivider";

export default function App() {
  return (
    <>
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
