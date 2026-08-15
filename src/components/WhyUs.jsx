import { whyUs, clinicInfo } from "../data/clinicData";
import "./WhyUs.css";

export default function WhyUs() {
  return (
    <section id="why-us" className="why-us">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">لماذا نحن؟</span>
          <h2>ما يميّز {clinicInfo.shortName}</h2>
        </div>

        <div className="why-us__grid">
          {whyUs.map((w) => (
            <article className="why-card" key={w.title}>
              <span className="why-card__icon">{w.icon}</span>
              <div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
