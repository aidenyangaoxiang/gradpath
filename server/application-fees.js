// Checked against linked official admissions pages on 2026-09-30.
const fee=(display,note,url,status='verified')=>({display,note,url,status,verifiedAt:'2026-09-30'});
export const applicationFees={
 'ucsd-ece-mlds':fee('US$155 / 份（国际申请人）','UCSD Graduate Division 当前页面：国际申请人每份申请 US$155，费用不可退；在申请入口支付。部分符合条件的申请人可申请 waiver，须至少在截止前一周提交 waiver request。','https://grad.ucsd.edu/admissions/admission-faq/faq-application-fee.html'),
 'ucsd-ece-phd':fee('US$155 / 份（国际申请人）','UCSD Graduate Division 当前页面：国际申请人每份申请 US$155，费用不可退；在申请入口支付。部分符合条件的申请人可申请 waiver，须至少在截止前一周提交 waiver request。','https://grad.ucsd.edu/admissions/admission-faq/faq-application-fee.html'),
 'cmu-ai-ece':fee('US$75 / 次','CMU ECE Graduate FAQ：申请费为一次性、不可退的 US$75；重新申请也需再次支付。CMU 学生/校友及 GEM Fellowship 申请者自动豁免，其他人可按 FAQ 流程申请豁免。','https://www.ece.cmu.edu/admissions/graduate-faq.html'),
 'northwestern-cs-ms':fee('US$95 / 份','Northwestern TGS：申请费 US$95、不可退；在申请系统用信用卡或借记卡支付。官网所列 waiver 条件以美国公民/永久居民及 TGS PhD/MFA 等为主，国际硕士申请人不要假定可豁免。','https://www.northwestern.edu/tgs/admission/application-procedures/application-requirements/fee.html'),
 'northwestern-cs-phd':fee('US$95 / 份','Northwestern TGS：申请费 US$95、不可退；在申请系统用信用卡或借记卡支付。官网提供面向符合条件申请人的限量 fee waiver。','https://www.northwestern.edu/tgs/admission/application-procedures/application-requirements/fee.html'),
 'nyu-tandon-cs':fee('US$90 / 份','NYU Tandon：申请费 US$90，在网申系统以主要信用卡支付。若构成经济困难，线下项目可联系 Graduate Enrollment Management and Admissions 询问 waiver。','https://engineering.nyu.edu/admissions/digital-learning/how-apply/application-checklist/application-fee'),
 'nyu-tandon-ee':fee('US$90 / 份','NYU Tandon：申请费 US$90，在网申系统以主要信用卡支付。若构成经济困难，线下项目可联系 Graduate Enrollment Management and Admissions 询问 waiver。','https://engineering.nyu.edu/admissions/digital-learning/how-apply/application-checklist/application-fee'),
 'cornell-tech-cs':fee('金额待申请系统核验','Cornell Tech Fall 2027 MEng 页面说明需通过其申请入口完成申请，但公开页未列出金额。官方 MEng 信息会/校园参访活动明确可获得 application fee waiver，说明应在活动后按邮件指引申请；不要把 Cornell Graduate School 的 US$105 自动套用于 Cornell Tech。','https://tech.cornell.edu/events/meng-jacobs-on-campus-information-session/','unconfirmed'),
 'cornell-ithaca-cs':fee('US$105 / 份','Cornell Graduate School：申请费 US$105、不可退，在线申请提交时通过信用卡或借记卡支付；符合经济困难条件可在付款页申请 waiver。Ithaca CS MEng 使用 Cornell Graduate School 体系。','https://gradschool.cornell.edu/admissions/application-steps/pay-fees/'),
 'hku-msc-ai':fee('HK$600 / 份','HKU Taught Postgraduate Admissions：每份申请 HK$600，在线以 Visa 或 MasterCard 支付；付款前申请不会处理，费用不可退且不可转让。','https://portal.hku.hk/tpg-admissions/applying/application-fees')
};
