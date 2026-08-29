"use client";

import { useEffect, useState } from "react";
import type { PersonalHistoryEntry } from "@/lib/types";
import MiniPattern from "./MiniPattern";
import styles from "@/app/content.module.css";
import feedback from "@/app/feedback.module.css";

type Entry = Omit<PersonalHistoryEntry, "ordinal"> & { ordinal?: number | null };
const nicknamePattern = /^[\p{L}\p{N} _.'-]{1,24}$/u;

function readHistory(): Entry[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("untraced-history") || "[]",
    );
    return Array.isArray(value) ? (value as Entry[]) : [];
  } catch {
    return [];
  }
}

export default function YouClient() {
  const [history, setHistory] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    queueMicrotask(() => {
      setHistory(readHistory());
      setName(localStorage.getItem("untraced-nickname") || "");
      const playerId = localStorage.getItem("untraced-player-id");
      if (!playerId) return;
      void fetch("/api/history", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ playerId }),
        cache: "no-store",
        signal: controller.signal,
      }).then(async (response) => {
        if (!response.ok) return;
        const data: unknown = await response.json();
        if (typeof data !== "object" || data === null || !("entries" in data) || !Array.isArray(data.entries)) return;
        const entries = data.entries as PersonalHistoryEntry[];
        setHistory(entries);
        localStorage.setItem("untraced-history", JSON.stringify(entries.slice(0, 150)));
      }).catch(() => undefined);
    });
    return () => controller.abort();
  }, []);

  const firstFinds = history.filter((entry) => entry.new);
  const unique = new Set(history.map((entry) => entry.route.join("")));
  let currentStreak = 0;
  for (const entry of history) {
    if (!entry.new) break;
    currentStreak++;
  }
  let bestStreak = 0;
  let run = 0;
  for (const entry of [...history].reverse()) {
    run = entry.new ? run + 1 : 0;
    bestStreak = Math.max(bestStreak, run);
  }

  const saveName = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (trimmed && !nicknamePattern.test(trimmed)) {
      setNotice("Use up to 24 letters, numbers, spaces, or - . '");
      return;
    }
    if (trimmed) localStorage.setItem("untraced-nickname", trimmed);
    else localStorage.removeItem("untraced-nickname");
    setName(trimmed);
    setNotice(trimmed ? "Nickname saved" : "Nickname cleared");
  };

  const deleteLocalData = () => {
    if (!confirm("Delete local Untraced data?")) return;
    ["untraced-player-id", "untraced-history", "untraced-nickname", "untraced-muted", "untraced-analytics-consent"].forEach(
      (key) => localStorage.removeItem(key),
    );
    location.reload();
  };

  return (
    <>
      <div className={`${styles.metrics} ${feedback.mineMetrics}`}>
        <div className={styles.metric}>
          <span>Entries</span>
          <strong>{history.length}</strong>
        </div>
        <div className={styles.metric}>
          <span>First finds</span>
          <strong>{firstFinds.length}</strong>
        </div>
        <div className={styles.metric}>
          <span>Unique patterns</span>
          <strong>{unique.size}</strong>
        </div>
        <div className={styles.metric}>
          <span>Best streak</span>
          <strong>{bestStreak}</strong>
        </div>
      </div>
      <section className={styles.section}>
        <h2>First finds</h2>
        <p>Current streak: {currentStreak}.</p>
        {firstFinds.length ? (
          <div className={`${styles.history} ${feedback.historyCompact}`} data-count={firstFinds.length}>
            {firstFinds.map((entry, index) => (
              <div className={styles.pattern} key={`${entry.at}-${index}`}>
                <MiniPattern route={entry.route} />
                <p>{entry.ordinal ? `#${entry.ordinal.toLocaleString()} · ` : ""}{entry.count.toLocaleString()} {entry.count === 1 ? "entry" : "entries"} · {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(entry.at))}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No first finds yet.</p>
        )}
      </section>
      <section className={styles.section}>
        <h2>Nickname</h2>
        <p>Your name appears on Global the next time you find a new pattern. It won’t change earlier finds. Maximum 24 characters.</p>
        <form className={styles.form} onSubmit={saveName}>
          <input
            aria-label="Nickname"
            maxLength={24}
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNotice("");
            }}
            placeholder="Anonymous"
          />
          <button className={styles.button}>Save</button>
        </form>
        <p className={styles.formNotice} role="status">
          {notice}
        </p>
      </section>
      <section className={styles.section}>
        <h2>Local data</h2>
        <p>
          Your player ID, nickname, sound setting, and history stay in this
          browser. Submitted patterns remain in the global totals.
        </p>
        <button className={`${styles.button} ${styles.danger}`} onClick={deleteLocalData}>
          Delete local data
        </button>
      </section>
    </>
  );
}
