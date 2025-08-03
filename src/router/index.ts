// src/router/index.ts
import { route } from 'quasar/wrappers'
import type { Router } from 'vue-router'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { supabase } from 'src/boot/supabase'

export default route(function (): Router {
  const history = process.env.SERVER
    ? createMemoryHistory()
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory() : createWebHashHistory())

  const Router = createRouter({ history, routes })

  Router.beforeEach(async (to) => {
    if (to.meta.requiresAuth) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        return { name: 'login' }
      }
    }
  })

  return Router
})
