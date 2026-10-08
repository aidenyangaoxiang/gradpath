export type Opening={availability?:'auto'|'not-open'|'open'|'unknown';history?:{date:string;cycle:string};date:string;display:string;status:string;note:string;url?:string};
export type Duration={display:string;note:string;url?:string};
export type Interview={status:'required'|'possible'|'not-listed'|'unconfirmed';display:string;note:string;url?:string;verifiedAt?:string};
export type ApplicationFee={display:string;note:string;url?:string;status:'verified'|'reference'|'unconfirmed';verifiedAt?:string};
export type Round={label:string;date:string;status:string;url?:string;time:string;timezone:string;reference:string};
export const dateStatus=(status:string)=>({verified:'当季已确认','user-confirmed':'用户已确认',reference:'参考 · 待核验',unconfirmed:'待核验'}[status]||'待核验');
export const confirmedDate=(status:string)=>['verified','user-confirmed'].includes(status);
export type Doc={id:string;name:string;kind:string;size:number;createdAt:string;words:number;pages:number|null;parseError:string|null;text?:string;extension:string};
export type Req={id:string;label:string;kind:string;detail:string;mode:string;verified:boolean;submissionMethod?:'recommender'|'applicant'|'either';manualReview?:boolean;maxWords?:number;maxPages?:number;optional?:boolean;waivable?:boolean;documents:Doc[];state:string;assessment?:{status:string;checks:{label:string;ok:boolean}[]};override?:{note:string;at:string}};
export type Program={officialUrl?:string;applicationFee?:ApplicationFee;interview?:Interview;credits?:Duration & {reference:string;verifiedAt?:string};opening?:Opening;duration?:Duration;rounds?:Round[];id:string;school:string;schoolEn:string;name:string;degree:string;country:string;city:string;field:string;tier:string;cycle:string;mark:string;color:string;tracked:boolean;deadline:string;deadlineTime:string;timezone:string;deadlineStatus:string;deadlineNote:string;verifiedAt:string;sources:{label:string;url:string}[];requirements:Req[];progress:{done:number;total:number;percent:number};notes:string;status:string;tuition?:{period?:string;annual?:string;programTotal?:string;calculation?:string;display:string;year:string;note:string;url?:string}};
export const kinds:Record<string,string>={cv:'个人简历 / CV',sop:'申请文书 / SOP',transcript:'成绩单',language:'语言成绩',research:'研究计划',portfolio:'作品集',other:'其他材料'};
export const states:Record<string,string>={missing:'待准备',review:'待人工核对',passed:'基础检查通过',confirmed:'已人工确认',waived:'已豁免 / 不适用'};
export const complete=(r:Req)=>['passed','confirmed','waived'].includes(r.state);
export async function api<T=any>(url:string,options:RequestInit={}):Promise<T>{const response=await fetch('/api'+url,{...options,headers:{'X-GradPath':'local',...(options.body instanceof FormData?{}:{'Content-Type':'application/json'}),...options.headers}});const data=await response.json();if(!response.ok)throw new Error(data.error||'请求失败');return data;}
export function daysUntil(date:string){const today=new Date();return Math.ceil((Date.parse(date)-Date.UTC(today.getFullYear(),today.getMonth(),today.getDate()))/86400000);}

export const degreeLabel=(degree:string)=>degree==='PhD'?'博士研究项目 · PhD':degree==='MEng'?'专业型硕士 · MEng':'硕士项目 · '+degree;
