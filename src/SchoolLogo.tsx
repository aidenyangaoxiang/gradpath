import {useState} from 'react';
import {GraduationCap} from 'lucide-react';
import type {Program} from './types';

function logoFor(p:Program){
 const name=`${p.id} ${p.school} ${p.schoolEn}`.toLowerCase();
 if(/cornell.tech|cornell tech/.test(name))return {file:'cornell-tech.svg',style:'cornell-tech'};
 if(/cornell|康奈尔/.test(name))return {file:'cornell.svg',style:'cornell'};
 if(/ucsd|uc san diego|圣地亚哥/.test(name))return {file:'ucsd.png',style:'ucsd'};
 if(/cmu|carnegie mellon|卡内基/.test(name))return {file:'cmu.png',style:'square'};
 if(/northwestern|西北大学/.test(name))return {file:'northwestern.png',style:'northwestern'};
 if(/nyu|new york university|纽约大学/.test(name))return {file:'nyu-tandon.svg',style:'nyu'};
 if(/hku|hong kong|香港大学/.test(name))return {file:'hku.png',style:'hku'};
 return null;
}

export function SchoolLogo({p}:{p:Program}){
 const logo=logoFor(p);const [failed,setFailed]=useState(false);
 return <span className={'school-mark school-logo '+(logo&&!failed?'logo-'+logo.style:'logo-fallback')}>
 {logo&&!failed?<img src={'/logos/'+logo.file} alt={p.school+' 官方 Logo'} onError={()=>setFailed(true)}/>:<GraduationCap size={30} aria-label={p.school+'（暂无校徽）'}/>}
 </span>;
}
