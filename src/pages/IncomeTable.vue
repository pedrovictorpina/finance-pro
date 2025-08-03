<template>
  <q-page class="q-pa-md" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-grey-1'">
    <div class="row q-gutter-md">
      <!-- Filtros -->
      <div class="col-12">
        <q-card flat :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-white'" class="filter-section">
          <q-card-section class="q-pa-lg">
            <div class="row q-gutter-md items-end">
              <div class="col-12 col-md-3">
                <q-select
                  v-model="selectedYear"
                  :options="yearOptions"
                  label="Filtrar por Ano"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  :dark="$q.dark.isActive"
                />
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  v-model="selectedMonth"
                  :options="monthOptions"
                  label="Filtrar por Mês"
                  outlined
                  dense
                  emit-value
                  map-options
                  clearable
                  :dark="$q.dark.isActive"
                />
              </div>
              <div class="col-12 col-md-4">
                <q-input
                  v-model="searchText"
                  label="Buscar..."
                  outlined
                  dense
                  clearable
                  :dark="$q.dark.isActive"
                >
                  <template v-slot:prepend>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  :color="viewMode === 'cards' ? 'primary' : 'grey'"
                  :icon="viewMode === 'cards' ? 'view_module' : 'table_chart'"
                  @click="toggleViewMode"
                  :label="viewMode === 'cards' ? 'Cards' : 'Tabela'"
                  no-caps
                  class="full-width"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Cards de Resumo -->
      <div class="col-12 col-md-3">
        <q-card flat :class="$q.dark.isActive ? 'bg-green-9' : 'bg-green-1'" class="summary-card">
          <q-card-section class="text-center">
            <q-icon name="trending_up" size="2rem" class="text-green q-mb-sm" />
            <div class="text-h4 text-weight-bold text-green">{{ $filters.formatBRL(totalIncome) }}</div>
            <div class="text-subtitle2" :class="$q.dark.isActive ? 'text-green-3' : 'text-green-8'">Total de Receitas</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card flat :class="$q.dark.isActive ? 'bg-blue-9' : 'bg-blue-1'" class="summary-card">
          <q-card-section class="text-center">
            <q-icon name="calendar_month" size="2rem" class="text-blue q-mb-sm" />
            <div class="text-h4 text-weight-bold text-blue">{{ monthsDisplayed }}</div>
            <div class="text-subtitle2" :class="$q.dark.isActive ? 'text-blue-3' : 'text-blue-8'">Meses Exibidos</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card flat :class="$q.dark.isActive ? 'bg-orange-9' : 'bg-orange-1'" class="summary-card">
          <q-card-section class="text-center">
            <q-icon name="show_chart" size="2rem" class="text-orange q-mb-sm" />
            <div class="text-h4 text-weight-bold text-orange">{{ $filters.formatBRL(averageIncome) }}</div>
            <div class="text-subtitle2" :class="$q.dark.isActive ? 'text-orange-3' : 'text-orange-8'">Média Mensal</div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-3">
        <q-card flat :class="$q.dark.isActive ? 'bg-purple-9' : 'bg-purple-1'" class="summary-card">
          <q-card-section class="text-center">
            <q-icon name="star" size="2rem" class="text-purple q-mb-sm" />
            <div class="text-h4 text-weight-bold text-purple">{{ $filters.formatBRL(highestIncome) }}</div>
            <div class="text-subtitle2" :class="$q.dark.isActive ? 'text-purple-3' : 'text-purple-8'">Maior Receita</div>
          </q-card-section>
        </q-card>
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
                    <q-chip :color="getIncomeChipColor(month.totalReceitas)" text-color="white" class="text-weight-bold">
                      {{ $filters.formatBRL(month.totalReceitas) }}
                    </q-chip>
                  </div>
                </div>
                
                <!-- Receitas -->
                <div class="income-categories q-mb-md">
                  <div class="text-subtitle2 text-weight-bold q-mb-xs" :class="$q.dark.isActive ? 'text-green-3' : 'text-green-8'">Receitas</div>
                  <div class="row q-gutter-xs q-mb-xs" v-for="income in getIncomeCategories(month)" :key="income.name">
                    <div class="col-7">
                      <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-6'">{{ income.label }}</div>
                    </div>
                    <div class="col-5 text-right">
                      <div class="text-weight-medium text-green">
                        {{ $filters.formatBRL(income.value) }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Resumo -->
                <div class="summary-section">
                  <div class="row q-gutter-xs q-mb-xs">
                    <div class="col-7">
                      <div class="text-caption text-weight-bold" :class="$q.dark.isActive ? 'text-red-3' : 'text-red-8'">Total Despesas:</div>
                    </div>
                    <div class="col-5 text-right">
                      <div class="text-weight-bold text-red">
                        {{ $filters.formatBRL(month.totalDespesas) }}
                      </div>
                    </div>
                  </div>
                  <div class="row q-gutter-xs">
                    <div class="col-7">
                      <div class="text-caption text-weight-bold" :class="$q.dark.isActive ? 'text-green-3' : 'text-green-8'">Sobra:</div>
                    </div>
                    <div class="col-5 text-right">
                      <div class="text-weight-bold" :class="getSobraClass(month.sobra)">
                        {{ $filters.formatBRL(month.sobra) }}
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
              class="income-table"
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
                  
                  <q-td key="dia15Pedro" :props="props">
                    <div class="text-weight-medium text-green">
                      {{ $filters.formatBRL(props.row.dia15Pedro) }}
                    </div>
                  </q-td>
                  
                  <q-td key="dia30Pedro" :props="props">
                    <div class="text-weight-medium text-green">
                      {{ $filters.formatBRL(props.row.dia30Pedro) }}
                    </div>
                  </q-td>
                  
                  <q-td key="juli" :props="props">
                    <div class="text-weight-medium text-green">
                      {{ $filters.formatBRL(props.row.juli) }}
                    </div>
                  </q-td>
                  
                  <q-td key="outros" :props="props">
                    <div class="text-weight-medium text-blue">
                      {{ $filters.formatBRL(props.row.outros) }}
                    </div>
                  </q-td>
                  
                  <q-td key="totalReceitas" :props="props">
                    <div class="text-weight-bold text-amber-8">
                      {{ $filters.formatBRL(props.row.totalReceitas) }}
                    </div>
                  </q-td>
                  
                  <q-td key="totalDespesas" :props="props">
                    <div class="text-weight-bold text-red">
                      {{ $filters.formatBRL(props.row.totalDespesas) }}
                    </div>
                  </q-td>
                  
                  <q-td key="sobra" :props="props" class="text-weight-bold">
                    <div class="text-h6" :class="getSobraClass(props.row.sobra)">
                      {{ $filters.formatBRL(props.row.sobra) }}
                    </div>
                  </q-td>
                </q-tr>
              </template>

              <template v-slot:bottom>
                <div class="full-width row justify-between items-center q-pa-md" :class="$q.dark.isActive ? 'bg-grey-8' : 'bg-grey-1'">
                  <div class="text-weight-bold text-h6" :class="$q.dark.isActive ? 'text-white' : 'text-grey-8'">
                    Total Receitas: {{ $filters.formatBRL(totalIncome) }}
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

interface IncomeRow {
  id: string
  month: string
  year: number
  dia15Pedro: number
  dia30Pedro: number
  juli: number
  outros: number
  totalReceitas: number
  totalDespesas: number
  sobra: number
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
const incomeData = ref<IncomeRow[]>([])

// Configuração da paginação
const pagination = ref({
  page: 1,
  rowsPerPage: 12
})

// Colunas da tabela
const columns = ref<TableColumn[]>([
  { name: 'month', label: 'Mês/Ano', field: 'month', align: 'left' as const, sortable: true },
  { name: 'dia15Pedro', label: 'Dia 15 Pedro', field: 'dia15Pedro', align: 'right' as const, sortable: true },
  { name: 'dia30Pedro', label: 'Dia 30 Pedro', field: 'dia30Pedro', align: 'right' as const, sortable: true },
  { name: 'juli', label: 'Juli', field: 'juli', align: 'right' as const, sortable: true },
  { name: 'outros', label: 'Outros', field: 'outros', align: 'right' as const, sortable: true },
  { name: 'totalReceitas', label: 'Total Receitas', field: 'totalReceitas', align: 'right' as const, sortable: true },
  { name: 'totalDespesas', label: 'Total Despesas', field: 'totalDespesas', align: 'right' as const, sortable: true },
  { name: 'sobra', label: 'Sobra', field: 'sobra', align: 'right' as const, sortable: true }
])

// Opções para filtros
const yearOptions = computed(() => {
  const years = [...new Set(incomeData.value.map(row => row.year))]
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
  let data = incomeData.value
  
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

const totalIncome = computed(() => {
  return filteredData.value.reduce((sum, row) => sum + row.totalReceitas, 0)
})

const averageIncome = computed(() => {
  return filteredData.value.length > 0 ? totalIncome.value / filteredData.value.length : 0
})

const highestIncome = computed(() => {
  return filteredData.value.length > 0 ? Math.max(...filteredData.value.map(row => row.totalReceitas)) : 0
})

const monthsDisplayed = computed(() => {
  return filteredData.value.length
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'table' ? 'cards' : 'table'
}

// Métodos
const loadIncomeData = () => {
  loading.value = true
  // Simular carregamento
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const formatMonth = (month: string, year: number) => {
  const monthNames: { [key: string]: string } = {
    'janeiro': 'Janeiro',
    'fevereiro': 'Fevereiro',
    'março': 'Março',
    'abril': 'Abril',
    'maio': 'Maio',
    'junho': 'Junho',
    'julho': 'Julho',
    'agosto': 'Agosto',
    'setembro': 'Setembro',
    'outubro': 'Outubro',
    'novembro': 'Novembro',
    'dezembro': 'Dezembro'
  }
  return `${monthNames[month] || month} ${year}`
}

const getIncomeChipColor = (total: number) => {
  if (total > 8000) return 'green'
  if (total > 7500) return 'light-green'
  if (total > 7000) return 'amber'
  return 'orange'
}

const getIncomeCategories = (month: IncomeRow) => {
  return [
    { name: 'dia15Pedro', label: 'Dia 15 Pedro', value: month.dia15Pedro },
    { name: 'dia30Pedro', label: 'Dia 30 Pedro', value: month.dia30Pedro },
    { name: 'juli', label: 'Juli', value: month.juli },
    { name: 'outros', label: 'Outros', value: month.outros }
  ].filter(cat => cat.value > 0)
}

const getSobraClass = (value: number) => {
  if (value > 5000) return 'text-green'
  if (value > 3000) return 'text-light-green'
  if (value > 1000) return 'text-amber'
  if (value > 0) return 'text-orange'
  return 'text-red'
}

const getMonthIcon = (month: string) => {
  const icons: { [key: string]: string } = {
    'janeiro': 'ac_unit',
    'fevereiro': 'favorite',
    'março': 'eco',
    'abril': 'wb_sunny',
    'maio': 'local_florist',
    'junho': 'beach_access',
    'julho': 'ac_unit',
    'agosto': 'wb_sunny',
    'setembro': 'eco',
    'outubro': 'local_florist',
    'novembro': 'cloud',
    'dezembro': 'celebration'
  }
  return icons[month] || 'calendar_month'
}

const getRowClass = (row: IncomeRow) => {
  if ($q.dark.isActive) {
    if (row.sobra > 5000) return 'bg-green-10'
    if (row.sobra > 3000) return 'bg-light-green-10'
    return ''
  } else {
    if (row.sobra > 5000) return 'bg-green-1'
    if (row.sobra > 3000) return 'bg-light-green-1'
    return ''
  }
}

// Lifecycle
onMounted(() => {
  loadIncomeData()
})
</script>

<style scoped>
.income-table {
  border-radius: 8px;
}

.income-table .q-table__top {
  padding: 16px;
}

.income-table .q-table__bottom {
  border-top: 1px solid #e0e0e0;
}

.summary-card {
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.filter-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
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

.income-categories {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
  margin-top: 12px;
}

.body--dark .income-categories {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.summary-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
  margin-top: 12px;
}

.body--dark .summary-section {
  border-top-color: rgba(255, 255, 255, 0.1);
}
</style>