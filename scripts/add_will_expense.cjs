// Script para adicionar despesa recorrente "Will"
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function addWillExpense() {
  try {
    console.log('🔄 Iniciando criação da despesa recorrente "Will"...')
    
    // Obter credenciais dos argumentos da linha de comando
    const email = process.argv[2]
    const password = process.argv[3]
    
    if (!email || !password) {
      console.error('❌ Uso: node scripts/add_will_expense.cjs <email> <senha>')
      console.error('   Exemplo: node scripts/add_will_expense.cjs usuario@email.com minhasenha')
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
    
    // Definir as transações do Will conforme especificado
    // Assumindo que é de agosto 2024 a junho 2025 (11 meses)
    const willTransactions = [
      { month: 8, year: 2024, amount: 184.84 },   // agosto 2024
      { month: 9, year: 2024, amount: 184.84 },   // setembro 2024
      { month: 10, year: 2024, amount: 184.84 },  // outubro 2024
      { month: 11, year: 2024, amount: 184.84 },  // novembro 2024
      { month: 12, year: 2024, amount: 184.84 },  // dezembro 2024
      { month: 1, year: 2025, amount: 184.84 },   // janeiro 2025
      { month: 2, year: 2025, amount: 184.84 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 184.84 },   // março 2025
      { month: 4, year: 2025, amount: 184.84 },   // abril 2025
      { month: 5, year: 2025, amount: 184.84 },   // maio 2025
      { month: 6, year: 2025, amount: 184.84 }    // junho 2025
    ]
    
    // Preparar dados para inserção
    const transactionsToInsert = willTransactions.map(transaction => {
      const date = new Date(transaction.year, transaction.month - 1, 1)
      const dateString = date.toISOString().split('T')[0]
      
      return {
        user_id: authData.user.id,
        date: dateString,
        amount: transaction.amount,
        account_id: accountId,
        category_id: categoryId,
        description: 'Will',
        type: 'expense',
        created_at: new Date().toISOString()
      }
    })
    
    console.log(`🔄 Inserindo ${transactionsToInsert.length} transações do Will...`)
    
    // Inserir todas as transações
    const { data: insertedTransactions, error: insertError } = await supabase
      .from('transactions')
      .insert(transactionsToInsert)
      .select()
    
    if (insertError) {
      console.error('❌ Erro ao inserir transações:', insertError.message)
      return
    }
    
    console.log(`✅ ${insertedTransactions.length} transações do Will criadas com sucesso!`)
    console.log('📊 Resumo:')
    console.log(`   - Total de transações: ${insertedTransactions.length}`)
    console.log(`   - Valor mensal: R$ 184,84`)
    console.log(`   - Valor total: R$ ${transactionsToInsert.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}`)
    console.log(`   - Período: agosto/2024 a junho/2025`)
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar o script
addWillExpense()
  .then(() => {
    console.log('🎉 Script finalizado!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })