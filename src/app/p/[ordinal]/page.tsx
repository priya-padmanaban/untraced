import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import Header from "@/components/Header";
import MiniPattern from "@/components/MiniPattern";
import { getPublicPatternByOrdinal } from "@/server/store";
import content from "../../content.module.css";
import styles from "./pattern.module.css";

type Props = { params: Promise<{ ordinal: string }> };
export const dynamic = "force-dynamic";
const getPattern = cache((value: string) => getPublicPatternByOrdinal(Number(value)));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ordinal } = await params;
  const pattern = await getPattern(ordinal);
  if (!pattern) return { title: "Pattern not found" };
  return {
    title: `Pattern #${pattern.ordinal.toLocaleString()}`,
    description: `Pattern #${pattern.ordinal.toLocaleString()} has ${pattern.count.toLocaleString()} ${pattern.count === 1 ? "entry" : "entries"} on UNTRACED.`,
  };
}

export default async function PatternPage({ params }: Props) {
  const { ordinal } = await params;
  const pattern = await getPattern(ordinal);
  if (!pattern) notFound();
  return <main className={content.shell}>
    <Header />
    <header className={content.hero}>
      <p className={content.kicker}>Discovered pattern</p>
      <h1>Pattern #{pattern.ordinal.toLocaleString()}</h1>
      <p>{pattern.name || "Anonymous"} found this pattern first.</p>
    </header>
    <section className={styles.result}>
      <div className={styles.pattern}><MiniPattern route={pattern.route} label={`Pattern #${pattern.ordinal.toLocaleString()}`} /></div>
      <div className={styles.details}>
        <p className={content.kicker}>Pattern record</p>
        <div><span>Global number</span><strong>#{pattern.ordinal.toLocaleString()}</strong></div>
        <div><span>Entries</span><strong>{pattern.count.toLocaleString()}</strong></div>
        <div><span>First found by</span><strong>{pattern.name || "Anonymous"}</strong></div>
        <p>{new Intl.DateTimeFormat("en", { dateStyle: "long", timeStyle: "short" }).format(new Date(pattern.firstDiscoveredAt))}</p>
      </div>
    </section>
    <Link className={styles.playLink} href="/">Try a pattern</Link>
  </main>;
}
