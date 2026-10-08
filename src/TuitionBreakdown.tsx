import type {Program} from './types';
export function TuitionBreakdown({p}:{p:Program}){
 const t=p.tuition;if(!t?.period)return null;
 return <div className="tuition-breakdown"><div><span>计费周期</span><strong>{t.period}</strong></div><div><span>学年费用参考</span><strong>{t.annual}</strong></div><div><span>项目总学费参考</span><strong>{t.programTotal}</strong></div><p>{t.calculation}</p></div>;
}
