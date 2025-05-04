<script setup lang="ts">
defineEmits<{
  (e: 'apply'): void
}>()
</script>

<template>
  <div class="apply-section">
    <div class="apply-content">
      <h2 class="title">申请友链</h2>
      <p class="description">
        欢迎优质的博客申请友链！请确保您的网站符合以下要求：
      </p>
      <div class="requirements">
        <div class="requirement-item">
          <div class="icon">
            <i class="i-carbon-checkmark-filled" />
          </div>
          <div class="text">
            <h3>内容原创</h3>
            <p>网站内容须为原创，拒绝采集站、营销站。</p>
            <p>贵站内容量须达70%以上，且访问稳定、内容持续更新。</p>
          </div>
        </div>
        <div class="requirement-item">
          <div class="icon">
            <i class="i-carbon-time-filled" />
          </div>
          <div class="text">
            <h3>稳定访问</h3>
            <p>网站能正常访问且无违反中国大陆相关法律法规。</p>
          </div>
        </div>
        <div class="requirement-item">
          <div class="icon">
            <i class="i-carbon-security-filled" />
          </div>
          <div class="text">
            <h3>安全可靠</h3>
            <p>贵站须部署有SSL/TLS证书，可通过HTTPS访问全站，有ICP备案。</p>
          </div>
        </div>
        <div class="requirement-item">
          <div class="icon">
            <i class="i-carbon-update-now-filled" />
          </div>
          <div class="text">
            <h3>交换友联</h3>
            <p>申请友链前请先添加本站友链。</p>
            <p>贵站若出现无法访问、网站性质更变，无通告的情况下，将视为放弃交换友链。</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <n-button
            type="primary"
            size="large"
            @click="$emit('apply')"
        >
          立即申请
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.apply-section {
  background: #fff;
  border-radius: 1rem;
  padding: 3rem 2rem;
  margin-top: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.apply-content {
  max-width: 800px;
  margin: 0 auto;
}

.title {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
}

.requirements {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.requirement-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .icon {
    width: 40px;
    height: 40px;
    background: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
  }

  .text {
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 0.9rem;
      color: #666;
      line-height: 1.4;
    }
  }
}

.actions {
  text-align: center;
}
</style>