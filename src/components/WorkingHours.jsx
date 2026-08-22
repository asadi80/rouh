import { useMemo } from "react";
import { useClinicData } from "../contexts/ClinicDataContext";
import { ClockIcon } from "./Icons";
import "./WorkingHours.css";

// Sunday = 0 ... Saturday = 6 (JS) -> map to Arabic week order used in data (starts Saturday)
const jsDayToLabel = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

export default function WorkingHours() {
  const { workingHours } = useClinicData();
  const todayLabel = useMemo(() => jsDayToLabel[new Date().getDay()], []);

  return (
    <section id="hours" className="hours">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <ClockIcon /> أوقات العمل
          </span>
          <h2>نستقبلكم على مدار الأسبوع</h2>
          <p>يمكنكم زيارتنا أو التواصل معنا خلال الأوقات التالية، ونرحب بالحجوزات المسبقة لضمان راحتكم.</p>
        </div>

        <div className="hours__card">
          <ul className="hours__list">
            {workingHours.map((item) => {
              const isToday = item.day === todayLabel;
              return (
                <li key={item.day} className={`hours__row ${isToday ? "hours__row--today" : ""}`}>
                  <span className="hours__day">
                    {item.day}
                    {isToday && <span className="hours__badge">اليوم</span>}
                  </span>
                  <span className={`hours__time ${!item.isOpen ? "hours__time--closed" : ""}`}>
                    {item.hours}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
