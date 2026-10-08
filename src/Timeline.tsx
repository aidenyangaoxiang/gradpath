import {OpeningStatus,openingSummary} from './OpeningStatus';
import {Fragment,useState} from 'react';
import {CalendarDays,ChevronRight} from 'lucide-react';
import {timelineEvents} from './Schedule';
import {confirmedDate,dateStatus,daysUntil,type Program} from './types';

export function Timeline({programs,onSelect}:{programs:Program[];onSelect:(id:string)=>void}){
 const [school,setSchool]=useState('all'),[kind,setKind]=useState('all');
 const selected=programs.filter(p=>school==='all'||p.id===school);
 const events=timelineEvents(selected).filter(e=>kind==='all'||(kind==='opening'?e.label==='申请开放':e.label!=='申请开放'));
 return <><div className="timeline-toolbar"><div className="filter-tabs">{[['all','全部节点'],['opening','申请开放'],['deadline','各轮截止']].map(([value,label])=><button key={value} className={kind===value?'selected':''} onClick={()=>setKind(value)}>{label}</button>)}</div><select aria-label="时间轴项目筛选" value={school} onChange={e=>setSchool(e.target.value)}><option value="all">全部申请项目</option>{programs.map(p=><option key={p.id} value={p.id}>{p.school} · {p.degree} · {p.name}</option>)}</select></div>
 <div className="timeline-legend"><span><i className="opening-key"/>申请开放</span><span><i className="deadline-key"/>轮次截止</span><span className="badge amber">参考日期待核验</span><small>按学校当地日期排序 · 点击节点查看详情</small></div>
 <div className="timeline-layout"><section className="timeline" aria-label="申请开放与截止时间轴">{events.map((event,i)=>{
  const opening=event.label==='申请开放',openingInfo=openingSummary(event.p.opening,event.p.timezone),days=daysUntil(event.date),confirmed=confirmedDate(event.status);
  return <Fragment key={event.p.id+'-'+event.label+'-'+i}>{(i===0||events[i-1].date.slice(0,7)!==event.date.slice(0,7))&&<h3 className="timeline-month">{event.date.slice(0,4)} 年 {Number(event.date.slice(5,7))} 月</h3>}<button className={'timeline-item '+(opening?'opening-event':'deadline-event')} onClick={()=>onSelect(event.p.id)}><span className="timeline-date"><strong>{event.date.slice(5).replace('-',' / ')}</strong><small>{event.date.slice(0,4)}</small></span><span className="timeline-dot"/><span className="timeline-content"><strong>{event.p.school} · {event.label}</strong><span>{event.p.degree} · {event.p.name}</span>{opening&&<OpeningStatus opening={event.p.opening} zone={event.p.timezone}/>}<small>{event.time?`${event.time} · ${event.timezone}`:'具体时刻以学校系统为准'} · {dateStatus(event.status)}</small></span><span className={'badge '+(confirmed?'green':'amber')}>{opening?openingInfo.title:confirmed?(days<0?'已过日期':`约 ${days} 天`):'参考 · 待核验'}</span></button></Fragment>;
 })}{!events.length&&<p className="timeline-empty">当前筛选下没有可按日期排列的节点。</p>}</section>
 <aside className="pending-box"><CalendarDays size={22}/><h3>尚未开放或截止待核验</h3><p>这里只显示尚未开放的项目，或截止轮次仍需确认的项目。已开放但未公布具体开放日期的项目不会被误放进来。</p>{selected.filter(p=>openingSummary(p.opening,p.timezone).title!=='已开放'||!confirmedDate(p.deadlineStatus)).map(p=><button key={p.id} onClick={()=>onSelect(p.id)}><strong>{p.school}</strong><span>{p.degree} · {p.name}</span><OpeningStatus opening={p.opening} zone={p.timezone}/><span>{dateStatus(p.opening?.status||'unconfirmed')}{!confirmedDate(p.deadlineStatus)?' · 截止轮次待核验':''}</span><ChevronRight size={16}/></button>)}{!selected.length&&<p>在“发现项目”中加入申请项目后即可显示。</p>}</aside></div></>;
}
