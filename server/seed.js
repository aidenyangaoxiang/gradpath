import { tuitionDetails } from './tuition-details.js';
import { graduationCredits } from './credits.js';
import { addSchedule } from './schedules.js';
import { interviewDetails } from './interviews.js';
import { applicationFees } from './application-fees.js';
// Verified against linked official pages on 2026-09-30.
export const requirement=(id,label,kind,detail,extra={})=>({id,label,kind,detail,mode:'upload',verified:true,...extra});
const cv=()=>requirement('cv','个人简历 / CV','cv','核对教育背景、研究与工作经历、成果和联系方式；自动检查仅识别可读文字及类别线索。');
const sop=(detail,extra={})=>requirement('sop','目的陈述 / SOP','sop',detail,{manualReview:true,...extra});
const transcript=()=>requirement('transcript','成绩单','transcript','准备所有相关院校的成绩单及必要翻译，人工核对完整性。',{manualReview:true});
const language=()=>requirement('language','语言成绩 / 豁免','language','核对学校认可的考试、分数、有效期、官方送分及豁免条件。',{manualReview:true,waivable:true});
const recommenderDetail='在申请系统填写推荐人姓名、职务和邮箱；系统会把提交链接发给推荐人，由推荐人在线完成上传。你只负责发起、提醒和在系统查看收件状态；不要把推荐信文件作为自己的材料上传。';
const refs=(n=3)=>Array.from({length:n},(_,i)=>requirement(`reference-${i+1}`,`推荐信 ${i+1}`,'reference',recommenderDetail,{mode:'manual',submissionMethod:'recommender'}));
const fee=()=>requirement('fee','申请表与申请费','other','在学校申请系统完成表格、提交及缴费（或取得费用豁免）后确认。',{mode:'manual'});
const base={cycle:'2027 Fall',degree:'MS',country:'美国',verifiedAt:'2026-09-30',tracked:false,notes:'',links:{},overrides:{},status:'preparing',deadline:'',deadlineStatus:'unconfirmed',deadlineTime:'',timezone:'',requirementsVerified:true};
const U='https://www.ece.ucsd.edu/graduate/graduate-admissions',UF='https://students.ucsd.edu/finances/fees/registration/2026-27/graduate.html';
const C='https://www.ece.cmu.edu/admissions/',CD=C+'graduate-application-deadlines.html',CF='https://www.cmu.edu/sfs/tuition/graduate/cit.html',CA='https://www.ece.cmu.edu/academics/ms-ai/index.html';
const N='https://www.mccormick.northwestern.edu/computer-science/academics/graduate/admissions/',NT='https://www.tgs.northwestern.edu/admission/application-procedures/application-requirements/',NF='https://www.northwestern.edu/sfs/tuition/graduate/tgs.html';
const Y='https://engineering.nyu.edu/admissions/graduate/apply/admissions-requirements',YD='https://engineering.nyu.edu/admissions/graduate/apply/application-deadlines',YF='https://www.nyu.edu/content/dam/nyu/bursar/documents/2025-2026%20Tuition%20and%20Fees.pdf';
const CO='https://tech.cornell.edu/admissions/meng-application/',COF='https://tech.cornell.edu/admissions/tuition-fees/';
const src=(label,url)=>({label,url});
const ut={display:'$37,972 / 学年（学校账单；不含生活费）',year:'2026–27 · 非加州居民参考',note:'经常性年度学校账单约 $37,972.17：基础学费 $13,722、非居民附加学费 $15,102、强制医保 $6,660 及校园费用。第一年另有一次性 Enrollment Services Fee $115，合计 $38,087.17。纯学费及非居民附加费为 $28,824；不含食宿、书本和个人开销，国际新生另有一次性签证管理费 $200。2027–28 费用尚未核验。',url:UF};
const ct={display:'$30,755 / 学期',year:'2026–27 · 工程学院参考',note:'工程学院硕士参考学费：秋春两学期 $61,510。AI–ECE 为 3 学期；若沿用当前单价，3 学期约 $92,265（仅测算，非正式报价）。不含杂费、医保与生活费，跨学年可能涨价，实际项目收费须向 ECE 确认。',url:CF};
const nt={display:'$23,662 / 学季',year:'2026–27 · TGS 全日制参考',note:'TGS 硕士每学季 3–4 units 收费 $23,662。同单价测算 3 学季 $70,986、4 学季 $94,648，并非项目固定总价。健康服务费、医保及生活费另计。CS MS 经 TGS 申请。2027–28 费用待核验。',url:NF};
const yt={display:'$2,525 / 学分',year:'2025–26 · 历史参考，非 2027 报价',note:'已核实 NYU Bursar 2025–26 Tandon General 研究生费率 $2,525 / 学分。若按 30 学分测算为 $75,750，实际项目学分与入学年份费率需另核对。仅学费，不含食宿、医保等。尚未取得可核验的 2027–28 费率。',url:YF};
const ur=()=>[sop('须为 PDF，不超过 2 MB。阐述背景、研究兴趣及目标；题目完整性与内容请人工复核。',{maxBytes:2097152,allowedExtensions:['.pdf']}),transcript(),language(),...refs(),{...cv(),optional:true,detail:'官网列为 recommended；不计入必备材料完成率。'},fee()];
const cr=()=>[cv(),sop('阐述对 AI–ECE 工程方向的理解、背景及目标；由本人撰写。长度和具体题目请核对当季申请系统。'),transcript(),language(),...refs(),fee()];
const nr=()=>[cv(),sop('Academic Statement：500–1,000 词，说明兴趣、背景及项目匹配。',{minWords:500,maxWords:1000,manualReview:false}),requirement('personal','Personal Statement','sop','125–250 词，按官方题目说明个人经历等，不重复 Academic Statement。',{minWords:125,maxWords:250,manualReview:true}),transcript(),language(),...refs(2),requirement('specific','核对 CS 专属要求','other','TGS 最低两封推荐信；核对 CS 申请系统是否追加材料并补入清单。MS 不要求或审阅 GRE。',{mode:'manual'}),fee()];
const yr=()=>[cv(),requirement('essay-1','Personal Essay · 问题 1','sop','回答第一道必答题，将题目放在回答开头；题目与长度以当季系统为准。',{manualReview:true}),requirement('essay-2','Personal Essay · 问题 2','sop','回答第二道必答题，将题目放在回答开头；可能另需视频或补充材料。',{manualReview:true}),transcript(),requirement('degree','学位证明（如已毕业）','other','已毕业者需授予证明；在读生按学校要求处理。',{manualReview:true,waivable:true}),language(),requirement('reference-optional','推荐信（可选）','reference','Tandon 当前通用硕士申请中推荐信为可选，不计入必备进度。若提交，应在系统填写推荐人信息，由推荐人通过邮件链接直接上传；本人上传的副本不作为正式推荐信。',{mode:'manual',optional:true,submissionMethod:'recommender'}),requirement('specific','核对项目专属要求 / GRE','other','核对所选专业的 GRE、先修课与额外材料；通用页不能代替专业要求。',{mode:'manual'}),fee()];
const hr=()=>[requirement('identity','护照个人信息页（非本地申请人）','other','初审阶段必须上传有效身份证明；非本地申请人上传带照片的护照页，本地申请人上传 HKID 副本。',{manualReview:true}),requirement('degree','学士学位或同等资格','other','须持有学士学位或同等资格。',{mode:'manual',manualReview:true}),requirement('prerequisites','先修知识核对','other','应具备线性代数、微积分、概率论、基础统计与计算机编程知识；在提交前按课程经历逐项核对。',{mode:'manual',manualReview:true}),requirement('transcript','成绩单、GPA 与评分制度','transcript','必须上传所有相关学历的完整成绩单、GPA/平均分与评分制度。中国大陆在读生：上传学校出具的中英文最新成绩单；海外在读生：上传学校出具的含 GPA/评分制度的最新成绩单。非英文文件须附学校可提供的认证英文翻译。',{manualReview:true}),requirement('chsi-transcript','学信网成绩验证报告（大陆已毕业）','transcript','大陆已毕业申请人须上传中英文《中国高等学校学生成绩验证报告》，有效期设为 6 个月或最长可选期限；无法取得时才可附理由并使用学校软拷贝成绩单。若仍在读，标记“豁免 / 不适用”。',{manualReview:true,waivable:true}),requirement('chsi-qualification','学信网学历证书电子注册备案表（大陆已毕业）','other','大陆已毕业申请人须上传本科中英文《教育部学历证书电子注册备案表》，有效期设为 6 个月或最长可选期限；若仍在读，标记“豁免 / 不适用”。',{mode:'manual',manualReview:true,waivable:true}),requirement('chsi-degree','学信网学位验证报告（大陆已毕业）','other','大陆已毕业申请人须上传中英文《中国高等教育学位验证报告》，有效期设为 6 个月或最长可选期限；若仍在读，标记“豁免 / 不适用”。',{mode:'manual',manualReview:true,waivable:true}),language(),{...cv(),label:'CV（可选）',optional:true,detail:'HKU MSc(AI) FAQ：CV 为可选材料；如提交，在完成申请表和缴费后上传至 TPG Admission Add-on system。'},{...sop('HKU MSc(AI) FAQ：Personal Statement 为可选材料；如提交，在完成申请表和缴费后上传至 TPG Admission Add-on system。'),label:'Personal Statement（可选）',optional:true},requirement('reference-optional','推荐信（可选）','reference','推荐信并非必需。如提交，在申请表填写推荐人信息；提交申请后的次日，系统会向推荐人发送邮件通知，由推荐人完成提交。',{mode:'manual',optional:true,submissionMethod:'recommender'}),requirement('gre-optional','GRE / GMAT（非必需）','other','FAQ 明确 GRE / GMAT 不要求；如你认为有帮助可自愿提供。',{mode:'manual',optional:true}),requirement('file-naming','文件命名与提交窗口','other','所有 PDF 文件名须以申请编号开头并使用学校指定代码（如 申请编号_T1、申请编号_I1）。收到邮件通知起 1 个月内上传全部初审文件；逾期不接受。',{mode:'manual',manualReview:true}),fee()];
export const seeds=[
 {...base,id:'ucsd-ece-mlds',school:'加州大学圣地亚哥分校',schoolEn:'UC San Diego · UCSD',name:'ECE · Machine Learning & Data Science',field:'EE / DS / AI · EC93',tier:'中等',tracked:true,city:'La Jolla, California',mark:'SD',color:'#476987',deadline:'2027-01-06',deadlineTime:'23:59',timezone:'America/Los_Angeles',deadlineStatus:'verified',deadlineNote:'2027 ECE MS：2027-01-06 23:59 加州时间。MLDS 方向代码为 EC93，需直接选此方向，不能假定可从其他方向转入。GRE 不要求。',sources:[src('ECE 招生、日期与材料',U),src('2026–27 学费',UF)],requirements:ur(),tuition:ut},
 {...base,id:'cmu-ai-ece',school:'卡内基梅隆大学',schoolEn:'Carnegie Mellon University · CMU',name:'Artificial Intelligence Engineering · ECE',field:'AI / EE · MSAIE',tier:'冲刺',tracked:true,city:'Pittsburgh, Pennsylvania',mark:'CMU',color:'#a44e48',timezone:'America/New_York',deadlineNote:'对应 ECE 的 MS in Artificial Intelligence Engineering（AI–ECE），3 学期。日期专页列 MS 提前审阅 12/15、最终 1/15，均 23:59 ET，未写年份；总页又简述 Fall 12/15。保留差异，待 2027 申请系统确认，不混用 SCS 日期。',sources:[src('AI–ECE 学位',CA),src('ECE 截止日期',CD),src('ECE 材料 FAQ',C+'graduate-faq.html'),src('ECE 招生与语言要求',C),src('工程学院学费',CF)],requirements:cr(),tuition:ct},
 {...base,id:'northwestern-cs-ms',school:'西北大学',schoolEn:'Northwestern University',name:'Computer Science',field:'CS / AI',tier:'中等',tracked:true,city:'Evanston, Illinois',mark:'N',color:'#796193',timezone:'America/Chicago',deadlineNote:'MS 官网分轮次列 11/30、12/31、2/28、6/15，名额满可提前关闭。申请季文字有歧义且轮次没写年份，暂不确认为 2027 日期。建议在申请系统确认首轮并尽早提交。PhD 规则不同。',sources:[src('CS 招生与轮次',N),src('TGS 材料',NT),src('两篇文书要求',NT+'essays.html'),src('TGS 学费',NF)],requirements:nr(),tuition:nt},
 {...base,id:'nyu-tandon-cs',school:'纽约大学 Tandon',schoolEn:'New York University · NYU Tandon',name:'Computer Science',field:'CS / AI',tier:'保底',tracked:true,city:'Brooklyn, New York',mark:'NYU',color:'#8a659b',timezone:'America/New_York',deadlineNote:'Tandon 通用 Fall MS 页面列优先 12/1、最终 2/15，未注明年份。2027 日期及时刻需申请系统确认。CS MS 无春季招生。此为 Tandon，而非 Courant。',sources:[src('Tandon 截止日期',YD),src('Tandon 材料',Y),src('CS 项目','https://engineering.nyu.edu/academics/programs/computer-science-ms'),src('历史学费',YF)],requirements:yr(),tuition:yt},
 {...base,id:'cornell-tech-cs',tracked:true,school:'康奈尔大学 · Cornell Tech',schoolEn:'Cornell University · New York Campus',name:'Computer Science',degree:'MEng',field:'CS / AI',tier:'冲刺',city:'New York, New York',mark:'C',color:'#ad5750',deadline:'2026-12-01',deadlineTime:'17:00',timezone:'America/New_York',deadlineStatus:'verified',deadlineNote:'这里记录 2027 全日制 MEng 优先轮：2026-12-01 17:00 EST。第二轮 2027-01-26、滚动轮 2027-04-01，均 17:00 EST。国际生建议最晚第二轮。此为纽约 Cornell Tech；Ithaca 校区另有独立项目卡片。',sources:[src('MEng 招生轮次',CO),src('Cornell Tech 学费',COF)],requirements:[requirement('verify-checklist','核对并建立当季材料清单','other','已核验项目及轮次；官网抓取未提供完整材料正文。请核对申请系统，添加具体材料后再记录就绪状态。',{mode:'manual',verified:false})],requirementsVerified:false,tuition:{display:'$73,946 / 学年',year:'2026–27 · Cornell Tech MEng',note:'官网 MEng 年学费 $73,946。另列医保 $3,751–4,092、NYC 健康费 $366、学生活动费 $110。生活费另计。2027–28 尚待核验；Ithaca 校区费用另按大学 Bursar 页面核验。',url:COF}},
 {...base,id:'nyu-tandon-ee',school:'纽约大学 Tandon',schoolEn:'New York University · NYU Tandon',name:'Electrical Engineering',field:'EE / AI',tier:'保底',city:'Brooklyn, New York',mark:'NYU',color:'#8a659b',deadlineNote:'通用 Fall MS：优先 12/1、最终 2/15（未注明年份，2027 待核验）。NYU 具体专业尚未确定，此项目供与 CS 比较。',sources:[src('EE 项目','https://engineering.nyu.edu/academics/programs/electrical-engineering-ms'),src('Tandon 材料',Y),src('Tandon 截止日期',YD),src('历史学费',YF)],requirements:yr(),tuition:yt},
 {...base,id:'ucsd-ece-phd',school:'加州大学圣地亚哥分校',schoolEn:'UC San Diego · UCSD',name:'ECE · Machine Learning & Data Science',degree:'PhD',field:'EE / DS / AI · EC93',tier:'中等',city:'La Jolla, California',mark:'SD',color:'#476987',deadline:'2026-12-16',deadlineTime:'23:59',timezone:'America/Los_Angeles',deadlineStatus:'verified',deadlineNote:'Fall 2027 ECE PhD 截止 2026-12-16 23:59 加州时间，GRE 不要求；须核对导师与研究匹配。',sources:[src('ECE 招生与材料',U),src('研究生学费',UF)],requirements:ur(),tuition:{...ut,note:'此为未扣除资助的非居民标价；博士实付应按资助信计算，通过 candidacy 后有非居民学费减免规则。'+ut.note}},
 {...base,id:'northwestern-cs-phd',school:'西北大学',schoolEn:'Northwestern University',name:'Computer Science',degree:'PhD',field:'CS / AI',tier:'中等',city:'Evanston, Illinois',mark:'N',color:'#796193',deadline:'2026-12-01',deadlineStatus:'verified',deadlineNote:'官网明确 Fall 2027 PhD 主截止 2026-12-01，另允许截至 12/15 的晚申请。博士要求 GRE，MS 不要求。具体时刻请核对学校系统。',sources:[src('CS 博士招生',N),src('TGS 材料',NT),src('TGS 文书',NT+'essays.html'),src('TGS 学费',NF)],requirements:[...nr().filter(r=>r.id!=='specific'),requirement('gre','GRE 成绩','other','CS 官网博士要求 GRE；在当季系统核对并完成送分。',{manualReview:true})],tuition:{display:'$18,689 / 学季（标价）',year:'2026–27 · TGS PhD 前 8 学季',note:'前 8 学季标价，不等于实付。CS FAQ 说明录取博士有学费与津贴资助；条件、金额及期限以 offer 为准。',url:NF}}
];
const officialUrls={
 'ucsd-ece-mlds':'https://ece.ucsd.edu/graduate/graduate-admissions',
 'ucsd-ece-phd':'https://ece.ucsd.edu/graduate/graduate-admissions',
 'cmu-ai-ece':'https://www.ece.cmu.edu/academics/ms-ai/index.html',
 'northwestern-cs-ms':'https://www.mccormick.northwestern.edu/computer-science/academics/graduate/masters/',
 'northwestern-cs-phd':'https://www.mccormick.northwestern.edu/computer-science/academics/graduate/phd/',
 'nyu-tandon-cs':'https://engineering.nyu.edu/academics/programs/computer-science-ms',
 'nyu-tandon-ee':'https://engineering.nyu.edu/academics/programs/electrical-engineering-ms',
 'cornell-tech-cs':'https://tech.cornell.edu/programs/masters-programs/master-in-computer-science/',
 'cornell-ithaca-cs':'https://www.cs.cornell.edu/master-engineering-computer-science'
};
for(const p of seeds)if(officialUrls[p.id])p.officialUrl=officialUrls[p.id];
// Cornell's requirement accordion is present in the HTML but omitted by some readers.
const cornellProgram=seeds.find(p=>p.id==='cornell-tech-cs');
cornellProgram.requirementsVerified=true;
cornellProgram.requirements=[
 {...cv(),maxPages:2,detail:'简历不超过 2 页；列出职业经历、学术背景及相关技能。'},
 requirement('personal','Personal Statement','sop','二选一题目，不超过 750 词：突出创新与团队贡献，或介绍完整软件开发经历。使用 AI 辅助须按官网要求披露。',{maxWords:750,manualReview:true}),
 requirement('video','3 分钟 Video Essay','other','通过学校提供的平台完成 3 分钟视频回答；问题不预先提供。',{mode:'manual'}),
 ...refs(2),transcript(),
 requirement('credential','境外学历逐课评估','other','美国及加拿大之外院校的成绩单需 course-by-course 评估，由官网认可机构办理；评估须在审核前到达。按个人教育背景核对适用性。',{manualReview:true,waivable:true}),
 language(),fee()
];

const CI='https://www.cs.cornell.edu/master-engineering-computer-science/apply';
const CIB='https://bursar.cornell.edu/students-parents/tuition-rates-and-fees';
seeds.push({...base,id:'cornell-ithaca-cs',school:'康奈尔大学 · Ithaca',schoolEn:'Cornell University · Ithaca Campus',name:'Computer Science · MEng',degree:'MEng',field:'CS / AI · 课程＋项目',tier:'冲刺',tracked:true,city:'Ithaca, New York',mark:'C',color:'#ad5750',timezone:'America/New_York',deadlineNote:'Ithaca CS MEng 官网常规 Fall 截止为 2/1，未写年份，按 2027 Fall 参考为 2027-02-01。没有公布多个 Fall 批次，不套用 Cornell Tech 轮次。',sources:[src('Ithaca CS MEng 与 AI 方向','https://www.cs.cornell.edu/masters-engineering-computer-science'),src('申请日期与材料',CI),src('两学期与 30 学分要求','https://www.cs.cornell.edu/master-engineering-computer-science/academic-planning'),src('MEng 每学期 / 每学年学费',CIB)],requirements:[cv(),sop('说明 CS 兴趣、选择 Cornell MEng 的原因、资历和目标，不超过 1,000 词。',{maxWords:1000}),requirement('personal','Personal Statement','sop','不超过 1,000 词，介绍背景、经历和对合作环境的贡献。',{maxWords:1000,manualReview:true}),transcript(),language(),...refs(2),fee()],tuition:{display:'$36,973 / 学期；$73,946 / 学年',year:'2026–27 · Ithaca MEng',note:'大学 Bursar 在 Professional and Select Master’s Degrees 的 Tier 1 中列出 MEng 每学期 $36,973、每学年 $73,946。标准两学期按该年度价格共 $73,946。2027–28 费用待公布，医保、杂费与食宿另计。',url:CIB}});
seeds.find(p=>p.id==='cornell-ithaca-cs').officialUrl=officialUrls['cornell-ithaca-cs'];
const HA='https://www.mscai.hku.hk/admissions/',HP='https://www.mscai.hku.hk/programme/',HC='https://www.mscai.hku.hk/curriculum/',HF='https://www.mscai.hku.hk/frequently-asked-questions/';
seeds.push({...base,id:'hku-msc-ai',school:'香港大学',schoolEn:'The University of Hong Kong · HKU',name:'Master of Science in Artificial Intelligence',degree:'MSc',country:'中国香港',field:'AI / CS / DS',tier:'待定',tracked:true,city:'Pokfulam, Hong Kong',mark:'HKU',color:'#8f5350',deadline:'2026-11-16',deadlineTime:'12:00',timezone:'Asia/Hong_Kong',deadlineStatus:'verified',deadlineNote:'2027–28 主轮截止：2026-11-16 12:00（GMT+8），主轮申请者获优先录取考虑；另有补录轮 2027-02-01 12:00（GMT+8）。',officialUrl:HP,sources:[src('MSc(AI) 项目介绍、时长与 2027 学费',HP),src('2027–28 招生开放、轮次与在线上传流程',HA),src('72 credits 课程结构',HC),src('FAQ：可选材料、推荐信及 GRE/GMAT',HF)],requirements:hr(),tuition:{display:'HK$420,000 / 全程',year:'2027–28 · 待审批',note:'官网明确为 2027 年 9 月录取学生的总学费 HK$420,000，通常在全日制 1.5 年内分三期缴付；金额标注 subject to approval。此处为整个项目，不是单学期或单学年费用。',url:HP}});
const recommendationSources={
 'ucsd-ece-mlds':src('推荐信提交方式','https://www.ece.ucsd.edu/graduate/admission-faq/faq-recommendation-letters'),
 'ucsd-ece-phd':src('推荐信提交方式','https://www.ece.ucsd.edu/graduate/admission-faq/faq-recommendation-letters'),
 'cmu-ai-ece':src('推荐信提交方式','https://www.ece.cmu.edu/admissions/graduate-faq.html'),
 'northwestern-cs-ms':src('推荐信提交方式','https://www.tgs.northwestern.edu/admission/application-procedures/application-requirements/letters-of-recommendation.html'),
 'northwestern-cs-phd':src('推荐信提交方式','https://www.tgs.northwestern.edu/admission/application-procedures/application-requirements/letters-of-recommendation.html'),
 'nyu-tandon-cs':src('推荐信提交方式','https://engineering.nyu.edu/admissions/digital-learning/how-apply/application-checklist/letters-recommendation'),
 'nyu-tandon-ee':src('推荐信提交方式','https://engineering.nyu.edu/admissions/digital-learning/how-apply/application-checklist/letters-recommendation'),
 'cornell-tech-cs':src('推荐信提交方式（Cornell 系统）','https://gradschool.cornell.edu/admissions/application-steps/recommendations/'),
 'cornell-ithaca-cs':src('推荐信提交方式','https://www.cs.cornell.edu/master-engineering-computer-science/apply'),
 'hku-msc-ai':src('推荐信提交方式','https://www.mscai.hku.hk/frequently-asked-questions/')
};
for(const p of seeds){const source=recommendationSources[p.id];if(source&&!p.sources.some(s=>s.url===source.url))p.sources.push(source);}
cornellProgram.sources.push(src('MEng 学期和学年费率',CIB));
for(const p of seeds)if(interviewDetails[p.id])p.interview=structuredClone(interviewDetails[p.id]);
for(const p of seeds)if(applicationFees[p.id])p.applicationFee=structuredClone(applicationFees[p.id]);
for(const p of seeds){const fee=applicationFees[p.id];if(fee?.url&&!p.sources.some(s=>s.url===fee.url))p.sources.push(src('申请费与支付说明',fee.url));}
for(let i=0;i<seeds.length;i++)seeds[i]=addSchedule(seeds[i]);

for(const p of seeds)if(graduationCredits[p.id])p.credits=structuredClone(graduationCredits[p.id]);

for(const p of seeds)if(p.tuition&&tuitionDetails[p.id])Object.assign(p.tuition,tuitionDetails[p.id]);
