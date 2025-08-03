<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
        {{ isEditing ? 'Editar Transação' : 'Nova Transação' }}
      </h4>
      <p class="text-subtitle1 text-grey-6 q-ma-none">
        {{ isEditing ? 'Modifique os dados da transação' : 'Adicione uma nova receita ou despesa' }}
      </p>
    </div>

    <!-- Formulário -->
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card flat class="transaction-card">
          <q-card-section class="q-pa-xl">
            <q-form @submit.prevent="submit" class="q-gutter-lg">
              <!-- Tipo de transação -->
              <div>
                <label class="text-subtitle2 text-weight-medium text-grey-8 q-mb-sm block">
                  Tipo de Transação
                </label>
                <q-btn-toggle
                  v-model="form.type"
                  :options="[
                    { label: 'Receita', value: 'income', icon: 'trending_up' },
                    { label: 'Despesa', value: 'expense', icon: 'trending_down' }
                  ]"
                  color="primary"
                  toggle-color="primary"
                  class="full-width"
                  unelevated
                />
              </div>

              <!-- Valor -->
              <q-input 
                v-model.number="form.amount" 
                type="number" 
                label="Valor"
                outlined
                :prefix="form.type === 'expense' ? '-R$' : '+R$'"
                :rules="[val => !!val || 'Valor é obrigatório', val => val > 0 || 'Valor deve ser positivo']"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="attach_money" class="text-grey-6" />
                </template>
              </q-input>

              <!-- Data -->
              <q-input 
                v-model="form.date" 
                type="date" 
                label="Data"
                outlined
                :rules="[val => !!val || 'Data é obrigatória']"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="event" class="text-grey-6" />
                </template>
              </q-input>

              <!-- Conta -->
              <q-select
                v-model="form.account_id"
                :options="accounts"
                label="Conta"
                option-value="id"
                option-label="name"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Conta é obrigatória']"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="account_balance" class="text-grey-6" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhuma conta encontrada
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- Categoria -->
              <q-select
                v-model="form.category_id"
                :options="filteredCategories"
                label="Categoria"
                option-value="id"
                option-label="name"
                outlined
                emit-value
                map-options
                :rules="[val => !!val || 'Categoria é obrigatória']"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="category" class="text-grey-6" />
                </template>
                <template #no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Nenhuma categoria encontrada
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <!-- Descrição -->
              <q-input 
                v-model="form.description" 
                label="Descrição (opcional)"
                outlined
                maxlength="255"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="description" class="text-grey-6" />
                </template>
              </q-input>

              <!-- Campos específicos para despesas -->
              <div v-if="form.type === 'expense'">
                <!-- Data de vencimento -->
                <q-input 
                  v-model="form.due_date" 
                  type="date" 
                  label="Data de Vencimento"
                  outlined
                  hint="Quando esta despesa deve ser paga"
                  class="custom-input"
                >
                  <template #prepend>
                    <q-icon name="schedule" class="text-grey-6" />
                  </template>
                </q-input>

                <!-- Status de pagamento -->
                <div class="q-gutter-sm">
                  <q-checkbox 
                    v-model="form.is_paid" 
                    label="Marcar como pago"
                    color="positive"
                  />
                  
                  <!-- Data do pagamento (só aparece se marcado como pago) -->
                  <q-input 
                    v-if="form.is_paid"
                    v-model="form.payment_date" 
                    type="date" 
                    label="Data do Pagamento"
                    outlined
                    hint="Quando esta despesa foi paga"
                    class="custom-input q-mt-md"
                  >
                    <template #prepend>
                      <q-icon name="payment" class="text-grey-6" />
                    </template>
                  </q-input>
                </div>
              </div>

              <!-- Recorrência -->
              <div v-if="!isEditing">
                <q-checkbox
                  v-model="form.isRecurring"
                  label="Transação recorrente"
                  color="primary"
                  class="q-mb-md"
                />
                <p class="text-caption text-grey-6 q-ma-none q-mb-md">
                  Marque esta opção para repetir esta transação mensalmente
                </p>
                
                <q-input
                  v-if="form.isRecurring"
                  v-model.number="form.recurringMonths"
                  type="number"
                  label="Número de meses para repetir"
                  outlined
                  :min="1"
                  :max="60"
                  :rules="[val => val >= 1 || 'Mínimo 1 mês', val => val <= 60 || 'Máximo 60 meses']"
                  class="custom-input"
                  hint="A transação será criada para os próximos meses automaticamente"
                >
                  <template #prepend>
                    <q-icon name="repeat" class="text-grey-6" />
                  </template>
                </q-input>
              </div>

              <!-- Botões -->
              <div class="row q-gutter-md q-mt-lg">
                <q-btn 
                  label="Cancelar" 
                  color="grey-6" 
                  outline
                  class="col"
                  @click="goBack"
                  no-caps
                />
                <q-btn 
                  :label="isEditing ? 'Atualizar Transação' : (form.isRecurring ? `Criar ${form.recurringMonths} Transações` : 'Salvar Transação')" 
                  color="primary" 
                  type="submit"
                  class="col"
                  :loading="loading"
                  unelevated
                  no-caps
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'TransactionFormPage' })

import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

interface Account { id: number; name: string }
interface Category { id: number; name: string; type?: string }

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const isEditing = computed(() => !!route.params.id)

const form = ref({
  date: new Date().toISOString().split('T')[0], // Data atual como padrão
  amount: null as number | null,
  account_id: null as number | null,
  category_id: null as number | null,
  description: '',
  type: 'expense', // Padrão para despesa
  due_date: new Date().toISOString().split('T')[0],
  is_paid: false,
  payment_date: null,
  isRecurring: false, // Recorrência ativada
  recurringMonths: 12 // Número de meses para repetir
})
const accounts = ref<Account[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)

// Categorias filtradas baseadas no tipo de transação
const filteredCategories = computed(() => {
  return categories.value.filter(category => {
    if (form.value.type === 'income') {
      return category.type === 'income' || !category.type
    } else {
      return category.type === 'expense' || !category.type
    }
  })
})

const submit = async () => {
  loading.value = true
  
  try {
    // Obter o user_id da sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }
    
    const baseAmount = form.value.type === 'expense' ? -Math.abs(form.value.amount!) : Math.abs(form.value.amount!)
    let message = 'Transação salva com sucesso!'
    
    if (isEditing.value) {
      // Atualizar transação existente
      const updateData = {
        date: form.value.date,
        amount: baseAmount,
        account_id: form.value.account_id,
        category_id: form.value.category_id,
        description: form.value.description,
        type: form.value.type,
        due_date: null as string | null,
        is_paid: false,
        payment_date: null as string | null
      }
      
      // Adicionar campos específicos para despesas
      if (form.value.type === 'expense') {
        updateData.due_date = form.value.due_date || null
        updateData.is_paid = form.value.is_paid
        updateData.payment_date = form.value.is_paid ? (form.value.payment_date || null) : null
      } else {
        // Para receitas, sempre marcar como pago
        updateData.is_paid = true
        updateData.payment_date = form.value.date || null
        updateData.due_date = null
      }
      
      const { error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', route.params.id)
      
      if (error) {
        throw error
      }
    } else {
      // Criar nova transação
      const transactions = []
      
      if (form.value.isRecurring) {
        // Criar transações recorrentes
        for (let i = 0; i < form.value.recurringMonths; i++) {
          const transactionDate = new Date(form.value.date || new Date().toISOString().split('T')[0] as string)
          transactionDate.setMonth(transactionDate.getMonth() + i)
          
          const transactionData = {
            user_id: session.user.id,
            date: transactionDate.toISOString().split('T')[0],
            amount: baseAmount,
            account_id: form.value.account_id,
            category_id: form.value.category_id,
            description: form.value.description + (i > 0 ? ` (${i + 1}/${form.value.recurringMonths})` : ` (1/${form.value.recurringMonths})`),
            type: form.value.type,
            created_at: new Date().toISOString(),
            due_date: null as string | null,
            is_paid: false,
            payment_date: null as string | null
          }
          
          // Adicionar campos específicos para despesas
          if (form.value.type === 'expense') {
            const dueDate = new Date(form.value.due_date || transactionDate)
            dueDate.setMonth(dueDate.getMonth() + i)
            transactionData.due_date = dueDate.toISOString().split('T')[0] as string
            transactionData.is_paid = form.value.is_paid
            transactionData.payment_date = form.value.is_paid ? (form.value.payment_date || null) : null
          } else {
            // Para receitas, sempre marcar como pago
            transactionData.is_paid = true
            transactionData.payment_date = transactionDate.toISOString().split('T')[0] as string
            transactionData.due_date = null
          }
          transactions.push(transactionData)
        }
      } else {
         // Criar transação única
         const transactionData = {
           user_id: session.user.id,
           ...form.value,
           amount: baseAmount,
           created_at: new Date().toISOString()
         }
         transactions.push(transactionData)
       }

       const { error } = await supabase
           .from('transactions')
           .insert(transactions)

         if (error) {
           throw error
         }
         
         // Definir mensagem de sucesso para criação
         if (form.value.isRecurring) {
           message = `${transactions.length} transações recorrentes criadas com sucesso!`
         }
       }

    if (isEditing.value) {
      message = 'Transação atualizada com sucesso!'
    }

    $q.notify({
      type: 'positive',
      message,
      position: 'top'
    })

    // Se estiver editando, voltar para dashboard
    if (isEditing.value) {
      void router.push({ name: 'dashboard' })
      return
    }

    // Resetar formulário apenas se estiver criando nova transação
    form.value = {
      date: new Date().toISOString().split('T')[0],
      amount: null,
      account_id: null,
      category_id: null,
      description: '',
      type: 'expense',
      due_date: undefined,
      is_paid: false,
      payment_date: null,
      isRecurring: false,
      recurringMonths: 12
    }

    // Redirecionar para o dashboard após 1 segundo
     setTimeout(() => {
       void router.push('/dashboard')
     }, 1000)

  } catch (error) {
    console.error('Erro ao salvar transação:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao salvar transação. Tente novamente.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const loadTransaction = async () => {
  if (!route.params.id) return
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', route.params.id)
      .single()
    
    if (error) throw error
    
    if (data) {
      form.value = {
        date: data.date,
        amount: Math.abs(data.amount),
        account_id: data.account_id,
        category_id: data.category_id,
        description: data.description || '',
        type: data.type,
        due_date: data.due_date || data.date,
        is_paid: data.is_paid || false,
        payment_date: data.payment_date || null,
        isRecurring: false,
        recurringMonths: 12
      }
    }
  } catch (error) {
    console.error('Erro ao carregar transação:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados da transação'
    })
    void router.push({ name: 'dashboard' })
  }
}

onMounted(async () => {
  try {
    // Obter o user_id da sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.id) {
      throw new Error('Usuário não autenticado')
    }

    // Buscar contas
    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .order('name')
    
    if (accountsError) throw accountsError
    accounts.value = (accountsData ?? []) as Account[]

    // Se não houver contas, criar contas padrão
    if (accounts.value.length === 0) {
      const defaultAccounts = [
        { user_id: session.user.id, name: 'Conta Corrente', type: 'checking', balance: 0 },
        { user_id: session.user.id, name: 'Poupança', type: 'savings', balance: 0 },
        { user_id: session.user.id, name: 'Cartão de Crédito', type: 'credit', balance: 0 }
      ]
      
      const { data: newAccounts, error: insertError } = await supabase
        .from('accounts')
        .insert(defaultAccounts)
        .select()
      
      if (insertError) throw insertError
      accounts.value = (newAccounts ?? []) as Account[]
    }

    // Buscar categorias
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (categoriesError) throw categoriesError
    categories.value = (categoriesData ?? []) as Category[]

    // Se não houver categorias, criar categorias padrão
    if (categories.value.length === 0) {
      const defaultCategories = [
        { user_id: session.user.id, name: 'Alimentação', type: 'expense', color: '#f44336', icon: 'restaurant' },
        { user_id: session.user.id, name: 'Transporte', type: 'expense', color: '#ff9800', icon: 'directions_car' },
        { user_id: session.user.id, name: 'Salário', type: 'income', color: '#4caf50', icon: 'work' },
        { user_id: session.user.id, name: 'Freelance', type: 'income', color: '#8bc34a', icon: 'computer' },
        { user_id: session.user.id, name: 'Lazer', type: 'expense', color: '#9c27b0', icon: 'movie' }
      ]
      
      const { data: newCategories, error: insertCatError } = await supabase
        .from('categories')
        .insert(defaultCategories)
        .select()
      
      if (insertCatError) throw insertCatError
      categories.value = (newCategories ?? []) as Category[]
    }

    // Se estiver editando, carregar dados da transação
    if (isEditing.value) {
      await loadTransaction()
    }

  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados. Verifique sua conexão.',
      position: 'top'
    })
  }
})
</script>

<style scoped>
.transaction-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.custom-input {
  margin-bottom: 8px;
}

.custom-input .q-field__control {
  border-radius: 12px;
}

.custom-input .q-field__native {
  font-size: 16px;
}

.q-btn-toggle {
  border-radius: 12px;
  overflow: hidden;
}

.q-btn-toggle .q-btn {
  border-radius: 0;
  flex: 1;
  padding: 12px 16px;
}

.q-btn-toggle .q-btn:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.q-btn-toggle .q-btn:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

.block {
  display: block;
}

/* Responsividade */
@media (max-width: 600px) {
  .q-card-section {
    padding: 24px 16px !important;
  }
  
  .q-gutter-lg > * {
    margin-bottom: 16px;
  }
  
  .row.q-gutter-md {
    margin: 0;
  }
  
  .row.q-gutter-md > .col {
    margin-bottom: 8px;
  }
}

/* Animações */
.transaction-card {
  transition: all 0.3s ease;
}

.transaction-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.q-btn {
  transition: all 0.2s ease;
}

.custom-input .q-field__control {
  transition: all 0.2s ease;
}

.custom-input.q-field--focused .q-field__control {
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.2);
}
</style>
