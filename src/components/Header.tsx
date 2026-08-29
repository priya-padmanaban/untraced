import Link from "next/link";
export default function Header(){return <header className="siteHeader"><Link href="/" className="wordmark">Untraced</Link><nav aria-label="Primary navigation"><Link href="/record">Record</Link><Link href="/you">You</Link><Link href="/about">About</Link></nav></header>}
