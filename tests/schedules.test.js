import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {openStore} from '../server/db.js';
import {seeds} from '../server/seed.js';

test('schedule migration preserves user dates, notes, documents, links and overrides; runs once',()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'gradpath-schedule-'));
 let store;
 try{
  store=openStore(directory);
  const p=store.get('programs','cmu-ai-ece');
  delete p.opening;delete p.duration;delete p.rounds;delete p.credits;
  Object.assign(p,{deadline:'2027-01-10',deadlineStatus:'user-confirmed',deadlineNote:'my evidence',notes:'my plan',tracked:false,links:{cv:['my-doc']},overrides:{cv:{status:'confirmed',note:'checked'}}});store.put('programs',p);
  const nyu=store.get('programs','nyu-tandon-cs');delete nyu.opening;delete nyu.duration;delete nyu.rounds;Object.assign(nyu,{deadline:'',deadlineStatus:'unconfirmed',deadlineNote:'original note'});store.put('programs',nyu);
  store.put('documents',{id:'my-doc',name:'my cv'});
  store.db.prepare("UPDATE meta SET value='2' WHERE key='seeded'").run();store.db.close();store=openStore(directory);
  const migrated=store.get('programs',p.id);assert.equal(migrated.deadline,p.deadline);assert.equal(migrated.deadlineStatus,'user-confirmed');assert.equal(migrated.deadlineNote,p.deadlineNote);assert.equal(migrated.notes,p.notes);assert.equal(migrated.tracked,false);assert.deepEqual(migrated.links,p.links);assert.deepEqual(migrated.overrides,p.overrides);assert.equal(migrated.duration.display,'3 学期');assert.equal(migrated.credits.display,'97 units（CMU 单位）');assert.equal(migrated.rounds.length,2);assert.equal(store.get('documents','my-doc').name,'my cv');
  const n=store.get('programs',nyu.id);assert.equal(n.deadline,'2026-12-01');assert.equal(n.deadlineStatus,'reference');assert.equal(n.deadlineNote,'original note');
  migrated.duration.display='custom duration';migrated.credits.display='custom credits';store.put('programs',migrated);store.db.prepare("UPDATE meta SET value='3' WHERE key='seeded'").run();store.db.close();store=openStore(directory);assert.equal(store.get('programs',p.id).duration.display,'custom duration');assert.equal(store.get('programs',p.id).credits.display,'custom credits');
 }finally{store?.db.close();fs.rmSync(directory,{recursive:true,force:true});}
});

test('all seeds have sourced durations, opening evidence and individually labelled rounds',()=>{
 for(const p of seeds){assert.ok(p.duration.display);assert.ok(p.duration.url.startsWith('https://'));assert.ok(p.opening.note);assert.ok(p.rounds.length);for(const r of p.rounds){assert.equal(new Date(r.date).toISOString().slice(0,10),r.date);if(r.status==='reference')assert.ok(r.reference);}}
 assert.equal(seeds.find(p=>p.id==='northwestern-cs-ms').rounds.length,4);
 assert.equal(seeds.find(p=>p.id==='cornell-tech-cs').rounds.length,3);
 assert.equal(seeds.find(p=>p.id==='nyu-tandon-cs').opening.date,'');
 const hku=seeds.find(p=>p.id==='hku-msc-ai');assert.equal(hku.opening.date,'2026-09-21');assert.equal(hku.rounds.length,2);assert.equal(hku.credits.display,'至少 72 credits（HKU 单位）');assert.equal(hku.interview.display,'官网未列固定面试');assert.equal(hku.applicationFee.display,'HK$600 / 份');
});

test('Cornell comparison upgrade adds Ithaca and clarifies fees without resetting user records',()=>{
 const directory=fs.mkdtempSync(path.join(os.tmpdir(),'gradpath-cornell-'));let store;
 try{
  store=openStore(directory);store.remove('programs','cornell-ithaca-cs');
  const old=store.get('programs','cornell-tech-cs');old.tracked=false;old.notes='keep this';old.links={cv:['cv-id']};old.tuition.display='$73,946 / 学年';delete old.tuition.period;delete old.tuition.programTotal;old.duration.display='1 年 · 全日制';store.put('programs',old);
  store.db.prepare("UPDATE meta SET value='4' WHERE key='seeded'").run();store.db.close();store=openStore(directory);
  const updated=store.get('programs',old.id);assert.equal(updated.tracked,true);assert.equal(updated.notes,'keep this');assert.deepEqual(updated.links,{cv:['cv-id']});assert.match(updated.tuition.display,/36,973/);assert.match(updated.tuition.programTotal,/73,946/);assert.match(updated.duration.display,/9 个月/);
  const ithaca=store.get('programs','cornell-ithaca-cs');assert.equal(ithaca.degree,'MEng');assert.equal(ithaca.deadline,'2027-02-01');assert.equal(ithaca.deadlineStatus,'reference');assert.equal(ithaca.credits.display,'30 credits');
 }finally{store?.db.close();fs.rmSync(directory,{recursive:true,force:true});}
});
