# 航空研究与素材来源

核查日期 2026-11-18。网站的研究抽屉与 src/research.ts 保存各条论述和引用。Joby 的规格需区分企业指标与载荷、天气、储备条件下的实际性能。2026 Q3 股东信所述阶段进度为企业披露，试飞、运营资格和型号合格证各有其适用范围。

- [Joby 产品与技术](https://www.jobyaviation.com/technology)
- [Joby 年报与推进设计](https://www.sec.gov/Archives/edgar/data/1819848/000181984826000160/joby-20251231.htm)
- [Joby Q3 股东信](https://www.sec.gov/Archives/edgar/data/1819848/000181984826000531/joby-8kx20261104xexx99_2.htm)与[季度申报](https://ir.jobyaviation.com/sec-filings/all-sec-filings/content/0001819848-26-000533/joby-20260930.htm)
- [Archer Midnight](https://www.sec.gov/Archives/edgar/data/1824502/000110465925011469/tm255927-3_424b5.htm)、[Eve eVTOL](https://www.eveairmobility.com/evtol/)、[EH216-S 专用条件](https://www.icao.int/sites/default/files/Meetings/a41/Documents/WP/wp_444_en.pdf)与[获证披露](https://www.sec.gov/Archives/edgar/data/1759783/000119312524204851/d227169dex991.htm)
- [NASA Glenn 螺旋桨动量理论](https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/propeller-thrust/)

模型几何由 src/model.ts 和 src/World.tsx 程序生成。外形比例为观察近似，电池、接线、倾转机构及安全网络为教学示意。静态海报由本项目 WebGL 渲染生成，城市、航线、图表、标志均由项目源码生成。图标来自 Lucide（ISC），字体为系统字体。代码未包含第三方站点的图片、模型或品牌标志。

默认情景为 40 km、2200 kg、120 kWh 电池、20% 储备，计算约需 42 kWh。该结果随教学假设变化。商业情景将周转与充电并行，未计入天气取消、调机与需求波动。判断是先验证少数时间优势明显的航线，再根据适航证据与实际利用率讨论规模化。
