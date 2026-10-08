export const KINDS=['cv','sop','transcript','language','research','portfolio','other'];
export function assess(document, req) {
  const checks=[{label:'文件已安全保存到本机',ok:true}];
  const text=document.text||'';
  const readable=text.trim().length>=80;
  checks.push({label:readable?'已提取可读文字':'无法提取足够文字；扫描件或图片需人工核对',ok:readable});
  const same=document.kind===req.kind || req.kind==='other';
  checks.push({label:same?'材料分类与清单一致':'材料分类与清单不一致',ok:same});
  if(req.maxBytes) checks.push({label:`文件大小 ${(document.size/1024/1024).toFixed(2)} MB / 上限 ${(req.maxBytes/1024/1024).toFixed(0)} MB`,ok:document.size<=req.maxBytes});
  if(req.allowedExtensions) checks.push({label:`要求格式：${req.allowedExtensions.join('、')}`,ok:req.allowedExtensions.includes(document.extension)});
  if(req.maxWords) checks.push({label:`${document.words} 词 / 上限 ${req.maxWords} 词`,ok:document.words>0&&document.words<=req.maxWords});
  if(req.minWords) checks.push({label:`至少 ${req.minWords} 词`,ok:document.words>=req.minWords});
  if(req.maxPages) checks.push({label:document.pages?`${document.pages} 页 / 上限 ${req.maxPages} 页`:'无法确定页数，请上传 PDF 或人工核验',ok:!!document.pages&&document.pages<=req.maxPages});
  const signals={cv:[/education|教育|学历/i,/experience|research|经历|研究/i],sop:[/research|interest|motivation|purpose|career|研究|兴趣|动机/i,/university|program|study|education|大学|项目|学习/i],research:[/research|研究/i,/method|question|方法|问题/i]};
  if(signals[req.kind]) checks.push({label:'检测到与材料类别相关的内容（仅基础检查）',ok:signals[req.kind].every(re=>re.test(text))});
  const all=checks.every(c=>c.ok);
  const needsManual=req.manualReview || !req.verified || !['cv','sop','research'].includes(req.kind) || req.mode==='manual';
  if(needsManual) checks.push({label:'还需人工核对官网要求、内容及完整性',ok:false});
  return {status:all&&!needsManual?'passed':'review',checks};
}
export function evaluateProgram(program, documents) {
  const requirements=program.requirements.map(req=>{
    const linked=(program.links[req.id]||[]).map(id=>documents.find(d=>d.id===id)).filter(Boolean);
    const latest=linked.at(-1);const result=latest?assess(latest,req):null;
    const override=program.overrides[req.id];
    return {...req,documents:linked.map(({text,storageName,...d})=>d),assessment:result,state:override?.status||result?.status||'missing',override:override||null};
  });
  const required=requirements.filter(r=>!r.optional);
  const done=required.filter(r=>['passed','confirmed','waived'].includes(r.state)).length;
  return {...program,requirements,progress:{done,total:required.length,percent:required.length?Math.round(done/required.length*100):0}};
}
