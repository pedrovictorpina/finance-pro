<template>
  <q-page class="signup-page flex flex-center">
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
    
    <div class="signup-container">
      <!-- Logo e Título -->
      <div class="text-center q-mb-xl">
        <q-icon name="account_balance_wallet" size="64px" color="primary" class="q-mb-md" />
        <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
          Finance Pro
        </h4>
        <p class="text-subtitle1 text-grey-6 q-ma-none q-mt-sm">
          Crie sua conta e comece a gerenciar suas finanças
        </p>
      </div>

      <!-- Formulário de Cadastro -->
      <q-card flat class="signup-card">
        <q-card-section class="q-pa-xl">
          <q-form @submit.prevent="signUp" class="q-gutter-lg">
            <!-- Nome Completo -->
            <q-input
              v-model="form.fullName"
              label="Nome Completo"
              outlined
              :rules="[val => !!val || 'Nome é obrigatório']"
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="person" class="text-grey-6" />
              </template>
            </q-input>

            <!-- Email -->
            <q-input
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              :rules="[
                val => !!val || 'Email é obrigatório',
                val => /.+@.+\..+/.test(val) || 'Email deve ser válido'
              ]"
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="email" class="text-grey-6" />
              </template>
            </q-input>

            <!-- Senha -->
            <q-input
              v-model="form.password"
              :label="'Senha'"
              :type="showPassword ? 'text' : 'password'"
              outlined
              :rules="[
                val => !!val || 'Senha é obrigatória',
                val => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres'
              ]"
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

            <!-- Confirmar Senha -->
            <q-input
              v-model="form.confirmPassword"
              label="Confirmar Senha"
              :type="showPassword ? 'text' : 'password'"
              outlined
              :rules="[
                val => !!val || 'Confirmação de senha é obrigatória',
                val => val === form.password || 'Senhas não coincidem'
              ]"
              class="custom-input"
            >
              <template #prepend>
                <q-icon name="lock_outline" class="text-grey-6" />
              </template>
            </q-input>

            <!-- Termos de Uso -->
            <q-checkbox
              v-model="form.acceptTerms"
              label="Aceito os termos de uso e política de privacidade"
              :rules="[(val: boolean) => !!val || 'Você deve aceitar os termos']"
              class="q-mt-md"
            />

            <!-- Botão de Cadastro -->
            <q-btn
              label="Criar Conta"
              color="primary"
              type="submit"
              class="full-width q-mt-lg"
              size="lg"
              :loading="loading"
              unelevated
              no-caps
            />
          </q-form>
        </q-card-section>
      </q-card>

      <!-- Links -->
      <div class="text-center q-mt-lg">
        <p class="text-body2 text-grey-6">
          Já tem uma conta?
          <router-link to="/login" class="text-primary text-weight-medium text-decoration-none">
            Faça login
          </router-link>
        </p>
      </div>

      <!-- Footer -->
      <div class="text-center q-mt-xl">
        <p class="text-caption text-grey-5">
          © 2024 Finance Pro. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'SignupPage' })

import { ref } from 'vue'
import { Notify, useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { supabase } from 'src/boot/supabase'

const router = useRouter()
const $q = useQuasar()
const loading = ref(false)
const showPassword = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

function toggleDarkMode() {
  $q.dark.toggle()
  // Salvar preferência no localStorage
  localStorage.setItem('darkMode', $q.dark.isActive.toString())
}

async function signUp() {
  try {
    loading.value = true

    if (!form.value.fullName) {
      Notify.create({ type: 'warning', message: 'Informe seu nome completo.' })
      return
    }
    if (!form.value.email) {
      Notify.create({ type: 'warning', message: 'Informe seu email.' })
      return
    }
    if (!form.value.password) {
      Notify.create({ type: 'warning', message: 'Informe sua senha.' })
      return
    }
    if (form.value.password !== form.value.confirmPassword) {
      Notify.create({ type: 'warning', message: 'As senhas não conferem.' })
      return
    }
    if (!form.value.acceptTerms) {
      Notify.create({ type: 'warning', message: 'Você deve aceitar os termos de uso.' })
      return
    }

    const { error } = await supabase.auth.signUp({
      email: form.value.email,
      password: form.value.password,
      options: {
        data: {
          full_name: form.value.fullName
        }
      }
    })

    if (error) {
      Notify.create({ type: 'negative', message: error.message })
      return
    }

    Notify.create({
      type: 'positive',
      message: 'Conta criada com sucesso! Você já pode fazer login.'
    })
    setTimeout(() => { void router.push({ name: 'login' }) }, 2000)
  }
  catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    Notify.create({ type: 'negative', message: message })
  }
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.signup-container {
  width: 100%;
  max-width: 480px;
}

.signup-card {
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.custom-input {
  margin-bottom: 8px;
}

.custom-input .q-field__control {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
}

.custom-input .q-field__native {
  font-size: 16px;
}

.q-btn {
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
}

.q-btn.q-btn--unelevated {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.q-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(25, 118, 210, 0.4);
}

/* Responsividade */
@media (max-width: 600px) {
  .signup-container {
    max-width: 100%;
    padding: 0 16px;
  }
  
  .q-card-section {
    padding: 32px 24px !important;
  }
  
  .q-gutter-lg > * {
    margin-bottom: 16px;
  }
}

/* Animações */
.signup-card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-input .q-field__control {
  transition: all 0.2s ease;
}

.custom-input.q-field--focused .q-field__control {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
  background: white;
}
</style>
