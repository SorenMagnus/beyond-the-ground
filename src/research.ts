import type {EvidenceClaim} from './types';
export const sources:EvidenceClaim[]=[
 {id:1,title:'Aircraft technology & specifications',publisher:'Joby Aviation',url:'https://www.jobyaviation.com/technology',checked:'2026-11-18',kind:'target'},
 {id:2,title:'2025 Form 10-K: propulsion and business model',publisher:'Joby / SEC',url:'https://www.sec.gov/Archives/edgar/data/1819848/000181984826000160/joby-20251231.htm',checked:'2026-11-18',kind:'fact'},
 {id:3,title:'Q3 2026 Shareholder Letter: certification progress',publisher:'Joby / SEC',url:'https://www.sec.gov/Archives/edgar/data/1819848/000181984826000531/joby-8kx20261104xexx99_2.htm',checked:'2026-11-18',kind:'fact'},
 {id:4,title:'Q3 2026 Form 10-Q: operating risks and outlook',publisher:'Joby / SEC',url:'https://ir.jobyaviation.com/sec-filings/all-sec-filings/content/0001819848-26-000533/joby-20260930.htm',checked:'2026-11-18',kind:'fact'},
 {id:5,title:'Midnight: 12-tilt-6 configuration',publisher:'Archer / SEC',url:'https://www.sec.gov/Archives/edgar/data/1824502/000110465925011469/tm255927-3_424b5.htm',checked:'2026-11-18',kind:'target'},
 {id:6,title:'Eve eVTOL: design mission and capacity',publisher:'Eve Air Mobility',url:'https://www.eveairmobility.com/evtol/',checked:'2026-11-18',kind:'target'},
 {id:7,title:'EH216-S special conditions',publisher:'CAAC / ICAO',url:'https://www.icao.int/sites/default/files/Meetings/a41/Documents/WP/wp_444_en.pdf',checked:'2026-11-18',kind:'fact'},
 {id:8,title:'EH216-S certification and production milestones',publisher:'EHang / SEC',url:'https://www.sec.gov/Archives/edgar/data/1759783/000119312524204851/d227169dex991.htm',checked:'2026-11-18',kind:'fact'},
 {id:9,title:'Momentum theory for propeller thrust',publisher:'NASA Glenn Research Center',url:'https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/propeller-thrust/',checked:'2026-11-18',kind:'fact'},
];
export const reports=[
 {title:'一架飞行器，也是一套运营系统。',body:[
 'Joby Aviation 是美国电动垂直起降飞行器开发企业。S4 / JAS4-1 采用固定翼与六组倾转推进器，产品定位为一名驾驶员和四名乘客的空中出租车。官网的最高速度等指标属于企业公布口径，不能直接当作所有载荷、天气和储备条件下的可用任务性能。[1]',
 '公司的路径不仅包括研发与制造，也包括运营准备、基础设施和出行服务协作。垂直整合能够提高系统配合程度，同时带来更大的资本、制造和运营组织负担。商业分析必须把飞机之外的成本一起计算。[2][4]',
 '本网站是独立课程研究，无 Joby 官方背书。原创三维模型用于解释外形与功能，不是官方 CAD；不公开的结构与参数单独标明为教学假设。'
 ]},
 {title:'从形态，读懂工程取舍。',body:[
 '垂直起降解决跑道约束，固定翼巡航缓解持续悬停的能耗压力。代价是倾转机构、飞控转换、重量与气动干扰必须共同优化。推进器既要适应低速升力，也要适应前飞效率和噪声要求。',
 '本模型保留机身、主翼、尾翼及六组推进器的可辨识关系；翼型、部件尺寸、机舱、能源模块、机构路径与内部布置均不是测绘或制造数据。选择部件可查看其证据类型。',
 '扫描和拆解表达功能关系，不代表真实装配工序。复合材料结构的载荷路径、疲劳、冲击损伤和维修判据仍需要实物试验与认证证据。'
 ]},
 {title:'电推进的优势，也带来新的边界。',body:[
 '电机可分布在多个推进单元中，避免把全部推力集中于单一大型旋翼。Joby 年报描述每个推进器由两个独立电机驱动，每个电机具有独立驱动单元。这是一项公开架构信息，不能由此推导所有故障组合的结果。[2]',
 '电池必须同时满足比能量、瞬时功率、循环寿命、冷却和热失控隔离需求。提高快充功率可能减少地面等待，却增加热管理压力和基础设施需求；增大电池也会增加起飞重量。',
 '本站能源块仅是功能示意。没有公开确认的电池容量、包布局和效率值不会被标为产品事实。模型计算器的所有默认数值是独立教学情景。'
 ]},
 {title:'过渡飞行不是把旋翼转过去。',body:[
 '悬停时推力主要承担重量；速度增加后，机翼逐渐承担升力，推进器的推力方向转向前方。升力建立、气流干扰、姿态和推进分配必须连续协调。',
 '动画展示“垂直起飞—过渡—巡航—降落”的功能顺序。滑杆的倾转角并非真实产品控制律；飞行器并不以固定线性规则完成全部阶段。',
 '飞控可靠性取决于感知、计算、供电、执行机构及软件验证的系统配合。冗余设计还必须控制共因失效、潜在失效和维护引入的风险。'
 ]},
 {title:'能飞，与能被批准运营，是两件事。',body:[
 '能量实验采用理想动量理论加等效效率，估算悬停功率；巡航使用给定升阻比估算阻力与功率。未建立完整气动极曲线，因此调速不代表真实最优航速研究。模型忽略风、爬升势能、转换附加损失、空调和电池温度影响，不能用于飞行规划。[9]',
 '截至本次核查，Joby 2026 年第三季度股东信称其五阶段认证路径前三阶段完成，仍在推进测试、分析与验证。公司预计相关飞机试飞和 FAA 飞行员训练在 2027 年上半年推进，属于前瞻安排，不是已经取得型号合格证。[3]',
 '企业的分阶段完成率不是法规授予的“安全百分比”。型号设计批准、生产许可、单机适航和运营资格是不同事项；试验飞行或运营资质不能自动证明 S4 已完成全部商业载客审批。'
 ]},
 {title:'真正的航程，是从门到门。',body:[
 '机场接驳是清晰的早期应用假设：两端相对固定，旅客有时间价值，地面道路可能拥堵。但飞行时长只占旅程的一部分，地面接驳、候机、登乘、天气备降都影响实际收益。',
 '跨水域或地形受限路线可能更容易体现直线飞行的价值；密集市中心则受到起降点土地、噪声、下洗、安全间隔和空域容量的约束。示意城市与航线不对应已获批航路。',
 '运行阶段无尾气不等于全生命周期零排放。电力结构、电池制造、乘坐率和地面接驳会改变最终环境表现，不能只比较飞机飞行时的能耗。[1]'
 ]},
 {title:'商业成立，取决于飞机之外。',body:[
 '商业模型以人民币表达独立教学情景。年度固定成本覆盖折旧、融资、人员、保险及基础设施分摊的合并假设；每航次维护费为可调整估计。它不是 Joby 报价、盈利预测或投资建议。',
 '班次取决于飞行时间与地面服务时间。模型假设充电和乘客周转可并行，取两者较大值；充电效率设为 90%。实际并行操作是否可行需由运营程序和地面系统验证。',
 '比较 Joby、Archer、Eve 与 EH216-S 时要保持口径：倾转、升力巡航与多旋翼的任务不同；有人驾驶与无人驾驶的运营要求不同；不同监管辖区的批准也不能简单排名。[5][6][7][8]',
 '判断：技术可行性已有持续试验支撑，但规模化经济性仍依赖认证、可靠性、利用率、电池寿命和基础设施。最有希望的是有明确时间优势、稳定需求与可管理运行边界的特定航线。'
 ]}
];
