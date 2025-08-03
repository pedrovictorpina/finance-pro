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
      { path: 'transaction/:id?', name: 'transaction', component: () => import('pages/TransactionForm.vue'), meta: { requiresAuth: true } },
      { path: 'profile',     name: 'profile',     component: () => import('pages/Profile.vue'), meta: { requiresAuth: true } },
      { path: 'expense-table', name: 'expense-table', component: () => import('pages/ExpenseTable.vue'), meta: { requiresAuth: true } },
      { path: 'income-table', name: 'income-table', component: () => import('pages/IncomeTable.vue'), meta: { requiresAuth: true } },
      { path: 'categories', name: 'categories', component: () => import('pages/CategoryManager.vue'), meta: { requiresAuth: true } },
      { path: 'history', name: 'history', component: () => import('pages/TransactionHistory.vue'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
