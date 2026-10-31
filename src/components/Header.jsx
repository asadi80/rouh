
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { useClinicData } from "../contexts/ClinicDataContext";
import { MenuIcon, CloseIcon, PhoneIcon } from "./Icons";
import "./Header.css";

const navLinks = [
  { href: "/#home", label: "الرئيسية" },
  { href: "/#services", label: "خدماتنا" },
  { href: "/#doctors", label: "الأطباء" },
  { href: "/#hours", label: "أوقات العمل" },
  { href: "/#location", label: "الموقع" },
  { href: "/#mental-health-section", label: "التقييم النفسي" },
  { href: "/#contact", label: "تواصل معنا" },
];

export default function Header() {
  const { clinicInfo = {} } = useClinicData();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = () => setOpen(false);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="container site-header__row">
        <a href="/#home" className="brand" onClick={handleNav}>
          <img
            src={logo}
            alt={clinicInfo.name || "عيادة روح"}
            className="brand__logo"
          />
          <span className="brand__name">
            {clinicInfo.shortName || "عيادة روح"}
          </span>
        </a>

        <nav className={`main-nav ${open ? "main-nav--open" : ""}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={handleNav}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={clinicInfo.phone ? `tel:${clinicInfo.phone}` : "tel:"}
            className="btn btn-primary main-nav__cta"
          >
            <PhoneIcon />
            <span className="call-text">اتصل الآن</span>
          </a>
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
    </header>
  );
}
