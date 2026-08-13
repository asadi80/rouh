import { doctors, clinicInfo } from "../data/clinicData";
import { WhatsappIcon, CalendarIcon } from "./Icons";
import "./Doctors.css";

export default function Doctors() {
  return (
    <section id="doctors" className="doctors">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <CalendarIcon /> فريقنا الطبي
          </span>
          <h2>الأطباء المتاحون ومواعيدهم</h2>
          <p>تعرّف على استشاريينا وأخصائيينا، واختر الطبيب والموعد المناسب لك مباشرة عبر واتساب.</p>
        </div>

        <div className="doctors__grid">
          {doctors.map((doc) => (
            <article className="doctor-card" key={doc.id}>
              <div className="doctor-card__top">
                <div className="doctor-card__avatar">{doc.initials}</div>
                <div>
                  <h3>{doc.name}</h3>
                  <p className="doctor-card__title">{doc.title}</p>
                </div>
              </div>

              <span className="doctor-card__specialty">{doc.specialty}</span>
              <p className="doctor-card__bio">{doc.bio}</p>

              <div className="doctor-card__schedule">
                <span className="doctor-card__schedule-label">مواعيد العيادة</span>
                <ul>
                  {doc.schedule.map((s) => (
                    <li key={s.day}>
                      <span>{s.day}</span>
                      <span className="doctor-card__schedule-time">{s.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                className="btn btn-primary doctor-card__cta"
                href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                  `مرحبًا، أرغب في حجز موعد مع ${doc.name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsappIcon /> احجز عبر واتساب
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
