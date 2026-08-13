import { clinicInfo } from "../data/clinicData";
import { PhoneIcon, WhatsappIcon, MapPinIcon, CalendarIcon } from "./Icons";
import "./QuickActions.css";

export default function QuickActions() {
  return (
    <nav className="quick-actions" aria-label="إجراءات سريعة">
      <a href={`tel:${clinicInfo.phone}`} className="quick-actions__item">
        <PhoneIcon />
        <span>اتصال</span>
      </a>
      <a
        href={`https://wa.me/${clinicInfo.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-actions__item"
      >
        <WhatsappIcon />
        <span>واتساب</span>
      </a>
      <a href="#doctors" className="quick-actions__item quick-actions__item--main">
        <CalendarIcon />
        <span>احجز</span>
      </a>
      <a
        href={clinicInfo.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="quick-actions__item"
      >
        <MapPinIcon />
        <span>الموقع</span>
      </a>
    </nav>
  );
}
