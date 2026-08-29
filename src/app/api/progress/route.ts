import { NextResponse } from "next/server";import { progress } from "@/server/store";
export const dynamic="force-dynamic";export async function GET(){try{return NextResponse.json(await progress(),{headers:{"Cache-Control":"public, s-maxage=10, stale-while-revalidate=20"}})}catch{return NextResponse.json({error:"Progress unavailable"},{status:503})}}
