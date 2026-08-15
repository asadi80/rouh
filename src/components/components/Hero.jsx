import logo from "../assets/logo.png";
import { clinicInfo, stats } from "../data/clinicData";
import { PhoneIcon, CalendarIcon, MapPinIcon } from "./Icons";
import PulseDivider from "./PulseDivider";
import "./Hero.css";

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__row">
        <div className="hero__copy">
          <span className="eyebrow">رعاية نفسية موثوقة منذ 2013</span>
          <h1>
            {clinicInfo.tagline} <br />
            <span className="hero__accent">في {clinicInfo.shortName}</span>
          </h1>
          <p className="hero__desc">{clinicInfo.description}</p>

          <div className="hero__cta">
            <a href="#doctors" className="btn btn-primary">
              <CalendarIcon /> احجز موعدك
            </a>
            <a href={`tel:${clinicInfo.phone}`} className="btn btn-outline">
              <PhoneIcon /> اتصل بالعيادة
            </a>
          </div>

          <a href="#location" className="hero__address">
            <MapPinIcon /> {clinicInfo.address}
          </a>

          <div className="hero__stats">
            {stats.map((s) => (
              <div className="hero__stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__art">
          <div className="hero__art-ring">
            <img src={logo} alt={clinicInfo.name} />
          </div>
        </div>
      </div>

      <div className="container">
        <PulseDivider />
      </div>
    </section>
  );
}
