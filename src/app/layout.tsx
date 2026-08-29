import type { Metadata } from "next";
import "./globals.css";
import "./typography.css";
const origin=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:"UNTRACED",template:"%s · UNTRACED"},description:"Draw a nine-dot pattern and see if anyone found it first.",openGraph:{title:"UNTRACED",description:"140,704 patterns. How many are still missing?",images:[{url:"/og.png",width:1536,height:1024}]},twitter:{card:"summary_large_image",title:"UNTRACED",description:"140,704 patterns. How many are still missing?",images:["/og.png"]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
