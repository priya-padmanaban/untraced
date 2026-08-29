import type { Metadata } from "next";
import ClarityConsent from "@/components/ClarityConsent";
import "./globals.css";
import "./typography.css";
const origin=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:"UNTRACED",template:"%s · UNTRACED"},description:"Draw a nine-dot pattern and see if anyone found it first.",manifest:"/manifest.webmanifest",icons:{icon:[{url:"/favicon.ico",sizes:"any"},{url:"/favicon.png",type:"image/png"},{url:"/favicon-96x96.png",sizes:"96x96",type:"image/png"}],apple:[{url:"/apple-touch-icon.png",sizes:"180x180",type:"image/png"}],shortcut:["/favicon.ico"]},openGraph:{title:"UNTRACED",description:"140,704 patterns. How many are still missing?",images:[{url:"/og.png",width:1536,height:1024}]},twitter:{card:"summary_large_image",title:"UNTRACED",description:"140,704 patterns. How many are still missing?",images:["/og.png"]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}<ClarityConsent/></body></html>}
