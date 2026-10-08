import {CalendarDays} from 'lucide-react';
import {confirmedDate,daysUntil,type Program} from './types';

function labelFor(p:Program,label:string,index:number,total:number){
 if(p.id==='northwestern-cs-ms'&&index===0)return '第一轮（最早）';
 if(p.id==='northwestern-cs-ms'&&index===total-1)return '最终轮';
 return label;
}

export function DeadlineRounds({p}:{p:Program}){
 const rounds=p.rounds?.length?p.rounds:(p.deadline?[{label:'最终截止',date:p.deadline,status:p.deadlineStatus,time:p.deadlineTime,timezone:p.timezone}]:[]);
 return <div className="deadline-rounds"><span className="deadline-rounds-title"><CalendarDays size={15}/>申请批次与截止日期</span>{rounds.map((round,index)=>{const confirmed=confirmedDate(round.status),days=daysUntil(round.date);return <div className="deadline-round" key={round.label+round.date}><span>{labelFor(p,round.label,index,rounds.length)}</span><strong>{round.date}</strong><small>{confirmed?(days<0?'已过日期':`约 ${days} 天`):'参考日期'}</small></div>})}</div>;
}
