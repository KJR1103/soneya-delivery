import { useState } from "react";
import "./motion.css";

export const LEGAL_VERSION = "1.0"; // à changer à chaque mise à jour des documents : l'utilisateur doit alors ré-accepter

export type Consent = { terms: true; privacy: true; marketing: boolean; version: string; acceptedAt: string };
type Props = {
  onAccept: (c: Consent) => Promise<void> | void; // à enregistrer côté serveur : qui, quand, quelle version
  openDoc: (doc: "terms" | "privacy" | "data") => void; // ouvre le lecteur du document
};

/** Écran bloquant : rien ne s'utilise tant que les conditions et la politique ne sont pas acceptées. */
export default function ConsentGate({ onAccept, openDoc }: Props) {
  const [terms, setTerms] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false); // facultatif, jamais coché par défaut
  const [busy, setBusy] = useState(false);
  const ok = terms && privacy && !busy;
  return (
    <main className="m-reveal" aria-labelledby="c-title">
      <h1 id="c-title">Avant de commencer</h1>
      <p>Pour utiliser Soneya, lisez et acceptez nos documents.</p>
      <button onClick={() => openDoc("terms")}>Conditions d'utilisation</button>
      <button onClick={() => openDoc("privacy")}>Politique de confidentialité</button>
      <button onClick={() => openDoc("data")}>Utilisation de vos données</button>
      <label><input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} /> J'ai lu et j'accepte les Conditions d'utilisation (v{LEGAL_VERSION})</label>
      <label><input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} /> J'ai lu et j'accepte la Politique de confidentialité et l'utilisation de mes données</label>
      <label><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} /> J'accepte de recevoir des offres (facultatif)</label>
      <button className="m-press" disabled={!ok} onClick={async () => { setBusy(true); await onAccept({ terms: true, privacy: true, marketing, version: LEGAL_VERSION, acceptedAt: new Date().toISOString() }); setBusy(false); }}>
        Accepter et continuer
      </button>
      <small>Vous pouvez retirer vos consentements dans Profil, Mes données.</small>
    </main>
  );
}
