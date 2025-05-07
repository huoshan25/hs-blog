<script setup lang="ts">
const { back } = useRouter()
</script>

<template>
  <div class="terms-container">
    <div class="header">
      <n-button circle quaternary @click="back">
        <template #icon>
          <n-icon size="18">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </n-icon>
        </template>
      </n-button>
      <h2 class="title">服务条款</h2>
    </div>
    
    <div class="content">
      <p class="intro">欢迎使用火山博客！请仔细阅读以下条款，使用我们的服务即表示您同意这些条款。</p>
      
      <h3>1. 接受条款</h3>
      <p>通过访问或使用火山博客，您同意受本服务条款的约束。如果您不同意这些条款的任何部分，请不要使用我们的服务。</p>
      
      <h3>2. 用户账号</h3>
      <p>在使用火山博客的某些功能时，您可能需要创建一个账号。您有责任：</p>
      <ul>
        <li>提供准确、真实的信息</li>
        <li>保持密码的机密性</li>
        <li>对您账号下的所有活动负责</li>
      </ul>
      <p>我们保留在任何时候删除或禁用账号的权利，如果我们认为用户违反了这些条款。</p>
      
      <h3>3. 用户内容</h3>
      <p>您保留对您在火山博客上发布的内容的所有权。通过发布内容，您授予我们非排他性的、免费的、全球范围内的许可，允许我们在提供服务过程中使用、修改、展示和分发这些内容。</p>
      <p>您承诺您提交的内容：</p>
      <ul>
        <li>是您个人原创或您拥有分享权利</li>
        <li>不侵犯任何第三方权利</li>
        <li>符合所有适用法律法规</li>
      </ul>
      
      <h3>4. 禁止行为</h3>
      <p>使用火山博客时，您不得：</p>
      <ul>
        <li>发布违法、有害、威胁、滥用、骚扰、诽谤、淫秽的内容</li>
        <li>冒充他人或虚假陈述您与任何人或实体的关系</li>
        <li>尝试未经授权访问火山博客的系统或网络</li>
        <li>干扰或中断服务或服务器</li>
        <li>传播恶意软件、病毒或其他破坏性代码</li>
      </ul>
      
      <h3>5. 服务变更</h3>
      <p>我们可能会不时修改、暂停或中断部分或全部服务，恕不另行通知。我们不对任何此类修改、暂停或中断承担责任。</p>
      
      <h3>6. 终止</h3>
      <p>我们可能会因任何理由或无理由在任何时候终止您对服务的使用，恕不另行通知。终止后，您访问服务的权利将立即停止。</p>
      
      <h3>7. 免责声明</h3>
      <p>火山博客"按原样"提供，没有任何形式的明示或暗示保证。我们不保证服务将是安全的、不间断的、及时的、无错误的或符合您的要求的。</p>
      
      <h3>8. 责任限制</h3>
      <p>在适用法律允许的最大范围内，火山博客及其关联方、员工、管理人员或代理人不对因使用或无法使用本服务引起的任何直接、间接、附带、特殊、惩罚性或后果性损害负责。</p>
      
      <h3>9. 适用法律</h3>
      <p>这些条款及您与火山博客之间的关系受中华人民共和国法律的管辖，不考虑法律冲突原则。</p>
      
      <h3>10. 联系我们</h3>
      <p>如您对本服务条款有任何疑问，请通过电子邮件联系我们：terms@huoshan-blog.com</p>
    </div>
  </div>
</template>

<style scoped>
.terms-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  margin: 0 0 0 12px;
  font-size: 20px;
  color: #333;
}

.content {
  line-height: 1.6;
}

.intro {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

h3 {
  margin-top: 20px;
  margin-bottom: 12px;
  font-size: 18px;
  color: #333;
}

p {
  margin-bottom: 16px;
  color: #555;
}

ul {
  margin-bottom: 16px;
  padding-left: 24px;
  color: #555;
}

li {
  margin-bottom: 8px;
}
</style> 