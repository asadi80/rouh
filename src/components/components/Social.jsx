import { socialLinks } from "../data/clinicData";
import { socialIconMap } from "./Icons";
import "./Social.css";

export default function Social() {
  return (
    <section id="social" className="social">
      <div className="container social__row">
        <div className="social__text">
          <h2>تابعونا على منصات التواصل</h2>
          <p>نشارك محتوى توعويًا حول الصحة النفسية بشكل دوري — تابعونا لتصلكم آخر النصائح والفعاليات.</p>
        </div>
        <div className="social__icons">
          {socialLinks.map((s) => {
            const Icon = socialIconMap[s.id];
            return (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social__icon"
                aria-label={s.label}
                title={s.label}
              >
                <Icon />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
