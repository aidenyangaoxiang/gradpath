import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {assess,evaluateProgram} from '../server/assessment.js';
import {extractPage} from '../server/extract.js';
import {parseDocument} from '../server/documents.js';
import {publicAddress,validateUrl} from '../server/network.js';
const doc={id:'one',kind:'cv',text:'Education: Bachelor of Computer Science. Research experience in machine learning and data science. Projects: Built a document search platform for the university.',words:27,pages:1,size:400,extension:'.pdf'};
test('readable CV passes basics, while unrelated content and wrong categories do not',()=>{
 const r={kind:'cv',verified:true};assert.equal(assess(doc,r).status,'passed');assert.equal(assess({...doc,text:'Unrelated document contents. '.repeat(12)},r).status,'review');assert.equal(assess({...doc,kind:'sop'},r).status,'review');
});
test('official records, scans and unverified imported requirements require review',()=>{
 for(const r of [{kind:'transcript',verified:true},{kind:'cv',verified:false},{kind:'cv',verified:true,manualReview:true}])assert.equal(assess({...doc,kind:r.kind},r).status,'review');
 assert.equal(assess({...doc,text:''},{kind:'cv',verified:true}).status,'review');
});
test('word, page, byte and format constraints prevent false completion',()=>{
 for(const rule of [{minWords:500},{maxWords:20},{maxPages:1},{maxBytes:100},{allowedExtensions:['.docx']}])assert.equal(assess({...doc,pages:2},{kind:'cv',verified:true,...rule}).status,'review');
 assert.equal(assess({...doc,pages:null},{kind:'cv',verified:true,maxPages:2}).status,'review');
});
test('optional requirements do not block progress; latest version is reassessed',()=>{
 const p={requirements:[{id:'cv',kind:'cv',verified:true},{id:'rec',kind:'reference',mode:'manual',optional:true}],links:{cv:['one']},overrides:{}};
 assert.deepEqual(evaluateProgram(p,[doc]).progress,{done:1,total:1,percent:100});
 p.links.cv.push('two');assert.equal(evaluateProgram(p,[doc,{...doc,id:'two',text:''}]).progress.done,0);
 p.overrides.cv={status:'confirmed',note:'Manual verification'};assert.equal(evaluateProgram(p,[doc]).progress.done,1);
});
test('recommendation files never imply school receipt',()=>assert.equal(assess(doc,{kind:'reference',mode:'manual',verified:true}).status,'review'));
test('import preserves contradictory historical evidence without fabricating confirmed dates',()=>{
 const r=extractPage('<main><h1>Admissions</h1><p>Fall 2025 deadline December 1, 2024</p><p>Fall 2027 dates not yet announced</p><p>GRE not required</p><p>Three recommendation letters</p><script>malicious text</script></main>','https://school.edu/admissions');
 assert.ok(r.years.includes('2024'));assert.ok(r.years.includes('2027'));assert.equal(r.deadline,undefined);assert.ok(r.requirements.every(x=>!x.verified));assert.ok(r.requirements.find(x=>x.kind==='gre').detail.includes('not required'));assert.ok(!r.text.includes('malicious'));
});
test('private, loopback, mapped IPv6 and non-HTTPS URLs are blocked',()=>{
 for(const address of ['127.0.0.1','10.1.2.3','172.16.0.1','192.168.1.1','169.254.169.254','::1','::ffff:127.0.0.1','fc00::1'])assert.equal(publicAddress(address),false,address);
 assert.equal(publicAddress('8.8.8.8'),true);
 for(const url of ['file:///etc/passwd','http://example.com','https://127.0.0.1','https://example.com:444','https://user:pass@example.com'])assert.throws(()=>validateUrl(url));
});
test('blank, corrupted and image uploads do not invent extracted text',async()=>{
 for(const [name,data] of [['empty.txt',''],['broken.pdf','not a pdf'],['scan.png','image']]){const result=await parseDocument(Buffer.from(data),name);assert.equal(result.text,'');assert.equal(result.words,0);}
 await assert.rejects(parseDocument(Buffer.from('x'),'unsafe.html'));
});
test('real DOCX text is parsed and page-limited DOCX stays pending review',async()=>{
 const parsed=await parseDocument(fs.readFileSync(new URL('./fixtures/sample-cv.docx',import.meta.url)),'sample-cv.docx');
 assert.match(parsed.text,/Research Experience/);assert.ok(parsed.words>20);assert.equal(parsed.parseError,null);
 assert.equal(assess({...parsed,id:'docx',kind:'cv',size:1000},{kind:'cv',verified:true,maxPages:2}).status,'review');
});
