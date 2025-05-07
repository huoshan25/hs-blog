<script setup lang="ts">
const { back } = useRouter()
</script>

<template>
  <div class="privacy-container">
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
      <h2 class="title">隐私政策</h2>
    </div>
    
    <div class="content">
      <p class="intro">本隐私政策描述了我们如何收集、使用和保护您的个人信息。我们重视您的隐私，并尽一切努力保护您的个人数据。</p>
      
      <h3>1. 我们收集的信息</h3>
      <p>我们可能收集以下类型的信息：</p>
      <ul>
        <li><strong>账号信息</strong>：注册时您提供的信息，如用户名、电子邮件和密码</li>
        <li><strong>个人资料信息</strong>：您选择添加到个人资料的信息，如头像、个人简介等</li>
        <li><strong>内容数据</strong>：您在我们平台上发布或分享的内容</li>
        <li><strong>使用数据</strong>：有关您如何使用我们服务的信息，如访问时间、浏览页面等</li>
        <li><strong>设备信息</strong>：有关您用于访问服务的设备的信息，如IP地址、浏览器类型等</li>
      </ul>
      
      <h3>2. 我们如何使用信息</h3>
      <p>我们使用收集的信息来：</p>
      <ul>
        <li>提供、维护和改进我们的服务</li>
        <li>处理和完成您的请求</li>
        <li>发送服务通知和支持消息</li>
        <li>保护我们服务的安全性</li>
        <li>个性化您的体验</li>
      </ul>
      
      <h3>3. 信息共享与披露</h3>
      <p>除以下情况外，我们不会与第三方共享您的个人信息：</p>
      <ul>
        <li>经您同意</li>
        <li>为遵守法律法规、法院命令或政府要求</li>
        <li>保护火山博客或用户的权利、财产或安全</li>
      </ul>
      
      <h3>4. 数据安全</h3>
      <p>我们采取合理的安全措施保护您的个人信息，防止未经授权的访问或披露。但请注意，互联网传输不能保证100%安全。</p>
      
      <h3>5. 您的权利</h3>
      <p>根据适用法律，您可能拥有以下权利：</p>
      <ul>
        <li>访问您的个人数据</li>
        <li>更正不准确的数据</li>
        <li>删除您的个人数据</li>
        <li>限制或反对处理您的数据</li>
        <li>数据可携带性</li>
      </ul>
      
      <h3>6. Cookie政策</h3>
      <p>我们使用cookie和类似技术来提供、保护和改进我们的服务。Cookie允许我们记住您的偏好并优化您的体验。</p>
      
      <h3>7. 政策变更</h3>
      <p>我们可能会不时更新本隐私政策。当我们进行重大更改时，我们将通过在网站上发布新政策或发送通知来告知您。</p>
      
      <h3>8. 联系我们</h3>
      <p>如果您对本隐私政策有任何疑问，请通过电子邮件联系我们：privacy@huoshan-blog.com</p>
    </div>
  </div>
</template>

<style scoped>
.privacy-container {
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

strong {
  font-weight: 600;
  color: #444;
}
</style> 