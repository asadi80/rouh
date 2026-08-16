import { services } from "../data/clinicData";
import "./Services.css";

export default function Services() {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">خدماتنا</span>
          <h2>ما نُقدّمه لكم</h2>
          <p>تقدم مصحة روح للطب النفسي مجموعة متكاملة من الخدمات النفسية والعلاجية، من خلال فريق متخصص، بهدف تقديم الرعاية المناسبة لكل حالة وفق احتياجاتها.</p>
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
