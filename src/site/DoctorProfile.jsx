import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { WhatsappIcon } from "../components/Icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./DoctorProfile.css";

const API_URL = (import.meta.env.VITE_API_URL || "https://api.rouh.ly").replace(
  /\/$/,
  "",
);

const WHATSAPP_NUMBER = "218916669082";

export default function DoctorProfile() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const BANK_INFO = {
    accountNameHolder: "شركة روح العطاء الخيرية",
    accountHolder: "مصحة روح",
    accountNumber: "105907165601018",
    accountInternationalNumber: "LY09027105105907165601018",
    consultationFee: "150",
    currency: "دينار ليبي",
    bankBranch: "فرع جنزور",
  };

  // --------------------------------------------------
  // FETCH DOCTOR DATA DIRECTLY FROM THE API
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDoctor() {
      try {
        setLoading(true);
        setError("");
        setDoctor(null);

        const response = await fetch(`${API_URL}/api/doctors`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`تعذر تحميل بيانات الأطباء (${response.status})`);
        }

        const result = await response.json();

        // Support different common API response formats
        const doctors = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : Array.isArray(result.doctors)
              ? result.doctors
              : [];

        if (!doctors.length) {
          throw new Error("لم يتم العثور على بيانات الأطباء");
        }

        const foundDoctor = doctors.find(
          (item) => String(item.id) === String(id),
        );

        if (!foundDoctor) {
          setError("لم يتم العثور على الطبيب المطلوب.");
          return;
        }

        setDoctor(foundDoctor);
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Doctor profile loading error:", err);

        setError(
          err.message ||
            "حدث خطأ أثناء تحميل بيانات الطبيب. يرجى المحاولة مرة أخرى.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDoctor();

    return () => controller.abort();
  }, [id]);

  // --------------------------------------------------
  // WHATSAPP BOOKING LINK
  // --------------------------------------------------

  const whatsappUrl = useMemo(() => {
    if (!doctor) return "";

    const message = [
      "مرحبًا، أرغب في حجز موعد.",
      `الطبيب: ${doctor.name || ""}`,
      `التخصص: ${doctor.specialty || ""}`,
      `رسوم الكشف: ${BANK_INFO.consultationFee} ${BANK_INFO.currency}`,
      "سأرسل إيصال الدفع في المحادثة.",
    ].join("\n");

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;
  }, [doctor]);

  // --------------------------------------------------
  // DOCTOR PROFILE QR CODE URL
  // --------------------------------------------------

  const profileUrl = useMemo(() => {
    if (!doctor || typeof window === "undefined") return "";

    return `${window.location.origin}/doctors/${encodeURIComponent(doctor.id)}`;
  }, [doctor]);

  // --------------------------------------------------
  // DOCTOR IMAGE URL
  // --------------------------------------------------

  const getImageUrl = (image) => {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

  // --------------------------------------------------
  // DOCTOR QUALIFICATIONS
  // --------------------------------------------------

  const qualifications = doctor
    ? [
        ["الجامعة / كلية الطب", doctor.medical_school],
        ["المؤهل العلمي", doctor.degree],
        ["سنة التخرج", doctor.graduation_year],
        ["سنوات الخبرة", doctor.years_experience],
        ["المؤهلات العليا", doctor.postgraduate_qualifications],
        ["الإقامة والزمالة", doctor.residency_fellowship],
        ["الشهادات المهنية", doctor.board_certifications],
        ["التخصص الدقيق", doctor.subspecialty],
        [
          "اللغات",
          Array.isArray(doctor.languages)
            ? doctor.languages.join("، ")
            : doctor.languages,
        ],
      ].filter(
        ([, value]) =>
          value !== null && value !== undefined && String(value).trim() !== "",
      )
    : [];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <>
      <Header />

      <main className="doctor-profile-page" dir="rtl">
        <div className="container">
          <Link to="/#doctors" className="doctor-profile-back">
            ← العودة إلى الأطباء
          </Link>

          {/* LOADING */}
          {loading && (
            <div className="doctor-profile-message">
              <div className="doctor-profile-loader" />
              <p>جارٍ تحميل بيانات الطبيب...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="doctor-profile-status doctor-profile-status--error">
              <h2>تعذر تحميل الملف الشخصي</h2>
              <p>{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="doctor-profile-retry"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* DOCTOR PROFILE */}
          {!loading && !error && doctor && (
            <article className="doctor-profile">
              {/* DOCTOR HEADER */}
              <div className="doctor-profile__top">
                <div className="doctor-profile__image">
                  {doctor.image || doctor.image_url ? (
                    <img
                      src={getImageUrl(doctor.image || doctor.image_url)}
                      alt={doctor.name || "صورة الطبيب"}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{doctor.initials || "د"}</span>
                  )}
                </div>

                <div className="doctor-profile__intro">
                  <h1>{doctor.name}</h1>

                  <p className="doctor-profile__title">
                    {doctor.title || doctor.specialty}
                  </p>

                  {doctor.specialty && <p>{doctor.specialty}</p>}
                </div>
              </div>

              {/* BOOKING AND QR CODE */}
              <section className="doctor-profile__booking">
                <div className="doctor-profile__booking-info">
                  <h2>احجز موعدك الآن</h2>

                  <p>
                    يمكنك التواصل مع العيادة مباشرة عبر واتساب لحجز موعد مع{" "}
                    {doctor.name}.
                  </p>

                  <button
                    type="button"
                    className="doctor-profile__whatsapp"
                    onClick={() => setPaymentModalOpen(true)}
                  >
                    <WhatsappIcon />
                    احجز موعد عبر واتساب
                  </button>
                </div>

                <div className="doctor-profile__qr">
                  <div className="doctor-profile__qr-image">
                    <QRCodeSVG
                      value={profileUrl}
                      size={190}
                      level="H"
                      includeMargin={true}
                    />
                  </div>

                  <strong>امسح الرمز لعرض الملف الشخصي</strong>

                  <span>تعرف على الطبيب ومؤهلاته ومواعيد العمل</span>
                </div>
              </section>

              {/* BIOGRAPHY */}
              {doctor.bio && (
                <section className="doctor-profile__section">
                  <h2>نبذة عن الطبيب</h2>
                  <p>{doctor.bio}</p>
                </section>
              )}

              {/* QUALIFICATIONS */}
              {qualifications.length > 0 && (
                <section className="doctor-profile__section">
                  <h2>المؤهلات والخبرات</h2>

                  <div className="doctor-profile__details">
                    {qualifications.map(([label, value]) => (
                      <div key={label}>
                        <strong>{label}</strong>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* WORKING SCHEDULE */}
              {Array.isArray(doctor.schedule) && doctor.schedule.length > 0 && (
                <section className="doctor-profile__section">
                  <h2>مواعيد العمل</h2>

                  <div className="doctor-profile__schedule">
                    {doctor.schedule.map((item, index) => (
                      <div key={index}>
                        <strong>{item.day || "موعد"}</strong>
                        <span>{item.time || item.note}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </article>
          )}
          {paymentModalOpen && (
            <div
              className="payment-modal__overlay"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  setPaymentModalOpen(false);
                }
              }}
            >
              <div
                className="payment-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="payment-modal-title"
                dir="rtl"
              >
                <button
                  type="button"
                  className="payment-modal__close"
                  onClick={() => setPaymentModalOpen(false)}
                  aria-label="إغلاق"
                >
                  ×
                </button>

                <h2 id="payment-modal-title">إتمام الحجز والدفع</h2>

                <p className="payment-modal__intro">
                  حجز موعد مع {doctor?.name}
                </p>

                <div className="payment-modal__bank">
                  <h3>بيانات التحويل المصرفي</h3>

                  <div className="payment-modal__row">
                    <span>اسم صاحب الحساب</span>
                    <strong>{BANK_INFO.accountNameHolder}</strong>
                  </div>

                  <div className="payment-modal__row">
                    <span>صاحب الحساب</span>
                    <strong>{BANK_INFO.accountHolder}</strong>
                  </div>

                  <div className="payment-modal__row">
                    <span>رقم الحساب</span>
                    <strong>{BANK_INFO.accountNumber}</strong>
                  </div>

                  <div className="payment-modal__row">
                    <span>رقم الحساب الدولي</span>
                    <strong>{BANK_INFO.accountInternationalNumber}</strong>
                  </div>

                  <div className="payment-modal__row">
                    <span>الفرع</span>
                    <strong>{BANK_INFO.bankBranch}</strong>
                  </div>

                  <div className="payment-modal__fee">
                    <span>رسوم الكشف</span>
                    <strong>
                      {BANK_INFO.consultationFee} {BANK_INFO.currency}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary payment-modal__whatsapp"
                  onClick={() => {
                    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                  }}
                >
                  <WhatsappIcon />
                  متابعة عبر واتساب
                </button>

                <p className="payment-modal__note">
                  يرجى إتمام التحويل المصرفي ثم إرسال إيصال الدفع عبر واتساب. لا
                  يعتبر الحجز مؤكداً إلا بعد مراجعة الدفع وتأكيد العيادة.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
