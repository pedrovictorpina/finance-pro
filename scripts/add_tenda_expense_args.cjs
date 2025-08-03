// Script para adicionar despesa recorrente "Tenda" com argumentos
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addTendaExpense() {
  try {
    console.log('🔄 Iniciando criação da despesa recorrente "Tenda"...')
    
    // Obter credenciais dos argumentos da linha de comando
    const email = process.argv[2]
    const password = process.argv[3]
    
    if (!email || !password) {
      console.error('❌ Uso: node scripts/add_tenda_expense_args.cjs <email> <senha>')
      console.error('   Exemplo: node scripts/add_tenda_expense_args.cjs usuario@email.com minhasenha')
      process.exit(1)
    }
    
    console.log(`📧 Fazendo login com: ${email}`)
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError) {
      console.error('❌ Erro de autenticação:', authError.message)
      return
    }
    
    console.log('✅ Usuário autenticado com sucesso')
    
    // Buscar conta padrão (primeira conta disponível)
    const { data: accounts, error: accountError } = await supabase
      .from('accounts')
      .select('*')
      .limit(1)
    
    if (accountError || !accounts || accounts.length === 0) {
      console.error('❌ Erro ao buscar contas ou nenhuma conta encontrada')
      return
    }
    
    const accountId = accounts[0].id
    console.log(`✅ Usando conta: ${accounts[0].name} (ID: ${accountId})`)
    
    // Buscar categoria de despesa (primeira categoria de despesa disponível)
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'expense')
      .limit(1)
    
    if (categoryError || !categories || categories.length === 0) {
      console.error('❌ Erro ao buscar categorias ou nenhuma categoria de despesa encontrada')
      return
    }
    
    const categoryId = categories[0].id
    console.log(`✅ Usando categoria: ${categories[0].name} (ID: ${categoryId})`)
    
    // Definir as transações da Tenda conforme especificado
    const tendaTransactions = [
      { month: 7, year: 2024, amount: 509.00 },   // julho 2024
      { month: 8, year: 2024, amount: 509.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 509.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 509.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 509.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 509.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 509.00 },   // janeiro 2025
      { month: 2, year: 2025, amount: 509.00 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 509.00 },   // março 2025
      { month: 4, year: 2025, amount: 509.00 },   // abril 2025
      { month: 5, year: 2025, amount: 509.00 },   // maio 2025
      { month: 6, year: 2025, amount: 509.00 },   // junho 2025
      { month: 7, year: 2025, amount: 3876.28 },  // julho 2025
      { month: 8, year: 2025, amount: 509.00 },   // agosto 2025
      { month: 9, year: 2025, amount: 509.00 },   // setembro 2025
      { month: 10, year: 2025, amount: 509.00 },  // outubro 2025
      { month: 11, year: 2025, amount: 509.00 },  // novembro 2025
      { month: 12, year: 2025, amount: 509.00 },  // dezembro 2025
      { month: 1, year: 2026, amount: 3876.28 },  // janeiro 2026
      { month: 2, year: 2026, amount: 509.00 },   // fevereiro 2026
      { month: 3, year: 2026, amount: 509.00 },   // março 2026
      { month: 4, year: 2026, amount: 509.00 },   // abril 2026
      { month: 5, year: 2026, amount: 509.00 },   // maio 2026
      { month: 6, year: 2026, amount: 509.00 },   // junho 2026
      { month: 7, year: 2026, amount: 3876.28 }   // julho 2026
    ]
    
    // Preparar dados para inserção
    const transactionsToInsert = tendaTransactions.map(transaction => {
      const date = new Date(transaction.year, transaction.month - 1, 1)
      const dateString = date.toISOString().split('T')[0]
      
      return {
        user_id: authData.user.id,
        date: dateString,
        amount: transaction.amount,
        account_id: accountId,
        category_id: categoryId,
        description: 'Tenda',
        type: 'expense',
        created_at: new Date().toISOString()
      }
    })
    
    console.log(`🔄 Inserindo ${transactionsToInsert.length} transações da Tenda...`)
    
    // Inserir todas as transações
    const { data: insertedTransactions, error: insertError } = await supabase
      .from('transactions')
      .insert(transactionsToInsert)
      .select()
    
    if (insertError) {
      console.error('❌ Erro ao inserir transações:', insertError.message)
      return
    }
    
    console.log(`✅ ${insertedTransactions.length} transações da Tenda criadas com sucesso!`)
    console.log('📊 Resumo:')
    console.log(`   - Total de transações: ${insertedTransactions.length}`)
    console.log(`   - Valor total: R$ ${transactionsToInsert.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`)
    console.log(`   - Período: julho/2024 a julho/2026`)
    console.log('\n🎯 Valores especiais:')
    console.log('   - Julho 2025: R$ 3.876,28')
    console.log('   - Janeiro 2026: R$ 3.876,28')
    console.log('   - Julho 2026: R$ 3.876,28')
    console.log('   - Demais meses: R$ 509,00')
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar o script
addTendaExpense()
  .then(() => {
    console.log('🎉 Script finalizado!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })