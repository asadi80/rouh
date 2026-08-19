import { useMemo, useRef, useState } from "react";
import { doctors, clinicInfo } from "../data/clinicData";
import { WhatsappIcon, CalendarIcon, ChevronIcon } from "./Icons";
import "./Doctors.css";

export default function Doctors() {
  const [query, setQuery] = useState("");
  const trackRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return doctors;
    return doctors.filter(
      (d) => d.name.includes(q) || d.specialty.includes(q) || d.title.includes(q)
    );
  }, [query]);

  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".doctor-card");
    const step = card ? card.getBoundingClientRect().width + 20 : 320;
    // dir is +1/-1 in "reading" terms; content is RTL so we flip the sign
    track.scrollBy({ left: -dir * step, behavior: "smooth" });
  };

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

        <div className="doctors__search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث بالاسم أو التخصص..."
            aria-label="البحث عن طبيب"
          />
          <span className="doctors__count">
            {filtered.length} {filtered.length === 1 ? "طبيب" : "أطباء"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="doctors__empty">لا توجد نتائج مطابقة لبحثك. جرّب كلمة أخرى.</p>
        ) : (
          <div className="doctors__carousel">
            <button
              className="doctors__arrow doctors__arrow--prev"
              onClick={() => scrollByCards(1)}
              aria-label="الطبيب السابق"
              type="button"
            >
              <ChevronIcon style={{ transform: "rotate(180deg)" }} />
            </button>

            <div className="doctors__track" ref={trackRef}>
              {filtered.map((doc) => (
                <article className="doctor-card" key={doc.id}>
                  <div className="doctor-card__top">
                    {doc.image ? (
                      <img src={doc.image} alt={doc.name} className="doctor-card__photo" />
                    ) : (
                      <div className="doctor-card__avatar">{doc.initials}</div>
                    )}
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
                      {doc.schedule.map((s, i) =>
                        typeof s === "string" ? (
                          <li key={i} className="doctor-card__schedule-note">
                            <span>{s}</span>
                          </li>
                        ) : (
                          <li key={s.day}>
                            <span>{s.day}</span>
                            <span className="doctor-card__schedule-time">{s.time}</span>
                          </li>
                        )
                      )}
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

            <button
              className="doctors__arrow doctors__arrow--next"
              onClick={() => scrollByCards(-1)}
              aria-label="الطبيب التالي"
              type="button"
            >
              <ChevronIcon />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
