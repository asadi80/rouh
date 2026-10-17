import { useMemo, useRef, useState } from "react";
import { useClinicData } from "../contexts/ClinicDataContext";
import { WhatsappIcon, CalendarIcon, ChevronIcon } from "./Icons";
import "./Doctors.css";

// Replace these example values with your actual bank information.
const BANK_INFO = {
  accountNameHolder: "شركة روح العطاء الخيرية",
  accountHolder: "مصحة روح",
  accountNumber: " 105907165601018",
  accountInternationalNumber: "LY09027105105907165601018",
  // iban: "رقم IBAN",
  consultationFee: "150",
  currency: "دينار ليبي",
  bankBranch: "فرع جنزور",
};
const whatsappNumber = "218916669082";

// Convert supported Google image URLs automatically.
function getDoctorImageUrl(url) {
  if (!url || typeof url !== "string" || !url.trim()) return "";

  const originalUrl = url.trim();

  try {
    const parsed = new URL(originalUrl);
    const hostname = parsed.hostname.toLowerCase();

    if (hostname === "drive.google.com" && parsed.pathname === "/thumbnail") {
      return originalUrl;
    }

    const isGoogleDrive = hostname === "drive.google.com";
    const isGoogleImage =
      hostname === "lh3.google.com" ||
      hostname.endsWith(".googleusercontent.com");

    if (!isGoogleDrive && !isGoogleImage) {
      return originalUrl;
    }

    const filePathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);

    const imagePathMatch = parsed.pathname.match(/\/d\/([^/=]+)/);

    const fileId =
      parsed.searchParams.get("id") ||
      (filePathMatch && filePathMatch[1]) ||
      (imagePathMatch && imagePathMatch[1]);

    if (!fileId) return originalUrl;

    return (
      "https://drive.google.com/thumbnail?id=" +
      encodeURIComponent(fileId) +
      "&sz=w1000"
    );
  } catch {
    return originalUrl;
  }
}

// Clipboard only reliably accepts PNG, so convert any image to PNG first.
function fileToPngBlob(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d").drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/png",
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image load failed"));
    };

    img.src = url;
  });
}

export default function Doctors() {
  const { doctors = [], clinicInfo = {} } = useClinicData();

  const [query, setQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState("");
  const [receiptError, setReceiptError] = useState("");

  const trackRef = useRef(null);
  const receiptInputRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return doctors;

    return doctors.filter(
      (doctor) =>
        (doctor.name || "").toLowerCase().includes(q) ||
        (doctor.specialty || "").toLowerCase().includes(q) ||
        (doctor.title || "").toLowerCase().includes(q),
    );
  }, [query, doctors]);

  const scrollByCards = (dir) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector(".doctor-card");
    const step = card ? card.getBoundingClientRect().width + 20 : 320;

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

  function openPaymentModal(doctor) {
    setSelectedDoctor(doctor);
    setReceiptFile(null);
    setReceiptPreview("");
    setReceiptError("");
  }

  function closePaymentModal() {
    setSelectedDoctor(null);
    setReceiptFile(null);
    setReceiptPreview("");
    setReceiptError("");

    if (receiptInputRef.current) {
      receiptInputRef.current.value = "";
    }
  }

  function handleReceiptChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setReceiptError("");

    if (!file.type.startsWith("image/")) {
      setReceiptError("يرجى اختيار ملف صورة صالح.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setReceiptError("يجب ألا يتجاوز حجم الصورة 10 ميجابايت.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setReceiptFile(file);
        setReceiptPreview(reader.result);
      } else {
        setReceiptError("تعذر قراءة الصورة. حاول مرة أخرى.");
      }
    };

    reader.onerror = () => {
      setReceiptError("تعذر قراءة الصورة. حاول مرة أخرى.");
    };

    reader.readAsDataURL(file);
  }

  async function sendBookingToWhatsApp() {
    if (!selectedDoctor || !receiptFile) {
      setReceiptError("يرجى اختيار صورة إيصال الدفع أولاً.");
      return;
    }

    const message = [
      "مرحبًا، أرغب في حجز موعد.",
      `الطبيب: ${selectedDoctor.name || ""}`,
      `التخصص: ${selectedDoctor.specialty || ""}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Copy the receipt image to the clipboard (passing a promise keeps
    // the user-gesture valid, which Safari requires).
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": fileToPngBlob(receiptFile) }),
        ]);
      }
    } catch (error) {
      console.error("Copying receipt failed:", error);
    }

    window.location.href = whatsappUrl;
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث بالاسم أو التخصص..."
            aria-label="البحث عن طبيب"
          />

          <span className="doctors__count">
            {filtered.length} {filtered.length === 1 ? "طبيب" : "أطباء"}
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
                            event.currentTarget.style.display = "none";

                            const avatar =
                              event.currentTarget.parentElement?.querySelector(
                                ".doctor-card__avatar",
                              );

                            if (avatar) avatar.style.display = "flex";
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
                        {(doc.schedule || []).map((schedule, index) =>
                          typeof schedule === "string" ? (
                            <li
                              key={index}
                              className="doctor-card__schedule-note"
                            >
                              <span>{schedule}</span>
                            </li>
                          ) : (
                            <li key={schedule.day || index}>
                              <span>{schedule.day}</span>

                              <span className="doctor-card__schedule-time">
                                {schedule.start_time && schedule.end_time
                                  ? `${formatArabicTime(
                                      schedule.start_time,
                                    )} - ${formatArabicTime(schedule.end_time)}`
                                  : formatScheduleTime(schedule.time)}
                              </span>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <button
                      className="btn btn-primary doctor-card__cta"
                      type="button"
                      onClick={() => openPaymentModal(doc)}
                    >
                      <WhatsappIcon /> احجز عبر واتساب
                    </button>
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

      {selectedDoctor && (
        <div
          className="payment-modal__overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closePaymentModal();
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
              onClick={closePaymentModal}
              aria-label="إغلاق"
            >
              ×
            </button>

            <h2 id="payment-modal-title">إتمام الحجز والدفع</h2>

            <p className="payment-modal__intro">
              حجز موعد مع {selectedDoctor.name}
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

              {/* <div className="payment-modal__row">
                <span>IBAN</span>
                <strong>{BANK_INFO.iban}</strong>
              </div> */}

              <div className="payment-modal__fee">
                <span>رسوم الكشف</span>
                <strong>
                  {BANK_INFO.consultationFee} {BANK_INFO.currency}
                </strong>
              </div>
            </div>

            <label className="payment-modal__upload">
              <span>إرفاق صورة إيصال التحويل</span>

              <input
                ref={receiptInputRef}
                type="file"
                accept="image/*"
                onChange={handleReceiptChange}
              />

              <span className="payment-modal__upload-hint">
                اختر صورة الإيصال من هاتفك أو جهازك (10 ميجابايت كحد أقصى).
              </span>
            </label>

            {receiptPreview && (
              <div className="payment-modal__preview">
                <img src={receiptPreview} alt="معاينة إيصال الدفع" />

                <p>{receiptFile?.name}</p>

                <button
                  type="button"
                  className="payment-modal__remove"
                  onClick={() => {
                    setReceiptFile(null);
                    setReceiptPreview("");
                    setReceiptError("");

                    if (receiptInputRef.current) {
                      receiptInputRef.current.value = "";
                    }
                  }}
                >
                  إزالة الصورة
                </button>
              </div>
            )}

            {receiptError && (
              <p className="payment-modal__error" role="status">
                {receiptError}
              </p>
            )}

            <button
              type="button"
              className="btn btn-primary payment-modal__whatsapp"
              disabled={!receiptFile}
              onClick={sendBookingToWhatsApp}
            >
              <WhatsappIcon />
              متابعة عبر واتساب وإرسال الإيصال
            </button>

            <p className="payment-modal__note">
              عند الضغط على الزر سيتم نسخ صورة الإيصال وفتح محادثة واتساب. اضغط
              مطولاً على خانة الكتابة ثم اختر "لصق" لإرسال الإيصال. لا يعتبر
              الحجز مؤكداً إلا بعد مراجعة الدفع وتأكيد العيادة.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
