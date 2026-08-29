import type { Metadata } from "next";
import { headers } from "next/headers";
import ClarityConsent from "@/components/ClarityConsent";
import "./globals.css";
import "./theme.css";
import "./typography.css";
const origin=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:"UNTRACED",template:"%s · UNTRACED"},description:"Draw a nine-dot pattern and see if anyone found it first.",manifest:"/manifest.webmanifest",openGraph:{title:"UNTRACED",description:"140,704 patterns. How many are still missing?",images:[{url:"/og.png",width:1536,height:1024}]},twitter:{card:"summary_large_image",title:"UNTRACED",description:"140,704 patterns. How many are still missing?",images:["/og.png"]}};

const consentRegions = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB",
]);

export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  const country = (await headers()).get("x-vercel-ip-country")?.toUpperCase();
  const requiresConsent = !country || consentRegions.has(country);

  return <html lang="en"><body>{children}<ClarityConsent requiresConsent={requiresConsent}/></body></html>
}
