import * as cheerio from 'cheerio';
import { fetchPublic } from './network.js';

const patterns=[
  ['cv','个人简历 / CV',/\b(?:resume|résumé|curriculum vitae|cv)\b|个人简历/i],
  ['sop','目的陈述 / SOP',/statement of purpose|statement of objectives|目的陈述/i],
  ['personal','个人陈述',/personal (?:statement|history)|个人陈述/i],
  ['transcript','成绩单',/transcript|成绩单/i],
  ['language','语言成绩 / 豁免',/TOEFL|IELTS|English (?:language )?proficiency|语言成绩/i],
  ['reference','推荐信',/recommendation|referees|references|推荐信/i],
  ['research','研究计划',/research proposal|研究计划/i],
  ['portfolio','作品集',/portfolio|作品集/i],
  ['gre','GRE 要求待核对',/\bGRE\b/i]
];
export function extractPage(html, url, plain=false) {
  const $=cheerio.load(plain?'':html); $('script,style,nav,header,footer,noscript,svg').remove();
  const title=plain?'导入的招生信息':$('h1').first().text().trim()||$('title').text().trim();
  const root=$('main').length?$('main'):$('body');
  const lines=(plain?html:root.find('h1,h2,h3,h4,p,li,tr').map((_,e)=>$(e).text().replace(/\s+/g,' ').trim()).get().join('\n')).split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const text=lines.join('\n').slice(0,120000);
  const requirements=patterns.flatMap(([kind,label,re])=>{
    const matches=lines.filter(line=>re.test(line)); if(!matches.length)return [];
    return [{id:`draft-${kind}`,kind:kind==='personal'?'sop':kind,label,detail:matches.slice(0,2).join(' ').slice(0,900),mode:kind==='reference'||kind==='gre'?'manual':'upload',verified:false,manualReview:true}];
  });
  const datePattern=/deadline|closing date|截止|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}|202\d[-/]\d{1,2}[-/]\d{1,2}/i;
  const evidence=[...new Set(lines.flatMap((line,index)=>datePattern.test(line)?[lines.slice(Math.max(0,index-1),index+3).join('\n').slice(0,1200)]:[]))].slice(0,14);
  const years=[...new Set(text.match(/\b202[4-9]\b/g)||[])];
  return {title,url,requirements,deadlineEvidence:evidence,years,text:text.slice(0,24000),fetchedAt:new Date().toISOString(),notice:'规则提取的候选清单：可能含历史年份、可选项、豁免条款或遗漏。保存前请逐项核对；不会自动确认截止日期。'};
}
export async function importPage(url) {const page=await fetchPublic(url);if(!/html|text/i.test(page.contentType))throw new Error('目前支持 HTML 网页；PDF 网页请复制招生正文后导入。');return extractPage(page.text,page.url);}
export async function searchWeb(query) {
  // Public search is best effort. Never manufacture results on provider failure.
  const page=await fetchPublic(`https://www.bing.com/search?format=rss&q=${encodeURIComponent(query+' graduate admissions 2027 requirements')}`);
  const $=cheerio.load(page.text,{xmlMode:true});
  const results=$('item').map((_,e)=>{const item=$(e);return {title:item.find('title').text(),url:item.find('link').text(),description:item.find('description').text().slice(0,450)};}).get().filter(r=>{try{return /\.(edu|ac\.uk|edu\.hk|edu\.sg|ac\.cn|edu\.cn|ca|ch|de|fr|edu\.au)$/.test(new URL(r.url).hostname);}catch{return false;}}).slice(0,12);
  return {results,notice:results.length?'搜索结果为候选网页，导入后请核对项目和申请季。':'搜索服务没有返回可用的高校网页。可打开网页搜索，或直接粘贴官网链接导入。'};
}
