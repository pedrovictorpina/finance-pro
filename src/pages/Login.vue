<template>
  <q-page class="login-page flex flex-center">
    <!-- Botão de toggle do modo escuro -->
    <q-btn
      flat round dense
      :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
      @click="toggleDarkMode"
      class="fixed-top-right q-ma-md dark-mode-toggle"
      style="z-index: 1000;"
    >
      <q-tooltip>{{ $q.dark.isActive ? 'Modo Claro' : 'Modo Escuro' }}</q-tooltip>
    </q-btn>
    
    <div class="login-container">
      <!-- Logo e título -->
      <div class="text-center q-mb-xl">
        <div class="logo-container q-mb-md">
          <q-icon name="account_balance_wallet" size="64px" class="text-primary" />
        </div>
        <h3 class="text-h3 text-weight-bold text-grey-8 q-ma-none">
          Finance Pro
        </h3>
        <p class="text-subtitle1 text-grey-6 q-mt-sm q-mb-none">
          Gerencie suas finanças com inteligência
        </p>
      </div>

      <!-- Card de login -->
      <q-card class="login-card" flat>
        <q-card-section class="q-pa-xl">
          <div class="text-h5 text-weight-bold text-center q-mb-lg text-grey-8">
            Bem-vindo de volta!
          </div>
          
          <q-form @submit.prevent="signIn" class="q-gutter-md">
            <q-input 
              v-model="email" 
              label="Email" 
              type="email"
              outlined
              :rules="[val => !!val || 'Email é obrigatório', val => /.+@.+\..+/.test(val) || 'Email inválido']"
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="email" class="text-grey-6" />
              </template>
            </q-input>
            
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Senha"
              outlined
              :rules="[val => !!val || 'Senha é obrigatória']"
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="lock" class="text-grey-6" />
              </template>
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer text-grey-6"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-checkbox
              v-model="rememberMe"
              label="Lembrar acesso"
              color="primary"
              class="q-mt-md"
            />

            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              size="lg"
              class="full-width q-mt-lg custom-btn"
              :loading="loading"
              unelevated
            />
          </q-form>
        </q-card-section>

        <q-separator />
        
        <q-card-actions class="q-pa-lg justify-center">
          <div class="column items-center q-gutter-sm full-width">
            <q-btn 
              flat 
              label="Esqueci minha senha" 
              @click="goReset"
              class="text-primary"
              no-caps
            />
            <div class="text-grey-6">ou</div>
            <q-btn 
              outline
              label="Criar nova conta" 
              @click="goSignup"
              color="primary"
              class="full-width"
              no-caps
            />
          </div>
        </q-card-actions>
      </q-card>
      
      <!-- Footer -->
      <div class="text-center q-mt-xl">
        <p class="text-caption text-grey-5">
          © 2025 Finance Pro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'LoginPage' })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

const router = useRouter()
const $q = useQuasar()
const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const rememberMe = ref(false)

// Carregar credenciais salvas ao inicializar
function loadSavedCredentials() {
  const savedEmail = localStorage.getItem('rememberedEmail')
  const savedPassword = localStorage.getItem('rememberedPassword')
  const isRemembered = localStorage.getItem('rememberMe') === 'true'
  
  if (isRemembered && savedEmail && savedPassword) {
    email.value = savedEmail
    password.value = savedPassword
    rememberMe.value = true
    // Auto-login se as credenciais estão salvas
    void signIn()
  }
}

function goReset() {
  void router.push({ name: 'reset' })
}

function goSignup() {
  void router.push({ name: 'signup' })
}

function toggleDarkMode() {
  $q.dark.toggle()
  // Salvar preferência no localStorage
  localStorage.setItem('darkMode', $q.dark.isActive.toString())
}

async function signIn() {
  if (!email.value || !password.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos',
      position: 'top'
    })
    return
  }
  
  loading.value = true
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) {
      $q.notify({
        type: 'negative',
        message: 'Email ou senha incorretos',
        position: 'top'
      })
      // Limpar credenciais salvas se o login falhar
      if (rememberMe.value) {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedPassword')
        localStorage.removeItem('rememberMe')
      }
    } else {
      // Salvar ou limpar credenciais baseado na opção "Lembrar acesso"
      if (rememberMe.value) {
        localStorage.setItem('rememberedEmail', email.value)
        localStorage.setItem('rememberedPassword', password.value)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberedPassword')
        localStorage.removeItem('rememberMe')
      }
      
      $q.notify({
        type: 'positive',
        message: 'Login realizado com sucesso!',
        position: 'top'
      })
      void router.push({ name: 'dashboard' })
    }
  } catch {
     $q.notify({
       type: 'negative',
       message: 'Erro ao fazer login. Tente novamente.',
       position: 'top'
     })
  } finally {
    loading.value = false
  }
}

// Carregar credenciais salvas quando o componente for montado
onMounted(() => {
  loadSavedCredentials()
})
</script>

<style scoped>
.login-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.logo-container {
  padding: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  backdrop-filter: blur(10px);
}

.custom-input {
  border-radius: 12px;
}

.custom-input .q-field__control {
  border-radius: 12px;
}

.custom-btn {
  border-radius: 12px;
  height: 48px;
  font-weight: 600;
  text-transform: none;
}

.q-btn {
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 600px) {
  .login-container {
    max-width: 100%;
    padding: 0 10px;
  }
  
  .login-card {
    border-radius: 16px;
  }
  
  .q-card-section {
    padding: 24px !important;
  }
}
</style>
