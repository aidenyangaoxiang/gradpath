import {MessageCircle,ExternalLink} from 'lucide-react';
import type {Program} from './types';

export function Interview({p}:{p:Program}){
 const interview=p.interview;if(!interview)return null;
 return <section className="info-panel interview-panel"><h3><MessageCircle size={16}/>面试 / 额外评估</h3><strong className={'interview-status '+interview.status}>{interview.display}</strong><p>{interview.note}</p>{interview.url&&<a href={interview.url} target="_blank" rel="noreferrer">面试说明来源<ExternalLink size={14}/></a>}</section>;
}
