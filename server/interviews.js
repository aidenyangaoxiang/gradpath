// Checked against each linked official programme/admissions page on 2026-09-30.
// “not-listed” means the page does not prescribe a fixed interview. It is not a
// guarantee that an admissions office will never contact an applicant.
const none=(note,url)=>({status:'not-listed',display:'官网未列固定面试',note,url,verifiedAt:'2026-09-30'});
export const interviewDetails={
 'ucsd-ece-mlds':none('Fall 2027 ECE 招生页列出了申请材料、项目方向与截止日期，未把面试列为固定申请环节。若招生办公室需要补充信息，以邮件或申请系统通知为准。','https://www.ece.ucsd.edu/graduate/graduate-admissions'),
 'ucsd-ece-phd':none('Fall 2027 ECE 招生页列出了材料与截止日期，未把面试列为固定申请环节。博士申请仍应主动核对导师研究匹配；任何个别联系以院系通知为准。','https://www.ece.ucsd.edu/graduate/graduate-admissions'),
 'cmu-ai-ece':none('ECE 研究生 FAQ 与申请页面列出申请材料和流程，未将面试写成 AI–ECE 的固定要求。若项目另行邀请或要求补充评估，以申请系统通知为准。','https://www.ece.cmu.edu/admissions/graduate-faq.html'),
 'northwestern-cs-ms':none('CS 招生页说明博士申请者可能由感兴趣的教师另行面试；该说明并未把面试列为 CS MS 的固定材料或步骤。因此此处记录为“官网未列固定面试”。','https://www.mccormick.northwestern.edu/computer-science/academics/graduate/admissions/'),
 'northwestern-cs-phd':{status:'possible',display:'可能安排面试',note:'CS 招生页明确说：主要针对 PhD，感兴趣的 CS 教师可能进行单独面试。它不是每位申请者的固定必经步骤；是否邀请取决于院系或教师。',url:'https://www.mccormick.northwestern.edu/computer-science/academics/graduate/admissions/',verifiedAt:'2026-09-30'},
 'nyu-tandon-cs':none('Tandon 研究生申请要求页列出申请流程和材料，未列 CS MS 的固定面试。申请系统或项目后续如有个别要求，以其通知为准。','https://engineering.nyu.edu/admissions/graduate/apply/admissions-requirements'),
 'nyu-tandon-ee':none('Tandon 研究生申请要求页列出申请流程和材料，未列 EE MS 的固定面试。申请系统或项目后续如有个别要求，以其通知为准。','https://engineering.nyu.edu/admissions/graduate/apply/admissions-requirements'),
 'cornell-tech-cs':none('Cornell Tech MEng 申请页要求完成 3 分钟 Video Essay；这是异步视频陈述，不是与招生官的实时面试。该页未列固定现场或线上面试。','https://tech.cornell.edu/admissions/meng-application/'),
 'cornell-ithaca-cs':none('Ithaca CS MEng 申请页列出材料和日期，未将实时面试列为固定步骤。任何个别联系以项目或 Graduate School 通知为准。','https://www.cs.cornell.edu/master-engineering-computer-science/apply'),
 'hku-msc-ai':none('HKU MSc(AI) 2027–28 招生页列出资格、两轮截止和在线上传流程；FAQ 说明可选材料与推荐信流程，未将面试列为固定步骤。若项目需要补充评估，以邮件通知为准。','https://www.mscai.hku.hk/admissions/')
};
