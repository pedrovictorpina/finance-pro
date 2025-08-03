// scripts/import_expenses_auto.js
// Script automatizado para importar despesas com credenciais pré-definidas

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Credenciais do usuário
const EMAIL = 'pedrovictorpina@gmail.com'
const PASSWORD = 'Juliane'

// Dados das despesas da planilha
const expenseData = [
  { month: 'julho', year: 2024, will: 509.00, itau: 184.84, willPedro: 369.19, facuJuli: 881.86, willJuli: 148.46, nubank: 286.16, itaucard: 338.18, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'agosto', year: 2024, will: 509.00, itau: 184.84, willPedro: 525.46, facuJuli: 647.54, willJuli: 118.46, nubank: 268.16, itaucard: 504.48, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'setembro', year: 2024, will: 509.00, itau: 184.84, willPedro: 52.66, facuJuli: 505.29, willJuli: 148.46, nubank: 145.36, itaucard: 150.48, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'outubro', year: 2024, will: 509.00, itau: 184.84, willPedro: 52.66, facuJuli: 505.29, willJuli: 148.46, nubank: 145.36, itaucard: 129.70, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'novembro', year: 2024, will: 509.00, itau: 184.84, willPedro: 0, facuJuli: 505.29, willJuli: 148.46, nubank: 145.36, itaucard: 113.04, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'dezembro', year: 2024, will: 509.00, itau: 184.84, willPedro: 0, facuJuli: 0, willJuli: 145.36, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'janeiro', year: 2025, will: 3676.26, itau: 0, willPedro: 0, facuJuli: 0, willJuli: 0, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 394.25 },
  { month: 'fevereiro', year: 2025, will: 509.00, itau: 184.84, willPedro: 410.39, facuJuli: 0, willJuli: 145.36, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 222.84 },
  { month: 'março', year: 2025, will: 509.00, itau: 184.84, willPedro: 0, facuJuli: 0, willJuli: 0, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 222.84 },
  { month: 'abril', year: 2025, will: 509.00, itau: 184.84, willPedro: 0, facuJuli: 0, willJuli: 0, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 222.84 },
  { month: 'maio', year: 2025, will: 509.00, itau: 184.84, willPedro: 0, facuJuli: 0, willJuli: 0, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 222.84 },
  { month: 'junho', year: 2025, will: 509.00, itau: 184.84, willPedro: 0, facuJuli: 0, willJuli: 0, nubank: 0, itaucard: 0, casa: 149.00, agua: 100.00, energia: 240.00, dizimo: 260.00, internet: 130.00, emprestimo: 222.84 }
]

// Mapeamento de categorias
const categoryMapping = {
  'Will Pedro': 'Compras',
  'Casa': 'Moradia',
  'Água': 'Moradia',
  'Energia': 'Moradia',
  'Dízimo': 'Outros',
  'Internet': 'Moradia',
  'Empréstimo': 'Outros',
  'Will': 'Compras',
  'Itaú Juli': 'Compras',
  'Facu Juli': 'Compras',
  'Will Juli': 'Compras',
  'Nubank': 'Compras',
  'Itaucard 6822': 'Compras'
}

// Função principal de importação
async function importExpensesAuto() {
  try {
    console.log('\n💰 IMPORTAÇÃO AUTOMATIZADA DE DESPESAS - Finance App')
    console.log('==================================================\n')
    
    // 1. Fazer login
    console.log('🔐 Fazendo login...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD
    })
    
    if (authError) {
      console.error('❌ Erro no login:', authError.message)
      return
    }
    
    console.log('✅ Login realizado com sucesso!')
    console.log(`👤 Usuário: ${authData.user.email}\n`)
    
    const userId = authData.user.id
    
    // 2. Verificar contas
    console.log('🔄 Verificando contas...')
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', userId)
    
    if (accountsError) {
      console.error('❌ Erro ao buscar contas:', accountsError.message)
      return
    }
    
    if (!accounts || accounts.length === 0) {
      console.error('❌ NENHUMA CONTA ENCONTRADA!')
      console.log('\n💡 Para resolver:')
      console.log('   1. Acesse: http://localhost:9000')
      console.log('   2. Faça login')
      console.log('   3. Crie uma conta em "Contas" > "Adicionar Conta"')
      console.log('   4. Execute este script novamente')
      return
    }
    
    console.log(`✅ Encontradas ${accounts.length} conta(s):`)
    accounts.forEach(acc => {
      console.log(`   - ${acc.name} (${acc.type}) - Saldo: R$ ${acc.balance.toFixed(2)}`)
    })
    
    // Usar a primeira conta disponível
    const defaultAccount = accounts[0]
    console.log(`\n📋 Usando conta padrão: ${defaultAccount.name}\n`)
    
    // 3. Verificar categorias
    console.log('🔄 Verificando categorias...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'expense')
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError.message)
      return
    }
    
    if (!categories || categories.length === 0) {
      console.error('❌ NENHUMA CATEGORIA ENCONTRADA!')
      console.log('\n💡 Para resolver:')
      console.log('   1. Faça login no app: http://localhost:9000')
      console.log('   2. As categorias serão criadas automaticamente')
      console.log('   3. Execute este script novamente')
      return
    }
    
    console.log(`✅ Encontradas ${categories.length} categorias de despesa\n`)
    
    // Criar mapa de categorias por nome
    const categoryMap = {}
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id
    })
    
    // 4. Processar e importar dados
    console.log('📊 INICIANDO IMPORTAÇÃO DOS DADOS')
    console.log('================================\n')
    
    let totalTransactions = 0
    let totalAmount = 0
    let successCount = 0
    let errorCount = 0
    
    for (const monthData of expenseData) {
      console.log(`📅 Processando ${monthData.month}/${monthData.year}...`)
      
      // Processar cada tipo de despesa do mês
      const expenses = [
        { type: 'Will', amount: monthData.will },
        { type: 'Itaú Juli', amount: monthData.itau },
        { type: 'Will Pedro', amount: monthData.willPedro },
        { type: 'Facu Juli', amount: monthData.facuJuli },
        { type: 'Will Juli', amount: monthData.willJuli },
        { type: 'Nubank', amount: monthData.nubank },
        { type: 'Itaucard 6822', amount: monthData.itaucard },
        { type: 'Casa', amount: monthData.casa },
        { type: 'Água', amount: monthData.agua },
        { type: 'Energia', amount: monthData.energia },
        { type: 'Dízimo', amount: monthData.dizimo },
        { type: 'Internet', amount: monthData.internet },
        { type: 'Empréstimo', amount: monthData.emprestimo }
      ]
      
      for (const expense of expenses) {
        if (expense.amount > 0) {
          totalTransactions++
          totalAmount += expense.amount
          
          // Mapear categoria
          const categoryName = categoryMapping[expense.type]
          const categoryId = categoryMap[categoryName]
          
          if (!categoryId) {
            console.warn(`   ⚠️ Categoria não encontrada para: ${expense.type} -> ${categoryName}`)
            errorCount++
            continue
          }
          
          // Criar data para o meio do mês
          const date = new Date(monthData.year, getMonthNumber(monthData.month) - 1, 15)
          const dateString = date.toISOString().split('T')[0]
          
          // Inserir transação
          const { error: insertError } = await supabase
            .from('transactions')
            .insert({
              user_id: userId,
              account_id: defaultAccount.id,
              category_id: categoryId,
              type: 'expense',
              amount: expense.amount,
              description: `${expense.type} - ${monthData.month}/${monthData.year}`,
              date: dateString
            })
          
          if (insertError) {
            console.error(`   ❌ Erro ao inserir ${expense.type}: ${insertError.message}`)
            errorCount++
          } else {
            successCount++
            console.log(`   ✅ ${expense.type}: R$ ${expense.amount.toFixed(2)} (${categoryName})`)
          }
        }
      }
      
      console.log(`   📊 ${monthData.month}/${monthData.year}: ${expenses.filter(e => e.amount > 0).length} transações\n`)
    }
    
    // 5. Resumo final
    console.log('🎉 IMPORTAÇÃO CONCLUÍDA!')
    console.log('========================\n')
    console.log(`📊 Estatísticas:`)
    console.log(`   ✅ Transações inseridas: ${successCount}`)
    console.log(`   ❌ Erros: ${errorCount}`)
    console.log(`   💰 Valor total: R$ ${totalAmount.toFixed(2)}`)
    console.log(`   📅 Período: julho/2024 a junho/2025`)
    console.log(`   🏦 Conta utilizada: ${defaultAccount.name}\n`)
    
    if (successCount > 0) {
      console.log('🚀 Próximos passos:')
      console.log('   1. Acesse o Finance App: http://localhost:9000')
      console.log('   2. Vá para o Dashboard para ver os dados importados')
      console.log('   3. Confira os relatórios e gráficos')
      console.log('   4. Ajuste categorias se necessário\n')
    }
    
    // Fazer logout
    await supabase.auth.signOut()
    console.log('🔓 Logout realizado')
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error.message)
    console.log('\n🔧 Possíveis soluções:')
    console.log('   1. Verifique se o Finance App está rodando')
    console.log('   2. Verifique se você tem uma conta criada')
    console.log('   3. Teste o login: node scripts/test_login_auto.js')
  }
}

// Função auxiliar para converter nome do mês para número
function getMonthNumber(monthName) {
  const months = {
    'janeiro': 1, 'fevereiro': 2, 'março': 3, 'abril': 4,
    'maio': 5, 'junho': 6, 'julho': 7, 'agosto': 8,
    'setembro': 9, 'outubro': 10, 'novembro': 11, 'dezembro': 12
  }
  return months[monthName.toLowerCase()] || 1
}

// Executar importação
console.log('🚀 Iniciando importação automatizada...')
importExpensesAuto().catch(console.error)