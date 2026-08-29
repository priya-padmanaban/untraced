"use client";

import { useEffect, useState } from "react";
import MiniPattern from "./MiniPattern";
import styles from "@/app/content.module.css";

type Entry = { route: number[]; new: boolean; at: string; count: number };
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
    queueMicrotask(() => {
      setHistory(readHistory());
      setName(localStorage.getItem("untraced-nickname") || "");
    });
  }, []);

  const firstFinds = history.filter((entry) => entry.new);
  const unique = new Set(history.map((entry) => entry.route.join("")));

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
      <div className={styles.metrics}>
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
      </div>
      <section className={styles.section}>
        <h2>First finds</h2>
        {firstFinds.length ? (
          <div className={styles.history} data-count={firstFinds.length}>
            {firstFinds.map((entry, index) => (
              <div className={styles.pattern} key={`${entry.at}-${index}`}>
                <MiniPattern route={entry.route} />
                <p>{new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(entry.at))}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No first finds yet.</p>
        )}
      </section>
      <section className={styles.section}>
        <h2>Nickname</h2>
        <p>Used on future first finds. Maximum 24 characters.</p>
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
