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
        <p>There are {TOTAL_PATTERNS.toLocaleString()} valid patterns.</p>
      </header>
      <section className={styles.rules}>
        <ul>
          <li>Start on any dot.</li>
          <li>Drag through all nine dots.</li>
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
          <li>Release after all nine dots are selected.</li>
        </ul>
        <p>
          Direction matters. Reversed, rotated, and reflected patterns all
          count as different patterns.
        </p>
      </section>
      <aside className={styles.note} id="privacy">
        <strong>Privacy</strong>
        <span>
          No account is required. An anonymous player ID and local history stay
          in your browser. Where required, Clarity asks for consent before
          recording anonymous usage sessions to improve the experiment.
        </span>
      </aside>
    </main>
  );
}
