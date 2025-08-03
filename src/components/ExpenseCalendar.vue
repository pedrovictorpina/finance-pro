<template>
  <div class="expense-calendar">
    <q-card class="q-ma-md">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="event" class="q-mr-sm" />
          Calendário de Despesas
        </div>
        
        <!-- Navegação do mês -->
        <div class="row items-center justify-between q-mb-md">
          <q-btn 
            flat 
            round 
            icon="chevron_left" 
            @click="previousMonth"
            size="sm"
          />
          <div class="text-h6">
            {{ currentMonthYear }}
          </div>
          <q-btn 
            flat 
            round 
            icon="chevron_right" 
            @click="nextMonth"
            size="sm"
          />
        </div>

        <!-- Calendário -->
        <div class="calendar-grid">
          <!-- Cabeçalho dos dias da semana -->
          <div 
            v-for="day in weekDays" 
            :key="day"
            class="calendar-header"
          >
            {{ day }}
          </div>

          <!-- Dias do mês -->
          <div 
            v-for="day in calendarDays" 
            :key="day.date"
            class="calendar-day"
            :class="{
              'other-month': !day.isCurrentMonth,
              'today': day.isToday,
              'has-expenses': day.expenses.length > 0,
              'has-overdue': day.hasOverdue
            }"
            @click="openDayExpenses(day)"
          >
            <div class="day-number">{{ day.dayNumber }}</div>
            <div v-if="day.expenses.length > 0" class="expense-indicator">
              <q-badge 
                :color="day.hasOverdue ? 'red' : 'orange'"
                :label="day.expenses.length"
                rounded
              />
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Modal de despesas do dia -->
    <q-dialog v-model="showDayModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">
            Despesas - {{ selectedDayFormatted }}
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="selectedDayExpenses.length === 0" class="text-center text-grey-6">
            Nenhuma despesa para este dia
          </div>
          
          <div v-else>
            <q-list separator>
              <q-item 
                v-for="expense in selectedDayExpenses" 
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
                    {{ expense.category }} • {{ expense.account }}
                  </q-item-label>
                  <q-item-label caption v-if="expense.isOverdue" class="text-red">
                    <q-icon name="warning" size="xs" class="q-mr-xs" />
                    Despesa em atraso
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <div class="column items-end">
                    <div class="text-weight-bold text-red">
                      {{ formatCurrency(expense.amount) }}
                    </div>
                    <q-btn
                      v-if="!expense.isPaid"
                      size="sm"
                      color="green"
                      label="Marcar como Pago"
                      @click="markAsPaid(expense)"
                      class="q-mt-xs"
                    />
                    <q-chip
                      v-else
                      size="sm"
                      color="green"
                      text-color="white"
                      label="Pago"
                      icon="check"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" @click="showDayModal = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

interface Expense {
  id: number
  description: string
  amount: number
  date: string
  category: string
  account: string
  isPaid: boolean
  isOverdue?: boolean
}

function getCategoryNameFromExpense(categories: { name: string }[] | { name: string } | null | undefined): string {
  if (!categories) return 'Sem categoria'
  if (Array.isArray(categories)) {
    return categories[0]?.name || 'Sem categoria'
  }
  return categories.name || 'Sem categoria'
}

function getAccountNameFromExpense(accounts: { name: string }[] | { name: string } | null | undefined): string {
  if (!accounts) return 'Sem conta'
  if (Array.isArray(accounts)) {
    return accounts[0]?.name || 'Sem conta'
  }
  return accounts.name || 'Sem conta'
}

interface CalendarDay {
  date: string
  dayNumber: number
  isCurrentMonth: boolean
  isToday: boolean
  expenses: Expense[]
  hasOverdue: boolean
}

const $q = useQuasar()

const currentDate = ref(new Date())
const showDayModal = ref(false)
const selectedDay = ref<CalendarDay | null>(null)
const expenses = ref<Expense[]>([])

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })
})

const selectedDayFormatted = computed(() => {
  if (!selectedDay.value) return ''
  return new Date(selectedDay.value.date).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const selectedDayExpenses = computed(() => {
  return selectedDay.value?.expenses || []
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days: CalendarDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const dateString = date.toISOString().split('T')[0] as string
    const dayExpenses = expenses.value.filter(expense => expense.date === dateString)
    const hasOverdue = dayExpenses.some(expense => expense.isOverdue && !expense.isPaid)
    
    days.push({
      date: dateString,
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: date.getTime() === today.getTime(),
      expenses: dayExpenses,
      hasOverdue
    })
  }
  
  return days
})

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const openDayExpenses = (day: CalendarDay) => {
  if (day.expenses.length > 0) {
    selectedDay.value = day
    showDayModal.value = true
  }
}

const markAsPaid = async (expense: Expense) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .update({ is_paid: true })
      .eq('id', expense.id)
    
    if (error) throw error
    
    expense.isPaid = true
    
    $q.notify({
      type: 'positive',
      message: 'Despesa marcada como paga!',
      position: 'top'
    })
  } catch (error) {
    console.error('Erro ao marcar despesa como paga:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao marcar despesa como paga',
      position: 'top'
    })
  }
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const loadExpenses = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        description,
        amount,
        date,
        is_paid,
        categories(name),
        accounts(name)
      `)
      .eq('type', 'expense')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
    
    if (error) throw error
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    expenses.value = (data || []).map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      date: transaction.date,
      category: getCategoryNameFromExpense(transaction.categories),
      account: getAccountNameFromExpense(transaction.accounts),
      isPaid: transaction.is_paid || false,
      isOverdue: new Date(transaction.date) < today && !transaction.is_paid
    }))
  } catch (error) {
    console.error('Erro ao carregar despesas:', error)
    
    // Dados de exemplo para demonstração
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)
    const overdue = new Date(today)
    overdue.setDate(today.getDate() - 2)
    
    expenses.value = [
      {
        id: 1,
        description: 'Conta de Luz',
        amount: 150.00,
        date: today.toISOString().split('T')[0] as string,
        category: 'Utilidades',
        account: 'Conta Corrente',
        isPaid: false,
        isOverdue: false
      },
      {
        id: 2,
        description: 'Internet',
        amount: 89.90,
        date: tomorrow.toISOString().split('T')[0] as string,
        category: 'Utilidades',
        account: 'Conta Corrente',
        isPaid: false,
        isOverdue: false
      },
      {
        id: 3,
        description: 'Aluguel',
        amount: 1200.00,
        date: nextWeek.toISOString().split('T')[0] as string,
        category: 'Moradia',
        account: 'Conta Corrente',
        isPaid: false,
        isOverdue: false
      },
      {
        id: 4,
        description: 'Cartão de Crédito',
        amount: 450.00,
        date: overdue.toISOString().split('T')[0] as string,
        category: 'Cartão',
        account: 'Conta Corrente',
        isPaid: false,
        isOverdue: true
      }
    ]
  }
}

onMounted(() => {
  void loadExpenses()
})
</script>

<style scoped>
.expense-calendar {
  width: 100%;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  border: 1px solid #e0e0e0;
}

.calendar-header {
  background-color: #f5f5f5;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
}

.calendar-day {
  background-color: white;
  min-height: 60px;
  padding: 4px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: background-color 0.2s;
}

.calendar-day:hover {
  background-color: #f0f0f0;
}

.calendar-day.other-month {
  background-color: #fafafa;
  color: #bdbdbd;
}

.calendar-day.today {
  background-color: #e3f2fd;
  font-weight: bold;
}

.calendar-day.has-expenses {
  background-color: #fff3e0;
}

.calendar-day.has-overdue {
  background-color: #ffebee;
}

.day-number {
  font-size: 14px;
  margin-bottom: 2px;
}

.expense-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
}

@media (max-width: 600px) {
  .calendar-day {
    min-height: 50px;
    font-size: 12px;
  }
  
  .day-number {
    font-size: 12px;
  }
}
</style>