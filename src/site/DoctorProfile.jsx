
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useClinicData } from "../contexts/ClinicDataContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./DoctorProfile.css";

const API_URL = import.meta.env.VITE_API_URL || "https://api.rouh.ly";

export default function DoctorProfile() {
  const { id } = useParams();

  const { doctors = [], loading, error } = useClinicData();

  // Find doctor from ClinicDataContext
  const doctor = useMemo(
    () => doctors.find((item) => String(item.id) === String(id)),
    [doctors, id]
  );

  // Support local uploads and external image URLs
  const getImageUrl = (image) => {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) return image;

    return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
  };

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
      ].filter(([, value]) => value !== null && value !== undefined && value !== "")
    : [];

  return (
    <>
      <Header />

      <main className="doctor-profile-page" dir="rtl">
        <div className="container">
          <Link to="/#doctors" className="doctor-profile-back">
            ← العودة إلى الأطباء
          </Link>

          {loading && (
            <p className="doctor-profile-message">
              جارٍ تحميل الملف الشخصي...
            </p>
          )}

          {!loading && error && (
            <p className="doctor-profile-message doctor-profile-error">
              تعذر تحميل بيانات الأطباء
            </p>
          )}

          {!loading && !error && !doctor && (
            <p className="doctor-profile-message">
              لم يتم العثور على الطبيب
            </p>
          )}

          {!loading && doctor && (
            <article className="doctor-profile">
              <div className="doctor-profile__top">
                <div className="doctor-profile__image">
                  {doctor.image || doctor.image_url ? (
                    <img
                      src={getImageUrl(doctor.image || doctor.image_url)}
                      alt={doctor.name}
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

              {doctor.bio && (
                <section className="doctor-profile__section">
                  <h2>نبذة عن الطبيب</h2>
                  <p>{doctor.bio}</p>
                </section>
              )}

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

              {Array.isArray(doctor.schedule) &&
                doctor.schedule.length > 0 && (
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
        </div>
      </main>

      <Footer />
    </>
  );
}
