<template>
  <q-page class="q-pa-md">
    <!-- Header com saudação -->
    <div class="q-mb-lg">
      <h4 class="text-h4 text-weight-bold q-ma-none text-grey-8">
        Olá! 👋
      </h4>
      <p class="text-subtitle1 text-grey-6 q-ma-none">
        Aqui está um resumo das suas finanças
      </p>
    </div>

    <!-- Cards de resumo -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card class="stats-card bg-gradient-success text-white" flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-weight-medium opacity-80">HOJE</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ formattedDay }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="sm" class="q-mr-xs" />
                  +12% vs ontem
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="today" size="48px" class="opacity-60" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-4">
        <q-card class="stats-card bg-gradient-warning text-white" flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-weight-medium opacity-80">SEMANA</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ formattedWeek }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="sm" class="q-mr-xs" />
                  +8% vs semana passada
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="date_range" size="48px" class="opacity-60" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-md-4">
        <q-card class="stats-card bg-gradient-info text-white" flat>
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-weight-medium opacity-80">MÊS</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ formattedMonth }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_down" size="sm" class="q-mr-xs" />
                  -3% vs mês passado
                </div>
              </div>
              <div class="col-auto">
                <q-icon name="calendar_month" size="48px" class="opacity-60" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Gráficos e estatísticas -->
    <div class="row q-col-gutter-lg">
      <div class="col-12 col-lg-8">
        <q-card flat class="chart-card">
          <q-card-section class="q-pb-none">
            <div class="text-h6 text-weight-bold text-grey-8">Movimentação Mensal</div>
            <div class="text-caption text-grey-6">Receitas vs Despesas</div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <div class="chart-container">
              <canvas ref="chartCanvas" width="400" height="200"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>
      
      <div class="col-12 col-lg-4">
        <q-card flat class="full-height">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-grey-8 q-mb-md">Ações Rápidas</div>
            
            <q-btn 
              unelevated 
              color="primary" 
              icon="add" 
              label="Nova Transação"
              class="full-width q-mb-sm"
              @click="goToTransaction"
            />
            
            <q-btn 
              unelevated 
              color="secondary" 
              icon="file_download" 
              label="Exportar Dados"
              class="full-width q-mb-sm"
              @click="exportData"
            />
            
            <q-btn 
              unelevated 
              color="accent" 
              icon="analytics" 
              label="Relatórios"
              class="full-width"
              @click="viewReports"
            />
          </q-card-section>
          
          <q-separator />
          
          <q-card-section>
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm">Resumo Rápido</div>
            <div class="q-mb-sm">
              <div class="text-caption text-grey-6">Saldo Total</div>
              <div class="text-h6 text-weight-bold text-positive">R$ 15.420,50</div>
            </div>
            <div class="q-mb-sm">
              <div class="text-caption text-grey-6">Gastos do Mês</div>
              <div class="text-h6 text-weight-bold text-negative">R$ 3.280,00</div>
            </div>
            <div>
              <div class="text-caption text-grey-6">Meta de Economia</div>
              <div class="text-body2 text-grey-8">R$ 2.000,00</div>
              <q-linear-progress 
                :value="0.65" 
                color="primary" 
                class="q-mt-xs"
                size="8px"
                rounded
              />
              <div class="text-caption text-grey-6 q-mt-xs">65% da meta</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardPage' })

import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

interface Totals { day: number; week: number; month: number }
const totals = ref<Totals>({ day: 1250.50, week: 4850.75, month: 18420.30 })
const chartCanvas = ref<HTMLCanvasElement>()
const router = useRouter()
const $q = useQuasar()

const formattedDay = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.value.day)
)
const formattedWeek = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.value.week)
)
const formattedMonth = computed(() =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.value.month)
)

// Funções para ações rápidas
function goToTransaction() {
  void router.push({ name: 'transaction' })
}

function exportData() {
  $q.notify({
    type: 'info',
    message: 'Funcionalidade de exportação em desenvolvimento',
    position: 'top'
  })
}

function viewReports() {
  $q.notify({
    type: 'info',
    message: 'Relatórios detalhados em breve!',
    position: 'top'
  })
}

// Função para criar gráfico simples
function createChart() {
  if (!chartCanvas.value) return
  
  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return
  
  // Dados de exemplo para o gráfico
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
  const receitas = [3200, 3800, 2900, 4200, 3600, 4100]
  const despesas = [2800, 3200, 2600, 3100, 2900, 3400]
  
  // Limpar canvas
  ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)
  
  // Configurações do gráfico
  const padding = 40
  const chartWidth = chartCanvas.value.width - 2 * padding
  const chartHeight = chartCanvas.value.height - 2 * padding
  const barWidth = chartWidth / (months.length * 2 + 1)
  const maxValue = Math.max(...receitas, ...despesas)
  
  // Desenhar eixos
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  // Eixo Y
  ctx.beginPath()
  ctx.moveTo(padding, padding)
  ctx.lineTo(padding, padding + chartHeight)
  ctx.stroke()
  
  // Eixo X
  ctx.beginPath()
  ctx.moveTo(padding, padding + chartHeight)
  ctx.lineTo(padding + chartWidth, padding + chartHeight)
  ctx.stroke()
  
  // Desenhar barras
  months.forEach((month, index) => {
    const x = padding + (index * 2 + 1) * barWidth
    
    // Barra de receitas (verde)
    const receitaHeight = ((receitas[index] || 0) / maxValue) * chartHeight
    ctx.fillStyle = '#4caf50'
    ctx.fillRect(x, padding + chartHeight - receitaHeight, barWidth * 0.8, receitaHeight)
    
    // Barra de despesas (vermelho)
    const despesaHeight = ((despesas[index] || 0) / maxValue) * chartHeight
    ctx.fillStyle = '#f44336'
    ctx.fillRect(x + barWidth, padding + chartHeight - despesaHeight, barWidth * 0.8, despesaHeight)
    
    // Labels dos meses
    ctx.fillStyle = '#666'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(month, x + barWidth, padding + chartHeight + 20)
  })
  
  // Legenda
  ctx.fillStyle = '#4caf50'
  ctx.fillRect(padding + chartWidth - 120, padding + 10, 15, 15)
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('Receitas', padding + chartWidth - 100, padding + 22)
  
  ctx.fillStyle = '#f44336'
  ctx.fillRect(padding + chartWidth - 120, padding + 30, 15, 15)
  ctx.fillStyle = '#666'
  ctx.fillText('Despesas', padding + chartWidth - 100, padding + 42)
}

onMounted(async () => {
  await nextTick()
  createChart()
  
  // Carregar dados reais do Supabase (opcional)
  try {
    const today: Date = new Date()
    const startOfWeek: Date = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay())
    const startOfMonth: Date = new Date(today.getFullYear(), today.getMonth(), 1)

    const { data, error } = await supabase
      .from('transactions')
      .select('amount, date')
      .gte('date', startOfMonth.toISOString().split('T')[0])

    if (!error && data) {
      let dayTotal = 0
      let weekTotal = 0
      let monthTotal = 0

      const todayStr: string = today?.toISOString().split('T')[0] || ''
      const startOfWeekStr: string = startOfWeek?.toISOString().split('T')[0] || ''

      for (const t of data) {
        const amount = t.amount
        const transactionDate = String(t.date)
        monthTotal += amount
        if (transactionDate >= startOfWeekStr) {
          weekTotal += amount
        }
        if (transactionDate === todayStr) {
          dayTotal += amount
        }
      }

      totals.value = { day: dayTotal, week: weekTotal, month: monthTotal }
    }
  } catch {
     console.log('Usando dados de exemplo')
  }
})
</script>

<style scoped>
.stats-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.bg-gradient-info {
  background: linear-gradient(135deg, #2196f3 0%, #64b5f6 100%);
}

.chart-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.chart-container {
  position: relative;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-container canvas {
  max-width: 100%;
  height: auto;
}

.q-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.q-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 16px;
  }
  
  .chart-container {
    height: 200px;
  }
}
</style>
