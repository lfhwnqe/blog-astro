import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import remarkMermaid from 'remark-mermaidjs';

// https://astro.build/config
export default defineConfig({
  // base: '.', // Set a path prefix.
  site: 'https://example.com/', // Use to generate your sitemap and canonical URLs in your final build.
  trailingSlash: 'always', // Use to always append '/' at end of url
  markdown: {
    // shikiConfig: {
    //   // Choose from Shiki's built-in themes (or add your own)
    //   // https://github.com/shikijs/shiki/blob/main/docs/themes.md
    //   theme: 'monokai',
    // },
    remarkPlugins: [remarkMermaid],

    syntaxHighlight: false,
  },
  integrations: [react(), tailwind({}), sitemap(), robotsTxt()],
});
