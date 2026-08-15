import { useMemo, useState } from "react";
import { doctors, clinicInfo } from "../data/clinicData";
import { WhatsappIcon, CalendarIcon } from "./Icons";
import "./Doctors.css";

const PAGE_SIZE = 6;

export default function Doctors() {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return doctors;
    return doctors.filter(
      (d) => d.name.includes(q) || d.specialty.includes(q) || d.title.includes(q)
    );
  }, [query]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setVisible(PAGE_SIZE);
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
            onChange={handleSearch}
            placeholder="ابحث بالاسم أو التخصص..."
            aria-label="البحث عن طبيب"
          />
          <span className="doctors__count">
            {filtered.length} {filtered.length === 1 ? "طبيب" : "أطباء"}
          </span>
        </div>

        {shown.length === 0 ? (
          <p className="doctors__empty">لا توجد نتائج مطابقة لبحثك. جرّب كلمة أخرى.</p>
        ) : (
          <div className="doctors__grid">
            {shown.map((doc) => (
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
        )}

        {hasMore && (
          <div className="doctors__more">
            <button className="btn btn-outline" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              عرض المزيد ({filtered.length - visible} متبقٍ)
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
