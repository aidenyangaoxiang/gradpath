// Keep institutional units and distinguish coursework from the whole doctoral degree.
const credit=(display,note,url,reference='官网当前课程要求 · 2027 入学要求待确认')=>({display,note,url,reference,verifiedAt:'2026-09-30'});
export const graduationCredits={
 'hku-msc-ai':credit('至少 72 credits（HKU 单位）','MSc(AI) 课程结构要求至少 72 credits：必修 42、学科选修 18、capstone project 12。保留 HKU 原始学分单位，不与美国 semester credits 直接换算。','https://www.mscai.hku.hk/curriculum/','2026-09-30 官网核验 · 2027–28 入学'),
 'cornell-ithaca-cs':credit('30 credits','Ithaca CS MEng 要求 30 credits，其中 3–6 credits 为毕业项目；其余课程须为技术性高级课程。','https://www.cs.cornell.edu/masters-engineering-computer-science'),
 'ucsd-ece-mlds':credit('48 units（综合考试）/ 52 units（论文）','Plan II 综合考试方案共 48 units；Plan I 论文方案共 52 units。UCSD 采用学季制，另须满足对应 capstone、成绩和在校修读要求。按 MLDS 方向的课程规划表选课。','https://ece.ucsd.edu/graduate/ms/faqs/incoming-students'),
 'cmu-ai-ece':credit('97 units（CMU 单位）','AI–ECE 官方项目页明确为 97-unit 学位。保留 CMU 原始单位，不按其他学校的 credits 换算或直接套用按学分学费。','https://www.ece.cmu.edu/academics/ms-ai/index.html'),
 'northwestern-cs-ms':credit('12 units（Northwestern 单位）','官网要求 12 units 的研究生学分；可包含课程和研究。课程型、项目型、论文型方案按各自要求分配，不等同于其他学校的 12 semester credits。','https://www.mccormick.northwestern.edu/computer-science/academics/graduate/masters/'),
 'nyu-tandon-cs':credit('30 credits','官方课程目录列出总计 30 credits；还须满足算法、核心课程、选修及 capstone 等具体分布要求。','https://bulletins.nyu.edu/graduate/engineering/programs/computer-science-tandon-ms/'),
 'nyu-tandon-ee':credit('30 credits','官方课程目录：核心课程 6 credits、ECE-GY 选修 18 credits、自由选修 6 credits，总计 30。论文、项目、阅读与实习学分的计入上限另见官网。','https://bulletins.nyu.edu/graduate/engineering/programs/electrical-engineering-ms/'),
 'cornell-tech-cs':credit('至少 30 credits','Cornell Tech CS MEng 至少修满 30 credits，包含 Studio 课程。这里记录纽约 Cornell Tech 校区的要求，具体课程分布以入学年度课程表为准。','https://admissions.tech.cornell.edu/admitted/student-academic-affairs/','2026–27 课程说明参考 · 2027 入学要求待确认'),
 'ucsd-ece-phd':credit('课程部分 48 units；博士总量不固定','ECE 官网课程要求为 48 units（12 门学季课程），其中至少 36 units 为研究生课程。已有 EE 硕士可经导师批准用既往课程替代；还需资格考试、研究、论文及答辩，48 units 不是博士全部毕业要求。','https://ece.ucsd.edu/graduate/phd-degree-requirements'),
 'northwestern-cs-phd':credit('课程要求 10 门；博士总学分未固定','2025 年 CS PhD 手册要求 10 门有字母成绩的研究生课程（含 IGS），并持续注册研究学分。课程数不直接换算成固定毕业总学分；另需方向要求、资格考试、研究与论文答辩。','https://www.mccormick.northwestern.edu/computer-science/documents/phdmanualmarch2025update.pdf','2025 年 PhD 手册参考 · 2027 入学要求待确认')
};
