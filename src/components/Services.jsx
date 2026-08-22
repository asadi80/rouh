import { useClinicData } from "../contexts/ClinicDataContext";
import "./Services.css";

export default function Services() {
  const { services } = useClinicData();
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">خدماتنا</span>
          <h2>ما نُقدّمه لكم</h2>
          <p>خدمات طبية ونفسية متكاملة تحت سقف واحد.</p>
        </div>

        <div className="services__grid">
          {services.map((s) => (
            <article className="service-card" key={s.title}>
              <span className="service-card__icon">{s.icon}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
