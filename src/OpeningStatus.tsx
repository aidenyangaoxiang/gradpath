import {confirmedDate,type Opening} from './types';

// Reference dates alone do not establish whether the current application is open.
export function openingSummary(o?:Opening,zone?:string,now=new Date()){
 const parts=new Intl.DateTimeFormat('en',{timeZone:zone||'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);
 const part=(key:string)=>parts.find(p=>p.type===key)?.value;
 const today=`${part('year')}-${part('month')}-${part('day')}`;
 const history=o?.history?.date?`往年开放时间：${o.history.date}${o.history.cycle?'（'+o.history.cycle+'）':''}`:'往年开放时间：未查到可核验记录';
 let state:string=o?.availability||'auto';
 if(state==='auto'){
  if(confirmedDate(o?.status||'')&&o?.date)state=o.date>today?'not-open':o.date<today?'open':'today';
  else if(confirmedDate(o?.status||'')&&o?.display.includes('已开放'))state='open';
  else state='unknown';
 }
 const title=state==='not-open'?'还未开放':state==='open'?'已开放':state==='today'?'今日为公布开放日':'开放状态待核验';
 const detail=o?.date?(o.status==='reference'?`参考开放时间：${o.date}（非当季确认）`:`${state==='not-open'?'预计开放':'公布开放日期'}：${o.date}`):'当季具体开放日期未公布';
 return {title,detail,history,showHistory:state!=='open',tone:state==='open'?'green':'amber'};
}

export function OpeningStatus({opening,zone}:{opening?:Opening;zone?:string}){
 const info=openingSummary(opening,zone);
 return <span className="opening-status"><strong className={info.tone==='green'?'green-text':''}>{info.title}</strong><small>{info.detail}</small>{info.showHistory&&<small>{info.history}</small>}</span>;
}
