<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
        Histórico de Transações
      </h4>
      <p class="text-subtitle1 text-grey-6 q-ma-none">
        Visualize e filtre todas as suas transações
      </p>
    </div>

    <!-- Filtros -->
    <q-card flat class="filter-card q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">Filtros</div>
        
        <!-- Filtros de Período Rápido -->
        <div class="q-mb-md">
          <label class="text-subtitle2 text-weight-medium text-grey-8 q-mb-sm block">
            Período
          </label>
          <q-btn-toggle
            v-model="quickFilter"
            :options="quickFilterOptions"
            color="primary"
            toggle-color="primary"
            class="full-width"
            unelevated
            @update:model-value="applyQuickFilter"
          />
        </div>

        <!-- Filtro de Data Personalizado -->
        <div class="row q-gutter-md q-mb-md">
          <q-input
            v-model="customDateRange.from"
            type="date"
            label="Data Inicial"
            outlined
            class="col"
            @update:model-value="applyCustomFilter"
          >
            <template #prepend>
              <q-icon name="event" class="text-grey-6" />
            </template>
          </q-input>
          
          <q-input
            v-model="customDateRange.to"
            type="date"
            label="Data Final"
            outlined
            class="col"
            @update:model-value="applyCustomFilter"
          >
            <template #prepend>
              <q-icon name="event" class="text-grey-6" />
            </template>
          </q-input>
        </div>

        <!-- Outros Filtros -->
        <div class="row q-gutter-md">
          <q-select
            v-model="typeFilter"
            :options="typeFilterOptions"
            label="Tipo de Transação"
            outlined
            clearable
            class="col"
            @update:model-value="filterTransactions"
          />
          
          <q-select
            v-model="categoryFilter"
            :options="categoryOptions"
            label="Categoria"
            outlined
            clearable
            class="col"
            @update:model-value="filterTransactions"
          />
          
          <q-input
            v-model="searchFilter"
            label="Buscar descrição"
            outlined
            clearable
            class="col"
            @update:model-value="filterTransactions"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <!-- Resumo do Período -->
        <div class="row q-gutter-md q-mt-md" v-if="filteredTransactions.length > 0">
          <q-card flat class="col summary-card bg-positive text-white">
            <q-card-section class="text-center">
              <div class="text-h6">{{ formatCurrency(periodSummary.income) }}</div>
              <div class="text-caption">Total Receitas</div>
            </q-card-section>
          </q-card>
          
          <q-card flat class="col summary-card bg-negative text-white">
            <q-card-section class="text-center">
              <div class="text-h6">{{ formatCurrency(Math.abs(periodSummary.expense)) }}</div>
              <div class="text-caption">Total Despesas</div>
            </q-card-section>
          </q-card>
          
          <q-card flat class="col summary-card" :class="periodSummary.balance >= 0 ? 'bg-positive text-white' : 'bg-negative text-white'">
            <q-card-section class="text-center">
              <div class="text-h6">{{ formatCurrency(periodSummary.balance) }}</div>
              <div class="text-caption">Saldo do Período</div>
            </q-card-section>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <!-- Lista de Transações -->
    <q-card flat class="transaction-list-card">
      <q-card-section class="q-pa-none">
        <div class="q-pa-md border-bottom">
          <div class="row items-center justify-between">
            <div class="text-h6">Transações ({{ filteredTransactions.length }})</div>
            <q-btn
              icon="refresh"
              flat
              round
              @click="loadTransactions"
              :loading="loading"
            >
              <q-tooltip>Atualizar</q-tooltip>
            </q-btn>
          </div>
        </div>

        <q-list separator v-if="filteredTransactions.length > 0">
          <q-item
            v-for="transaction in paginatedTransactions"
            :key="transaction.id"
            class="transaction-item"
          >
            <q-item-section avatar>
              <q-avatar
                :color="transaction.amount >= 0 ? 'positive' : 'negative'"
                text-color="white"
                :icon="transaction.amount >= 0 ? 'trending_up' : 'trending_down'"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">
                {{ transaction.description || 'Sem descrição' }}
              </q-item-label>
              <q-item-label caption class="row items-center q-gutter-sm">
                <span>{{ formatDate(transaction.date) }}</span>
                <q-chip
                  v-if="transaction.category"
                  size="sm"
                  dense
                  :color="transaction.amount >= 0 ? 'positive' : 'negative'"
                  text-color="white"
                >
                  {{ transaction.category }}
                </q-chip>
                <q-chip
                  v-if="transaction.account"
                  size="sm"
                  dense
                  color="grey-6"
                  text-color="white"
                >
                  {{ transaction.account }}
                </q-chip>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="text-right">
                <div
                  class="text-h6 text-weight-bold"
                  :class="transaction.amount >= 0 ? 'text-positive' : 'text-negative'"
                >
                  {{ formatCurrency(transaction.amount) }}
                </div>
                <div class="text-caption text-grey-6">
                  {{ transaction.amount >= 0 ? 'Receita' : 'Despesa' }}
                </div>
                
                <!-- Status de pagamento para despesas -->
                <div v-if="transaction.amount < 0" class="q-mt-xs">
                  <q-chip
                    :color="transaction.is_paid ? 'positive' : 'warning'"
                    :text-color="transaction.is_paid ? 'white' : 'black'"
                    size="sm"
                    dense
                    :icon="transaction.is_paid ? 'check_circle' : 'schedule'"
                    clickable
                    @click="togglePaymentStatus(transaction)"
                  >
                    {{ transaction.is_paid ? 'Pago' : 'Pendente' }}
                  </q-chip>
                  
                  <!-- Data de vencimento -->
                  <div v-if="transaction.due_date" class="text-caption text-grey-6 q-mt-xs">
                    Venc: {{ formatDate(transaction.due_date) }}
                  </div>
                  
                  <!-- Data de pagamento -->
                  <div v-if="transaction.is_paid && transaction.payment_date" class="text-caption text-positive q-mt-xs">
                    Pago em: {{ formatDate(transaction.payment_date) }}
                  </div>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Estado Vazio -->
        <div v-else class="q-pa-xl text-center text-grey-6">
          <q-icon name="receipt_long" size="64px" class="q-mb-md" />
          <div class="text-h6 q-mb-sm">Nenhuma transação encontrada</div>
          <div class="text-body2">
            {{ hasFilters ? 'Tente ajustar os filtros para ver mais resultados' : 'Adicione sua primeira transação para começar' }}
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="filteredTransactions.length > itemsPerPage" class="q-pa-md border-top">
          <q-pagination
            v-model="currentPage"
            :max="totalPages"
            direction-links
            boundary-links
            color="primary"
            class="justify-center"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'TransactionHistoryPage' })

import { ref, onMounted, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

interface Transaction {
  id: number
  date: string
  amount: number
  description: string
  type: 'income' | 'expense'
  category?: string
  account?: string
  category_id?: number
  account_id?: number
  due_date?: string
  is_paid?: boolean
  payment_date?: string
  installment_number?: number
  total_installments?: number
  installment_group_id?: string
}

interface Category {
  id: number
  name: string
  type: 'income' | 'expense'
}

interface Account {
  id: number
  name: string
}

const $q = useQuasar()

// Estado
const transactions = ref<Transaction[]>([])
const categories = ref<Category[]>([])
const accounts = ref<Account[]>([])
const loading = ref(false)

// Filtros
const quickFilter = ref('month')
const customDateRange = ref({
  from: '',
  to: ''
})
const typeFilter = ref<string | null>(null)
const categoryFilter = ref<number | null>(null)
const searchFilter = ref('')

// Paginação
const currentPage = ref(1)
const itemsPerPage = 20

// Opções de filtro
const quickFilterOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
  { label: 'Ano', value: 'year' },
  { label: 'Personalizado', value: 'custom' }
]

const typeFilterOptions = [
  { label: 'Receitas', value: 'income' },
  { label: 'Despesas', value: 'expense' }
]

// Computed
const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    label: cat.name,
    value: cat.id
  }))
})

const filteredTransactions = computed(() => {
  let filtered = [...transactions.value]

  // Filtro de data
  if (quickFilter.value !== 'custom') {
    const dateRange = getDateRange(quickFilter.value)
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date)
      return transactionDate >= dateRange.start && transactionDate <= dateRange.end
    })
  } else if (customDateRange.value.from && customDateRange.value.to) {
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date)
      const fromDate = new Date(customDateRange.value.from)
      const toDate = new Date(customDateRange.value.to)
      return transactionDate >= fromDate && transactionDate <= toDate
    })
  }

  // Filtro de tipo
  if (typeFilter.value) {
    filtered = filtered.filter(t => t.type === typeFilter.value)
  }

  // Filtro de categoria
  if (categoryFilter.value) {
    filtered = filtered.filter(t => t.category_id === categoryFilter.value)
  }

  // Filtro de busca
  if (searchFilter.value) {
    const search = searchFilter.value.toLowerCase()
    filtered = filtered.filter(t => 
      t.description?.toLowerCase().includes(search) ||
      t.category?.toLowerCase().includes(search) ||
      t.account?.toLowerCase().includes(search)
    )
  }

  // Ordenar por data (mais recente primeiro)
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage)
})

const periodSummary = computed(() => {
  const income = filteredTransactions.value
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  const expense = filteredTransactions.value
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0)
  
  return {
    income,
    expense,
    balance: income + expense
  }
})

const hasFilters = computed(() => {
  return typeFilter.value || categoryFilter.value || searchFilter.value || 
         (customDateRange.value.from && customDateRange.value.to)
})

// Métodos
const getDateRange = (period: string) => {
  const now = new Date()
  const start = new Date()
  const end = new Date()

  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'week': {
      const dayOfWeek = now.getDay()
      start.setDate(now.getDate() - dayOfWeek)
      start.setHours(0, 0, 0, 0)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      break
    }
    case 'month':
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(start.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      break
    case 'year':
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      end.setMonth(11, 31)
      end.setHours(23, 59, 59, 999)
      break
  }

  return { start, end }
}

const applyQuickFilter = () => {
  if (quickFilter.value !== 'custom') {
    customDateRange.value = { from: '', to: '' }
  }
  currentPage.value = 1
}

const applyCustomFilter = () => {
  if (customDateRange.value.from || customDateRange.value.to) {
    quickFilter.value = 'custom'
  }
  currentPage.value = 1
}

const filterTransactions = () => {
  currentPage.value = 1
}

const loadTransactions = async () => {
  loading.value = true
  
  try {
    // Carregar transações
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('transactions')
      .select(`
        *,
        categories(name),
        accounts(name)
      `)
      .order('date', { ascending: false })

    if (transactionsError) throw transactionsError

    transactions.value = (transactionsData || []).map(t => ({
      ...t,
      date: t.date || new Date().toISOString().split('T')[0],
      category: t.categories?.name || 'Sem categoria',
      account: t.accounts?.name || 'Sem conta',
      type: t.amount >= 0 ? 'income' : 'expense',
      due_date: t.due_date,
      is_paid: t.is_paid || false,
      payment_date: t.payment_date
    }))

    // Se não houver transações, criar algumas de exemplo
    if (transactions.value.length === 0) {
      const sampleTransactions: Transaction[] = [
        {
          id: 1,
          date: new Date().toISOString().split('T')[0] as string,
          amount: 2500,
          description: 'Salário',
          type: 'income',
          category: 'Salário',
          account: 'Conta Corrente'
        },
        {
          id: 2,
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0] as string,
          amount: -150,
          description: 'Supermercado',
          type: 'expense',
          category: 'Alimentação',
          account: 'Cartão de Crédito'
        },
        {
          id: 3,
          date: new Date(Date.now() - 172800000).toISOString().split('T')[0] as string,
          amount: -80,
          description: 'Combustível',
          type: 'expense',
          category: 'Transporte',
          account: 'Conta Corrente'
        }
      ]
      transactions.value = sampleTransactions
    }

  } catch (error) {
    console.error('Erro ao carregar transações:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar transações',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (error) throw error
    
    categories.value = data || []

    if (categories.value.length === 0) {
      categories.value = [
        { id: 1, name: 'Alimentação', type: 'expense' },
        { id: 2, name: 'Transporte', type: 'expense' },
        { id: 3, name: 'Salário', type: 'income' },
        { id: 4, name: 'Freelance', type: 'income' }
      ]
    }
  } catch (error) {
    console.error('Erro ao carregar categorias:', error)
  }
}

const loadAccounts = async () => {
  try {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('name')

    if (error) throw error
    
    accounts.value = data || []

    if (accounts.value.length === 0) {
      accounts.value = [
        { id: 1, name: 'Conta Corrente' },
        { id: 2, name: 'Poupança' },
        { id: 3, name: 'Cartão de Crédito' }
      ]
    }
  } catch (error) {
    console.error('Erro ao carregar contas:', error)
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

const togglePaymentStatus = async (transaction: Transaction) => {
  try {
    const newStatus = !transaction.is_paid
    const updateData: { is_paid: boolean; payment_date: string | null } = {
       is_paid: newStatus,
       payment_date: newStatus ? new Date().toISOString().split('T')[0] as string : null
     }
    
    const { error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transaction.id)
    
    if (error) throw error
    
    // Atualizar localmente
    const index = transactions.value.findIndex(t => t.id === transaction.id)
    if (index !== -1) {
      transactions.value[index] = {
        ...transactions.value[index],
        is_paid: updateData.is_paid,
        payment_date: updateData.payment_date
      } as Transaction
    }
    
    $q.notify({
      type: 'positive',
      message: newStatus ? 'Transação marcada como paga' : 'Transação marcada como pendente',
      position: 'top'
    })
    
  } catch (error) {
    console.error('Erro ao atualizar status de pagamento:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao atualizar status de pagamento',
      position: 'top'
    })
  }
}

// Watchers
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onMounted(() => {
  void loadTransactions()
  void loadCategories()
  void loadAccounts()
})
</script>

<style scoped>
.filter-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.transaction-list-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.summary-card {
  border-radius: 12px;
  min-height: 80px;
}

.transaction-item {
  transition: all 0.2s ease;
}

.transaction-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.block {
  display: block;
}

.q-btn-toggle {
  border-radius: 12px;
  overflow: hidden;
}

.q-btn-toggle .q-btn {
  border-radius: 0;
  flex: 1;
  padding: 8px 12px;
  font-size: 12px;
}

.q-btn-toggle .q-btn:first-child {
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}

.q-btn-toggle .q-btn:last-child {
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Responsividade */
@media (max-width: 768px) {
  .row.q-gutter-md {
    flex-direction: column;
  }
  
  .row.q-gutter-md > .col {
    margin-bottom: 8px;
  }
  
  .summary-card {
    margin-bottom: 8px;
  }
  
  .q-btn-toggle .q-btn {
    font-size: 10px;
    padding: 6px 8px;
  }
}

@media (max-width: 600px) {
  .q-card-section {
    padding: 16px;
  }
  
  .text-h4 {
    font-size: 1.5rem;
  }
  
  .text-h6 {
    font-size: 1.1rem;
  }
}
</style>