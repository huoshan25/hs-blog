import type { RouterConfig } from '@nuxt/schema'
import type { RouterOptions } from 'vue-router'

/*自定义路由*/
export default <RouterConfig>{
  routes: (_routes: RouterOptions['routes']) => {
    return _routes.filter(route => !/\b\/components\b/.test(route.path))
  }
}
