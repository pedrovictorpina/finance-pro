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

    <!-- Cards de resumo clicáveis -->
    <div class="row q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-md-4">
        <q-card 
          class="stats-card bg-gradient-success text-white cursor-pointer" 
          flat 
          @click="openSummaryModal('day')"
        >
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-weight-medium opacity-80">HOJE</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ formatCurrency(summaryData.day.balance) }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="sm" class="q-mr-xs" />
                  {{ summaryData.day.transactions }} transações
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
        <q-card 
          class="stats-card bg-gradient-warning text-white cursor-pointer" 
          flat 
          @click="openSummaryModal('week')"
        >
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-weight-medium opacity-80">SEMANA</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ formatCurrency(summaryData.week.balance) }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_up" size="sm" class="q-mr-xs" />
                  {{ summaryData.week.transactions }} transações
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
        <q-card 
          class="stats-card bg-gradient-info text-white cursor-pointer" 
          flat 
          @click="openSummaryModal('month')"
        >
          <q-card-section class="q-pa-lg">
            <div class="row items-center">
              <div class="col">
                <div class="text-caption text-weight-medium opacity-80">MÊS</div>
                <div class="text-h4 text-weight-bold q-mt-xs">{{ formatCurrency(summaryData.month.balance) }}</div>
                <div class="text-caption opacity-70 q-mt-xs">
                  <q-icon name="trending_down" size="sm" class="q-mr-xs" />
                  {{ summaryData.month.transactions }} transações
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

    <!-- Gráfico de 12 meses e Histórico -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-lg-8">
        <q-card flat class="chart-card cursor-pointer" @click="openChartModal">
          <q-card-section class="q-pb-none">
            <div class="text-h6 text-weight-bold text-grey-8">Movimentação dos Últimos 12 Meses</div>
            <div class="text-caption text-grey-6">Receitas vs Despesas - Clique para detalhes</div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <div class="chart-container" style="position: relative;">
              <canvas ref="chartCanvas" width="400" height="200"></canvas>
              
              <!-- Tooltip -->
              <div 
                v-if="showTooltip"
                class="chart-tooltip"
                :style="{
                  position: 'fixed',
                  left: tooltipData.x + 'px',
                  top: tooltipData.y + 'px',
                  zIndex: 1000
                }"
              >
                <div class="tooltip-content">
                  <div class="tooltip-month">{{ tooltipData.month }}</div>
                  <div class="tooltip-item receita">
                    <span class="tooltip-label">Receitas:</span>
                    <span class="tooltip-value">{{ formatCurrency(tooltipData.receita) }}</span>
                  </div>
                  <div class="tooltip-item despesa">
                    <span class="tooltip-label">Despesas:</span>
                    <span class="tooltip-value">{{ formatCurrency(tooltipData.despesa) }}</span>
                  </div>
                  <div class="tooltip-item saldo">
                    <span class="tooltip-label">Saldo:</span>
                    <span class="tooltip-value" :class="tooltipData.receita - tooltipData.despesa >= 0 ? 'positive' : 'negative'">
                      {{ formatCurrency(tooltipData.receita - tooltipData.despesa) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card flat class="full-height">
          <q-card-section>
            <div class="row items-center q-mb-md">
              <div class="text-h6 text-weight-bold text-grey-8">Últimas Transações</div>
              <q-space />
              <q-btn 
                flat 
                round 
                icon="more_vert" 
                size="sm" 
                @click="openHistoryModal"
              >
                <q-tooltip>Ver todas</q-tooltip>
              </q-btn>
            </div>

            <div v-if="recentTransactions.length === 0" class="text-center text-grey-6 q-py-lg">
              <q-icon name="receipt_long" size="48px" class="q-mb-sm" />
              <div>Nenhuma transação encontrada</div>
            </div>

            <div v-else>
              <div 
                v-for="transaction in recentTransactions" 
                :key="transaction.id"
                class="transaction-item q-mb-sm cursor-pointer"
                @click="openTransactionModal(transaction)"
              >
                <div class="row items-center">
                  <div class="col-auto q-mr-sm">
                    <q-avatar 
                      :color="transaction.type === 'income' ? 'positive' : 'negative'" 
                      text-color="white" 
                      size="32px"
                    >
                      <q-icon :name="transaction.type === 'income' ? 'trending_up' : 'trending_down'" />
                    </q-avatar>
                  </div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium">{{ transaction.description }}</div>
                    <div class="text-caption text-grey-6">{{ formatDate(transaction.date) }}</div>
                  </div>
                  <div class="col-auto">
                    <div 
                      class="text-body2 text-weight-bold"
                      :class="transaction.type === 'income' ? 'text-positive' : 'text-negative'"
                    >
                      {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-subtitle2 text-weight-bold text-grey-8 q-mb-sm cursor-pointer" @click="openQuickSummaryModal">
              Resumo Rápido
              <q-icon name="open_in_new" size="sm" class="q-ml-xs" />
            </div>
            <div class="q-mb-sm">
              <div class="text-caption text-grey-6">Saldo Total</div>
              <div class="text-h6 text-weight-bold text-positive">{{ formatCurrency(quickSummary.totalBalance) }}</div>
            </div>
            <div class="q-mb-sm">
              <div class="text-caption text-grey-6">Gastos do Mês</div>
              <div class="text-h6 text-weight-bold text-negative">{{ formatCurrency(Math.abs(quickSummary.monthExpenses)) }}</div>
            </div>
            <div>
              <div class="text-caption text-grey-6">Meta de Economia</div>
              <div class="text-body2 text-grey-8">{{ formatCurrency(quickSummary.savingsGoal) }}</div>
              <q-linear-progress
                :value="quickSummary.savingsProgress"
                color="primary"
                class="q-mt-xs"
                size="8px"
                rounded
              />
              <div class="text-caption text-grey-6 q-mt-xs">{{ Math.round(quickSummary.savingsProgress * 100) }}% da meta</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Próximas Despesas do Mês -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12">
        <q-card flat>
          <q-card-section class="q-pb-none">
            <div class="row items-center">
              <div class="text-h6 text-weight-bold text-grey-8">Próximas Despesas do Mês</div>
              <q-space />
              <q-btn 
                flat 
                round 
                icon="more_vert" 
                size="sm" 
                @click="openUpcomingExpensesModal"
              >
                <q-tooltip>Ver todas</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          
          <q-card-section>
            <div v-if="upcomingExpenses.length === 0" class="text-center text-grey-6 q-py-lg">
              <q-icon name="event" size="48px" class="q-mb-sm" />
              <div>Nenhuma despesa programada para este mês</div>
            </div>

            <div v-else>
              <div 
                v-for="expense in upcomingExpenses.slice(0, 5)" 
                :key="expense.id"
                class="expense-item q-mb-sm cursor-pointer"
                @click="openExpenseDetailModal(expense)"
              >
                <div class="row items-center">
                  <div class="col-auto q-mr-sm">
                    <q-avatar 
                      :color="expense.is_paid ? 'positive' : 'warning'" 
                      text-color="white" 
                      size="32px"
                    >
                      <q-icon :name="expense.is_paid ? 'check' : 'schedule'" />
                    </q-avatar>
                  </div>
                  <div class="col">
                    <div class="text-body2 text-weight-medium">{{ expense.description }}</div>
                    <div class="text-caption text-grey-6">
                      {{ formatDate(expense.date) }}
                      <span v-if="expense.category?.name" class="q-ml-sm">
                        • {{ expense.category.name }}
                      </span>
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="text-body2 text-weight-bold text-negative">
                      {{ formatCurrency(expense.amount) }}
                    </div>
                    <div class="text-caption text-grey-6 text-right">
                      {{ expense.is_paid ? 'Pago' : 'Pendente' }}
                    </div>
                  </div>
                  <div class="col-auto q-ml-sm">
                    <q-btn 
                      v-if="!expense.is_paid"
                      flat 
                      round 
                      icon="check_circle" 
                      size="sm" 
                      color="positive"
                      @click.stop="markAsPaid(expense)"
                    >
                      <q-tooltip>Marcar como pago</q-tooltip>
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Calendário -->
    <div class="row q-col-gutter-lg">
      <div class="col-12">
        <q-card flat class="calendar-card">
          <q-card-section class="q-pb-none">
            <div class="row items-center">
              <div class="text-h6 text-weight-bold text-grey-8">Calendário Financeiro</div>
              <q-space />
              <q-btn-toggle
                v-model="calendarFilter"
                toggle-color="primary"
                :options="[
                  { label: 'Diário', value: 'day' },
                  { label: 'Semanal', value: 'week' },
                  { label: 'Mensal', value: 'month' }
                ]"
                class="q-mr-md"
              />
              <q-btn 
                flat 
                round 
                icon="fullscreen" 
                @click="openCalendarModal"
              >
                <q-tooltip>Expandir calendário</q-tooltip>
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section>
            <q-date
              v-model="selectedDate"
              :events="calendarEvents"
              event-color="primary"
              @click="onDateClick"
              class="full-width"
              :options="dateOptions"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
    <!-- Modal de Resumo por Período -->
    <q-dialog v-model="summaryModalOpen" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Resumo {{ summaryModalPeriod === 'day' ? 'Diário' : summaryModalPeriod === 'week' ? 'Semanal' : 'Mensal' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-4">
              <q-card flat class="bg-positive text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(summaryModalData.income) }}</div>
                  <div class="text-caption">Receitas</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat class="bg-negative text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(Math.abs(summaryModalData.expense)) }}</div>
                  <div class="text-caption">Despesas</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-4">
              <q-card flat :class="summaryModalData.balance >= 0 ? 'bg-positive' : 'bg-negative'" class="text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(summaryModalData.balance) }}</div>
                  <div class="text-caption">Saldo</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-weight-bold q-mb-sm">Transações do Período</div>
          <div v-if="summaryModalTransactions.length === 0" class="text-center text-grey-6 q-py-md">
            Nenhuma transação encontrada
          </div>
          <div v-else class="q-gutter-sm" style="max-height: 300px; overflow-y: auto;">
            <div 
              v-for="transaction in summaryModalTransactions" 
              :key="transaction.id"
              class="transaction-item-modal"
            >
              <div class="row items-center">
                <div class="col-auto q-mr-sm">
                  <q-avatar 
                    :color="transaction.type === 'income' ? 'positive' : 'negative'" 
                    text-color="white" 
                    size="24px"
                  >
                    <q-icon :name="transaction.type === 'income' ? 'trending_up' : 'trending_down'" size="sm" />
                  </q-avatar>
                </div>
                <div class="col">
                  <div class="text-body2">{{ transaction.description }}</div>
                  <div class="text-caption text-grey-6">{{ formatDate(transaction.date) }}</div>
                </div>
                <div class="col-auto">
                  <div 
                    class="text-body2 text-weight-bold"
                    :class="transaction.type === 'income' ? 'text-positive' : 'text-negative'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal do Gráfico Expandido -->
    <q-dialog v-model="chartModalOpen" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Movimentação dos Últimos 12 Meses - Detalhado</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="full-height">
          <div class="chart-container-large">
            <canvas ref="chartCanvasLarge" width="800" height="400"></canvas>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de Histórico Completo -->
    <q-dialog v-model="historyModalOpen" persistent>
      <q-card style="min-width: 600px; max-width: 800px; width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Histórico de Transações</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col">
              <q-input 
                v-model="historyFilter.search" 
                placeholder="Buscar transações..." 
                outlined 
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-select 
                v-model="historyFilter.type" 
                :options="[{label: 'Todas', value: 'all'}, {label: 'Receitas', value: 'income'}, {label: 'Despesas', value: 'expense'}]" 
                outlined 
                dense 
                style="min-width: 120px"
              />
            </div>
          </div>

          <div style="max-height: 400px; overflow-y: auto;">
            <div 
              v-for="transaction in filteredHistoryTransactions" 
              :key="transaction.id"
              class="transaction-item-modal cursor-pointer"
              @click="openTransactionModal(transaction)"
            >
              <div class="row items-center">
                <div class="col-auto q-mr-sm">
                  <q-avatar 
                    :color="transaction.type === 'income' ? 'positive' : 'negative'" 
                    text-color="white" 
                    size="32px"
                  >
                    <q-icon :name="transaction.type === 'income' ? 'trending_up' : 'trending_down'" />
                  </q-avatar>
                </div>
                <div class="col">
                  <div class="text-body2 text-weight-medium">{{ transaction.description }}</div>
                  <div class="text-caption text-grey-6">{{ formatDate(transaction.date) }} • {{ transaction.category?.name || 'Sem categoria' }}</div>
                </div>
                <div class="col-auto">
                  <div 
                    class="text-body2 text-weight-bold"
                    :class="transaction.type === 'income' ? 'text-positive' : 'text-negative'"
                  >
                    {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de Detalhes da Transação -->
    <q-dialog v-model="transactionModalOpen" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalhes da Transação</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedTransaction">
          <div class="q-gutter-md">
            <div class="row">
              <div class="col-4 text-grey-6">Descrição:</div>
              <div class="col text-weight-medium">{{ selectedTransaction.description }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Valor:</div>
              <div class="col text-weight-bold" :class="selectedTransaction.type === 'income' ? 'text-positive' : 'text-negative'">
                {{ selectedTransaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(selectedTransaction.amount)) }}
              </div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Data:</div>
              <div class="col">{{ formatDate(selectedTransaction.date) }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Categoria:</div>
              <div class="col">{{ selectedTransaction.category?.name || 'Sem categoria' }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Conta:</div>
              <div class="col">{{ selectedTransaction.account?.name || 'Sem conta' }}</div>
            </div>

          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Editar" color="primary" @click="editTransaction" />
          <q-btn flat label="Fechar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal do Calendário Expandido -->
    <q-dialog v-model="calendarModalOpen" maximized>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Calendário Financeiro - {{ calendarFilter === 'day' ? 'Visão Diária' : calendarFilter === 'week' ? 'Visão Semanal' : 'Visão Mensal' }}</div>
          <q-space />
          <q-btn-toggle
            v-model="calendarFilter"
            toggle-color="primary"
            :options="[
              { label: 'Diário', value: 'day' },
              { label: 'Semanal', value: 'week' },
              { label: 'Mensal', value: 'month' }
            ]"
            class="q-mr-md"
          />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="full-height">
          <div class="row full-height">
            <div class="col-8">
              <q-date
                v-model="selectedDate"
                :events="calendarEvents"
                event-color="primary"
                @click="onDateClick"
                class="full-width full-height"
                :options="dateOptions"
              />
            </div>
            <div class="col-4 q-pl-md">
              <q-card flat class="full-height">
                <q-card-section>
                  <div class="text-h6 q-mb-md">{{ selectedDateFormatted }}</div>
                  <div v-if="selectedDateTransactions.length === 0" class="text-center text-grey-6 q-py-lg">
                    <q-icon name="event_busy" size="48px" class="q-mb-sm" />
                    <div>Nenhuma transação neste dia</div>
                  </div>
                  <div v-else>
                    <div 
                      v-for="transaction in selectedDateTransactions" 
                      :key="transaction.id"
                      class="transaction-item q-mb-sm cursor-pointer"
                      @click="openTransactionModal(transaction)"
                    >
                      <div class="row items-center">
                        <div class="col-auto q-mr-sm">
                          <q-avatar 
                            :color="transaction.type === 'income' ? 'positive' : 'negative'" 
                            text-color="white" 
                            size="24px"
                          >
                            <q-icon :name="transaction.type === 'income' ? 'trending_up' : 'trending_down'" size="sm" />
                          </q-avatar>
                        </div>
                        <div class="col">
                          <div class="text-body2">{{ transaction.description }}</div>
                          <div class="text-caption text-grey-6">{{ transaction.category?.name || 'Sem categoria' }}</div>
                        </div>
                        <div class="col-auto">
                          <div 
                            class="text-body2 text-weight-bold"
                            :class="transaction.type === 'income' ? 'text-positive' : 'text-negative'"
                          >
                            {{ transaction.type === 'income' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de Resumo Rápido Expandido -->
    <q-dialog v-model="quickSummaryModalOpen" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Resumo Financeiro Detalhado</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-card flat class="bg-positive text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(quickSummary.totalIncome) }}</div>
                  <div class="text-caption">Total de Receitas</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat class="bg-negative text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(Math.abs(quickSummary.totalExpenses)) }}</div>
                  <div class="text-caption">Total de Despesas</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-6">
              <q-card flat :class="quickSummary.totalBalance >= 0 ? 'bg-positive' : 'bg-negative'" class="text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(quickSummary.totalBalance) }}</div>
                  <div class="text-caption">Saldo Total</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6">
              <q-card flat class="bg-info text-white text-center">
                <q-card-section>
                  <div class="text-h6">{{ formatCurrency(quickSummary.savingsGoal) }}</div>
                  <div class="text-caption">Meta de Economia</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="text-subtitle2 text-weight-bold q-mb-sm">Progresso da Meta</div>
          <q-linear-progress
            :value="quickSummary.savingsProgress"
            color="primary"
            size="20px"
            rounded
            class="q-mb-sm"
          />
          <div class="text-center text-body2">{{ Math.round(quickSummary.savingsProgress * 100) }}% da meta atingida</div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de Próximas Despesas -->
    <q-dialog v-model="upcomingExpensesModalOpen" persistent>
      <q-card style="min-width: 600px; max-width: 800px; width: 90vw">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Próximas Despesas do Mês</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col">
              <q-input 
                v-model="expenseFilter.search" 
                placeholder="Buscar despesas..." 
                outlined 
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-select 
                v-model="expenseFilter.status" 
                :options="[{label: 'Todas', value: 'all'}, {label: 'Pendentes', value: 'pending'}, {label: 'Pagas', value: 'paid'}]" 
                outlined 
                dense 
                style="min-width: 120px"
              />
            </div>
          </div>

          <div style="max-height: 400px; overflow-y: auto;">
            <div 
              v-for="expense in filteredUpcomingExpenses" 
              :key="expense.id"
              class="expense-item-modal cursor-pointer"
              @click="openExpenseDetailModal(expense)"
            >
              <div class="row items-center q-pa-sm">
                <div class="col-auto q-mr-sm">
                  <q-avatar 
                    :color="expense.is_paid ? 'positive' : 'warning'" 
                    text-color="white" 
                    size="32px"
                  >
                    <q-icon :name="expense.is_paid ? 'check' : 'schedule'" />
                  </q-avatar>
                </div>
                <div class="col">
                  <div class="text-body2 text-weight-medium">{{ expense.description }}</div>
                  <div class="text-caption text-grey-6">
                    {{ formatDate(expense.date) }}
                    <span v-if="expense.category?.name" class="q-ml-sm">
                      • {{ expense.category.name }}
                    </span>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="text-body2 text-weight-bold text-negative">
                    {{ formatCurrency(expense.amount) }}
                  </div>
                  <div class="text-caption text-grey-6 text-right">
                    {{ expense.is_paid ? 'Pago' : 'Pendente' }}
                  </div>
                </div>
                <div class="col-auto q-ml-sm">
                  <q-btn 
                    v-if="!expense.is_paid"
                    flat 
                    round 
                    icon="check_circle" 
                    size="sm" 
                    color="positive"
                    @click.stop="markAsPaid(expense)"
                  >
                    <q-tooltip>Marcar como pago</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de Detalhes da Despesa -->
    <q-dialog v-model="expenseDetailModalOpen" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalhes da Despesa</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedExpense">
          <div class="q-gutter-md">
            <div class="row">
              <div class="col-4 text-grey-6">Descrição:</div>
              <div class="col text-weight-medium">{{ selectedExpense.description }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Valor:</div>
              <div class="col text-weight-bold text-negative">
                {{ formatCurrency(selectedExpense.amount) }}
              </div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Data:</div>
              <div class="col">{{ formatDate(selectedExpense.date) }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Categoria:</div>
              <div class="col">{{ selectedExpense.category?.name || 'Sem categoria' }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Conta:</div>
              <div class="col">{{ selectedExpense.account?.name || 'Sem conta' }}</div>
            </div>
            <div class="row">
              <div class="col-4 text-grey-6">Status:</div>
              <div class="col">
                <q-chip 
                  :color="selectedExpense.is_paid ? 'positive' : 'warning'" 
                  text-color="white" 
                  size="sm"
                >
                  {{ selectedExpense.is_paid ? 'Pago' : 'Pendente' }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            v-if="selectedExpense && !selectedExpense.is_paid"
            flat 
            label="Marcar como Pago" 
            color="positive" 
            @click="markAsPaid(selectedExpense)"
          />
          <q-btn flat label="Editar" color="primary" @click="editExpense" />
          <q-btn flat label="Fechar" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
defineOptions({ name: 'DashboardPage' })

import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { supabase } from 'src/boot/supabase'

// Interfaces
interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: 'income' | 'expense'
  category?: { name: string }
  account?: { name: string }
  is_paid?: boolean
}

interface SupabaseTransaction {
  id: string
  description: string
  amount: number
  date: string
  type: string
  is_paid?: boolean
  category: { name: string }[] | null
  account: { name: string }[] | null
}

interface SummaryData {
  balance: number
  income: number
  expense: number
  transactions: number
}

// Refs principais
const chartCanvas = ref<HTMLCanvasElement>()
const chartCanvasLarge = ref<HTMLCanvasElement>()
const router = useRouter()
const $q = useQuasar()

// Dados de resumo
const summaryData = ref({
  day: { balance: 0, income: 0, expense: 0, transactions: 0 },
  week: { balance: 0, income: 0, expense: 0, transactions: 0 },
  month: { balance: 0, income: 0, expense: 0, transactions: 0 }
})

// Transações recentes
const recentTransactions = ref<Transaction[]>([])
const allTransactions = ref<Transaction[]>([])

// Resumo rápido
const quickSummary = ref({
  totalBalance: 0,
  totalIncome: 0,
  totalExpenses: 0,
  monthExpenses: 0,
  savingsGoal: 5000,
  savingsProgress: 0
})

// Modais
const summaryModalOpen = ref(false)
const summaryModalPeriod = ref<'day' | 'week' | 'month'>('day')
const summaryModalData = ref<SummaryData>({ balance: 0, income: 0, expense: 0, transactions: 0 })
const summaryModalTransactions = ref<Transaction[]>([])

const chartModalOpen = ref(false)
const historyModalOpen = ref(false)
const transactionModalOpen = ref(false)
const calendarModalOpen = ref(false)
const quickSummaryModalOpen = ref(false)
const upcomingExpensesModalOpen = ref(false)
const expenseDetailModalOpen = ref(false)

const selectedTransaction = ref<Transaction | null>(null)
const selectedExpense = ref<Transaction | null>(null)

// Próximas despesas
const upcomingExpenses = ref<Transaction[]>([])

// Filtros
const historyFilter = ref({
  search: '',
  type: { label: 'Todas', value: 'all' }
})

const expenseFilter = ref({
  search: '',
  status: { label: 'Todas', value: 'all' }
})

// Calendário
const calendarFilter = ref('day')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const calendarEvents = ref<string[]>([])
const selectedDateTransactions = ref<Transaction[]>([])

// Função para formatar moeda
function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Função para formatar data
function formatDate(dateStr: string | undefined): string {
  const validDateStr = dateStr || new Date().toISOString().split('T')[0]
  const date = new Date(validDateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Variáveis para tooltip
const showTooltip = ref(false)
const tooltipData = ref({ 
  x: 0, 
  y: 0, 
  month: '', 
  receita: 0, 
  despesa: 0, 
  type: '', 
  value: 0 
})

// Dados do gráfico com 12 meses
const chartData = ref({
  months: [] as string[],
  receitas: [] as number[],
  despesas: [] as number[],
  padding: 40,
  chartWidth: 0,
  chartHeight: 0,
  pointSpacing: 0,
  maxValue: 0
})

// Computed para data selecionada formatada
const selectedDateFormatted = computed(() => {
  const dateValue = selectedDate.value as string
  return formatDate(dateValue)
})

// Computed para próximas despesas filtradas
const filteredUpcomingExpenses = computed(() => {
  let filtered = upcomingExpenses.value
  
  // Filtrar por busca
  if (expenseFilter.value.search) {
    const search = expenseFilter.value.search.toLowerCase()
    filtered = filtered.filter(expense => 
      expense.description.toLowerCase().includes(search) ||
      expense.category?.name?.toLowerCase().includes(search)
    )
  }
  
  // Filtrar por status
  if (expenseFilter.value.status.value !== 'all') {
    if (expenseFilter.value.status.value === 'paid') {
      filtered = filtered.filter(expense => expense.is_paid)
    } else if (expenseFilter.value.status.value === 'pending') {
      filtered = filtered.filter(expense => !expense.is_paid)
    }
  }
  
  return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

// Computed para transações filtradas
const filteredHistoryTransactions = computed(() => {
  let filtered = allTransactions.value
  
  if (historyFilter.value.search) {
    filtered = filtered.filter(t => 
      t.description.toLowerCase().includes(historyFilter.value.search.toLowerCase())
    )
  }
  
  if (historyFilter.value.type.value !== 'all') {
    filtered = filtered.filter(t => t.type === historyFilter.value.type.value)
  }
  
  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// Opções do calendário
const dateOptions = computed(() => {
  return (date: string) => {
    return calendarEvents.value.includes(date)
  }
})



// Função para criar gráfico simples
function createChart() {
  drawChart()
}

function drawChart() {
  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')
  if (!ctx) return

  // Usar dados centralizados
  const { months, receitas, despesas, padding } = chartData.value

  // Limpar canvas
  ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)

  // Configurações do gráfico
  chartData.value.chartWidth = chartCanvas.value.width - 2 * padding
  chartData.value.chartHeight = chartCanvas.value.height - 2 * padding
  chartData.value.maxValue = Math.max(...receitas, ...despesas)
  chartData.value.pointSpacing = chartData.value.chartWidth / (months.length - 1)
  
  const { chartWidth, chartHeight, maxValue, pointSpacing } = chartData.value

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

  // Desenhar linhas
  // Linha de receitas (verde)
  ctx.strokeStyle = '#4caf50'
  ctx.lineWidth = 3
  ctx.beginPath()
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((receitas[index] || 0) / maxValue) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Pontos de receitas
  ctx.fillStyle = '#4caf50'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((receitas[index] || 0) / maxValue) * chartHeight
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Linha de despesas (vermelho)
  ctx.strokeStyle = '#f44336'
  ctx.lineWidth = 3
  ctx.beginPath()
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((despesas[index] || 0) / maxValue) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Pontos de despesas
  ctx.fillStyle = '#f44336'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((despesas[index] || 0) / maxValue) * chartHeight
    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Labels dos meses
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    ctx.fillText(month, x, padding + chartHeight + 20)
  })

  // Legenda (posicionada abaixo do gráfico)
  const legendY = padding + chartHeight + 50
  
  ctx.fillStyle = '#4caf50'
  ctx.fillRect(padding + 50, legendY, 15, 15)
  ctx.fillStyle = '#666'
  ctx.font = '12px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('Receitas', padding + 70, legendY + 12)

  ctx.fillStyle = '#f44336'
  ctx.fillRect(padding + 150, legendY, 15, 15)
  ctx.fillStyle = '#666'
  ctx.fillText('Despesas', padding + 170, legendY + 12)
}

// Função para desenhar gráfico expandido
function drawChartLarge() {
  if (!chartCanvasLarge.value) return

  const ctx = chartCanvasLarge.value.getContext('2d')
  if (!ctx) return

  // Usar dados centralizados
  const { months, receitas, despesas } = chartData.value
  const padding = 60

  // Limpar canvas
  ctx.clearRect(0, 0, chartCanvasLarge.value.width, chartCanvasLarge.value.height)

  // Configurações do gráfico expandido
  const chartWidth = chartCanvasLarge.value.width - 2 * padding
  const chartHeight = chartCanvasLarge.value.height - 2 * padding
  const maxValue = Math.max(...receitas, ...despesas)
  const pointSpacing = chartWidth / (months.length - 1)

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

  // Desenhar linhas
  // Linha de receitas (verde)
  ctx.strokeStyle = '#4caf50'
  ctx.lineWidth = 3
  ctx.beginPath()
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((receitas[index] || 0) / maxValue) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Pontos de receitas
  ctx.fillStyle = '#4caf50'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((receitas[index] || 0) / maxValue) * chartHeight
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Linha de despesas (vermelho)
  ctx.strokeStyle = '#f44336'
  ctx.lineWidth = 3
  ctx.beginPath()
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((despesas[index] || 0) / maxValue) * chartHeight
    if (index === 0) {
      ctx.moveTo(x, y)
    } else {
      ctx.lineTo(x, y)
    }
  })
  ctx.stroke()

  // Pontos de despesas
  ctx.fillStyle = '#f44336'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    const y = padding + chartHeight - ((despesas[index] || 0) / maxValue) * chartHeight
    ctx.beginPath()
    ctx.arc(x, y, 6, 0, 2 * Math.PI)
    ctx.fill()
  })

  // Labels dos meses
  ctx.fillStyle = '#666'
  ctx.font = '14px Arial'
  ctx.textAlign = 'center'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    ctx.fillText(month, x, padding + chartHeight + 25)
  })

  // Valores nos pontos
  ctx.font = '12px Arial'
  ctx.textAlign = 'center'
  months.forEach((month, index) => {
    const x = padding + index * pointSpacing
    
    // Valor das receitas
    const yReceita = padding + chartHeight - ((receitas[index] || 0) / maxValue) * chartHeight
    ctx.fillStyle = '#4caf50'
    ctx.fillText(`R$ ${(receitas[index] || 0).toLocaleString('pt-BR')}`, x, yReceita - 10)
    
    // Valor das despesas
    const yDespesa = padding + chartHeight - ((despesas[index] || 0) / maxValue) * chartHeight
    ctx.fillStyle = '#f44336'
    ctx.fillText(`R$ ${(despesas[index] || 0).toLocaleString('pt-BR')}`, x, yDespesa + 20)
  })

  // Legenda (posicionada abaixo do gráfico)
  const legendY = padding + chartHeight + 60
  
  ctx.fillStyle = '#4caf50'
  ctx.fillRect(padding + 100, legendY, 20, 20)
  ctx.fillStyle = '#666'
  ctx.font = '16px Arial'
  ctx.textAlign = 'left'
  ctx.fillText('Receitas', padding + 130, legendY + 15)

  ctx.fillStyle = '#f44336'
  ctx.fillRect(padding + 250, legendY, 20, 20)
  ctx.fillStyle = '#666'
  ctx.fillText('Despesas', padding + 280, legendY + 15)
}

// Função para detectar se o mouse está sobre um ponto
function getPointAtPosition(mouseX: number, mouseY: number) {
  const { months, receitas, despesas, padding, chartHeight, pointSpacing, maxValue } = chartData.value
  const tolerance = 10 // Raio de detecção em pixels
  
  for (let i = 0; i < months.length; i++) {
    const x = padding + i * pointSpacing
    
    // Verificar ponto de receitas
    const receitaY = padding + chartHeight - ((receitas[i] || 0) / maxValue) * chartHeight
    const distanceReceita = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - receitaY, 2))
    
    if (distanceReceita <= tolerance) {
      return {
        index: i,
        type: 'receita',
        month: months[i],
        value: receitas[i],
        x: x,
        y: receitaY
      }
    }
    
    // Verificar ponto de despesas
    const despesaY = padding + chartHeight - ((despesas[i] || 0) / maxValue) * chartHeight
    const distanceDespesa = Math.sqrt(Math.pow(mouseX - x, 2) + Math.pow(mouseY - despesaY, 2))
    
    if (distanceDespesa <= tolerance) {
      return {
        index: i,
        type: 'despesa',
        month: months[i],
        value: despesas[i],
        x: x,
        y: despesaY
      }
    }
  }
  
  return null
}

// Função para lidar com movimento do mouse
function handleMouseMove(event: MouseEvent) {
  if (!chartCanvas.value) return
  
  const rect = chartCanvas.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top
  
  const point = getPointAtPosition(mouseX, mouseY)
  
  if (point) {
    showTooltip.value = true
    tooltipData.value = {
      x: event.clientX,
      y: event.clientY - 10,
      month: point.month || '',
      receita: chartData.value.receitas[point.index] || 0,
      despesa: chartData.value.despesas[point.index] || 0,
      type: point.type,
      value: point.value || 0
    }
    chartCanvas.value.style.cursor = 'pointer'
  } else {
    showTooltip.value = false
    chartCanvas.value.style.cursor = 'default'
  }
}

// Função para esconder tooltip quando mouse sai do canvas
function handleMouseLeave() {
  showTooltip.value = false
  if (chartCanvas.value) {
    chartCanvas.value.style.cursor = 'default'
  }
}





// Funções para carregar dados
async function loadTransactions() {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        description,
        amount,
        date,
        type,
        is_paid,
        category:categories(name),
        account:accounts(name)
      `)
      .order('date', { ascending: false })
    
    if (error) throw error
    
    // Mapear dados do Supabase para o formato correto
    const mappedData = (data || []).map((item: SupabaseTransaction) => ({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date,
      type: item.type as 'income' | 'expense',
      is_paid: item.is_paid || false,
      category: item.category && item.category.length > 0 ? item.category[0] : undefined,
      account: item.account && item.account.length > 0 ? item.account[0] : undefined
    })) as Transaction[]
    
    allTransactions.value = mappedData
    recentTransactions.value = mappedData.slice(0, 5)
    
    calculateSummaries()
    generateChartData()
    generateCalendarEvents()
    loadUpcomingExpenses()
    
  } catch (error) {
    console.error('Erro ao carregar transações:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados',
      position: 'top'
    })
  }
}

// Função para calcular resumos
function calculateSummaries() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  // Resetar dados
  summaryData.value = {
    day: { balance: 0, income: 0, expense: 0, transactions: 0 },
    week: { balance: 0, income: 0, expense: 0, transactions: 0 },
    month: { balance: 0, income: 0, expense: 0, transactions: 0 }
  }
  
  allTransactions.value.forEach(transaction => {
    const transactionDate = new Date(transaction.date + 'T00:00:00')
    const amount = transaction.amount
    
    // Dia
    if (transactionDate >= today) {
      summaryData.value.day.transactions++
      if (transaction.type === 'income') {
        summaryData.value.day.income += amount
      } else {
        summaryData.value.day.expense += amount
      }
    }
    
    // Semana
    if (transactionDate >= weekStart) {
      summaryData.value.week.transactions++
      if (transaction.type === 'income') {
        summaryData.value.week.income += amount
      } else {
        summaryData.value.week.expense += amount
      }
    }
    
    // Mês
    if (transactionDate >= monthStart) {
      summaryData.value.month.transactions++
      if (transaction.type === 'income') {
        summaryData.value.month.income += amount
      } else {
        summaryData.value.month.expense += amount
      }
    }
  })
  
  // Calcular saldos
  summaryData.value.day.balance = summaryData.value.day.income - summaryData.value.day.expense
  summaryData.value.week.balance = summaryData.value.week.income - summaryData.value.week.expense
  summaryData.value.month.balance = summaryData.value.month.income - summaryData.value.month.expense
  
  // Calcular resumo rápido
  const totalIncome = allTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = allTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  quickSummary.value = {
    totalBalance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
    monthExpenses: summaryData.value.month.expense,
    savingsGoal: 5000,
    savingsProgress: Math.min((totalIncome - totalExpenses) / 5000 * 100, 100)
  }
}

// Função para gerar dados do gráfico de 12 meses
function generateChartData() {
  const now = new Date()
  const months = []
  const receitas = []
  const despesas = []
  
  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
    months.push(monthName.charAt(0).toUpperCase() + monthName.slice(1))
    
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const monthTransactions = allTransactions.value.filter(t => {
      const transactionDate = new Date(t.date + 'T00:00:00')
      return transactionDate >= monthStart && transactionDate <= monthEnd
    })
    
    const monthIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const monthExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    receitas.push(monthIncome)
    despesas.push(monthExpense)
  }
  
  chartData.value.months = months
  chartData.value.receitas = receitas
  chartData.value.despesas = despesas
}

// Função para gerar eventos do calendário
function generateCalendarEvents() {
  const events = new Set<string>()
  
  allTransactions.value.forEach(transaction => {
    events.add(transaction.date)
  })
  
  calendarEvents.value = Array.from(events)
}

// Função para carregar próximas despesas do mês
function loadUpcomingExpenses() {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const today = new Date(currentYear, currentMonth, now.getDate())
  
  // Filtrar despesas do mês atual que são futuras ou de hoje
  upcomingExpenses.value = allTransactions.value.filter(transaction => {
    if (transaction.type !== 'expense') return false
    
    const transactionDate = new Date(transaction.date + 'T00:00:00')
    const transactionMonth = transactionDate.getMonth()
    const transactionYear = transactionDate.getFullYear()
    
    // Verificar se é do mês atual e se é hoje ou futuro
    return transactionMonth === currentMonth && 
           transactionYear === currentYear && 
           transactionDate >= today
  }).sort((a, b) => {
    // Ordenar por data (mais próximas primeiro)
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })
}

// Funções dos modais
function openSummaryModal(period: 'day' | 'week' | 'month') {
  summaryModalPeriod.value = period
  summaryModalData.value = summaryData.value[period]
  
  // Filtrar transações do período
  const now = new Date()
  let startDate: Date
  
  if (period === 'day') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  } else if (period === 'week') {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  }
  
  summaryModalTransactions.value = allTransactions.value.filter(t => {
    const transactionDate = new Date(t.date + 'T00:00:00')
    return transactionDate >= startDate
  })
  
  summaryModalOpen.value = true
}

function openChartModal() {
  chartModalOpen.value = true
  void nextTick(() => {
    drawChartLarge()
  })
}

function openHistoryModal() {
  historyModalOpen.value = true
}

function openTransactionModal(transaction: Transaction) {
  selectedTransaction.value = transaction
  transactionModalOpen.value = true
}

function openCalendarModal() {
  calendarModalOpen.value = true
}

function openQuickSummaryModal() {
  quickSummaryModalOpen.value = true
}

// Funções para próximas despesas
function openUpcomingExpensesModal() {
  upcomingExpensesModalOpen.value = true
}

function openExpenseDetailModal(expense: Transaction) {
  selectedExpense.value = expense
  expenseDetailModalOpen.value = true
}

async function markAsPaid(expense: Transaction) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      $q.notify({
        type: 'negative',
        message: 'Usuário não autenticado'
      })
      return
    }

    const { error } = await supabase
      .from('transactions')
      .update({ is_paid: true })
      .eq('id', expense.id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Erro ao marcar despesa como paga:', error)
      $q.notify({
        type: 'negative',
        message: 'Erro ao marcar despesa como paga'
      })
      return
    }

    // Atualizar localmente
    expense.is_paid = true
    
    // Recarregar dados
    await loadTransactions()
    
    $q.notify({
      type: 'positive',
      message: 'Despesa marcada como paga!'
    })
  } catch (error) {
    console.error('Erro ao marcar despesa como paga:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao marcar despesa como paga'
    })
  }
}

function editExpense() {
  if (selectedExpense.value) {
    void router.push(`/transaction-form?id=${selectedExpense.value.id}`)
    expenseDetailModalOpen.value = false
  }
}

function onDateClick(date: string) {
  selectedDate.value = date
  selectedDateTransactions.value = allTransactions.value.filter(t => t.date === date)
}

function editTransaction() {
  if (selectedTransaction.value) {
    void router.push({ name: 'transaction', params: { id: selectedTransaction.value.id } })
  }
}









// Watch para redesenhar gráfico quando dados mudarem
watch(() => chartData.value.months.length, () => {
  void nextTick(() => {
    createChart()
  })
})

onMounted(async () => {
  await loadTransactions()
  await nextTick()
  createChart()
  
  // Adicionar event listeners para tooltip
  if (chartCanvas.value) {
    chartCanvas.value.addEventListener('mousemove', handleMouseMove)
    chartCanvas.value.addEventListener('mouseleave', handleMouseLeave)
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

/* Estilos do Tooltip */
.chart-tooltip {
  pointer-events: none;
  transform: translateX(-50%);
}

.tooltip-content {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  font-size: 12px;
  min-width: 160px;
  backdrop-filter: blur(10px);
}

.tooltip-month {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 8px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
}

.tooltip-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  align-items: center;
}

.tooltip-item:last-child {
  margin-bottom: 0;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.tooltip-label {
  font-weight: 500;
  opacity: 0.9;
}

.tooltip-value {
  font-weight: bold;
}

.tooltip-value.positive {
  color: #4caf50;
}

.tooltip-value.negative {
  color: #f44336;
}

.receita .tooltip-label::before {
  content: '●';
  color: #4caf50;
  margin-right: 4px;
}

.despesa .tooltip-label::before {
  content: '●';
  color: #f44336;
  margin-right: 4px;
}

.saldo .tooltip-label::before {
  content: '●';
  color: #2196f3;
  margin-right: 4px;
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

.expense-item {
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.expense-item:hover {
  background-color: rgba(255, 152, 0, 0.04);
  border-color: rgba(255, 152, 0, 0.2);
}

.expense-item-modal {
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
}

.expense-item-modal:hover {
  background-color: rgba(255, 152, 0, 0.04);
  border-color: rgba(255, 152, 0, 0.2);
}
</style>
