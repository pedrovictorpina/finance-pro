<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
        Nova Transação
      </h4>
      <p class="text-subtitle1 text-grey-6 q-ma-none">
        Adicione uma nova receita ou despesa
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
                type="textarea"
                label="Descrição (opcional)"
                outlined
                rows="3"
                class="custom-input"
              >
                <template #prepend>
                  <q-icon name="description" class="text-grey-6" />
                </template>
              </q-input>

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
                  label="Salvar Transação" 
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
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

interface Account { id: number; name: string }
interface Category { id: number; name: string; type?: string }

const router = useRouter()
const $q = useQuasar()

const form = ref({
  date: new Date().toISOString().split('T')[0], // Data atual como padrão
  amount: null as number | null,
  account_id: null as number | null,
  category_id: null as number | null,
  description: '',
  type: 'expense' // Padrão para despesa
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
    // Preparar dados da transação
    const transactionData = {
      ...form.value,
      amount: form.value.type === 'expense' ? -Math.abs(form.value.amount!) : Math.abs(form.value.amount!),
      created_at: new Date().toISOString()
    }

    const { error } = await supabase
       .from('transactions')
       .insert([transactionData])

    if (error) {
      throw error
    }

    $q.notify({
      type: 'positive',
      message: 'Transação salva com sucesso!',
      position: 'top'
    })

    // Resetar formulário
    form.value = {
      date: new Date().toISOString().split('T')[0],
      amount: null,
      account_id: null,
      category_id: null,
      description: '',
      type: 'expense'
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

onMounted(async () => {
  try {
    // Buscar contas
    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .order('name')
    
    if (accountsError) throw accountsError
    accounts.value = (accountsData ?? []) as Account[]

    // Buscar categorias
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (categoriesError) throw categoriesError
    categories.value = (categoriesData ?? []) as Category[]

    // Se não houver dados, criar alguns exemplos
    if (accounts.value.length === 0) {
      accounts.value = [
        { id: 1, name: 'Conta Corrente' },
        { id: 2, name: 'Poupança' },
        { id: 3, name: 'Cartão de Crédito' }
      ]
    }

    if (categories.value.length === 0) {
      categories.value = [
        { id: 1, name: 'Alimentação', type: 'expense' },
        { id: 2, name: 'Transporte', type: 'expense' },
        { id: 3, name: 'Salário', type: 'income' },
        { id: 4, name: 'Freelance', type: 'income' },
        { id: 5, name: 'Lazer', type: 'expense' }
      ]
    }

  } catch {
     console.error('Erro ao carregar dados')
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
