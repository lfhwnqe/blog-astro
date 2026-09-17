# 交易复盘发布

沿用本项目 Astro 4 的 Markdown 页面及交易日记列表。没有新增常驻服务。

## 调用合同

Node 20 或更新版本，先在博客执行 `npm ci`（包括现有 Mermaid 所需 Chromium）。
来源流程先完成总结、无损压缩、上传及匿名取回验证，再保存成功 stdout JSON 到该复盘目录的 `finish-result.json`。
只有凭证 `status=complete` 且 `timeline_sha256` 匹配源文件时允许导入。正文的每张图片必须同时匹配凭证、`screenshots/sources.json` 中压缩文件的哈希和已验证上传记录。

```sh
node /Volumes/macmini-disk/codes/blog-astro/scripts/trade-review.mjs \
  --review /Volumes/macmini-disk/codes/trade-codes/trade-analysis-system/reviews/2026-09-17-SOLUSDC.P-01 \
  --receipt /Volumes/macmini-disk/codes/trade-codes/trade-analysis-system/reviews/2026-09-17-SOLUSDC.P-01/finish-result.json \
  --publish
```

`--receipt` 默认指向复盘目录内 `finish-result.json`。模式必须选一个：

- `--preview`：验证公网图片并输出转换后的 Markdown，不写文件。
- `--import`：验证图片、写入本地文章、执行完整构建，不提交或推送。构建失败保留生成文章供排查。
- `--publish`：从配置中的生产分支临时 clone，比较文章；无变化直接退出。变化时匿名取回图片再次核对哈希，安装锁定依赖、完整构建、只提交该文章、普通 push 触发现有 Netlify。临时目录最后清理。

最后一行是 JSON。退出码 0、`status=published` 表示 Git 推送成功，`status=unchanged` 表示远端已有完全相同文章；均返回 commit 和 url。这不等同 Netlify 已部署完成。非零退出码表示失败，来源流程须保留凭证并报告真实失败；不能声称发布成功。网络或并发推送失败后可以原命令重试。来源正文若变动，必须重新结束流程生成匹配凭证。

## 文章转换

`title → title`、`summary → description`、`date → pubDate`（北京时间零点）、首图 → `imgSrc/imgAlt`；使用 `@/templates/BasePost.astro`。标签保留并添加“交易复盘”。正文原意保持，取消机会不转写为成交或盈利案例。

规范 review-id（例如 `2026-09-17-SOLUSDC.P-01`）固定映射到 `src/pages/posts/trade/reviews/2026-09-17-solusdc.p-01.md`，修改标题或内容仍更新同一篇。现有文章没有对应 reviewId 时拒绝覆盖。

导出删除 `local-evidence`（兼容旧 `local-originals`）标记包围的完整块。只复制公开 frontmatter 白名单；拒绝原始 HTML、本地路径、来源会话 ID、凭据、签名 URL、未经准许的图片域名和未完成上传。博客不保存来源 manifest、结束凭证、原图二进制或原始聊天。

## Git 与部署边界

`scripts/trade-review.config.json` 固定远端、已核实的生产分支、站点 URL 和 CDN 域名。生产配置未核实时 `--publish` 关闭，不能把默认分支当作生产分支。仓库当前存在 Netlify push webhook 和 `netlify.toml`，构建命令为 `npm run build`、输出目录 `dist`。

发布使用全新临时 clone，不暂存、重置、清理或推送原博客工作区，不携带用户未提交改动或本地领先提交。拒绝强推，远端并发更新时普通 push 失败，重新调用即可。新增的发布基础代码需要先按明确文件名单单独提交并集成；每次发布只产生文章提交。

2026-09-17 已从登录后的 Netlify 项目 `beautiful-strudel-62663b` 核实：绑定 `lfhwnqe/blog-astro`，生产分支为 `main`，正式站点为 `https://blog.maomaocong.com/`。第一篇复盘对应 `fe1fcde`，生产部署状态为 Published（当日 22:23）。这些值已写入发布配置，后续无需每篇重复询问。每篇仍须提供真实上传完成凭证；推送后检查 Netlify 对应 commit 构建结果，以及文章 URL、交易列表和图片。

```sh
node --test tests/trade-review.test.mjs
npm run build
```

自动测试覆盖字段转换与脱敏、陈旧/部分完成凭证拒绝、图片响应哈希、重复执行、禁止覆盖手写文章、构建失败不推送、临时 Git 仓库仅提交本篇且保留本地用户暂存内容。Git 集成测试模拟 npm 构建，实际 Astro 构建另行执行。
