import { clinicInfo } from "../data/clinicData";
import { MapPinIcon, ExternalIcon, PhoneIcon, MailIcon } from "./Icons";
import "./Location.css";

export default function Location() {
  return (
    <section id="location" className="location">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            <MapPinIcon /> موقعنا
          </span>
          <h2>تفضّلوا بزيارتنا</h2>
          <p>عيادتنا في موقع مميز يسهل الوصول إليه. اضغط على الخريطة لفتح المسار في خرائط Google.</p>
        </div>

        <div className="location__panel">
          <a
            className="location__map"
            href={clinicInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="افتح الموقع في خرائط Google"
          >
            <iframe
              title="موقع العيادة على الخريطة"
              src={clinicInfo.googleMapsEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
            />
            <span className="location__map-overlay">
              <ExternalIcon /> فتح في خرائط Google
            </span>
          </a>

          <div className="location__info">
            <div className="location__item">
              <MapPinIcon />
              <div>
                <strong>العنوان</strong>
                <p>{clinicInfo.address}</p>
              </div>
            </div>
            <div className="location__item">
              <PhoneIcon />
              <div>
                <strong>الهاتف</strong>
                <p className="ltr">{clinicInfo.phoneDisplay}</p>
              </div>
            </div>
            <div className="location__item">
              <MailIcon />
              <div>
                <strong>البريد الإلكتروني</strong>
                <p className="ltr">{clinicInfo.email}</p>
              </div>
            </div>

            <a
              href={clinicInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary location__btn"
            >
              <MapPinIcon /> احصل على الاتجاهات
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
