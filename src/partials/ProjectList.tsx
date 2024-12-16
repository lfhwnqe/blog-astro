import {
  ColorTags,
  GradientText,
  Project,
  Section,
  Tags,
} from 'astro-boilerplate-components';

const ProjectList = () => (
  <Section
    title={
      <>
        Recent <GradientText>Projects</GradientText>
      </>
    }
  >
    <div className="flex flex-col gap-6">
      <Project
        name="顺丰科技门户应用"
        description={`负责前后端不分离巨石java应用（1000+页面）=> 前后端分离（100天极限重构）
        => 微前端架构（分领域开发）`}
        link="/"
        img={{
          src: '/assets/images/project-web-design.png',
          alt: 'Project Web Design',
        }}
        category={
          <>
            <Tags color={ColorTags.FUCHSIA}>React.js</Tags>
            <Tags color={ColorTags.SKY}>Atomic State</Tags>
            <Tags color={ColorTags.LIME}>Antd Design</Tags>
            <Tags color={ColorTags.SKY}>Umi</Tags>
            <Tags color={ColorTags.ROSE}>TypeScript</Tags>
            <Tags color={ColorTags.LIME}>Qiankun</Tags>
            <Tags color={ColorTags.ROSE}>Nginx</Tags>
          </>
        }
      />
      <Project
        name="前端基建"
        description={`提炼基础业务工具链(实现业务组件+hooks+cli) => 推进全领域统一工具链(风险掌控，准时切换) `}
        link="/"
        img={{ src: '/assets/images/project-maps.png', alt: 'Project Maps' }}
        category={
          <>
            <Tags color={ColorTags.FUCHSIA}>React.js</Tags>
            <Tags color={ColorTags.SKY}>Monorepo</Tags>
            <Tags color={ColorTags.SKY}>Pnpm</Tags>
            <Tags color={ColorTags.SKY}>Lerna</Tags>
            <Tags color={ColorTags.SKY}>Dumi</Tags>
            <Tags color={ColorTags.LIME}>Antd Design</Tags>
            <Tags color={ColorTags.ROSE}>TypeScript</Tags>
          </>
        }
      />
      <Project
        name="灰度功能搭建"
        description={`设计基于网关能力的全链路灰度方案(微应用粒度级灰度) => 不同部署架构前端应用对应不同链路(Nginx与Oss) 
          => 域名、clb、网关、网关插件、网关分流、k8s ingress、service、nginx、oss`}
        link="/"
        img={{ src: '/assets/images/project-fire.png', alt: 'Project Fire' }}
        category={
          <>
            <Tags color={ColorTags.FUCHSIA}>Gateway</Tags>
            <Tags color={ColorTags.SKY}>K8s</Tags>
            <Tags color={ColorTags.LIME}>Oss</Tags>
            <Tags color={ColorTags.ROSE}>Nginx</Tags>
          </>
        }
      />
      <Project
        name="建立React应用性能标准"
        description={`设计react性能监控工具 => 引入组件粒度级监控无效渲染 => 设立性能指标推出最佳实践 
          => 全中心应用低性能电脑(5代i3级)复杂联动表单页面交互稳定60fps(业务复杂页面文件合计2w行+代码，巨量表单数据联动)`}
        link="/"
        img={{
          src: '/assets/images/project-web-design.png',
          alt: 'Project Web Design',
        }}
        category={
          <>
            <Tags color={ColorTags.FUCHSIA}>React.js</Tags>
            <Tags color={ColorTags.SKY}>Atomic State</Tags>
            <Tags color={ColorTags.SKY}>Immutable State</Tags>
            <Tags color={ColorTags.LIME}>React Profiler</Tags>
            <Tags color={ColorTags.SKY}>Why Did You Render</Tags>
          </>
        }
      />
      <Project
        name="架构束缚下的极致lcp"
        description={`umi+qiankun迁移难度大+业务持续高频迭代（4-8秒lcp） => 无法替换技术栈引入ssr/module federation以升级lcp表现 
          => 设计基于旧架构秒级lcp方案 
          => 困难点：
          1. 开发体验，保持原样（外包同学难理解同构开发，易出错）
          2. 低成本，保持使用nginx + oss部署架构(ssr方案由于机器数量限制不适用公司云)
          3. 业务无感知（原有业务 0 变动）
          => 实现1秒内lcp(灰度验证中)`}
        link="/"
        img={{ src: '/assets/images/project-maps.png', alt: 'Project Maps' }}
        category={
          <>
            <Tags color={ColorTags.FUCHSIA}>Koa</Tags>
            <Tags color={ColorTags.SKY}>Nginx</Tags>
            <Tags color={ColorTags.LIME}>Puppeteer</Tags>
            <Tags color={ColorTags.SKY}>Lazy Render</Tags>
            <Tags color={ColorTags.ROSE}>Cdn</Tags>
            <Tags color={ColorTags.SKY}>Split Chunk</Tags>
          </>
        }
      />
    </div>
  </Section>
);

export { ProjectList };
