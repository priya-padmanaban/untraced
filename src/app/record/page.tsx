import type { Metadata } from "next";
import Header from "@/components/Header";
import MiniPattern from "@/components/MiniPattern";
import { MILESTONES } from "@/lib/constants";
import { formatElapsed, formatPercent, formatRelativeTime } from "@/lib/patterns";
import { progress } from "@/server/store";
import styles from "../content.module.css";

export const metadata: Metadata = { title: "Global" };
export const dynamic = "force-dynamic";

const exactDate = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeStyle: "short",
});

export default async function Record() {
  const data = await progress();
  const reached = new Map(data.milestones.map((milestone) => [milestone.threshold, milestone]));

  return (
    <main className={styles.shell}>
      <Header />
      <header className={styles.hero}>
        <p className={styles.kicker}>Global status</p>
        <h1>{data.discovered.toLocaleString()} patterns found.</h1>
        <p>
          {formatPercent(data.discovered)} mapped{" "}
          {formatElapsed(data.huntStartedAt)}.
        </p>
      </header>
      <div className={styles.metrics}>
        <div className={styles.metric}>
          <span>Unique patterns</span>
          <strong>{data.discovered.toLocaleString()}</strong>
        </div>
        <div className={styles.metric}>
          <span>Total entries</span>
          <strong>{data.totalSubmissions.toLocaleString()}</strong>
        </div>
        <div className={styles.metric}>
          <span>Players</span>
          <strong>{data.browsers.toLocaleString()}</strong>
        </div>
      </div>
      <p className={styles.privacyLine}>
        Players are counted anonymously. Each browser keeps a local player ID;
        no account is required. Anonymous usage sessions help improve the
        experiment.
      </p>
      <section className={styles.section}>
        <h2>Latest activity</h2>
        {data.recent.length ? (
          <div className={styles.gallery} data-count={data.recent.length}>
            {data.recent.map((pattern, index) => (
              <div
                className={styles.pattern}
                key={`${pattern.entryAt ?? pattern.firstDiscoveredAt}-${index}`}
              >
                <MiniPattern route={pattern.route} />
                <p className={styles.patternMeta}>
                  <strong>
                    {pattern.wasFirstDiscovery ? "First find" : "Repeat entry"}
                  </strong>
                  {" · "}
                  {pattern.name || "Anonymous"}
                  {" · "}
                  {formatRelativeTime(
                    pattern.entryAt ?? pattern.firstDiscoveredAt,
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No entries yet. The first line is waiting.</p>
        )}
      </section>
      <section className={styles.section}>
        <h2>Most common</h2>
        {data.popular.length ? (
          <div className={styles.gallery} data-count={data.popular.length}>
            {data.popular.map((pattern, index) => (
              <div
                className={styles.pattern}
                key={`${pattern.firstDiscoveredAt}-${index}`}
              >
                <MiniPattern route={pattern.route} />
                <p className={styles.patternMeta}>
                  {pattern.count.toLocaleString()}{" "}
                  {pattern.count === 1 ? "entry" : "entries"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <strong>No repeat yet.</strong>
            <p>No pattern has been entered twice yet.</p>
          </div>
        )}
      </section>
      <section className={styles.section}>
        <h2>Milestones</h2>
        <ol className={styles.milestones}>
          {MILESTONES.map((milestone) => {
            const milestoneData = reached.get(milestone.threshold);
            const remaining = milestone.count - data.discovered;

            return (
              <li
                className={milestoneData ? styles.reached : styles.locked}
                key={milestone.threshold}
              >
                <strong>{milestone.threshold}</strong>
                {milestoneData ? (
                  <span>{exactDate.format(new Date(milestoneData.reachedAt))}</span>
                ) : (
                  <span>
                    {remaining > 0
                      ? `${remaining.toLocaleString()} to go`
                      : "Ready to record"}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </main>
  );
}
