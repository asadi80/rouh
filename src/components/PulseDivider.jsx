import "./PulseDivider.css";

export default function PulseDivider({ flat = false }) {
  return (
    <div className={`pulse-divider ${flat ? "pulse-divider--flat" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 600 60" preserveAspectRatio="none">
        <path
          className="pulse-line pulse-line--track"
          d="M0 30 H215 L223 30 L231 4 L241 56 L251 18 L259 30 L267 30 L275 12 L283 30 H600"
        />
        <path
          className="pulse-line pulse-line--draw"
          d="M0 30 H215 L223 30 L231 4 L241 56 L251 18 L259 30 L267 30 L275 12 L283 30 H600"
        />
        
      </svg>
      
    </div>
  );
}