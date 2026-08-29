import type { Metadata } from "next";
import Header from "@/components/Header";
import { TOTAL_PATTERNS } from "@/lib/constants";
import content from "../content.module.css";
import styles from "./about.module.css";

export const metadata: Metadata = { title: "Rules" };

export default function About() {
  return (
    <main className={content.shell}>
      <Header />
      <header className={content.hero}>
        <p className={content.kicker}>Rules</p>
        <h1>Find a new pattern.</h1>
        <p>There are {TOTAL_PATTERNS.toLocaleString()} possible patterns.</p>
      </header>
      <section className={styles.rules}>
        <ul>
          <li>Start on any dot.</li>
          <li>With a pointer, drag through all nine dots and release to check the pattern.</li>
          <li>With a keyboard, Tab to each dot and press Enter or Space. Select Submit after all nine.</li>
          <li>Use each dot only once.</li>
          <li className={styles.midpointRule}>
            <span>Crossing an unused middle dot selects it automatically.</span>
            <svg
              viewBox="0 0 120 18"
              role="img"
              aria-label="A line crossing through a middle dot"
            >
              <line x1="12" y1="9" x2="108" y2="9" />
              <circle cx="12" cy="9" r="4" />
              <circle cx="60" cy="9" r="5" />
              <circle cx="108" cy="9" r="4" />
            </svg>
          </li>
          <li>If you release early, your selected dots stay in place. Continue from any unused dot or clear the route.</li>
        </ul>
        <p>
          Direction matters. Reversed, rotated, and reflected patterns all
          count as different patterns. Every discovered route receives a global
          pattern number, shown in results and on Global.
        </p>
      </section>
      <aside className={styles.note} id="privacy">
        <strong>Privacy</strong>
        <span>
          No account. Your player ID and history stay in this browser. Where
          required, Clarity asks before recording anonymous usage.
        </span>
      </aside>
    </main>
  );
}
