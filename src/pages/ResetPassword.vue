<template>
  <q-page class="reset-page flex flex-center">
    <div class="reset-container">
      <!-- Logo e Título -->
      <div class="text-center q-mb-xl">
        <q-icon name="lock_reset" size="64px" color="primary" class="q-mb-md" />
        <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
          Recuperar Senha
        </h4>
        <p class="text-subtitle1 text-grey-6 q-ma-none q-mt-sm">
          Digite seu email para receber as instruções de recuperação
        </p>
      </div>

      <!-- Formulário de Recuperação -->
      <q-card flat class="reset-card">
        <q-card-section class="q-pa-xl">
          <q-form @submit.prevent="resetPassword" class="q-gutter-lg">
            <!-- Email -->
            <q-input
              v-model="email"
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

            <!-- Botão de Envio -->
            <q-btn
              label="Enviar Instruções"
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

      <!-- Mensagem de Sucesso -->
      <q-card v-if="emailSent" flat class="success-card q-mt-lg">
        <q-card-section class="text-center q-pa-lg">
          <q-icon name="check_circle" size="48px" color="positive" class="q-mb-md" />
          <h6 class="text-h6 text-weight-medium q-ma-none q-mb-sm">
            Email Enviado!
          </h6>
          <p class="text-body2 text-grey-6 q-ma-none">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </p>
        </q-card-section>
      </q-card>

      <!-- Links -->
      <div class="text-center q-mt-lg">
        <p class="text-body2 text-grey-6">
          Lembrou da senha?
          <router-link to="/login" class="text-primary text-weight-medium text-decoration-none">
            Voltar ao login
          </router-link>
        </p>
        <p class="text-body2 text-grey-6 q-mt-sm">
          Não tem uma conta?
          <router-link to="/signup" class="text-primary text-weight-medium text-decoration-none">
            Criar conta
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
defineOptions({ name: 'ResetPasswordPage' })

import { ref } from 'vue'
import { Notify } from 'quasar'
import { supabase } from 'src/boot/supabase'
const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

// Função removida - não utilizada

async function resetPassword() {
  if (!email.value) {
    Notify.create({ type: 'warning', message: 'Informe seu email.' })
    return
  }

  loading.value = true

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value)

    if (error) {
      Notify.create({ type: 'negative', message: error.message })
    } else {
      emailSent.value = true
      Notify.create({
        type: 'positive',
        message: 'Link de recuperação enviado. Verifique seu email.'
      })
    }
  } catch {
     Notify.create({ type: 'negative', message: 'Erro ao enviar email de recuperação.' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.reset-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-container {
  width: 100%;
  max-width: 450px;
}

.reset-card {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.success-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #21ba45;
}

.custom-input {
  border-radius: 12px;
}

.custom-input :deep(.q-field__control) {
  border-radius: 12px;
}

.custom-input :deep(.q-field__native) {
  padding: 12px 16px;
}

@media (max-width: 600px) {
  .reset-container {
    max-width: 100%;
    padding: 0 10px;
  }
  
  .reset-card {
    margin: 0;
  }
  
  .reset-card .q-card-section {
    padding: 24px 20px;
  }
}
</style>
