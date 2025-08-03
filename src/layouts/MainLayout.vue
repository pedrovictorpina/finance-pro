<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-gradient-primary text-white">
      <q-toolbar class="q-py-sm">
        <q-btn
          flat dense round icon="menu" aria-label="Menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />
        <q-icon name="account_balance_wallet" size="md" class="q-mr-sm" />
        <q-toolbar-title class="text-h5 text-weight-bold">
          Finance Pro
        </q-toolbar-title>
        <q-separator vertical class="q-mx-md" />
        <div class="text-h6 text-weight-medium">
          {{ currentPageTitle }}
        </div>
        <q-space />
        <q-btn
          flat round dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
          class="q-mr-sm dark-mode-toggle"
        >
          <q-tooltip>{{ $q.dark.isActive ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
        </q-btn>
        <q-btn
          flat round dense
          icon="notifications"
          class="q-mr-sm"
        >
          <q-badge v-if="unreadCount > 0" color="red" floating>{{ unreadCount }}</q-badge>
          <q-popup-proxy 
            anchor="bottom right" 
            self="top right" 
            class="notification-menu"
            :offset="[0, 10]"
          >
            <q-card style="min-width: 320px; max-width: 400px;">
              <q-card-section class="q-pb-none">
                <div class="row items-center justify-between">
                  <div class="text-h6">Notificações</div>
                  <q-btn 
                    v-if="notifications.length > 0"
                    flat dense round 
                    icon="done_all" 
                    size="sm"
                    @click="markAllAsRead"
                  >
                    <q-tooltip>Marcar todas como lidas</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section class="q-pa-none" style="max-height: 400px; overflow-y: auto;">
                <q-list v-if="notifications.length > 0" separator>
                  <q-item 
                    v-for="notification in notifications" 
                    :key="notification.id"
                    clickable
                    @click="markAsRead(notification.id)"
                    :class="{ 'bg-blue-1': !notification.read }"
                  >
                    <q-item-section avatar>
                      <q-icon 
                        :name="getNotificationIcon(notification.type)" 
                        :color="getNotificationColor(notification.type)"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{ notification.title }}</q-item-label>
                      <q-item-label caption>{{ notification.message }}</q-item-label>
                      <q-item-label caption class="text-grey-6">{{ formatDate(notification.date) }}</q-item-label>
                    </q-item-section>
                    <q-item-section side v-if="!notification.read">
                      <q-icon name="circle" color="primary" size="8px" />
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="q-pa-lg text-center text-grey-6">
                  <q-icon name="notifications_none" size="48px" class="q-mb-sm" />
                  <div>Nenhuma notificação</div>
                </div>
              </q-card-section>
              <q-separator v-if="notifications.length > 0" />
              <q-card-actions v-if="notifications.length > 0" align="center">
                <q-btn 
                  flat 
                  label="Limpar todas" 
                  color="negative"
                  size="sm"
                  @click="clearAllNotifications"
                />
              </q-card-actions>
            </q-card>
          </q-popup-proxy>
        </q-btn>
        <q-btn
          flat round dense
          icon="account_circle"
          @click="goProfile"
        />
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered
      class="bg-grey-1"
      :width="280"
    >
      <div class="q-pa-md bg-gradient-primary text-white">
        <div class="row items-center q-gutter-sm">
          <q-avatar size="50px" class="bg-white text-primary">
            <q-icon name="person" size="md" />
          </q-avatar>
          <div>
            <div class="text-h6 text-weight-bold">Usuário</div>
            <div class="text-caption opacity-70">Bem-vindo de volta!</div>
          </div>
        </div>
      </div>
      
      <q-list padding class="q-mt-sm">
        <q-item 
          clickable v-ripple 
          @click="goTo('dashboard')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'dashboard' }"
        >
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Dashboard</q-item-label>
            <q-item-label caption>Visão geral</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item 
          clickable v-ripple 
          @click="goTo('transaction')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'transaction' }"
        >
          <q-item-section avatar>
            <q-icon name="add_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Nova Transação</q-item-label>
            <q-item-label caption>Adicionar receita/despesa</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item 
          clickable v-ripple 
          @click="goTo('profile')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'profile' }"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Perfil</q-item-label>
            <q-item-label caption>Configurações da conta</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item 
          clickable v-ripple 
          @click="goTo('expense-table')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'expense-table' }"
        >
          <q-item-section avatar>
            <q-icon name="table_chart" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Tabela de Despesas</q-item-label>
            <q-item-label caption>Visualizar despesas</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item 
          clickable v-ripple 
          @click="goTo('income-table')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'income-table' }"
        >
          <q-item-section avatar>
            <q-icon name="trending_up" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Tabela de Receitas</q-item-label>
            <q-item-label caption>Visualizar receitas</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item 
          clickable v-ripple 
          @click="goTo('categories')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'categories' }"
        >
          <q-item-section avatar>
            <q-icon name="category" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Categorias</q-item-label>
            <q-item-label caption>Gerenciar categorias</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-item 
          clickable v-ripple 
          @click="goTo('history')"
          class="rounded-borders q-ma-xs"
          :class="{ 'bg-primary text-white': route.name === 'history' }"
        >
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Histórico</q-item-label>
            <q-item-label caption>Todas as transações</q-item-label>
          </q-item-section>
        </q-item>
        
        <q-separator class="q-my-md" />
        
        <q-item 
          clickable v-ripple 
          @click="logout"
          class="rounded-borders q-ma-xs text-negative"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium">Sair</q-item-label>
            <q-item-label caption>Encerrar sessão</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../boot/supabase'

interface Notification {
  id: number
  title: string
  message: string
  type: 'success' | 'warning' | 'error' | 'info' | 'transaction'
  date: Date
  read: boolean
}

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

// Títulos das páginas
const pageTitle = computed(() => {
  const routeTitles = {
    'dashboard': 'Dashboard',
    'transaction': 'Nova Transação',
    'profile': 'Perfil',
    'expense-table': 'Tabela de Despesas',
    'income-table': 'Tabela de Receitas',
    'categories': 'Gerenciar Categorias',
    'history': 'Histórico de Transações'
  }
  return routeTitles[route.name as keyof typeof routeTitles] || 'Finance Pro'
})

const currentPageTitle = computed(() => {
  return route.name === 'dashboard' ? '' : pageTitle.value
})
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'Nova transação registrada',
    message: 'Receita de R$ 2.500,00 foi adicionada',
    type: 'success',
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
    read: false
  },
  {
    id: 2,
    title: 'Meta de economia atingida',
    message: 'Parabéns! Você atingiu 65% da sua meta mensal',
    type: 'success',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
    read: false
  },
  {
    id: 3,
    title: 'Lembrete de pagamento',
    message: 'Conta de energia vence em 3 dias',
    type: 'warning',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 dia atrás
    read: true
  }
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goTo(routeName: string) {
  void router.push({ name: routeName })
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

function goProfile() {
  goTo('profile')
}

function toggleDarkMode() {
  $q.dark.toggle()
  // Salvar preferência no localStorage
  localStorage.setItem('darkMode', $q.dark.isActive.toString())
}

function getNotificationIcon(type: string) {
  const icons = {
    success: 'check_circle',
    warning: 'warning',
    error: 'error',
    info: 'info',
    transaction: 'account_balance_wallet'
  }
  return icons[type as keyof typeof icons] || 'notifications'
}

function getNotificationColor(type: string) {
  const colors = {
    success: 'positive',
    warning: 'warning',
    error: 'negative',
    info: 'info',
    transaction: 'primary'
  }
  return colors[type as keyof typeof colors] || 'grey'
}

function formatDate(date: Date) {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes}m atrás`
  } else if (hours < 24) {
    return `${hours}h atrás`
  } else {
    return `${days}d atrás`
  }
}

function markAsRead(id: number) {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
}

function clearAllNotifications() {
  notifications.value = []
}

async function logout() {
  console.log('Logout function called')
  
  if ($q && $q.loading) {
    $q.loading.show({
      message: 'Saindo...'
    })
  }
  
  try {
    console.log('Calling supabase.auth.signOut()')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Supabase signOut error:', error)
      throw error
    }
    console.log('SignOut successful, redirecting to login')
    
    if ($q && $q.notify) {
      $q.notify({
        type: 'positive',
        message: 'Logout realizado com sucesso!',
        position: 'top'
      })
    }
    
    console.log('Redirecting to login page')
    await router.replace({ name: 'login' })
    
  } catch (error) {
    console.error('Logout error:', error)
    
    if ($q && $q.notify) {
      $q.notify({
        type: 'negative',
        message: 'Erro ao fazer logout',
        position: 'top'
      })
    }
  } finally {
    if ($q && $q.loading) {
      $q.loading.hide()
    }
  }
}
</script>

<style scoped>
.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.q-item {
  transition: all 0.3s ease;
}

.q-item:hover {
  transform: translateX(4px);
}

.q-toolbar {
  min-height: 64px;
}
</style>
