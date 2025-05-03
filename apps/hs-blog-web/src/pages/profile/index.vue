<script setup lang="ts">
  import { useProfileSEO } from './components/useProfileSEO'
  import { getProfileInfo } from '~/api/user'
  import { HttpStatus } from '~/enums/httpStatus'

  definePageMeta({
    layout: 'default'
  })

  const message = useMessage()

  const { data: personalInfo } = await useAsyncData('profile', () => getProfileInfo(), {
    default() {
      return {
        message: '获取失败',
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {
          name: '',
          title: '',
          description: '',
          bio: [],
          skills: [
            {
              name: '',
              items: []
            }
          ],
          projects: [
            {
              name: '',
              description: '',
              tech: [],
              link: ''
            }
          ],
          contacts: [
            {
              platform: '',
              link: '',
              icon: ''
            }
          ],
          seo: {
            title: '',
            description: '',
            keywords: '',
            ogDescription: '',
            twitterDescription: ''
          }
        }
      }
    }
  })

  useProfileSEO(personalInfo.value.data.seo)

  const copyEmail = () => {
    navigator.clipboard.writeText('1726941245@qq.com')
    message.success('邮箱已复制到剪贴板')
  }
</script>

<template>
  <main class="wrap">
    <section class="intro">
      <div class="avatar-container">
        <nuxt-img size="120" src="img/avatar.jpg" format="webp" />
      </div>
      <h1 class="title">{{ personalInfo.data.name }}</h1>
      <h2 class="subtitle">{{ personalInfo.data.title }}</h2>
      <p class="description">{{ personalInfo.data.description }}</p>
      <div class="bio-list">
        <p v-for="(item, index) in personalInfo.data.bio" :key="index" class="bio-item">
          {{ item }}
        </p>
      </div>
    </section>

    <div class="wrap-container">
      <section class="github-stats">
        <h2 class="section-title">GitHub statistics</h2>
        <div class="stats-container">
          <nuxt-img
            src="https://ghchart.rshah.org/1E80FF/huoshan25"
            size="120"
            loading="lazy"
            format="webp"
            alt="GitHub Contribution Graph"
            class="w-full h-auto rounded-[8px]"
          />
          <div class="github-metrics">
            <nuxt-img
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=huoshan25&layout=compact&title_color=1E80FF"
              loading="lazy"
              format="webp"
              alt="commonLanguage"
              class="w-full h-auto rounded-[8px]"
            />
            <nuxt-img
              src="https://github-profile-summary-cards.vercel.app/api/cards/productive-time?username=huoshan25"
              loading="lazy"
              format="webp"
              alt="commits"
              class="w-full h-auto rounded-[8px]"
            />
            <nuxt-img
              src="https://github-readme-stats.vercel.app/api?username=huoshan25&show_icons=true&title_color=1E80FF"
              loading="lazy"
              format="webp"
              alt="stats统计"
              class="w-full h-auto rounded-[8px]"
            />
            <nuxt-img
              src="https://github-readme-streak-stats.herokuapp.com/?user=huoshan25&ring=1E80FF&fire=1E80FF&currStreakLabel=1E80FF"
              loading="lazy"
              format="webp"
              alt="streak"
              class="w-full h-auto rounded-[8px]"
            />
          </div>
        </div>
      </section>

      <section class="skills">
        <h2 class="section-title">技术栈</h2>
        <div class="skills-container">
          <div v-for="(category, index) in personalInfo.data.skills" :key="index" class="skill-category">
            <h3 class="category-title">{{ category.name }}</h3>
            <div class="skill-list">
              <div v-for="(skill, skillIndex) in category.items" :key="skillIndex" class="skill-item">
                <div class="skill-tag">
                  {{ skill.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="projects">
        <h2 class="section-title">个人项目</h2>
        <div class="projects-grid">
          <n-card v-for="(project, index) in personalInfo.data.projects" :key="index" class="project-card" hoverable>
            <template #header>
              <div class="project-header">
                <h3>{{ project.name }}</h3>
                <n-button text type="primary" :href="project.link" target="_blank" tag="a">查看项目</n-button>
              </div>
            </template>
            <p>{{ project.description }}</p>
            <div class="project-tech">
              <n-tag v-for="(tech, techIndex) in project.tech" :key="techIndex" size="small" class="tech-tag">
                {{ tech }}
              </n-tag>
            </div>
          </n-card>
        </div>
      </section>

      <section class="contact">
        <h2 class="section-title">联系方式</h2>
        <div class="contact-links">
          <n-button
            v-for="(contact, index) in personalInfo.data.contacts"
            :key="index"
            tag="a"
            class="contact-btn"
            :href="contact.link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <template #icon>
              <nuxt-img class="h-[22px]" :src="contact.icon" format="webp" />
            </template>
            {{ contact.platform }}
          </n-button>
          <n-button @click="copyEmail" class="contact-btn">
            <template #icon>
              <nuxt-img class="h-[20px]" src="/svg/copy.svg" format="webp" />
            </template>
            复制邮箱
          </n-button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100%;
    background-color: #f5f5f5;
    padding: 0 16px;

    &-container {
      width: 860px;
      max-width: 100%;
      padding: 40px 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

      @media (max-width: 768px) {
        padding: 24px 16px;
        margin: 0 -16px;
        border-radius: 0;
      }
    }
  }

  .intro {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(-90deg, #00bcd4 0, #1890ff 100%);
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    margin-bottom: 30px;
    padding: 0 16px 15px;
    margin-top: 100px;
    text-align: center;

    @media (max-width: 768px) {
      margin-top: 80px;
      margin-bottom: 20px;
      border-radius: 8px;
    }

    .avatar-container {
      margin-bottom: 20px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 85px;
      width: 120px;
      height: 120px;
      padding: 4px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      @media (max-width: 768px) {
        width: 100px;
        height: 100px;
        top: 65px;
      }

      &:hover {
        transform: translateX(-50%) translateY(-3px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      }

      & > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .title {
      padding-top: 75px; // Adjusted for smaller avatar
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);

      @media (max-width: 768px) {
        padding-top: 60px;
        font-size: 1.8rem;
        margin-bottom: 6px;
      }
    }

    .subtitle {
      font-size: 1.5rem;
      font-weight: 500;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      margin-bottom: 16px;

      @media (max-width: 768px) {
        font-size: 1.2rem;
        margin-bottom: 12px;
      }
    }

    .description {
      font-size: 1.1rem;
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      line-height: 1.6;
      margin-bottom: 24px;

      @media (max-width: 768px) {
        font-size: 1rem;
        margin-bottom: 16px;
        padding: 0 12px;
      }
    }

    .bio-list {
      text-align: left;
      max-width: 600px;
      margin: 0 auto;
      padding: 0 16px;

      @media (max-width: 768px) {
        padding: 0 12px;
      }

      .bio-item {
        margin: 8px 0;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        font-size: 1rem;
        line-height: 1.6;

        @media (max-width: 768px) {
          font-size: 0.9rem;
          margin: 6px 0;
        }
      }
    }
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 24px;
    color: #2c3e50;
    position: relative;
    padding-bottom: 8px;

    @media (max-width: 768px) {
      font-size: 1.3rem;
      margin-bottom: 20px;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 40px;
      height: 3px;
      background-color: #1e80ff;
    }
  }

  .github-stats {
    margin-bottom: 48px;

    @media (max-width: 768px) {
      margin-bottom: 32px;
    }

    .stats-container {
      display: flex;
      flex-direction: column;
      gap: 20px;

      @media (max-width: 768px) {
        gap: 16px;
      }
    }

    .github-metrics {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }

  .skills {
    margin-bottom: 48px;

    @media (max-width: 768px) {
      margin-bottom: 32px;
    }

    .skills-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
      padding: 1rem;

      @media (max-width: 768px) {
        gap: 0.6rem;
        padding: 0.8rem;
      }
    }

    .skill-tag {
      margin-right: 6px;
      padding: 0.6rem 1.2rem;
      background: #f5f7fa;
      border-radius: 20px;
      font-size: 0.8rem;
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s;

      @media (max-width: 768px) {
        padding: 0.5rem 1rem;
        font-size: 0.75rem;
      }
    }

    .skills-container {
      display: flex;
      flex-direction: column;
    }

    .skill-category {
      margin-bottom: 5px;

      .category-title {
        font-size: 1.2rem;
        margin-bottom: 16px;
        color: #444;

        @media (max-width: 768px) {
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
      }

      .skill-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        @media (max-width: 768px) {
          gap: 6px;
        }
      }
    }
  }

  .projects {
    margin-bottom: 48px;

    @media (max-width: 768px) {
      margin-bottom: 32px;
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }

    .project-card {
      height: 100%;

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        h3 {
          margin: 0;
          color: #2c3e50;
          font-size: 1.1rem;

          @media (max-width: 768px) {
            font-size: 1rem;
          }
        }
      }

      .project-tech {
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        @media (max-width: 768px) {
          margin-top: 10px;
          gap: 6px;
        }
      }
    }
  }

  .contact {
    .contact-links {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        gap: 12px;
        justify-content: center;
      }
    }

    .contact-btn {
      min-width: 120px;

      @media (max-width: 768px) {
        min-width: 110px;
        font-size: 0.9rem;
      }
    }
  }
</style>
