import type { ArticleDetails } from "~/api/post/type";

/**
 * 设置文章的 SEO优化
 * @param article
 */
export const useArticleSEO = (article: ArticleDetails | undefined) => {
  // 如果文章不存在，直接返回
  if (!article) return;
  
  const config = useRuntimeConfig();
  const route = useRoute();
  
  // 添加空值检查，确保 tags 存在
  const tagsList = article.tags?.map(tag => tag.name) || [];

  useHead({
    title: article.title,
    titleTemplate: title => `${title} - 火山博客`,

    meta: [
      {
        "data-n-head": "ssr",
        name: "description",
        content: article.description || `${article.title} - 火山博客`
      },
      {
        "data-n-head": "ssr",
        name: "keywords",
        content: [...tagsList, "博客", "技术文章"].flat().filter(Boolean).join(",")
      },
      {
        "data-n-head": "ssr",
        name: "author",
        content: "火山"
      },

      {
        "data-n-head": "ssr",
        name: "robots",
        //是否允许搜索引擎收录此文章
        // content: article.isPublished ? "index, follow" : "noindex, nofollow"
        content: "index, follow"
      },

      // Open Graph 协议 (Facebook、领英等)
      {
        "data-n-head": "ssr",
        property: "og:type",
        content: "article"
      },
      {
        "data-n-head": "ssr",
        property: "og:title",
        content: article.title
      },
      {
        "data-n-head": "ssr",
        property: "og:description",
        content: article.description
      },
      {
        "data-n-head": "ssr",
        property: "og:url",
        content: `${config.public.siteUrl}${route.path}`
      },
      {
        "data-n-head": "ssr",
        property: "og:site_name",
        content: "火山博客"
      },
      {
        "data-n-head": "ssr",
        property: "article:published_time",
        content: article.publish_time
      },
      {
        "data-n-head": "ssr",
        property: "article:modified_time",
        content: article.update_time
      },
      {
        "data-n-head": "ssr",
        property: "article:author",
        content: "火山"
      }
      // 如果有封面图
      // article.cover && {
      //   "data-n-head": "ssr",
      //   property: "og:image",
      //   content: article.cover
      // },

      /*Twitter*/
      // {
      //   name: 'twitter:card',
      //   content: 'summary_large_image'
      // },
      // {
      //   name: 'twitter:title',
      //   content: article.title
      // },
      // {
      //   name: 'twitter:description',
      //   content: article.description || article.summary
      // },
      // 如果有封面图
      // article.cover && {
      //   "data-n-head": "ssr",
      //   name: "twitter:image",
      //   content: article.cover
      // }
    ].filter(Boolean), // 过滤掉 undefined 的项

    // 添加规范链接
    link: [
      {
        "data-n-head": "ssr",
        rel: "canonical",
        href: `${config.public.siteUrl}${route.path}`
      }
    ],

    // 添加结构化数据
    script: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          author: {
            "@type": "Person",
            name: "火山"
          },
          datePublished: article.create_time,
          dateModified: article.update_time,
          publisher: {
            "@type": "Organization",
            name: "火山博客",
            logo: {
              "@type": "ImageObject",
              url: `${config.public.siteUrl}/svg/logo.svg`
            }
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${config.public.siteUrl}${route.path}`
          }
          // 如果有封面图
          // ...(article.cover && {
          //   image: {
          //     "@type": "ImageObject",
          //     url: article.cover
          //   }
          // })
        })
      }
    ]
  });
};
