# BEYOND THE GROUND

《飞行汽车技术基础》课程研究。通过同一架原创三维飞行器探索 Joby S4 的构型、工程、城市应用与商业可行性。飞行器外形按公开资料独立建模，内部结构、计算参数及运营情景均为教学示意。

[公开网站](https://sorenmagnus.github.io/beyond-the-ground/)

使用 Node.js 24，运行 `npm ci` 后运行 `npm run dev`。三个浏览器原型分别位于 `/?prototype=1`、`/?prototype=2`、`/?prototype=3`。`npm test` 运行计算与场景测试，`npm run build` 生成静态站点。启动开发服务器后可用已安装的 Chrome 执行 `npm run qa`。

- [艺术指导](docs/art-direction.md)与[镜头分镜](docs/motion-storyboard.md)
- [场景架构](docs/scene-architecture.md)与[交互规范](docs/interaction-spec.md)
- [开源研究](docs/open-source-research.md)与[航空研究和素材](docs/research.md)
- [浏览器验收](docs/visual-qa.md)

GitHub Pages 使用 Actions 发布 `dist/`。源码入口为仓库根目录的 `index.html`。
