<template>
  <q-page class="q-pa-md">
    <div class="text-h4 q-mb-lg">
      <q-icon name="dashboard" class="q-mr-sm" />
      Dashboard Financeiro
    </div>

    <!-- Cards de Resumo -->
    <div class="row q-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card class="bg-green-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h6 text-green-8">Receitas do Mês</div>
                <div class="text-h4 text-green-9">{{ formatCurrency(monthlyIncome) }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="trending_up" size="3rem" class="text-green-6" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-red-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h6 text-red-8">Despesas do Mês</div>
                <div class="text-h4 text-red-9">{{ formatCurrency(monthlyExpenses) }}</div>
              </div>
              <div class="col-auto">
                <q-icon name="trending_down" size="3rem" class="text-red-6" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="bg-blue-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col">
                <div class="text-h6 text-blue-8">Saldo do Mês</div>
                <div class="text-h4" :class="monthlyBalance >= 0 ? 'text-green-9' : 'text-red-9'">
                  {{ formatCurrency(monthlyBalance) }}
                </div>
              </div>
              <div class="col-auto">
                <q-icon 
                  :name="monthlyBalance >= 0 ? 'account_balance_wallet' : 'money_off'" 
                  size="3rem" 
                  :class="monthlyBalance >= 0 ? 'text-green-6' : 'text-red-6'"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Calendário de Despesas -->
    <div class="row">
      <div class="col-12">
        <ExpenseCalendar />
      </div>
    </div>

    <!-- Próximas Despesas -->
    <div class="row q-mt-lg">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="schedule" class="q-mr-sm" />
              Próximas Despesas (7 dias)
            </div>
            
            <q-list v-if="upcomingExpenses.length > 0" separator>
              <q-item 
                v-for="expense in upcomingExpenses" 
                :key="expense.id"
                class="q-pa-md"
              >
                <q-item-section avatar>
                  <q-avatar 
                    :color="expense.isOverdue ? 'red' : 'orange'"
                    text-color="white"
                    icon="receipt"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ expense.description }}</q-item-label>
                  <q-item-label caption>
                    {{ formatDate(expense.date) }} • {{ expense.category }}
                  </q-item-label>
                  <q-item-label caption v-if="expense.isOverdue" class="text-red">
                    <q-icon name="warning" size="xs" class="q-mr-xs" />
                    Em atraso
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="text-weight-bold text-red">
                    {{ formatCurrency(expense.amount) }}
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            
            <div v-else class="text-center text-grey-6 q-pa-lg">
              <q-icon name="check_circle" size="3rem" class="q-mb-md" />
              <div>Nenhuma despesa nos próximos 7 dias!</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from 'src/boot/supabase'
import ExpenseCalendar from 'src/components/ExpenseCalendar.vue'

interface Transaction {
  id: number
  description: string
  amount: number
  date: string
  type: 'income' | 'expense'
  category: string
  isOverdue?: boolean
}

interface SupabaseTransaction {
  id: number
  description: string
  amount: number
  date: string
  type: 'income' | 'expense'
  categories?: { name: string }[] | { name: string } | null
}

function getCategoryName(categories: { name: string }[] | { name: string } | null | undefined): string {
  if (!categories) return 'Sem categoria'
  if (Array.isArray(categories)) {
    return categories[0]?.name || 'Sem categoria'
  }
  return categories.name || 'Sem categoria'
}

const transactions = ref<Transaction[]>([])

const monthlyIncome = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return transactions.value
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'income' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + t.amount, 0)
})

const monthlyExpenses = computed(() => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return transactions.value
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'expense' && 
             transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
})

const monthlyBalance = computed(() => {
  return monthlyIncome.value - monthlyExpenses.value
})

const upcomingExpenses = computed(() => {
  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)
  
  today.setHours(0, 0, 0, 0)
  
  return transactions.value
    .filter(t => {
      const transactionDate = new Date(t.date)
      return t.type === 'expense' && transactionDate <= nextWeek
    })
    .map(t => ({
      ...t,
      isOverdue: new Date(t.date) < today
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const loadTransactions = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        description,
        amount,
        date,
        type,
        categories(name)
      `)
      .order('date', { ascending: false })
    
    if (error) throw error
    
    transactions.value = (data || []).map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date || new Date().toISOString().split('T')[0],
      type: transaction.type,
      category: getCategoryName((transaction as SupabaseTransaction).categories)
    }))
  } catch (error) {
    console.error('Erro ao carregar transações:', error)
    
    // Dados de exemplo para demonstração
    const today = new Date()
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    transactions.value = [
      {
        id: 1,
        description: 'Salário',
        amount: 5000,
        date: thisMonth.toISOString().split('T')[0] as string,
        type: 'income',
        category: 'Salário'
      },
      {
        id: 2,
        description: 'Freelance',
        amount: 1500,
        date: new Date(thisMonth.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] as string,
        type: 'income',
        category: 'Trabalho'
      },
      {
        id: 3,
        description: 'Conta de Luz',
        amount: -150,
        date: today.toISOString().split('T')[0] as string,
        type: 'expense',
        category: 'Utilidades'
      },
      {
        id: 4,
        description: 'Internet',
        amount: -89.90,
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] as string,
        type: 'expense',
        category: 'Utilidades'
      },
      {
        id: 5,
        description: 'Supermercado',
        amount: -250,
        date: new Date(today.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0] as string,
        type: 'expense',
        category: 'Alimentação'
      }
    ]
  }
}

onMounted(() => {
  void loadTransactions()
})
</script>
