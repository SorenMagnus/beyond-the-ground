# Scene architecture

React 19 + R3F 9，Three.js，Drei。Vite 静态构建，hash 锚点，Pages 子路径兼容。

## Flow
Native scroll / Lenis → section rects → scene index + progress → deterministic SceneState → persistent World/Camera/Aircraft/Material uniforms.
单独 R3F 渲染循环读取同一状态，不创建第二个滚动控制器。GSAP ticker 驱动 Lenis；Lenis 通知 ScrollTrigger；refresh 在字体、尺寸变化后重测。

## Ownership
story：时间线控制相机。inspect：OrbitControls 独占相机。return：禁用 OrbitControls，插值回当前叙事目标。输入和计算独立于动画；滚动离开检查器会退出 inspect，不锁文档。

## Interfaces
SceneState：scene, progress, scan, explode, tilt, city, morph, portal, camera/target。
PartDefinition：id, label, evidence, rest transform, explode vector, tilt pivot。
EvidenceClaim：id, title, url, publisher, published/checked, kind fact/target/assumption。
EngineeringInputs/Result 与 BusinessInputs/Result：SI内部计算，UI换算，非法输入及不可行情景明确返回状态。

## Lifetime and failure
Canvas 仅一个。几何和材质 useMemo 创建，GPU资源在卸载时清理，React useGSAP/context 清理触发器。不在每帧调用 React setState。
全局 error boundary、WebGL检查、context-lost 事件切换静态图。纯 DOM/SVG 数值模块继续可用。
城市实例化、移动限制DPR、无重型实时阴影、按需加载世界。首帧是可读静态壳，不等待网络纹理或模型。

## Dependencies rejected
不集成 r3f-scroll-rig：避免与 Lenis 重叠。
不集成 Theatre：可逆状态由代码分镜确定，无编辑器状态同步需求。
不集成 Interlude：Astro导航生命周期不适用于当前React单页，仅借鉴清理与恢复。
首版不用 postprocessing：依靠照明、雾、真实材质建立层次，保留GPU预算；只有实测余量允许再加。
