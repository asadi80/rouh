import "./PulseDivider.css";

export default function PulseDivider({ flat = false }) {
  return (
    <div className={`pulse-divider ${flat ? "pulse-divider--flat" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 600 60" preserveAspectRatio="none">
        <path
          className="pulse-line pulse-line--track"
          d="M0 30 H220 L245 8 L262 52 L280 18 L296 42 L312 30 H600"
        />
        <path
          className="pulse-line pulse-line--draw"
          d="M0 30 H220 L245 8 L262 52 L280 18 L296 42 L312 30 H600"
        />
      </svg>
    </div>
  );
}
