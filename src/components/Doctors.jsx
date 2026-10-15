
import { useMemo, useRef, useState } from "react";
import { useClinicData } from "../contexts/ClinicDataContext";
import { WhatsappIcon, CalendarIcon, ChevronIcon } from "./Icons";
import "./Doctors.css";

// Automatically convert Google image URLs.
function getDoctorImageUrl(url) {
  if (!url || !url.trim()) return "";

  const originalUrl = url.trim();

  try {
    const parsed = new URL(originalUrl);
    const hostname = parsed.hostname.toLowerCase();

    // Keep already-converted thumbnail URLs.
    if (
      hostname === "drive.google.com" &&
      parsed.pathname === "/thumbnail"
    ) {
      return originalUrl;
    }

    const isGoogleDrive = hostname === "drive.google.com";
    const isGoogleImage =
      hostname === "lh3.google.com" ||
      hostname.endsWith(".googleusercontent.com");

    if (!isGoogleDrive && !isGoogleImage) {
      return originalUrl;
    }

    const filePathMatch = parsed.pathname.match(
      /\/file\/d\/([^/]+)/
    );

    const imagePathMatch = parsed.pathname.match(
      /\/d\/([^/=]+)/
    );

    const fileId =
      parsed.searchParams.get("id") ||
      (filePathMatch && filePathMatch[1]) ||
      (imagePathMatch && imagePathMatch[1]);

    if (!fileId) {
      console.warn("Could not extract Google image ID:", originalUrl);
      return originalUrl;
    }

    return (
      "https://drive.google.com/thumbnail?id=" +
      encodeURIComponent(fileId) +
      "&sz=w1000"
    );
  } catch (error) {
    console.error("Invalid doctor image URL:", originalUrl, error);
    return originalUrl;
  }
}

export default function Doctors() {
  const { doctors, clinicInfo } = useClinicData();
  const [query, setQuery] = useState("");
  const trackRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return doctors;

    return doctors.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(q) ||
        (d.specialty || "").toLowerCase().includes(q) ||
        (d.title || "").toLowerCase().includes(q)
    );
  }, [query, doctors]);

  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".doctor-card");
    const step = card
      ? card.getBoundingClientRect().width + 20
      : 320;

    track.scrollBy({
      left: -dir * step,
      behavior: "smooth",
    });
  };

  function formatArabicTime(time) {
    if (!time) return "";

    const value = String(time).trim();
    const [hoursString, minutesString = "00"] = value.split(":");

    let hours = Number(hoursString);
    const minutes = Number(minutesString);

    if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return value;
    }

    const period = hours >= 12 ? "م" : "ص";

    hours = hours % 12;
    if (hours === 0) hours = 12;

    return `${hours}:${String(minutes).padStart(2, "0")} ${period}`;
  }

  function formatScheduleTime(time) {
    if (!time) return "";

    return String(time)
      .split(/\s*[-–—]\s*/)
      .map((part) => formatArabicTime(part))
      .join(" - ");
  }

  return (
    <section id="doctors" className="doctors">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <CalendarIcon /> فريقنا الطبي
          </span>

          <h2>الأطباء المتاحون ومواعيدهم</h2>

          <p>
            تعرّف على استشاريينا وأخصائيينا، واختر الطبيب والموعد المناسب لك
            مباشرة عبر واتساب.
          </p>
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
            {filtered.length}{" "}
            {filtered.length === 1 ? "طبيب" : "أطباء"}
          </span>
        </div>

        {filtered.length === 0 ? (
          <p className="doctors__empty">
            لا توجد نتائج مطابقة لبحثك. جرّب كلمة أخرى.
          </p>
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
              {filtered.map((doc) => {
                const imageUrl = getDoctorImageUrl(doc.image);

                return (
                  <article className="doctor-card" key={doc.id}>
                    <div className="doctor-card__top">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={doc.name || "صورة الطبيب"}
                          className="doctor-card__photo"
                          onError={(event) => {
                            console.error(
                              "Doctor image failed:",
                              doc.name,
                              imageUrl
                            );

                            event.currentTarget.style.display = "none";

                            const avatar =
                              event.currentTarget.parentElement.querySelector(
                                ".doctor-card__avatar"
                              );

                            if (avatar) {
                              avatar.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}

                      <div
                        className="doctor-card__avatar"
                        style={{
                          display: imageUrl ? "none" : "flex",
                        }}
                      >
                        {doc.initials || (doc.name || "ط").charAt(0)}
                      </div>

                      <div>
                        <h3>{doc.name}</h3>
                        <p className="doctor-card__title">{doc.title}</p>
                      </div>
                    </div>

                    <span className="doctor-card__specialty">
                      {doc.specialty}
                    </span>

                    <p className="doctor-card__bio">{doc.bio}</p>

                    <div className="doctor-card__schedule">
                      <span className="doctor-card__schedule-label">
                        مواعيد العيادة
                      </span>

                      <ul>
                        {(doc.schedule || []).map((s, i) =>
                          typeof s === "string" ? (
                            <li
                              key={i}
                              className="doctor-card__schedule-note"
                            >
                              <span>{s}</span>
                            </li>
                          ) : (
                            <li key={s.day || i}>
                              <span>{s.day}</span>

                              <span className="doctor-card__schedule-time">
                                {s.start_time && s.end_time
                                  ? `${formatArabicTime(
                                      s.start_time
                                    )} - ${formatArabicTime(s.end_time)}`
                                  : formatScheduleTime(s.time)}
                              </span>
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
                );
              })}
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