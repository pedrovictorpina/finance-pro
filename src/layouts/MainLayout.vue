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
          <q-badge color="red" floating>3</q-badge>
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../boot/supabase'

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const leftDrawerOpen = ref(false)

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

async function logout() {
  $q.loading.show({
    message: 'Saindo...'
  })
  
  try {
    await supabase.auth.signOut()
    $q.notify({
      type: 'positive',
      message: 'Logout realizado com sucesso!',
      position: 'top'
    })
    void router.replace({ name: 'login' })
  } catch {
     $q.notify({
      type: 'negative',
      message: 'Erro ao fazer logout',
      position: 'top'
    })
  } finally {
    $q.loading.hide()
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
