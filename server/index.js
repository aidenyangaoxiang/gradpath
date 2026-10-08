import express from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { openStore } from './db.js';
import { parseDocument, extensions } from './documents.js';
import { evaluateProgram, KINDS } from './assessment.js';
import { importPage, extractPage, searchWeb } from './extract.js';
import { validateUrl } from './network.js';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const short=z.string().trim().max(300);const url=z.string().refine(s=>{try{validateUrl(s);return true;}catch{return false;}},'请使用公开 HTTPS 网址');
const date=z.string().refine(s=>s===''||(/^20\d{2}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s),'日期无效');
const time=z.string().refine(s=>s===''||/^([01]\d|2[0-3]):[0-5]\d$/.test(s),'时间无效');
const timezone=z.string().refine(s=>{try{if(s)new Intl.DateTimeFormat('en',{timeZone:s});return true;}catch{return false;}},'时区无效');
const editableDateStatus=z.enum(['unconfirmed','reference','user-confirmed']);
const openingSchema=z.object({availability:z.enum(['auto','not-open','open','unknown']).optional(),history:z.object({date:short.default(''),cycle:short.default('')}).optional(),date:date.default(''),display:short.default(''),status:editableDateStatus.default('unconfirmed'),note:z.string().max(5000).default(''),url:url.optional()}).transform(o=>({...o,display:o.date||o.display}));
const durationSchema=z.object({display:short.default(''),note:z.string().max(5000).default(''),url:url.optional()});
const interviewSchema=z.object({status:z.enum(['required','possible','not-listed','unconfirmed']),display:short.default(''),note:z.string().max(5000).default(''),url:url.optional(),verifiedAt:short.optional()});
const applicationFeeSchema=z.object({display:short.default(''),note:z.string().max(5000).default(''),url:url.optional(),status:z.enum(['verified','reference','unconfirmed']).default('unconfirmed'),verifiedAt:short.optional()});
const creditsSchema=durationSchema.extend({reference:short.default('用户记录 · 适用年份待核验')});
const reqSchema=z.object({id:short.min(1),label:short.min(1),kind:short.min(1),detail:z.string().max(3000).default(''),mode:z.enum(['upload','manual']).default('upload'),verified:z.boolean().default(false),submissionMethod:z.enum(['recommender','applicant','either']).optional(),manualReview:z.boolean().default(true),minWords:z.number().int().positive().max(100000).optional(),maxWords:z.number().int().positive().max(100000).optional(),maxPages:z.number().int().positive().max(1000).optional(),maxBytes:z.number().int().positive().optional(),allowedExtensions:z.array(z.string()).optional(),optional:z.boolean().optional(),waivable:z.boolean().optional()});
const programSchema=z.object({officialUrl:url.optional(),applicationFee:applicationFeeSchema.optional(),interview:interviewSchema.optional(),opening:openingSchema.optional(),duration:durationSchema.optional(),credits:creditsSchema.optional(),school:short.min(1),schoolEn:short.default(''),name:short.min(1),degree:z.enum(['MS','MSc','MEng','PhD']),country:short.default('美国'),city:short.default(''),field:short.default(''),tier:z.enum(['冲刺','中等','保底','待定']).default('待定'),cycle:z.literal('2027 Fall').default('2027 Fall'),deadline:date.default(''),deadlineTime:time.default(''),timezone:timezone.default(''),deadlineStatus:editableDateStatus.default('unconfirmed'),deadlineNote:z.string().max(5000).default(''),sources:z.array(z.object({label:short,url})).max(20).default([]),requirements:z.array(reqSchema).max(100),tuition:z.object({display:short,year:short,note:z.string().max(3000),url:url.optional()}).optional()});
export async function createApp({dataDir=process.env.DATA_DIR||path.join(ROOT,'data'),frontend=true}={}){
  const app=express();const store=openStore(dataDir);const uploads=path.join(dataDir,'uploads');
  app.disable('x-powered-by');
  app.use((req,res,next)=>{
    const host=req.hostname;
    if(!['127.0.0.1','localhost','::1'].includes(host))return res.status(403).json({error:'仅允许本机访问。'});
    if(req.path.startsWith('/api')){
      res.set('Cache-Control','no-store');
      const origin=req.get('Origin');
      if(origin && origin!==`${req.protocol}://${req.get('host')}`)return res.status(403).json({error:'不接受跨站请求。'});
      if(!['GET','HEAD'].includes(req.method)&&req.get('X-GradPath')!=='local')return res.status(403).json({error:'请求校验失败，请刷新页面。'});
    }
    res.set('X-Content-Type-Options','nosniff');res.set('Referrer-Policy','no-referrer');next();
  });
  app.use(express.json({limit:'1mb'}));
  const getProgram=id=>{const p=store.get('programs',id);if(!p){const e=new Error('项目不存在。');e.status=404;throw e;}return p;};
  app.get('/api/state',(_,res)=>res.json({programs:store.all('programs').map(p=>evaluateProgram(p,store.all('documents'))),documents:store.all('documents').map(({text,storageName,...d})=>d)}));
  app.post('/api/programs',(req,res)=>{
    const values=programSchema.parse(req.body);if(new Set(values.requirements.map(r=>r.id)).size!==values.requirements.length)throw new Error('材料条目 ID 不能重复。');
    const p={...values,id:randomUUID(),mark:values.schoolEn.slice(0,2).toUpperCase()||'U',color:'#346756',tracked:true,links:{},overrides:{},notes:'',status:'preparing',verifiedAt:new Date().toISOString().slice(0,10),requirementsVerified:false};
    store.put('programs',p);res.status(201).json(p);
  });
  app.patch('/api/programs/:id',(req,res)=>{
    const p=getProgram(req.params.id);
    const patch=z.object({opening:openingSchema.optional(),duration:durationSchema.optional(),credits:creditsSchema.optional(),tracked:z.boolean().optional(),notes:z.string().max(20000).optional(),tier:z.enum(['冲刺','中等','保底','待定']).optional(),status:z.enum(['preparing','submitted','admitted','rejected']).optional(),deadline:date.optional(),deadlineTime:time.optional(),timezone:timezone.optional(),deadlineStatus:editableDateStatus.optional(),deadlineNote:z.string().max(5000).optional()}).parse(req.body);
    if(patch.deadline!==undefined && patch.deadline!==p.deadline){patch.deadlineStatus=patch.deadline?(patch.deadlineStatus||'user-confirmed'):'unconfirmed';patch.verifiedAt=new Date().toISOString().slice(0,10);}
    if(patch.credits)patch.credits.verifiedAt=new Date().toISOString().slice(0,10);
    store.put('programs',{...p,...patch});res.json({ok:true});
  });
  app.post('/api/programs/:id/requirements',(req,res)=>{const p=getProgram(req.params.id);const r=reqSchema.parse({...req.body,id:randomUUID()});p.requirements.push(r);store.put('programs',p);res.json(r);});
  app.put('/api/programs/:id/requirements/:rid',(req,res)=>{
    const p=getProgram(req.params.id),r=p.requirements.find(r=>r.id===req.params.rid);if(!r)return res.status(404).json({error:'清单条目不存在。'});
    const change=z.object({status:z.enum(['confirmed','waived','missing','auto']),note:z.string().trim().max(3000).default('')}).parse(req.body);
    if(change.status==='waived'&&!r.waivable&&!r.optional)return res.status(400).json({error:'该条目不能标记为豁免。'});
    if(['confirmed','waived'].includes(change.status)&&!change.note)return res.status(400).json({error:'请记录人工确认依据，例如已检查官网或收件邮件。'});
    if(change.status==='auto')delete p.overrides[r.id];else p.overrides[r.id]={...change,at:new Date().toISOString()};
    store.put('programs',p);res.json({ok:true});
  });
  app.post('/api/programs/:id/links',(req,res)=>{
    const p=getProgram(req.params.id);const {requirementId,documentId}=z.object({requirementId:short,documentId:short}).parse(req.body);
    const r=p.requirements.find(r=>r.id===requirementId);if(!r||r.mode==='manual')return res.status(400).json({error:'该条目不能关联文件。'});
    if(!store.get('documents',documentId))return res.status(404).json({error:'文件不存在。'});
    p.links[requirementId]=[...(p.links[requirementId]||[]).filter(id=>id!==documentId),documentId];delete p.overrides[requirementId];store.put('programs',p);res.json({ok:true});
  });
  const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:15*1024*1024,files:1},fileFilter(_req,file,cb){cb(extensions.includes(path.extname(file.originalname).toLowerCase())?null:new Error('不支持此文件类型。'),true);}});
  app.post('/api/documents',upload.single('file'),async(req,res)=>{
    if(!req.file)return res.status(400).json({error:'请选择一个文件。'});
    const kind=z.enum(KINDS).parse(req.body.kind);
    let name=req.file.originalname;try{const utf8=Buffer.from(name,'latin1').toString('utf8');if(!utf8.includes('�'))name=utf8;}catch{}
    name=path.basename(name).replace(/[\x00-\x1f]/g,'').slice(0,255);
    const parsed=await parseDocument(req.file.buffer,name);const id=randomUUID();const storageName=id+path.extname(name).toLowerCase();
    fs.writeFileSync(path.join(uploads,storageName),req.file.buffer,{mode:0o600});
    const doc={id,name,storageName,kind,size:req.file.size,createdAt:new Date().toISOString(),...parsed};store.put('documents',doc);
    const {text,storageName:_,...safe}=doc;res.status(201).json(safe);
  });
  app.get('/api/documents/:id',(req,res)=>{const d=store.get('documents',req.params.id);if(!d)return res.status(404).json({error:'文件不存在。'});const {storageName,...safe}=d;res.json(safe);});
  app.get('/api/documents/:id/download',(req,res)=>{const d=store.get('documents',req.params.id);if(!d)return res.status(404).json({error:'文件不存在。'});res.download(path.join(uploads,d.storageName),d.name);});
  app.delete('/api/documents/:id',(req,res)=>{
    const d=store.get('documents',req.params.id);if(!d)return res.status(404).json({error:'文件不存在。'});
    for(const p of store.all('programs')){for(const [rid,ids] of Object.entries(p.links)){if(ids.includes(d.id)){p.links[rid]=ids.filter(id=>id!==d.id);delete p.overrides[rid];}}store.put('programs',p);}
    store.remove('documents',d.id);fs.rmSync(path.join(uploads,d.storageName),{force:true});res.json({ok:true});
  });
  app.post('/api/import',async(req,res)=>{const input=z.object({url:url.optional(),text:z.string().max(120000).optional()}).parse(req.body);if(input.text)res.json(extractPage(input.text,input.url||'',true));else if(input.url)res.json(await importPage(input.url));else res.status(400).json({error:'请输入官网网址或正文。'});});
  app.get('/api/search',async(req,res)=>{const q=z.string().min(2).max(180).parse(req.query.q);res.json(await searchWeb(q));});
  app.get('/api/export',(_,res)=>{res.attachment('gradpath-2027-backup.json').json({version:1,exportedAt:new Date().toISOString(),programs:store.all('programs'),documents:store.all('documents'),notice:'此文件备份清单及解析文字，不含文件原件。完整备份请复制 data 目录。'});});
  app.use('/api',(_,res)=>res.status(404).json({error:'接口不存在。'}));
  if(frontend){if(process.argv.includes('--production'))app.use(express.static(path.join(ROOT,'dist')));else {const {createServer}=await import('vite');const vite=await createServer({server:{middlewareMode:true},appType:'spa'});app.use(vite.middlewares);app.locals.vite=vite;}}
  app.use((err,req,res,next)=>{if(res.headersSent)return next(err);res.status(err.status||400).json({error:err instanceof z.ZodError?err.issues.map(i=>i.message).join('；'):err.code==='LIMIT_FILE_SIZE'?'文件不能超过 15 MB。':err.message||'操作失败，请重试。'});});
  app.locals.store=store;return app;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const app=await createApp();const port=Number(process.env.PORT||4317);
  const server=app.listen(port,'127.0.0.1',()=>console.log(`GradPath 已启动：http://127.0.0.1:${port}`));
  server.on('error',err=>{console.error(err.message);process.exitCode=1;});
}
