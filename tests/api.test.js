import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { once } from 'node:events';
import {createApp} from '../server/index.js';
import {openStore} from '../server/db.js';

test('full upload, reuse, persistence, human confirmation, deletion and request validation',async()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'gradpath-api-'));const app=await createApp({dataDir:directory,frontend:false});
 const server=app.listen(0,'127.0.0.1');if(!server.listening)await once(server,'listening');
 const root=`http://127.0.0.1:${server.address().port}/api`;
 const request=(url,body,method='POST',headers={})=>fetch(root+url,{method,headers:{'X-GradPath':'local',...(body instanceof FormData?{}:{'Content-Type':'application/json'}),...headers},body:body instanceof FormData?body:JSON.stringify(body)});
 try{
  const initial=await (await fetch(root+'/state')).json();assert.equal(initial.programs.filter(p=>p.tracked).length,7);
  assert.equal((await request('/programs/cmu-ai-ece',{deadline:'2027-01-15',deadlineStatus:'reference'},'PATCH')).status,200);
  assert.equal(app.locals.store.get('programs','cmu-ai-ece').deadlineStatus,'reference');
  assert.equal((await request('/programs/cmu-ai-ece',{opening:{date:'2026-02-30',display:'',status:'reference',note:''}},'PATCH')).status,400);
  assert.equal((await request('/programs/cmu-ai-ece',{opening:{date:'2026-10-01',display:'old display',status:'reference',note:'annual schedule'},duration:{display:'3 semesters',note:'official'}},'PATCH')).status,200);
  assert.equal(app.locals.store.get('programs','cmu-ai-ece').opening.display,'2026-10-01');
  const data=new FormData();data.append('kind','cv');data.append('file',new Blob(['Education: Bachelor of Computer Science. Research experience: developed machine learning models for a university laboratory. Projects: a graduate application platform. Skills: Python and statistics.']),'my-cv.txt');
  const response=await request('/documents',data);assert.equal(response.status,201);const doc=await response.json();assert.ok(doc.words>20);assert.equal(doc.text,undefined);
  for(const id of ['cmu-ai-ece','nyu-tandon-cs'])assert.equal((await request(`/programs/${id}/links`,{documentId:doc.id,requirementId:'cv'})).status,200);
  let state=await (await fetch(root+'/state')).json();for(const id of ['cmu-ai-ece','nyu-tandon-cs'])assert.equal(state.programs.find(p=>p.id===id).requirements.find(r=>r.id==='cv').state,'passed');
  const download=await fetch(root+`/documents/${doc.id}/download`);assert.match(await download.text(),/Bachelor/);assert.match(download.headers.get('content-disposition'),/attachment/);
  assert.equal((await request('/programs/cmu-ai-ece/requirements/reference-1',{status:'confirmed',note:''},'PUT')).status,400);
  assert.equal((await request('/programs/cmu-ai-ece/requirements/reference-1',{status:'confirmed',note:'School portal shows Received'},'PUT')).status,200);
  const reloaded=openStore(directory);assert.equal(reloaded.get('documents',doc.id).words,doc.words);assert.equal(reloaded.get('programs','cmu-ai-ece').overrides['reference-1'].status,'confirmed');reloaded.db.close();
  assert.equal((await request('/programs/cmu-ai-ece',{deadline:'2027-02-30'},'PATCH')).status,400);
  assert.equal((await request('/programs/cmu-ai-ece',{tracked:false},'PATCH',{'Origin':'https://evil.example'})).status,403);
  assert.equal((await fetch(root+'/programs/cmu-ai-ece',{method:'PATCH',headers:{'Content-Type':'application/json'},body:'{}'})).status,403);
  assert.equal((await request('/programs/cmu-ai-ece/links',{documentId:doc.id,requirementId:'reference-1'})).status,400);
  assert.equal((await request('/import',{url:'https://127.0.0.1/private'})).status,400);
  assert.equal((await request(`/documents/${doc.id}`,undefined,'DELETE')).status,200);
  state=await (await fetch(root+'/state')).json();assert.equal(state.documents.length,0);for(const id of ['cmu-ai-ece','nyu-tandon-cs'])assert.equal(state.programs.find(p=>p.id===id).requirements.find(r=>r.id==='cv').state,'missing');
  assert.equal((await fetch(root+'/documents/'+doc.id+'/download')).status,404);
  const imported=await (await request('/import',{text:'Admissions 2027. Statement of purpose. GRE is not required. Deadline not announced.'})).json();assert.ok(imported.requirements.length);
  const added=await request('/programs',{school:'测试大学',name:'Test CS',degree:'MS',requirements:imported.requirements,sources:[]});assert.equal(added.status,201);
  const backup=await (await fetch(root+'/export')).json();assert.equal(backup.programs.length,initial.programs.length+1);
 }finally{await new Promise(resolve=>server.close(resolve));app.locals.store.db.close();fs.rmSync(directory,{recursive:true,force:true});}
});
