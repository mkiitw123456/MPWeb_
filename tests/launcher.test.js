import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import launcher from '../api/launcher.js';
process.env.REGISTRATION_BRIDGE_TOKEN=crypto.randomBytes(48).toString('hex');
process.env.REGISTRATION_BRIDGE_URL='https://test.trycloudflare.com';
const response=()=>({code:200,setHeader(){},status(n){this.code=n;return this},json(data){this.data=data;return this}});
test('native launcher forwards locale but never arbitrary account fields',async()=>{
 const previous=global.fetch;let body;
 try{
  global.fetch=async(url,options)=>{body=JSON.parse(options.body);return {status:200,json:async()=>({ok:true})}};
  const r=response();await launcher({method:'POST',headers:{},body:{action:'login',name:'qa',password:'fixture',locale:'zh-TW',gm:99,accountid:1}},r);
  assert.equal(r.code,200);assert.equal(body.locale,'zh-TW');assert.equal(body.gm,undefined);assert.equal(body.accountid,undefined);
  body=null;const denied=response();await launcher({method:'POST',headers:{origin:'https://other.example'},body:{action:'login'}},denied);
  assert.equal(denied.code,403);assert.equal(body,null);
 }finally{global.fetch=previous}
});
