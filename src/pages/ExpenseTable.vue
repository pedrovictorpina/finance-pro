<template>
  <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-dark' : 'bg-grey-1'">
    <div class="row q-gutter-md">
      <!-- Header -->
      <div class="col-12">
        <q-card flat :class="$q.dark.isActive ? 'bg-grey-9 text-white' : 'bg-gradient-primary text-white'">
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-h4 text-weight-bold q-mb-xs">
                  <q-icon name="table_chart" size="md" class="q-mr-sm" />
                  Despesas Mensais
                </div>
                <div class="text-subtitle1 opacity-80">
                  Controle detalhado de gastos mês a mês por categoria
                </div>
              </div>
              <div class="col-auto">
                <q-btn 
                  flat 
                  round 
                  icon="refresh" 
                  size="lg" 
                  @click="loadExpenseData"
                  class="q-ml-md"
                >
                  <q-tooltip>Atualizar dados</q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Filtros -->
      <div class="col-12">
        <q-card flat :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'" class="q-pa-md">
          <div class="row q-gutter-md items-center">
            <div class="col-12 col-md-2">
              <q-select
                v-model="selectedYear"
                :options="yearOptions"
                label="Ano"
                outlined
                dense
                :dark="$q.dark.isActive"
                @update:model-value="filterData"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-select
                v-model="selectedMonth"
                :options="monthOptions"
                label="Mês"
                outlined
                dense
                clearable
                :dark="$q.dark.isActive"
                @update:model-value="filterData"
              />
            </div>
            <div class="col-12 col-md-3">
              <q-input
                v-model="searchText"
                label="Buscar categoria"
                outlined
                dense
                clearable
                :dark="$q.dark.isActive"
                @update:model-value="filterData"
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                color="primary"
                icon="view_module"
                :label="viewMode === 'table' ? 'Cards' : 'Tabela'"
                @click="toggleViewMode"
                class="full-width"
              />
            </div>
            <div class="col-12 col-md-2">
              <q-btn
                color="secondary"
                icon="download"
                label="Exportar"
                @click="exportData"
                class="full-width"
              />
            </div>
          </div>
        </q-card>
      </div>

      <!-- Resumo -->
      <div class="col-12">
        <div class="row q-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat :class="$q.dark.isActive ? 'bg-green-9 text-white' : 'bg-positive text-white'" class="stats-card">
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="trending_up" size="32px" class="q-mb-sm" />
                <div class="text-h6 text-weight-bold">{{ $filters.formatBRL(totalExpenses) }}</div>
                <div class="text-caption opacity-80">Total Período</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat :class="$q.dark.isActive ? 'bg-blue-9 text-white' : 'bg-info text-white'" class="stats-card">
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="calendar_month" size="32px" class="q-mb-sm" />
                <div class="text-h6 text-weight-bold">{{ filteredData.length }}</div>
                <div class="text-caption opacity-80">Meses Exibidos</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat :class="$q.dark.isActive ? 'bg-orange-9 text-white' : 'bg-warning text-white'" class="stats-card">
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="calculate" size="32px" class="q-mb-sm" />
                <div class="text-h6 text-weight-bold">{{ $filters.formatBRL(averageMonthly) }}</div>
                <div class="text-caption opacity-80">Média Mensal</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat :class="$q.dark.isActive ? 'bg-purple-9 text-white' : 'bg-secondary text-white'" class="stats-card">
              <q-card-section class="text-center q-pa-lg">
                <q-icon name="trending_down" size="32px" class="q-mb-sm" />
                <div class="text-h6 text-weight-bold">{{ $filters.formatBRL(highestMonth) }}</div>
                <div class="text-caption opacity-80">Maior Gasto</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Visualização em Cards (Mês a Mês) -->
      <div class="col-12" v-if="viewMode === 'cards'">
        <div class="row q-gutter-md">
          <div class="col-12 col-md-6 col-lg-4" v-for="month in filteredData" :key="month.id">
            <q-card flat :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'" class="month-card">
              <q-card-section class="q-pa-lg">
                <div class="row items-center q-mb-md">
                  <div class="col">
                    <div class="text-h6 text-weight-bold" :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'">
                      <q-icon :name="getMonthIcon(month.month)" class="q-mr-sm" />
                      {{ formatMonth(month.month, month.year) }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <q-chip :color="getMonthChipColor(month.total)" text-color="white" class="text-weight-bold">
                      {{ $filters.formatBRL(month.total) }}
                    </q-chip>
                  </div>
                </div>
                
                <div class="expense-categories">
                  <div class="row q-gutter-xs q-mb-xs" v-for="category in getMonthCategories(month)" :key="category.name">
                    <div class="col-6">
                      <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-6'">{{ category.label }}</div>
                    </div>
                    <div class="col-6 text-right">
                      <div class="text-weight-medium" :class="getAmountClass(category.value)">
                        {{ $filters.formatBRL(category.value) }}
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Tabela -->
      <div class="col-12" v-else>
        <q-card flat :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'">
          <q-card-section class="q-pa-none">
            <q-table
              :rows="filteredData"
              :columns="columns"
              row-key="id"
              :pagination="pagination"
              :loading="loading"
              flat
              :dark="$q.dark.isActive"
              class="expense-table"
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-weight-bold"
                    :class="$q.dark.isActive ? 'bg-grey-8 text-white' : 'bg-grey-2'"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props" :class="getRowClass(props.row)">
                  <q-td key="month" :props="props" class="text-weight-medium">
                    <div class="row items-center">
                      <q-icon :name="getMonthIcon(props.row.month)" class="q-mr-sm" :color="$q.dark.isActive ? 'white' : 'primary'" />
                      <span :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'">
                        {{ formatMonth(props.row.month, props.row.year) }}
                      </span>
                    </div>
                  </q-td>
                  
                  <q-td key="will" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.will)">
                      {{ $filters.formatBRL(props.row.will) }}
                    </div>
                  </q-td>
                  
                  <q-td key="itau" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.itau)">
                      {{ $filters.formatBRL(props.row.itau) }}
                    </div>
                  </q-td>
                  
                  <q-td key="willPedro" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.willPedro)">
                      {{ $filters.formatBRL(props.row.willPedro) }}
                    </div>
                  </q-td>
                  
                  <q-td key="facuJuli" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.facuJuli)">
                      {{ $filters.formatBRL(props.row.facuJuli) }}
                    </div>
                  </q-td>
                  
                  <q-td key="willJuli" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.willJuli)">
                      {{ $filters.formatBRL(props.row.willJuli) }}
                    </div>
                  </q-td>
                  
                  <q-td key="nubank" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.nubank)">
                      {{ $filters.formatBRL(props.row.nubank) }}
                    </div>
                  </q-td>
                  
                  <q-td key="itaucard" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.itaucard)">
                      {{ $filters.formatBRL(props.row.itaucard) }}
                    </div>
                  </q-td>
                  
                  <q-td key="casa" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.casa)">
                      {{ $filters.formatBRL(props.row.casa) }}
                    </div>
                  </q-td>
                  
                  <q-td key="agua" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.agua)">
                      {{ $filters.formatBRL(props.row.agua) }}
                    </div>
                  </q-td>
                  
                  <q-td key="energia" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.energia)">
                      {{ $filters.formatBRL(props.row.energia) }}
                    </div>
                  </q-td>
                  
                  <q-td key="dizimo" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.dizimo)">
                      {{ $filters.formatBRL(props.row.dizimo) }}
                    </div>
                  </q-td>
                  
                  <q-td key="internet" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.internet)">
                      {{ $filters.formatBRL(props.row.internet) }}
                    </div>
                  </q-td>
                  
                  <q-td key="emprestimo" :props="props">
                    <div class="text-weight-medium" :class="getAmountClass(props.row.emprestimo)">
                      {{ $filters.formatBRL(props.row.emprestimo) }}
                    </div>
                  </q-td>
                  
                  <q-td key="total" :props="props" class="text-weight-bold">
                    <div class="text-h6 text-primary">
                      {{ $filters.formatBRL(props.row.total) }}
                    </div>
                  </q-td>
                </q-tr>
              </template>

              <template v-slot:bottom>
                <div class="full-width row justify-between items-center q-pa-md" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-1'">
                  <div class="text-weight-bold text-h6" :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'">
                    Total Geral: {{ $filters.formatBRL(totalExpenses) }}
                  </div>
                  <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-6'">
                    {{ filteredData.length }} registros
                  </div>
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

interface ExpenseRow {
  id: string
  month: string
  year: number
  will: number
  itau: number
  willPedro: number
  facuJuli: number
  willJuli: number
  nubank: number
  itaucard: number
  casa: number
  agua: number
  energia: number
  dizimo: number
  internet: number
  emprestimo: number
  total: number
}

interface TableColumn {
  name: string
  label: string
  field: string
  align: 'left' | 'right' | 'center'
  sortable: boolean
}

const $q = useQuasar()

// Estado reativo
const loading = ref(false)
const selectedYear = ref<number | null>(null)
const selectedMonth = ref<string | null>(null)
const searchText = ref('')
const viewMode = ref('table')

// Dados da tabela (vazio para permitir correção dos valores)
const expenseData = ref<ExpenseRow[]>([])

// Configuração da paginação
const pagination = ref({
  page: 1,
  rowsPerPage: 12
})

// Colunas da tabela
const columns = ref<TableColumn[]>([
  { name: 'month', label: 'Mês/Ano', field: 'month', align: 'left' as const, sortable: true },
  { name: 'will', label: 'Will', field: 'will', align: 'right' as const, sortable: true },
  { name: 'itau', label: 'Itaú Juli', field: 'itau', align: 'right' as const, sortable: true },
  { name: 'willPedro', label: 'Will Pedro', field: 'willPedro', align: 'right' as const, sortable: true },
  { name: 'facuJuli', label: 'Facu Juli', field: 'facuJuli', align: 'right' as const, sortable: true },
  { name: 'willJuli', label: 'Will Juli', field: 'willJuli', align: 'right' as const, sortable: true },
  { name: 'nubank', label: 'Nubank', field: 'nubank', align: 'right' as const, sortable: true },
  { name: 'itaucard', label: 'Itaucard 6822', field: 'itaucard', align: 'right' as const, sortable: true },
  { name: 'casa', label: 'Casa', field: 'casa', align: 'right' as const, sortable: true },
  { name: 'agua', label: 'Água', field: 'agua', align: 'right' as const, sortable: true },
  { name: 'energia', label: 'Energia', field: 'energia', align: 'right' as const, sortable: true },
  { name: 'dizimo', label: 'Dízimo', field: 'dizimo', align: 'right' as const, sortable: true },
  { name: 'internet', label: 'Internet', field: 'internet', align: 'right' as const, sortable: true },
  { name: 'emprestimo', label: 'Empréstimo', field: 'emprestimo', align: 'right' as const, sortable: true },
  { name: 'total', label: 'Total', field: 'total', align: 'right' as const, sortable: true }
])

// Opções para filtros
const yearOptions = computed(() => {
  const years = [...new Set(expenseData.value.map(row => row.year))]
  return [{ label: 'Todos os anos', value: null }, ...years.map(year => ({ label: year.toString(), value: year }))]
})

const monthOptions = [
  { label: 'Todos os meses', value: null },
  { label: 'Janeiro', value: 'janeiro' },
  { label: 'Fevereiro', value: 'fevereiro' },
  { label: 'Março', value: 'março' },
  { label: 'Abril', value: 'abril' },
  { label: 'Maio', value: 'maio' },
  { label: 'Junho', value: 'junho' },
  { label: 'Julho', value: 'julho' },
  { label: 'Agosto', value: 'agosto' },
  { label: 'Setembro', value: 'setembro' },
  { label: 'Outubro', value: 'outubro' },
  { label: 'Novembro', value: 'novembro' },
  { label: 'Dezembro', value: 'dezembro' }
]

// Dados computados
const filteredData = computed(() => {
  let data = expenseData.value
  
  if (selectedYear.value) {
    data = data.filter(row => row.year === selectedYear.value)
  }
  
  if (selectedMonth.value) {
    data = data.filter(row => row.month.toLowerCase() === selectedMonth.value!.toLowerCase())
  }
  
  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    data = data.filter(row => 
      row.month.toLowerCase().includes(search) ||
      row.year.toString().includes(search)
    )
  }
  
  return data
})

// Computadas para estatísticas
const totalExpenses = computed(() => {
  return filteredData.value.reduce((sum, row) => sum + row.total, 0)
})

const averageMonthly = computed(() => {
  return filteredData.value.length > 0 ? totalExpenses.value / filteredData.value.length : 0
})

const highestMonth = computed(() => {
  return filteredData.value.length > 0 ? Math.max(...filteredData.value.map(row => row.total)) : 0
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'table' ? 'cards' : 'table'
}

// Métodos
const loadExpenseData = () => {
  loading.value = true
  // Simular carregamento
  setTimeout(() => {
    loading.value = false
    $q.notify({
      type: 'positive',
      message: 'Dados atualizados com sucesso!',
      position: 'top'
    })
  }, 1000)
}

const filterData = () => {
  // Filtros são aplicados automaticamente via computed
}

const exportData = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de exportação em desenvolvimento',
    position: 'top'
  })
}

const formatMonth = (month: string, year: number) => {
  const monthNames: { [key: string]: string } = {
    'janeiro': 'Jan', 'fevereiro': 'Fev', 'março': 'Mar', 'abril': 'Abr',
    'maio': 'Mai', 'junho': 'Jun', 'julho': 'Jul', 'agosto': 'Ago',
    'setembro': 'Set', 'outubro': 'Out', 'novembro': 'Nov', 'dezembro': 'Dez'
  }
  return `${monthNames[month]} ${year}`
}

const getMonthChipColor = (total: number) => {
  if (total > 3000) return 'red'
  if (total > 2500) return 'orange'
  if (total > 2000) return 'amber'
  return 'green'
}

const getMonthCategories = (month: ExpenseRow) => {
  return [
    { name: 'will', label: 'Will', value: month.will },
    { name: 'itau', label: 'Itaú Juli', value: month.itau },
    { name: 'willPedro', label: 'Will Pedro', value: month.willPedro },
    { name: 'facuJuli', label: 'Facu Juli', value: month.facuJuli },
    { name: 'willJuli', label: 'Will Juli', value: month.willJuli },
    { name: 'nubank', label: 'Nubank', value: month.nubank },
    { name: 'itaucard', label: 'Itaucard', value: month.itaucard },
    { name: 'casa', label: 'Casa', value: month.casa },
    { name: 'agua', label: 'Água', value: month.agua },
    { name: 'energia', label: 'Energia', value: month.energia },
    { name: 'dizimo', label: 'Dízimo', value: month.dizimo },
    { name: 'internet', label: 'Internet', value: month.internet },
    { name: 'emprestimo', label: 'Empréstimo', value: month.emprestimo }
  ].filter(cat => cat.value > 0)
}

const getMonthIcon = (month: string) => {
  const icons: { [key: string]: string } = {
    'janeiro': 'ac_unit', 'fevereiro': 'favorite', 'março': 'eco', 'abril': 'wb_sunny',
    'maio': 'local_florist', 'junho': 'beach_access', 'julho': 'ac_unit', 'agosto': 'wb_sunny',
    'setembro': 'eco', 'outubro': 'local_florist', 'novembro': 'cloud', 'dezembro': 'ac_unit'
  }
  return icons[month] || 'calendar_month'
}

const getRowClass = (row: ExpenseRow) => {
  if ($q.dark.isActive) {
    if (row.total > 3000) return 'bg-red-10'
    if (row.total > 2000) return 'bg-orange-10'
    return ''
  } else {
    if (row.total > 3000) return 'bg-red-1'
    if (row.total > 2000) return 'bg-orange-1'
    return ''
  }
}

const getAmountClass = (value: number) => {
  if (value === 0) return 'text-grey-5'
  if (value > 500) return 'text-red'
  if (value > 300) return 'text-orange'
  if (value > 100) return 'text-amber'
  return 'text-green'
}

// Lifecycle
onMounted(() => {
  // Definir ano atual como padrão
  selectedYear.value = new Date().getFullYear()
})
</script>

<style scoped>
.stats-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.expense-table {
  border-radius: 8px;
  overflow: hidden;
}

.expense-table .q-table__top,
.expense-table .q-table__bottom,
.expense-table thead tr:first-child th {
  background-color: #f5f5f5;
}

.expense-table tbody tr:hover {
  background-color: #f0f8ff;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.month-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  border: 1px solid transparent;
}

.month-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.body--dark .month-card {
  border-color: rgba(255, 255, 255, 0.1);
}

.body--dark .month-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
}

.expense-categories {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
  margin-top: 12px;
}

.body--dark .expense-categories {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.text-red { color: #f44336; }
.text-orange { color: #ff9800; }
.text-amber { color: #ffc107; }
.text-green { color: #4caf50; }
</style>