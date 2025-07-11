import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'RigVe',
  tagline: 'Tools for the modern developer',
  favicon: 'img/favicon.png',

  // Set the production url of your site here
  url: 'https://raghava-ch.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/rigve-tool/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'raghava-ch', // Usually your GitHub org/user name.
  projectName: 'rigve-tool', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Raghava-Ch/RigVe/tree/main/website',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/Raghava-Ch/RigVe/tree/main/website',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Declare some <meta> tags
    metadata: [
      {name: 'keywords', content: 'static-analysis, developer-tools, software-architecture, interactive-diagrams, code-visualization, program-structure, code-mapping, code-flow, code-insights, code-analysis-tools, code-dependency-analysis, code-debugging, c-code-visualizer, code-diagram-generator, source-code-diagrams'},
    ],
    // Replace with your project's social card
    // image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'RigVe',
      logo: {
        alt: 'RigVe Logo',
        src: 'img/brand.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'documentationSidebar',
          position: 'left',
          label: 'Documentation',
        },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          href: 'https://github.com/Raghava-Ch/RigVe',
          label: 'GitHub',
          position: 'right',
        },
        {
          sidebarId: 'documentationSidebar',
          position: 'left',
          label: 'Purchase',
          to: "/docs/purchase"
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Documentation',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/Raghava-Ch/RigVe/issues',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/HaxSNvv3sE',
            },
            // {
            //   label: 'X',
            //   href: 'https://x.com/docusaurus',
            // },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Raghava-Ch/RigVe',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} RigVe Project.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
  headTags: [
    // Declare a <link> preconnect tag
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://raghava-ch.github.io',
      },
    },
    // Declare some json-ld structured data
    // {
    //   tagName: 'script',
    //   attributes: {
    //     type: 'application/ld+json',
    //   },
    //   innerHTML: JSON.stringify({
    //     '@context': 'https://schema.org/',
    //     '@type': 'Organization',
    //     name: 'Meta Open Source',
    //     url: 'https://opensource.fb.com/',
    //     logo: 'https://opensource.fb.com/img/logos/Meta-Open-Source.svg',
    //   }),
    // },
  ],
};

export default config;
