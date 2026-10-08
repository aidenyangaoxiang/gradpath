import {useState} from 'react';
import type {Program} from './types';

export function Credits({p,save}:{p:Program;save:(values:unknown)=>Promise<void>}){
 const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const fd=new FormData(e.currentTarget);setBusy(true);
  try{await save({credits:{display:fd.get('credits'),note:fd.get('creditsNote'),reference:fd.get('creditsReference'),...(fd.get('creditsUrl')?{url:fd.get('creditsUrl')}:{})}});}catch{}finally{setBusy(false);}
 }
 return <section className="info-panel credits-panel"><h3>参考毕业学分：</h3><strong>{p.credits?.display||'待核验'}</strong><p>{p.credits?.reference||'请核对入学年度课程目录'}</p><p>{p.credits?.note}</p><p className="muted small-copy">不同学校的 units / credits 计量方式不同，保留官网原单位。{p.credits?.verifiedAt&&` 最近核验 / 更新：${p.credits.verifiedAt}`}</p>{p.credits?.url&&<a href={p.credits.url} target="_blank" rel="noreferrer">查看毕业学分官网 ↗</a>}<details><summary>补充或修改毕业学分</summary><form onSubmit={e=>void submit(e)}><label>参考毕业学分<input name="credits" defaultValue={p.credits?.display||''} placeholder="例如：30 credits / 48 units（综合考试）"/></label><label>方案与学分说明<textarea name="creditsNote" defaultValue={p.credits?.note||''} rows={3}/></label><label>适用学年 / 参考依据<input name="creditsReference" defaultValue={p.credits?.reference||''}/></label><label>毕业学分官网链接<input type="url" name="creditsUrl" defaultValue={p.credits?.url||''} placeholder="https://…"/></label><button className="button secondary" disabled={busy}>保存毕业学分</button></form></details></section>;
}
