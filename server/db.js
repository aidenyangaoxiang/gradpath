import { tuitionDetails } from './tuition-details.js';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { seeds } from './seed.js';
export function openStore(directory){
  fs.mkdirSync(path.join(directory,'uploads'),{recursive:true,mode:0o700});
  const db=new DatabaseSync(path.join(directory,'gradpath.sqlite'));
  db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS programs (id TEXT PRIMARY KEY, body TEXT NOT NULL); CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, body TEXT NOT NULL); CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY,value TEXT);');
  const all=table=>db.prepare(`SELECT body FROM ${table}`).all().map(r=>JSON.parse(r.body));
  const get=(table,id)=>{const row=db.prepare(`SELECT body FROM ${table} WHERE id=?`).get(id);return row?JSON.parse(row.body):null;};
  const put=(table,obj)=>db.prepare(`INSERT INTO ${table} (id,body) VALUES (?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body`).run(obj.id,JSON.stringify(obj));
  if(!db.prepare("SELECT value FROM meta WHERE key='seeded'").get()){for(const p of seeds)put('programs',p);db.prepare("INSERT INTO meta VALUES ('seeded','2')").run();}
  else if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='1'){
    const existing=get('programs','cornell-tech-cs');
    if(existing){const updated=seeds.find(p=>p.id===existing.id);put('programs',{...existing,requirements:updated.requirements,requirementsVerified:true});}
    db.prepare("UPDATE meta SET value='2' WHERE key='seeded'").run();
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='2'){
    db.exec('BEGIN');
    try {
      for(const seed of seeds){
        const existing=get('programs',seed.id);if(!existing)continue;
        const timing={};for(const key of ['opening','duration','rounds'])if(existing[key]===undefined)timing[key]=seed[key];
        // Never replace a date, note, file association or manual confirmation entered by the user.
        if(!existing.deadline&&existing.deadlineStatus==='unconfirmed'){
          for(const key of ['deadline','deadlineStatus','deadlineTime','timezone'])timing[key]=seed[key];
        }
        put('programs',{...existing,...timing});
      }
      db.prepare("UPDATE meta SET value='3' WHERE key='seeded'").run();db.exec('COMMIT');
    } catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='3'){
    db.exec('BEGIN');
    try {
      for(const seed of seeds){const existing=get('programs',seed.id);if(existing&&existing.credits===undefined)put('programs',{...existing,credits:seed.credits});}
      db.prepare("UPDATE meta SET value='4' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='4'){
    db.exec('BEGIN');
    try {
      for(const seed of seeds){
        const existing=get('programs',seed.id);
        if(!existing){if(seed.id==='cornell-ithaca-cs')put('programs',seed);continue;}
        const updated={...existing};
        const oldDurations={'ucsd-ece-phd':'规范学制 6 年 / 已有硕士 5 年','cornell-tech-cs':'1 年 · 全日制'};
        if(existing.duration?.display===oldDurations[seed.id])updated.duration={...existing.duration,display:seed.duration.display,note:existing.duration.note+' '+seed.duration.note};
        if(seed.id==='cornell-tech-cs'){
          updated.tracked=true;
          updated.deadlineNote=existing.deadlineNote?.replace('此为纽约 Cornell Tech，Ithaca 须另建项目。','此为纽约 Cornell Tech；Ithaca 校区另有独立项目卡片。');
          updated.sources=[...existing.sources,...seed.sources.filter(s=>!existing.sources.some(old=>old.url===s.url))];
        }
        if(tuitionDetails[seed.id]&&existing.tuition?.url===seed.tuition?.url){
          updated.tuition={...existing.tuition};
          if(seed.id==='cornell-tech-cs')updated.tuition.note=existing.tuition.note?.replace('2027–28 尚待核验；不能套用于 Ithaca 项目。','2027–28 尚待核验；Ithaca 校区费用另按大学 Bursar 页面核验。');
          for(const [key,value] of Object.entries(tuitionDetails[seed.id])){
            if(key==='display'){if(existing.tuition.display==='$73,946 / 学年')updated.tuition.display=value;}
            else if(updated.tuition[key]===undefined)updated.tuition[key]=value;
          }
        }
        put('programs',updated);
      }
      db.prepare("UPDATE meta SET value='5' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='5'){
    db.exec('BEGIN');
    try {
      // Only replace the legacy, untouched opening records. User edits keep priority.
      const legacyNotes={
        'ucsd-ece-mlds':'官网明确为 Fall 2027 申请开放日期。',
        'ucsd-ece-phd':'官网明确为 Fall 2027 申请开放日期。',
        'northwestern-cs-ms':'官网写 2026-09-15 开放，但同句称 2026–2027 academic year，与旁边 Fall 2027 博士说明有歧义；作为参考，需在申请系统确认。',
        'northwestern-cs-phd':'官网写 2026-09-15 开放，但同句称 2026–2027 academic year，与旁边 Fall 2027 博士说明有歧义；作为参考，需在申请系统确认。',
        'cmu-ai-ece':'官网常规日程（未标年份），按 2027 Fall 推算；原页开放日期为 10/1。',
        'nyu-tandon-cs':'2026-09-30 核验：申请入口明确显示 2027 application 已开放，未公布首次开放日期；没有找到可核验的往年具体开放日。',
        'nyu-tandon-ee':'2026-09-30 核验：申请入口明确显示 2027 application 已开放，未公布首次开放日期；没有找到可核验的往年具体开放日。',
        'cornell-tech-cs':'官网已公布 Fall 2027 轮次并提供申请入口，但未注明开放日；未找到可靠的历史开放日期。',
        'cornell-ithaca-cs':'Ithaca CS 当前主页强调 Spring 2027，不能据此确认 Fall 2027 已开放。尚未查到可核验的当季或历史具体开放日。'
      };
      for(const seed of seeds){
        const existing=get('programs',seed.id);
        if(existing?.opening?.note===legacyNotes[seed.id])put('programs',{...existing,opening:seed.opening});
      }
      db.prepare("UPDATE meta SET value='6' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='6'){
    db.exec('BEGIN');
    try {
      for(const seed of seeds){
        const existing=get('programs',seed.id);
        if(existing&&!existing.officialUrl&&seed.officialUrl)put('programs',{...existing,officialUrl:seed.officialUrl});
      }
      db.prepare("UPDATE meta SET value='7' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='7'){
    db.exec('BEGIN');
    try {
      const seed=seeds.find(p=>p.id==='cornell-ithaca-cs'),existing=get('programs','cornell-ithaca-cs');
      if(existing&&!existing.officialUrl)put('programs',{...existing,officialUrl:seed.officialUrl});
      db.prepare("UPDATE meta SET value='8' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='8'){
    db.exec('BEGIN');
    try {
      const oldReferenceDetail='推荐人通过学校系统提交；确认学校显示收件后手动勾选并记录依据。';
      for(const seed of seeds){
        const existing=get('programs',seed.id);if(!existing)continue;
        const requirements=existing.requirements.map(requirement=>{
          const seeded=seed.requirements.find(r=>r.id===requirement.id);
          if(!seeded?.submissionMethod||requirement.submissionMethod)return requirement;
          return {...requirement,submissionMethod:seeded.submissionMethod,detail:requirement.detail===oldReferenceDetail?seeded.detail:requirement.detail};
        });
        const sources=[...existing.sources,...seed.sources.filter(source=>!existing.sources.some(old=>old.url===source.url))];
        put('programs',{...existing,requirements,sources});
      }
      db.prepare("UPDATE meta SET value='9' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='9'){
    db.exec('BEGIN');
    try {
      for(const seed of seeds){
        const existing=get('programs',seed.id);
        if(!existing){if(seed.id==='hku-msc-ai')put('programs',seed);continue;}
        if(!existing.interview&&seed.interview){
          const sources=[...existing.sources,...seed.sources.filter(source=>!existing.sources.some(old=>old.url===source.url))];
          put('programs',{...existing,interview:seed.interview,sources});
        }
      }
      db.prepare("UPDATE meta SET value='10' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='10'){
    db.exec('BEGIN');
    try {
      for(const seed of seeds){
        const existing=get('programs',seed.id);if(!existing?.applicationFee&&seed.applicationFee){
          const sources=[...existing.sources,...seed.sources.filter(source=>!existing.sources.some(old=>old.url===source.url))];
          put('programs',{...existing,applicationFee:seed.applicationFee,sources});
        }
      }
      db.prepare("UPDATE meta SET value='11' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='11'){
    db.exec('BEGIN');
    try {
      const seed=seeds.find(p=>p.id==='hku-msc-ai'),existing=get('programs','hku-msc-ai');
      if(existing&&seed){
        const requirements=[...existing.requirements];
        for(const requirement of seed.requirements)if(!requirements.some(old=>old.id===requirement.id))requirements.push(requirement);
        const sources=[...existing.sources,...seed.sources.filter(source=>!existing.sources.some(old=>old.url===source.url))];
        put('programs',{...existing,requirements,sources});
      }
      db.prepare("UPDATE meta SET value='12' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='12'){
    db.exec('BEGIN');
    try {
      const seed=seeds.find(p=>p.id==='ucsd-ece-mlds'),existing=get('programs','ucsd-ece-mlds');
      if(existing?.tuition?.display==='$28,824 / 学年（纯学费）'&&seed){
        put('programs',{...existing,tuition:{...existing.tuition,...seed.tuition}});
      }
      db.prepare("UPDATE meta SET value='13' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  if(db.prepare("SELECT value FROM meta WHERE key='seeded'").get().value==='13'){
    db.exec('BEGIN');
    try {
      const seed=seeds.find(p=>p.id==='ucsd-ece-mlds'),existing=get('programs','ucsd-ece-mlds');
      if(existing?.tuition?.display==='$38,087 / 学年（学校账单；不含生活费）'&&seed){
        put('programs',{...existing,tuition:{...existing.tuition,...seed.tuition}});
      }
      db.prepare("UPDATE meta SET value='14' WHERE key='seeded'").run();db.exec('COMMIT');
    }catch(error){db.exec('ROLLBACK');throw error;}
  }
  return {db,all,get,put,remove:(table,id)=>db.prepare(`DELETE FROM ${table} WHERE id=?`).run(id)};
}
