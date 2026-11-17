# 开源参考

核查源码、仓库许可证和公开示例。查阅的项目使用 MIT，Theatre 使用 Apache-2.0。GSAP 运行库适用其[标准许可](https://gsap.com/community/standard-license/)，与官方技能仓库的 MIT 许可分别核对。以下采用描述的是工程思想和公开 API。

| 参考 | 已查看实现与观察 | 项目决定 |
|---|---|---|
| [SeamTransitions](https://github.com/codrops/SeamTransitions) | js/index.js 动态按需导入 11 类效果，contour.js 用进度、边缘距离和宽度限制着色区域 | 自写对象空间扫描，替换双 Canvas 和 ScrollSmoother |
| [ScrollBasedLayoutAnimations](https://github.com/codrops/ScrollBasedLayoutAnimations/tree/729029a0f2c31e7c39e15d5c6433a0f4f2bac498) | js/index.js 捕获 Flip 状态，布局变形随滚动 | 用同一模型和绝对场景变换保留身份 |
| [OneElementScroll](https://github.com/codrops/OneElementScroll) | js/index.js 记录 waypoint，Flip.fit 定位，重建前 revert | 共享飞行器，镜头重测章节位置 |
| [KineticTypePageTransition](https://github.com/codrops/KineticTypePageTransition/tree/ebe926e2f1de42950c36ff8a678321155280c1af) | typeTransition.js 按节奏错开字行与整体变换 | 采用独立标题层，保留可读 HTML |
| [3DCarousel](https://github.com/codrops/3DCarousel/tree/b18acdc8900f46302bf1601ace47eee87f418e1c) | gridTransition.js 组织透视空间和队列 | 借鉴空间匹配，省略画廊 runtime |
| [Interlude](https://github.com/codrops/interlude) | lifecycle.ts 管理注册、清理和交接。在线 Demo 可访问 | 采用清理与降级思路，React 单页不引入 Astro |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber/tree/d74622ea8ed717f7212d7e19d65ff3e325508389) | loop.ts 处理帧订阅与渲染 | 集成共享 Canvas 和 useFrame |
| [Drei](https://github.com/pmndrs/drei/tree/bf6f4addf47467d3885de272d94ca5127f6ef68f) | OrbitControls.tsx 在帧循环中更新相机，卸载清理事件 | 集成 OrbitControls 和 Html 标注 |
| [r3f-scroll-rig](https://github.com/14islands/r3f-scroll-rig/tree/123663599e4b31af56f1845a19132d17e6a9b81f) | GlobalCanvas 管理固定画布和异常边界 | 保留单 Canvas 思路，避免第二个滚动协调器 |
| [Lenis](https://github.com/darkroomengineering/lenis) | 官方 GSAP 同步方案依赖同一 ticker，转发 scroll 通知 | 集成桌面平滑滚动，触摸保留原生滚动 |
| [React Postprocessing](https://github.com/pmndrs/react-postprocessing/tree/e07ef9a890c8a202a3b20eac0249032cff4e7805) | EffectComposer 接管渲染和缓冲 | 首版以材质和灯光控制开销 |
| [Theatre](https://github.com/theatre-js/theatre/tree/6ea82b938ea49609489f6377ded693ccc6ee8f5b) | R3F 示例采用独立编排状态 | 使用代码分镜和 GSAP，避免需要同步两条时间线 |
| [GSAP Skills](https://github.com/greensock/gsap-skills) | 阅读 core、timeline、plugins、scrolltrigger、react 和 performance | 使用可定位时间线、刷新及对应清理 |
| [scroll-craft](https://github.com/nateherkai/scroll-craft) | 阅读 SKILL.md 及 feel、taste、devices、hero-depth、worldflight、verify 等参考 | 采用构图、节奏与逐帧浏览器验证。运行时使用任务指定实时三维 |

Tympanus 的 11 个 Seam 页面及 4 个独立示例在本机 Chrome 请求返回 HTTP 403。相关结论来自可读源码及项目文档。Interlude Demo 返回 HTTP 200。复测脚本见 scripts/reference-demos.mjs。
