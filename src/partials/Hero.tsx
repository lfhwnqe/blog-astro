import {
  GradientText,
  HeroAvatar,
  HeroSocial,
  Section,
} from 'astro-boilerplate-components';

const Hero = () => (
  <Section>
    <HeroAvatar
      title={
        <>
          你好, 我是 <GradientText>李诺</GradientText> 👋
        </>
      }
      description={
        <>
          我是一名资深的前端工程师，对技术充满热情。不仅专注于代码开发，还深入研究基于威科夫理论的交易策略。近十年来在前端领域不断探索与实践，积累了丰富经验，并始终乐于分享心得。目前，我在深圳一边追求技术创新，一边不断突破自我。
          <a className="text-cyan-400 hover:underline" href="/"></a>{' '}
          欢迎来到我的个人博客
        </>
      }
      avatar={
        <img
          className="h-80 w-64"
          src="/assets/images/avatar.svg"
          alt="Avatar image"
          loading="lazy"
        />
      }
      socialButtons={
        <>
          <a href="/">
            <HeroSocial
              src="/assets/images/twitter-icon.png"
              alt="Twitter icon"
            />
          </a>
          <a href="/">
            <HeroSocial
              src="/assets/images/facebook-icon.png"
              alt="Facebook icon"
            />
          </a>
          <a href="/">
            <HeroSocial
              src="/assets/images/linkedin-icon.png"
              alt="Linkedin icon"
            />
          </a>
          <a href="/">
            <HeroSocial
              src="/assets/images/youtube-icon.png"
              alt="Youtube icon"
            />
          </a>
        </>
      }
    />
  </Section>
);

export { Hero };
