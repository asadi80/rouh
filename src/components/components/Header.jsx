import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { clinicInfo } from "../data/clinicData";
import { MenuIcon, CloseIcon, PhoneIcon } from "./Icons";
import "./Header.css";

const navLinks = [
  { href: "#home", label: "الرئيسية" },
  { href: "#services", label: "خدماتنا" },
  { href: "#doctors", label: "الأطباء" },
  { href: "#hours", label: "أوقات العمل" },
  { href: "#location", label: "الموقع" },
  { href: "#contact", label: "تواصل معنا" },
];

export default function Header() {
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
        <a href="#home" className="brand" onClick={handleNav}>
          <img src={logo} alt={clinicInfo.name} className="brand__logo" />
          <span className="brand__name">{clinicInfo.shortName}</span>
        </a>

        <nav className={`main-nav ${open ? "main-nav--open" : ""}`}>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={handleNav}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={`tel:${clinicInfo.phone}`} className="btn btn-primary main-nav__cta">
            <PhoneIcon /> اتصل الآن
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
