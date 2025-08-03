// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '',        name: 'login',    component: () => import('pages/Login.vue') },
      { path: 'signup',  name: 'signup',   component: () => import('pages/Signup.vue') },
      { path: 'reset',   name: 'reset',    component: () => import('pages/ResetPassword.vue') },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      { path: 'transaction', name: 'transaction', component: () => import('pages/TransactionForm.vue'), meta: { requiresAuth: true } },
      { path: 'profile',     name: 'profile',     component: () => import('pages/Profile.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
