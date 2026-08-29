import type { Metadata } from "next";
import "./globals.css";
const origin=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
export const metadata:Metadata={metadataBase:new URL(origin),title:{default:"Untraced",template:"%s · Untraced"},description:"A communal attempt to discover every valid nine-dot Android-style lock pattern.",openGraph:{title:"Untraced",description:"One shared hunt. 140,704 routes.",images:[{url:"/og.png",width:1536,height:1024}]},twitter:{card:"summary_large_image",title:"Untraced",description:"One shared hunt. 140,704 routes.",images:["/og.png"]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body>{children}</body></html>}
