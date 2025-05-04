export default defineNuxtRouteMiddleware((to, from) => {
  /*检查路由是否存在*/
  const matchedRoute = to.matched.length > 0

  if (!matchedRoute) {
    showError({ statusCode: 404, message: '页面不存在' })
  }
})
