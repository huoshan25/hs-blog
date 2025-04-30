<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToSharedDemo = () => {
  router.push('/shared-demo');
};
</script>

<template>
  <div class="container">
    <h1>博客系统</h1>
    <div class="links">
      <button @click="goToSharedDemo" class="demo-btn">共享包使用示例</button>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 30px;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
}

.links {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.demo-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.demo-btn:hover {
  background-color: #45a049;
}
</style>