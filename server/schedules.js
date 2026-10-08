// Checked 2026-09-30. Undated annual schedules are references, not confirmed 2027 dates.
const U='https://www.ece.ucsd.edu/graduate/graduate-admissions';
const C='https://www.ece.cmu.edu/admissions/graduate-application-deadlines.html';
const N='https://www.mccormick.northwestern.edu/computer-science/academics/graduate/admissions/';
const Y='https://engineering.nyu.edu/admissions/graduate/apply/application-deadlines';
const CO='https://tech.cornell.edu/admissions/meng-application/';
const annual='官网常规日程（未标年份），按 2027 Fall 推算';
const opening=(date,display,status,note,url,extra={})=>({date,display,status,note,url,...extra});
const round=(label,date,status,url,time='',timezone='',reference='')=>({label,date,status,url,time,timezone,reference});
const duration=(display,note,url)=>({display,note,url});
const uOpen=opening('2026-09-02','2026-09-02','verified','2026-09-30 核验：ECE 官网明确为 Fall 2027 申请开放日期，申请期已开始。',U,{availability:'open'});
const nOpen=opening('2026-09-15','2026-09-15','verified','2026-09-30 核验：CS 招生页写明申请于 2026-09-15 开放，且同页列出 Fall 2027 PhD 截止日期。页面把申请学年写作 2026–2027，疑为文字不一致；以开放通知和 Fall 2027 截止日期为依据，标为已开放。',N,{availability:'open'});
const yOpen=opening('','已开放 · 具体日期未公布','verified','2026-09-30 核验：申请入口明确显示 2027 application 已开放，未公布首次开放日期；没有找到可核验的往年具体开放日。','https://apply.engineering.nyu.edu/apply/',{availability:'open'});
const yRounds=[round('优先截止','2026-12-01','reference',Y,'','America/New_York',annual),round('最终截止','2027-02-15','reference',Y,'','America/New_York',annual)];
export const schedules={
 'hku-msc-ai':{opening:opening('2026-09-21','2026-09-21','verified','2026-09-30 核验：HKU MSc(AI) 招生页明确写明 2027–28 intake 于 2026-09-21 开放。','https://www.mscai.hku.hk/admissions/',{availability:'open'}),duration:duration('全日制 1.5 年','项目官网明确为 Full-time: 1.5 years；学费通常在全日制 1.5 年内分三期支付。','https://www.mscai.hku.hk/programme/'),rounds:[round('主轮截止（优先审阅）','2026-11-16','verified','https://www.mscai.hku.hk/admissions/','12:00','Asia/Hong_Kong','主轮申请者获优先录取考虑'),round('补录轮截止','2027-02-01','verified','https://www.mscai.hku.hk/admissions/','12:00','Asia/Hong_Kong','Clearing Round；香港时间 GMT+8')]},
 'cornell-ithaca-cs':{opening:opening('','Fall 2027 暂未见开放入口','reference','2026-09-30 核验：Ithaca CS 页面当前只写“正在接受 Spring 2027”申请；未列 Fall 2027 的申请入口或开放日。因此暂按 Fall 2027 尚未开放处理，等 CS 或 Cornell Graduate School 发布 Fall 入口后再确认。','https://www.cs.cornell.edu/master-engineering-computer-science/apply',{availability:'not-open',history:{date:'未查到可核验的历史具体日期',cycle:''}}),duration:duration('2 学期 · 约 9 个月（秋春）','官方要求两个全日制学期完成；秋季入学按秋、春连续修读约 9 个月。项目为专业型 MEng，含课程与毕业项目。','https://www.cs.cornell.edu/master-engineering-computer-science/academic-planning'),rounds:[round('秋季入学截止','2027-02-01','reference','https://www.cs.cornell.edu/master-engineering-computer-science/apply','','America/New_York',annual+'；官网未列出 Fall 的多个批次')]},
 'ucsd-ece-mlds':{opening:uOpen,duration:duration('约 2 年 · 6 学季','ECE 官方 FAQ：硕士需在最多 6 学季内完成；每学年秋、冬、春 3 学季，理想完成时间为 2 年。','https://ece.ucsd.edu/graduate/ms/faqs/incoming-students'),rounds:[round('最终截止','2027-01-06','verified',U,'23:59','America/Los_Angeles')]},
 'cmu-ai-ece':{opening:opening('2026-10-01','2026-10-01','reference','2026-09-30 核验：ECE 截止日期页的常规 Fall 日程写 10/1 开放，但未注明年份；CMU 工程学院门户可创建申请账户，尚不能在公开页确认 AI–ECE 的 Fall 2027 项目选项。故按常规日程标为暂未开放，明日及开放后需在项目选择页复核。',C,{availability:'not-open',history:{date:'10 月 1 日',cycle:'ECE 官网常规 Fall 日程（未标年份）'}}),duration:duration('3 学期','AI–ECE 官网明确为 3 学期、97 units；按常规秋春秋安排约 1.5 年，含暑期的具体安排以项目课程计划为准。','https://www.ece.cmu.edu/academics/ms-ai/index.html'),rounds:[round('提前审阅截止','2026-12-15','reference',C,'23:59','America/New_York',annual),round('最终截止','2027-01-15','reference',C,'23:59','America/New_York',annual)]},
 'northwestern-cs-ms':{opening:nOpen,duration:duration('3–4 学季','官方项目页：12 units，课程、项目或论文方案，通常可在 3–4 学季完成，部分学生用时更长。学季不等于半年制学期。','https://www.mccormick.northwestern.edu/computer-science/academics/graduate/masters/'),rounds:[['第一轮','2026-11-30'],['第二轮','2026-12-31'],['第三轮','2027-02-28'],['第四轮','2027-06-15']].map(([label,date])=>round(label,date,'reference',N,'','America/Chicago',annual+'；名额满可能提前关闭'))},
 'nyu-tandon-cs':{opening:yOpen,duration:duration('4 学期示例 · 约 2 年','官方 Bulletin 的无实习示例排课为 4 学期、30 学分；这是示例，实际时长受选课和实习影响，并非固定学制承诺。','https://bulletins.nyu.edu/graduate/engineering/programs/computer-science-tandon-ms/'),rounds:yRounds},
 'nyu-tandon-ee':{opening:yOpen,duration:duration('4 学期示例 · 约 2 年','官方 Bulletin 示例排课为 4 学期、30 学分；实际时长依个人课程计划，不代表所有学生必须读满 2 年。','https://bulletins.nyu.edu/graduate/engineering/programs/electrical-engineering-ms/'),rounds:yRounds},
 'cornell-tech-cs':{opening:opening('','已开放 · 具体开放日期未公布','verified','2026-09-30 核验：Cornell Tech 已发布 Fall 2027 MEng 轮次并在申请页提供 Apply Now；其申请门户可创建新申请。官网未公布首次开放日期。',CO,{availability:'open'}),duration:duration('1 学年 · 约 9 个月（全日制）','Cornell Tech CS MEng 官网标为 1 Year。按秋、春两个学期理解为一个学年，约 9 个月（月份为学年安排估算）；不适用于非全日制项目。','https://tech.cornell.edu/programs/masters-programs/master-in-computer-science/'),rounds:[round('优先截止','2026-12-01','verified',CO,'17:00','America/New_York'),round('第二轮截止','2027-01-26','verified',CO,'17:00','America/New_York'),round('滚动轮截止','2027-04-01','verified',CO,'17:00','America/New_York')]},
 'ucsd-ece-phd':{opening:uOpen,duration:duration('博士：本科起读 6 年；持硕士入读 5 年','ECE 官方规范完成时间：本科入学 6 年，已有硕士 5 年；实际毕业时间取决于研究进度，资助期限另算。','https://www.ece.ucsd.edu/graduate/phd-degree-requirements'),rounds:[round('最终截止','2026-12-16','verified',U,'23:59','America/Los_Angeles')]},
 'northwestern-cs-phd':{opening:nOpen,duration:duration('目标 5 年','2025 年 CS PhD 官方手册将目标时长设为 5 年；实际时间取决于方向、资格考试和论文研究。','https://www.mccormick.northwestern.edu/computer-science/documents/new-phd-manual-mar62025.pdf'),rounds:[round('主截止','2026-12-01','verified',N),round('晚申请最晚日期','2026-12-15','verified',N)]}
};
export function addSchedule(program){
 const schedule=schedules[program.id];if(!schedule)return program;
 const updated={...program,...structuredClone(schedule)};
 if(!program.deadline&&program.deadlineStatus==='unconfirmed'){
  const first=schedule.rounds[0];Object.assign(updated,{deadline:first.date,deadlineStatus:first.status,deadlineTime:first.time,timezone:first.timezone});
 }
 return updated;
}
