import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {csrf,validCsrf,origin} from '../lib/registration.js';
import register from '../api/register.js';
import bootstrap from '../api/registration.js';
process.env.REGISTRATION_BRIDGE_TOKEN=crypto.randomBytes(48).toString('hex');
process.env.REGISTRATION_BRIDGE_URL='https://test.trycloudflare.com';
function response(){return {code:200,headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(data){this.data=data;return this}}}
test('signed CSRF, origin and cookie checks block cross-site requests',async()=>{const token=csrf();assert(validCsrf(token));assert(!validCsrf(token+'x'));const r=response();await register({method:'POST',headers:{origin:'https://other.example'},body:{}},r);assert.equal(r.code,403)});
test('valid registration forwards only expected fields and hides backend failures',async()=>{const token=csrf(),old=global.fetch;let sent;
 const req={method:'POST',headers:{origin,'content-type':'application/json','x-admin-csrf':token,cookie:'__Host-registration='+token},body:{name:'testuser',password:'Test12345',id:crypto.randomUUID(),gm:99}};
 try{global.fetch=async(url,opts)=>{sent=JSON.parse(opts.body);return {status:200,json:async()=>({ok:true,password:'hidden'})}};const r=response();await register(req,r);assert.equal(r.code,200);assert.deepEqual(r.data,{ok:true});assert(!('gm' in sent));
 global.fetch=async()=>{throw Error('private details')};const fail=response();await register(req,fail);assert.equal(fail.code,503);assert(!JSON.stringify(fail.data).includes('private'));
 const offline=response();await bootstrap({method:'GET'},offline);assert.equal(offline.code,503);assert.equal(offline.data.available,false);
 }finally{global.fetch=old}});
