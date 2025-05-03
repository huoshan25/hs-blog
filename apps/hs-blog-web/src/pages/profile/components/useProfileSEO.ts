import type { Seo } from "~/api/user";

export const useProfileSEO = (seo: Seo) => {
  const config = useRuntimeConfig();
  const route = useRoute();

  useHead({
    title: seo.title || "关于我",
    titleTemplate: titleChunk => `${titleChunk} - 火山博客`,
    meta: [
      { name: "description", content: seo.description },
      { name: "keywords", content: seo.keywords },

      { property: "og:type", content: "profile" },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.ogDescription },
      { property: "og:url", content: route.fullPath },

      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.twitterDescription }
    ],
    link: [
      {
        "data-n-head": "ssr",
        rel: "canonical",
        href: `${config.public.siteUrl}${route.path}`
      }
      // TODO: 当前页面url暂时空着
      // { rel: 'canonical', href: '' }
    ],
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          mainEntity: {
            "@type": "Person",
            name: "火山",
            jobTitle: "Web前端开发工程师",
            description: "建立广泛的知识储备，专注深耕前端技术栈，热爱技术，热爱开源，持续学习中...",
            // TODO: 当前页面url暂时空着
            url: "",
            sameAs: ["https://github.com/huoshan25", "https://juejin.cn/user/46604556441571"],
            knowsAbout: ["Vue.js", "Nuxt.js", "TypeScript", "React.js", "Next.js", "Nest.js", "FastAPI", "MySQL"],
            email: "1726941245@qq.com"
          },
          publisher: {
            "@type": "Organization",
            name: "火山博客",
            logo: {
              "@type": "ImageObject",
              url: `${config.public.siteUrl}/svg/logo.svg`
            }
          }
          // TODO: 当前页面url暂时空着
          // url: ''
        })
      }
    ]
  });
};
