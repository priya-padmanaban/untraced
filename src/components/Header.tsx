import Link from "next/link";
export default function Header(){return <header className="siteHeader"><Link href="/" className="wordmark">UNTRACED<span>09</span></Link><nav aria-label="Primary navigation"><Link href="/record">Global</Link><Link href="/you">Mine</Link><Link href="/about">Rules</Link></nav></header>}
