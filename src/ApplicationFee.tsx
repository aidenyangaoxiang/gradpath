import {CreditCard,ExternalLink} from 'lucide-react';
import type {Program} from './types';

export function ApplicationFee({p}:{p:Program}){
 const fee=p.applicationFee;if(!fee)return null;
 return <section className="info-panel application-fee-panel"><h3><CreditCard size={16}/>申请费与提交</h3><strong className={fee.status==='unconfirmed'?'fee-unconfirmed':''}>{fee.display}</strong><p>{fee.note}</p>{fee.url&&<a href={fee.url} target="_blank" rel="noreferrer">申请费官方说明<ExternalLink size={14}/></a>}</section>;
}
