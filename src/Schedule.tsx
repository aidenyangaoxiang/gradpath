import {OpeningStatus} from './OpeningStatus';
import {useState} from 'react';
import {dateStatus, type Program} from './types';

export function Schedule({p,save}:{p:Program;save:(values:unknown)=>Promise<void>}){
 const [busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const data=new FormData(e.currentTarget);setBusy(true);
  try{await save({opening:{availability:data.get('openingAvailability'),history:{date:data.get('historyDate'),cycle:data.get('historyCycle')},date:data.get('openingDate'),display:data.get('openingDisplay'),status:data.get('openingStatus'),note:data.get('openingNote'),...(p.opening?.url?{url:p.opening.url}:{})},duration:{display:data.get('durationDisplay'),note:data.get('durationNote'),...(p.duration?.url?{url:p.duration.url}:{})}});}catch{}finally{setBusy(false);}
 }
 return <><section className="info-panel schedule-panel"><h3>申请开放与各轮截止</h3><p>日期均为学校当地日期。参考日期按 2027 Fall 排列；官网未注明年份时，不视为当季已确认。</p>
 <div className="schedule-row"><div><strong>申请开放</strong><OpeningStatus opening={p.opening} zone={p.timezone}/></div><span className={'badge '+(p.opening?.status==='reference'?'amber':'muted')}>{dateStatus(p.opening?.status||'unconfirmed')}</span></div>
 <p>{p.opening?.note}</p>{p.opening?.url&&<a href={p.opening.url} target="_blank" rel="noreferrer">查看开放日期来源 ↗</a>}
 {p.rounds?.length? <><h4>官网轮次记录</h4>{p.rounds.map((r,i)=><div className="schedule-round" key={i}><div className="schedule-row"><div><strong>{r.label}</strong><small>{r.date}{r.time?' · '+r.time:''}{r.timezone?' · '+r.timezone:''}</small></div><span className={'badge '+(r.status==='reference'?'amber':'muted')}>{dateStatus(r.status)}</span></div>{r.reference&&<p>{r.reference}</p>}{r.url&&<a href={r.url} target="_blank" rel="noreferrer">轮次来源 ↗</a>}</div>)}<p>下方“关注的截止日期”可设为你打算申请的轮次；不会改写这些官网记录。</p></>:<p>暂无单独的官网轮次记录，可在下方填写关注的截止日期。</p>}
 </section><section className="info-panel"><h3>项目时间长度</h3><strong>{p.duration?.display||'待核验'}</strong><p>{p.duration?.note}</p>{p.duration?.url&&<a href={p.duration.url} target="_blank" rel="noreferrer">查看学制来源 ↗</a>}</section>
 <details className="info-panel"><summary>补充或修改开放日期、项目时长</summary><form onSubmit={e=>void submit(e)}><div className="form-row"><label>申请开放日期<input type="date" name="openingDate" defaultValue={p.opening?.date||''}/></label><label>开放日期状态<select name="openingStatus" defaultValue={p.opening?.status==='verified'?'user-confirmed':p.opening?.status||'unconfirmed'}><option value="unconfirmed">待核验</option><option value="reference">往年 / 常规日程参考</option><option value="user-confirmed">我已核对当季信息</option></select></label></div><label>当季开放状态<select aria-label="当季开放状态" name="openingAvailability" defaultValue={p.opening?.availability||'auto'}><option value="auto">按已确认日期判断</option><option value="not-open">已核实：还未开放</option><option value="open">已核实：已开放</option><option value="unknown">开放状态待核验</option></select></label><div className="form-row"><label>往年开放时间<input name="historyDate" defaultValue={p.opening?.history?.date||''} placeholder="例如：2025-10-01（需有官网依据）"/></label><label>往年对应申请季<input name="historyCycle" defaultValue={p.opening?.history?.cycle||''} placeholder="例如：2026 Fall"/></label></div><label>开放时间显示文字<input name="openingDisplay" defaultValue={p.opening?.display||''} placeholder="例如：已开放，具体开放日未公布"/></label><label>开放日期依据 / 参考年份<textarea name="openingNote" defaultValue={p.opening?.note||''} rows={3}/></label><label>项目时长<input name="durationDisplay" defaultValue={p.duration?.display||''} placeholder="例如：3 学期 / 约 1.5 年"/></label><label>学制说明<textarea name="durationNote" defaultValue={p.duration?.note||''} rows={3}/></label><button className="button secondary" disabled={busy}>保存开放日期与学制</button></form></details></>;
}

export function timelineEvents(programs:Program[]){
 return programs.flatMap(p=>{
  const events=(p.rounds||[]).map(r=>({...r,p}));
  if(p.deadline&&!events.some(r=>r.date===p.deadline&&r.status===p.deadlineStatus))events.push({p,label:'关注的截止日期',date:p.deadline,status:p.deadlineStatus,time:p.deadlineTime,timezone:p.timezone,reference:p.deadlineNote});
  if(p.opening?.date)events.push({p,label:'申请开放',date:p.opening.date,status:p.opening.status,time:'',timezone:p.timezone,reference:p.opening.note});
  return events;
 }).sort((a,b)=>a.date.localeCompare(b.date));
}
