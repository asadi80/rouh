import logo from "../assets/logo.png";
import { clinicInfo, socialLinks, workingHours } from "../data/clinicData";
import { socialIconMap } from "./Icons";
import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  const todayHours = workingHours.find((w) => w.isOpen);

  return (
    <footer id="contact" className="site-footer">
      <div className="container site-footer__grid">
        <div className="footer-col footer-col--brand">
          <div className="footer-brand">
            <img src={logo} alt={clinicInfo.name} />
            <span>{clinicInfo.shortName}</span>
          </div>
          <p>{clinicInfo.description}</p>
          <div className="footer-social">
            {socialLinks.map((s) => {
              const Icon = socialIconMap[s.id];
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <Icon />
                </a>
              );
            })}
          </div>
        </div>

        <div className="footer-col">
          <h4>روابط سريعة</h4>
          <a href="#home">الرئيسية</a>
          <a href="#doctors">الأطباء</a>
          <a href="#hours">أوقات العمل</a>
          <a href="#location">الموقع</a>
        </div>

        <div className="footer-col">
          <h4>تواصل معنا</h4>
          <a href={`tel:${clinicInfo.phone}`} className="ltr">{clinicInfo.phoneDisplay}</a>
          <a href={`mailto:${clinicInfo.email}`} className="ltr">{clinicInfo.email}</a>
          <a href={clinicInfo.googleMapsUrl} target="_blank" rel="noopener noreferrer">
            {clinicInfo.address}
          </a>
        </div>

        <div className="footer-col">
          <h4>أوقات العمل</h4>
          <p>{todayHours ? `${todayHours.hours}` : "—"}</p>
          <p className="footer-note">السبت – الخميس (الجمعة إجازة)</p>
          <p className="footer-note"> 3:00 م – 9:00 م</p>
          <p className="footer-note">الجمعة</p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-row">
          <p>© {year} {clinicInfo.name}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
