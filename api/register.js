import {bridge,validCsrf,headers,origin} from '../lib/registration.js';
export default async function handler(req,res){headers(res);if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});try{
 const token=req.headers['x-admin-csrf'];const cookie=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('__Host-registration='))?.slice('__Host-registration='.length);
 if(req.headers.origin!==origin||!String(req.headers['content-type']||'').startsWith('application/json')||!token||cookie!==token||!validCsrf(token))return res.status(403).json({error:'頁面已過期，請重新整理後再試'});
 if(Number(req.headers['content-length']||0)>4096)return res.status(413).json({error:'請求過大'});
 const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
 if(!body||JSON.stringify(body).length>4096||typeof body.name!=='string'||typeof body.password!=='string'||!body.id)return res.status(400).json({error:'請求格式無效'});
 const result=await bridge('/register',{name:body.name,password:body.password,id:body.id},String(req.headers['x-real-ip']||'unknown'));
 if(result.status===200&&result.data.ok)return res.json({ok:true});
 return res.status([400,429].includes(result.status)?result.status:503).json({error:result.data.error||'註冊服務暫停，請稍後再試'});
 }catch{return res.status(503).json({error:'註冊服務暫停，請稍後再試'})}}
