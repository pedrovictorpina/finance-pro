// Script para adicionar múltiplas receitas recorrentes
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuração das receitas - ADICIONE AQUI AS NOVAS RECEITAS
const incomesConfig = [
  {
    name: 'Dia 15 Pedro',
    transactions: [
      { month: 8, year: 2024, amount: 1400.00, day: 15 },   // agosto 2024
      { month: 9, year: 2024, amount: 1400.00, day: 15 },   // setembro 2024
      { month: 10, year: 2024, amount: 1400.00, day: 15 },  // outubro 2024
      { month: 11, year: 2024, amount: 1400.00, day: 15 },  // novembro 2024
      { month: 12, year: 2024, amount: 1400.00, day: 15 },  // dezembro 2024
      { month: 1, year: 2025, amount: 1400.00, day: 15 },   // janeiro 2025
      { month: 2, year: 2025, amount: 1400.00, day: 15 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 1400.00, day: 15 },   // março 2025
      { month: 4, year: 2025, amount: 1400.00, day: 15 },   // abril 2025
      { month: 5, year: 2025, amount: 1400.00, day: 15 },   // maio 2025
      { month: 6, year: 2025, amount: 1400.00, day: 15 },   // junho 2025
      { month: 7, year: 2025, amount: 1400.00, day: 15 }    // julho 2025
    ]
  },
  {
    name: 'Dia 30 Pedro',
    transactions: [
      { month: 8, year: 2024, amount: 1600.00, day: 30 },   // agosto 2024
      { month: 9, year: 2024, amount: 1400.00, day: 30 },   // setembro 2024
      { month: 10, year: 2024, amount: 1400.00, day: 30 },  // outubro 2024
      { month: 11, year: 2024, amount: 1400.00, day: 30 },  // novembro 2024
      { month: 12, year: 2024, amount: 1400.00, day: 30 },  // dezembro 2024
      { month: 1, year: 2025, amount: 1400.00, day: 30 },   // janeiro 2025
      { month: 2, year: 2025, amount: 1400.00, day: 28 },   // fevereiro 2025 (último dia)
      { month: 3, year: 2025, amount: 1400.00, day: 30 },   // março 2025
      { month: 4, year: 2025, amount: 1400.00, day: 30 },   // abril 2025
      { month: 5, year: 2025, amount: 1400.00, day: 30 },   // maio 2025
      { month: 6, year: 2025, amount: 1400.00, day: 30 },   // junho 2025
      { month: 7, year: 2025, amount: 1400.00, day: 30 }    // julho 2025
    ]
  },
  {
    name: 'Juli',
    transactions: [
      { month: 8, year: 2024, amount: 1130.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 1130.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 1130.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 1130.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 1130.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 1130.00 },   // janeiro 2025
      { month: 2, year: 2025, amount: 1130.00 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 1130.00 },   // março 2025
      { month: 4, year: 2025, amount: 1130.00 },   // abril 2025
      { month: 5, year: 2025, amount: 1130.00 },   // maio 2025
      { month: 6, year: 2025, amount: 1130.00 },   // junho 2025
      { month: 7, year: 2025, amount: 1130.00 }    // julho 2025
    ]
  },
  {
    name: 'Ajuda',
    transactions: [
      { month: 7, year: 2024, amount: 800.00 },   // julho 2024
      { month: 8, year: 2024, amount: 800.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 800.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 800.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 800.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 800.00 }   // dezembro 2024
    ]
  },
  {
    name: 'David',
    transactions: [
      { month: 7, year: 2024, amount: 65.00 },   // julho 2024
      { month: 8, year: 2024, amount: 65.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 65.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 65.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 65.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 65.00 }   // dezembro 2024
    ]
  },
  {
    name: 'Luciene',
    transactions: [
      { month: 7, year: 2024, amount: 25.00 },   // julho 2024
      { month: 8, year: 2024, amount: 25.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 25.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 25.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 25.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 25.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 25.00 }    // janeiro 2025
    ]
  },
  {
    name: 'Sueva',
    transactions: [
      { month: 7, year: 2024, amount: 250.00 },   // julho 2024
      { month: 8, year: 2024, amount: 250.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 250.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 250.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 250.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 250.00 }   // dezembro 2024
    ]
  },
  {
    name: 'Jac',
    transactions: [
      { month: 7, year: 2024, amount: 152.66 },   // julho 2024
      { month: 8, year: 2024, amount: 52.66 },    // agosto 2024
      { month: 9, year: 2024, amount: 52.66 },    // setembro 2024
      { month: 10, year: 2024, amount: 52.66 }    // outubro 2024
    ]
  },
  {
    name: 'Ney',
    transactions: [
      { month: 7, year: 2024, amount: 80.00 }     // julho 2024
    ]
  },
  {
    name: 'Rose',
    transactions: [
      { month: 7, year: 2024, amount: 112.00 },   // julho 2024
      { month: 8, year: 2024, amount: 112.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 112.00 }    // setembro 2024
    ]
  }
  // ADICIONE NOVAS RECEITAS AQUI SEGUINDO O MESMO FORMATO
]

async function addMultipleIncomes() {
  try {
    console.log('🔄 Iniciando criação de múltiplas receitas recorrentes...')
    
    // Obter credenciais dos argumentos da linha de comando
    const email = process.argv[2]
    const password = process.argv[3]
    
    if (!email || !password) {
      console.error('❌ Uso: node scripts/add_multiple_incomes.cjs <email> <senha>')
      console.error('   Exemplo: node scripts/add_multiple_incomes.cjs usuario@email.com minhasenha')
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
    
    // Buscar categoria de receita (primeira categoria de receita disponível)
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('type', 'income')
      .limit(1)
    
    if (categoryError || !categories || categories.length === 0) {
      console.error('❌ Erro ao buscar categorias ou nenhuma categoria de receita encontrada')
      return
    }
    
    const categoryId = categories[0].id
    console.log(`✅ Usando categoria: ${categories[0].name} (ID: ${categoryId})`)
    
    let totalTransactions = 0
    let totalAmount = 0
    
    // Processar cada receita
    for (const income of incomesConfig) {
      console.log(`\n🔄 Processando receita: ${income.name}...`)
      
      // Preparar dados para inserção
      const transactionsToInsert = income.transactions.map(transaction => {
        const day = transaction.day || 1 // Usar dia específico ou dia 1
        const date = new Date(transaction.year, transaction.month - 1, day)
        const dateString = date.toISOString().split('T')[0]
        
        return {
          user_id: authData.user.id,
          date: dateString,
          amount: transaction.amount,
          account_id: accountId,
          category_id: categoryId,
          description: income.name,
          type: 'income',
          created_at: new Date().toISOString()
        }
      })
      
      console.log(`   📝 Inserindo ${transactionsToInsert.length} transações...`)
      
      // Inserir transações desta receita
      const { data: insertedTransactions, error: insertError } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select()
      
      if (insertError) {
        console.error(`   ❌ Erro ao inserir transações de ${income.name}:`, insertError.message)
        continue
      }
      
      const incomeTotal = transactionsToInsert.reduce((sum, t) => sum + t.amount, 0)
      totalTransactions += insertedTransactions.length
      totalAmount += incomeTotal
      
      console.log(`   ✅ ${insertedTransactions.length} transações de ${income.name} criadas (Total: R$ ${incomeTotal.toFixed(2)})`)
    }
    
    console.log('\n🎉 RESUMO FINAL:')
    console.log(`   📊 Total de receitas processadas: ${incomesConfig.length}`)
    console.log(`   📝 Total de transações criadas: ${totalTransactions}`)
    console.log(`   💰 Valor total de todas as receitas: R$ ${totalAmount.toFixed(2)}`)
    
    console.log('\n📋 Detalhes por receita:')
    incomesConfig.forEach(income => {
      const incomeTotal = income.transactions.reduce((sum, t) => sum + t.amount, 0)
      console.log(`   - ${income.name}: ${income.transactions.length} transações, R$ ${incomeTotal.toFixed(2)}`)
    })
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar o script
addMultipleIncomes()
  .then(() => {
    console.log('\n🎉 Script finalizado!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })