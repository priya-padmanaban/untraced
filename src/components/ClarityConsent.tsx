"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import styles from "./ClarityConsent.module.css";

const CONSENT_KEY = "untraced-analytics-consent";
const claritySnippet = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","y9u9dsnznt");`;

type Consent = "granted" | "denied";

export default function ClarityConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const saved = localStorage.getItem(CONSENT_KEY);
      if (saved === "granted" || saved === "denied") setConsent(saved);
    });
  }, []);

  const choose = (choice: Consent) => {
    localStorage.setItem(CONSENT_KEY, choice);
    setConsent(choice);
  };

  return (
    <>
      {consent === "granted" && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {claritySnippet}
        </Script>
      )}
      {consent === null && (
        <aside
          className={styles.banner}
          role="dialog"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
        >
          <div>
            <p className={styles.eyebrow}>A small request</p>
            <h2 id="analytics-consent-title">Help improve the experiment?</h2>
            <p id="analytics-consent-description">
              Clarity records anonymous session behavior, such as clicks and
              navigation, so UNTRACED can be improved. The game works fully
              without it.
            </p>
          </div>
          <div className={styles.actions}>
            <button className={styles.accept} onClick={() => choose("granted")}>
              Accept analytics
            </button>
            <button className={styles.decline} onClick={() => choose("denied")}>
              Not now
            </button>
            <a href="/about#privacy">Privacy</a>
          </div>
        </aside>
      )}
    </>
  );
}
