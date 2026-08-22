import { useClinicData } from "../contexts/ClinicDataContext";
import "./WhyUs.css";

export default function WhyUs() {
  const { whyUs, clinicInfo } = useClinicData();

  return (
    <section id="why-us" className="why-us">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">لماذا نحن؟</span>
          <h2>ما يميّز {clinicInfo?.shortName || "مصحة روح"}</h2>
        </div>

        <div className="why-us__grid">
          {(whyUs || []).map((w) => (
            <article className="why-card" key={w.id || w.title}>
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
