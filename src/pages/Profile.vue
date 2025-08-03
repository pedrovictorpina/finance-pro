<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
        Meu Perfil
      </h4>
      <p class="text-subtitle1 text-grey-6 q-ma-none">
        Gerencie suas informações pessoais e configurações
      </p>
    </div>

    <div class="row q-gutter-lg">
      <!-- Informações do Usuário -->
      <div class="col-12 col-md-4">
        <q-card flat class="profile-card">
          <q-card-section class="text-center q-pa-xl">
            <q-avatar size="120px" class="q-mb-md">
              <img v-if="user?.user_metadata?.avatar_url" :src="String(user.user_metadata.avatar_url)" />
              <q-icon v-else name="person" size="60px" color="grey-6" />
            </q-avatar>
            
            <h5 class="text-h5 text-weight-medium q-ma-none q-mb-xs">
              {{ user?.user_metadata?.full_name || 'Usuário' }}
            </h5>
            
            <p class="text-body2 text-grey-6 q-ma-none q-mb-md">
              {{ user?.email }}
            </p>
            
            <q-chip 
              :color="user?.email_confirmed_at ? 'positive' : 'warning'" 
              text-color="white" 
              :icon="user?.email_confirmed_at ? 'verified' : 'pending'"
            >
              {{ user?.email_confirmed_at ? 'Verificado' : 'Pendente' }}
            </q-chip>
          </q-card-section>
        </q-card>
      </div>

      <!-- Formulário de Edição -->
      <div class="col-12 col-md-8">
        <q-card flat class="profile-card">
          <q-card-section class="q-pa-xl">
            <h6 class="text-h6 text-weight-medium q-ma-none q-mb-lg">
              Informações Pessoais
            </h6>
            
            <q-form @submit.prevent="updateProfile" class="q-gutter-lg">
              <div class="row q-gutter-md">
                <q-input
                  v-model="profileForm.full_name"
                  label="Nome Completo"
                  outlined
                  class="col custom-input"
                >
                  <template #prepend>
                    <q-icon name="person" class="text-grey-6" />
                  </template>
                </q-input>
                
                <q-input
                  v-model="profileForm.phone"
                  label="Telefone"
                  outlined
                  mask="(##) #####-####"
                  class="col custom-input"
                >
                  <template #prepend>
                    <q-icon name="phone" class="text-grey-6" />
                  </template>
                </q-input>
              </div>
              
              <q-input
                 :model-value="user?.email || ''"
                 label="Email"
                 outlined
                 readonly
                 class="custom-input"
               >
                <template #prepend>
                  <q-icon name="email" class="text-grey-6" />
                </template>
              </q-input>
              
              <q-input
                v-model="profileForm.bio"
                label="Sobre você"
                type="textarea"
                outlined
                rows="3"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="description" class="text-grey-6" />
                </template>
              </q-input>
              
              <div class="row q-gutter-md q-mt-lg">
                <q-btn 
                  label="Salvar Alterações" 
                  color="primary" 
                  type="submit"
                  class="col"
                  :loading="loading"
                  unelevated
                  no-caps
                />
                <q-btn 
                  label="Alterar Senha" 
                  color="grey-6" 
                  outline
                  class="col"
                  @click="showPasswordDialog = true"
                  no-caps
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Estatísticas Rápidas -->
    <div class="q-mt-xl">
      <h6 class="text-h6 text-weight-medium q-mb-lg text-grey-8">
        Estatísticas da Conta
      </h6>
      
      <div class="row q-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stats-mini-card">
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="account_balance_wallet" size="32px" color="primary" class="q-mb-sm" />
              <div class="text-h6 text-weight-bold">{{ stats.totalTransactions }}</div>
              <div class="text-caption text-grey-6">Transações</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stats-mini-card">
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="trending_up" size="32px" color="positive" class="q-mb-sm" />
              <div class="text-h6 text-weight-bold">{{ $filters.formatBRL(stats.totalIncome) }}</div>
              <div class="text-caption text-grey-6">Receitas</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stats-mini-card">
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="trending_down" size="32px" color="negative" class="q-mb-sm" />
              <div class="text-h6 text-weight-bold">{{ $filters.formatBRL(Math.abs(stats.totalExpenses)) }}</div>
              <div class="text-caption text-grey-6">Despesas</div>
            </q-card-section>
          </q-card>
        </div>
        
        <div class="col-12 col-sm-6 col-md-3">
          <q-card flat class="stats-mini-card">
            <q-card-section class="text-center q-pa-lg">
              <q-icon name="calendar_today" size="32px" color="info" class="q-mb-sm" />
              <div class="text-h6 text-weight-bold">{{ daysSinceJoined }}</div>
              <div class="text-caption text-grey-6">Dias conosco</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Dialog para alterar senha -->
    <q-dialog v-model="showPasswordDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Alterar Senha</div>
        </q-card-section>
        
        <q-card-section class="q-pt-none">
          <q-form @submit.prevent="changePassword" class="q-gutter-md">
            <q-input
              v-model="passwordForm.newPassword"
              label="Nova Senha"
              :type="showPassword ? 'text' : 'password'"
              outlined
              :rules="[val => !!val || 'Senha é obrigatória', val => val.length >= 6 || 'Senha deve ter pelo menos 6 caracteres']"
            >
              <template #append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            
            <q-input
              v-model="passwordForm.confirmPassword"
              label="Confirmar Nova Senha"
              :type="showPassword ? 'text' : 'password'"
              outlined
              :rules="[val => !!val || 'Confirmação é obrigatória', val => val === passwordForm.newPassword || 'Senhas não coincidem']"
            />
          </q-form>
        </q-card-section>
        
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" @click="showPasswordDialog = false" />
          <q-btn 
            label="Alterar" 
            color="primary" 
            @click="changePassword"
            :loading="passwordLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'ProfilePage' })

import { ref, onMounted, computed } from 'vue'
import { supabase } from 'src/boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()

interface Transaction {
  id: number
  amount: number
  type: 'income' | 'expense'
  date: string
  user_id: string
}

interface SupabaseUser {
  id: string
  email?: string
  created_at?: string
  email_confirmed_at?: string
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}

interface ProfileForm {
  full_name: string
  phone: string
  bio: string
}

interface PasswordForm {
  newPassword: string
  confirmPassword: string
}

interface Stats {
  totalTransactions: number
  totalIncome: number
  totalExpenses: number
}

const user = ref<SupabaseUser | null>(null)
const loading = ref(false)
const passwordLoading = ref(false)
const showPasswordDialog = ref(false)
const showPassword = ref(false)

const profileForm = ref<ProfileForm>({
  full_name: '',
  phone: '',
  bio: ''
})

const passwordForm = ref<PasswordForm>({
  newPassword: '',
  confirmPassword: ''
})

const stats = ref<Stats>({
  totalTransactions: 0,
  totalIncome: 0,
  totalExpenses: 0
})

const daysSinceJoined = computed(() => {
  if (!user.value?.created_at) return 0
  const joinDate = new Date(user.value.created_at)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - joinDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const loadUserData = async () => {
  try {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (u) {
      user.value = u
      
      // Carregar dados do perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single()
      
      if (profile) {
        profileForm.value = {
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          bio: profile.bio || ''
        }
      }
    }
  } catch (error) {
    console.error('Erro ao carregar dados do usuário:', error)
  }
}

const loadStats = async () => {
  try {
     const { data: transactions } = await supabase
       .from('transactions')
       .select('*')
       .eq('user_id', user.value?.id)

     const transactionsList = transactions || []

     stats.value = {
       totalTransactions: transactionsList.length,
       totalIncome: transactionsList
         .filter((t: Transaction) => t.type === 'income')
         .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
       totalExpenses: transactionsList
         .filter((t: Transaction) => t.type === 'expense')
         .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
     }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const updateProfile = async () => {
  if (!user.value) return
  
  loading.value = true
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.value.id,
        ...profileForm.value,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    $q.notify({
      type: 'positive',
      message: 'Perfil atualizado com sucesso!',
      position: 'top'
    })
  } catch (error) {
     $q.notify({
       type: 'negative',
       message: error instanceof Error ? error.message : 'Erro ao atualizar perfil',
       position: 'top'
     })
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    $q.notify({
      type: 'negative',
      message: 'As senhas não coincidem',
      position: 'top'
    })
    return
  }
  
  passwordLoading.value = true
  try {
    const { error } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword
    })
    
    if (error) throw error
    
    $q.notify({
      type: 'positive',
      message: 'Senha alterada com sucesso!',
      position: 'top'
    })
    
    showPasswordDialog.value = false
    passwordForm.value = { newPassword: '', confirmPassword: '' }
  } catch (error) {
     $q.notify({
       type: 'negative',
       message: error instanceof Error ? error.message : 'Erro ao alterar senha',
       position: 'top'
     })
  } finally {
    passwordLoading.value = false
  }
}

onMounted(async () => {
  await loadUserData()
  await loadStats()
})
</script>

<style scoped>
.profile-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-mini-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stats-mini-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-input {
  border-radius: 8px;
}
</style>
