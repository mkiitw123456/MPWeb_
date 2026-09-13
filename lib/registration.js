import crypto from 'node:crypto';
export const origin='https://mp-web-9q62.vercel.app';
function secret(){const s=process.env.REGISTRATION_BRIDGE_TOKEN;if(!s||s.length<32)throw Error('unavailable');return s}
function sign(s){return crypto.createHmac('sha256',secret()).update(s).digest('hex')}
export function csrf(){const value=Date.now()+'.'+crypto.randomBytes(24).toString('hex');return value+'.'+sign(value)}
export function validCsrf(value){if(typeof value!=='string'||value.length>180)return false;const [ts,nonce,mac]=value.split('.');if(!/^\d{13}$/.test(ts)||!nonce||!mac||Date.now()-Number(ts)>1800000||Number(ts)>Date.now()+30000)return false;const expected=sign(ts+'.'+nonce);return mac.length===expected.length&&crypto.timingSafeEqual(Buffer.from(mac),Buffer.from(expected))}
export async function bridge(route,body,client=''){
 const u=new URL(process.env.REGISTRATION_BRIDGE_URL);if(u.protocol!=='https:'||!u.hostname.endsWith('.trycloudflare.com')||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash)throw Error('unavailable');
 const r=await fetch(new URL(route,u),{method:body?'POST':'GET',redirect:'error',signal:AbortSignal.timeout(8000),headers:{Authorization:'Bearer '+secret(),'Content-Type':'application/json','X-Registration-Client':sign(client).slice(0,48)},body:body?JSON.stringify(body):undefined});
 return {status:r.status,data:await r.json()};
}
export function headers(res){res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff')}
