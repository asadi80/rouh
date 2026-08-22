import { useEffect, useState } from "react";
import "./AnnouncementBar.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!API_URL) return; // لا يوجد سيرفر لوحة تحكم مُعرّف — لا نعرض شيئًا ولا نطلب شيئًا

    let cancelled = false;
    fetch(`${API_URL}/api/announcements`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setAnnouncements(data);
      })
      .catch(() => {
        /* فشل الطلب: لا نعرض شيئًا، ولا نكسر الصفحة */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // لا يوجد أي إعلان مفعّل حاليًا -> لا يُعرض القسم إطلاقًا
  if (announcements.length === 0) return null;

  return (
    <div className="announcement-bar">
      <div className="container announcement-bar__row">
        {announcements.map((a) => (
          <p key={a.id}>
            {a.title && <strong>{a.title}: </strong>}
            {a.message}
          </p>
        ))}
      </div>
    </div>
  );
}
