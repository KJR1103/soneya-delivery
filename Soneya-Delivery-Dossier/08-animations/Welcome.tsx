import type { CSSProperties } from "react";
import "./welcome.css";

// Slogans modifiables. 4 slogans = cycle de 12 s (3 s chacun), géré en CSS.
export const SLOGANS = [
  "Tout Conakry, livré chez vous.",
  "Repas, pharmacie, courses et colis. Une seule application.",
  "Suivez votre livreur en direct.",
  "Payez avec Orange Money ou MTN MoMo.",
];

type Props = {
  onLogin: () => void;
  onSignup: () => void;
  logoSrc?: string;
  photos?: [string, string, string]; // 3 photos de plats (haute résolution)
};

export default function Welcome({
  onLogin,
  onSignup,
  logoSrc = "/images/soneya-icon.png",
  photos = ["/images/plat-1.jpg", "/images/plat-2.jpg", "/images/plat-3.jpg"],
}: Props) {
  return (
    <main className="welcome" aria-label="Bienvenue sur Soneya">
      <div className="orb a" aria-hidden="true" />
      <div className="orb b" aria-hidden="true" />
      {photos.map((src, i) => (
        <div
          key={src}
          className={`plate p${i + 1}`}
          style={{ backgroundImage: `url(${src})` }}
          aria-hidden="true"
        />
      ))}

      <div className="logo" style={{ backgroundImage: `url(${logoSrc})` }} role="img" aria-label="Soneya Delivery" />
      <h1>Bienvenue sur Soneya</h1>

      <ul className="slogans" aria-label="Nos promesses">
        {SLOGANS.map((text, i) => (
          <li key={text} className="slogan" style={{ "--i": i } as CSSProperties}>
            {text}
          </li>
        ))}
      </ul>
      <div className="dots" aria-hidden="true">
        {SLOGANS.map((_, i) => (
          <span key={i} className="dot" style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      <div className="cta">
        <button className="btn primary" onClick={onLogin}>Se connecter</button>
        <button className="btn ghost" onClick={onSignup}>Créer un compte</button>
      </div>
    </main>
  );
}
