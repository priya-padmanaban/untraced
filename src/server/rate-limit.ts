const buckets=new Map<string,{count:number;reset:number}>();
export function allow(key:string,limit=18,windowMs=60_000){if(process.env.NODE_ENV==="development")return true;const now=Date.now(),old=buckets.get(key);if(!old||old.reset<now){buckets.set(key,{count:1,reset:now+windowMs});return true}if(old.count>=limit)return false;old.count++;return true}
