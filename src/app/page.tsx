import { progress } from "@/server/store";
import PatternGame from "@/components/PatternGame";
export const dynamic="force-dynamic";
export default async function Home(){let data;try{data=await progress()}catch{data={discovered:0,totalSubmissions:0,browsers:0,huntStartedAt:new Date().toISOString(),completedAt:null,recent:[],popular:[],milestones:[]}}return <PatternGame initialProgress={data}/>}
