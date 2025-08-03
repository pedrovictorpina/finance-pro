// Script para adicionar múltiplas despesas recorrentes
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY são obrigatórias')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Configuração das despesas - ADICIONE AQUI AS NOVAS DESPESAS
const expensesConfig = [
  {
    name: 'Tenda',
    transactions: [
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
  },
  {
    name: 'Will',
    transactions: [
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
  },
  {
    name: 'Itau Juli',
    transactions: [
      { month: 8, year: 2024, amount: 369.19 },   // agosto 2024
      { month: 9, year: 2024, amount: 52.66 },    // setembro 2024
      { month: 10, year: 2024, amount: 52.66 },   // outubro 2024
      { month: 11, year: 2024, amount: 52.66 }    // novembro 2024
    ]
  },
  {
    name: 'Will Pedro',
    transactions: [
      { month: 8, year: 2024, amount: 881.80 },   // agosto 2024
      { month: 9, year: 2024, amount: 647.54 },   // setembro 2024
      { month: 10, year: 2024, amount: 505.29 },  // outubro 2024
      { month: 11, year: 2024, amount: 505.29 },  // novembro 2024
      { month: 12, year: 2024, amount: 505.29 },  // dezembro 2024
      { month: 1, year: 2025, amount: 505.29 },   // janeiro 2025
      { month: 2, year: 2025, amount: 410.39 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 212.90 },   // março 2025
      { month: 4, year: 2025, amount: 98.04 },    // abril 2025
      { month: 5, year: 2025, amount: 98.04 },    // maio 2025
      { month: 6, year: 2025, amount: 98.04 }     // junho 2025
    ]
  },
  {
    name: 'Facu Juli',
    transactions: [
      { month: 8, year: 2024, amount: 148.46 },   // agosto 2024
      { month: 9, year: 2024, amount: 148.46 },   // setembro 2024
      { month: 10, year: 2024, amount: 148.46 },  // outubro 2024
      { month: 11, year: 2024, amount: 148.46 },  // novembro 2024
      { month: 12, year: 2024, amount: 148.46 }   // dezembro 2024
    ]
  },
  {
    name: 'Will Juli',
    transactions: [
      { month: 8, year: 2024, amount: 286.16 },   // agosto 2024
      { month: 9, year: 2024, amount: 286.16 },   // setembro 2024
      { month: 10, year: 2024, amount: 145.36 },  // outubro 2024
      { month: 11, year: 2024, amount: 145.36 },  // novembro 2024
      { month: 12, year: 2024, amount: 145.36 },  // dezembro 2024
      { month: 1, year: 2025, amount: 145.36 },   // janeiro 2025
      { month: 2, year: 2025, amount: 145.36 }    // fevereiro 2025
    ]
  },
  {
    name: 'Nubank',
    transactions: [
      { month: 8, year: 2024, amount: 338.18 },   // agosto 2024
      { month: 9, year: 2024, amount: 150.48 },   // setembro 2024
      { month: 10, year: 2024, amount: 150.48 },  // outubro 2024
      { month: 11, year: 2024, amount: 129.70 },  // novembro 2024
      { month: 12, year: 2024, amount: 129.70 },  // dezembro 2024
      { month: 1, year: 2025, amount: 13.04 }     // janeiro 2025
    ]
  },
  {
    name: 'Itaucard 6823',
    transactions: [
      { month: 8, year: 2024, amount: 149.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 149.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 149.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 149.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 149.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 149.00 },   // janeiro 2025
      { month: 2, year: 2025, amount: 149.00 }    // fevereiro 2025
    ]
  },
  {
    name: 'Casa',
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
    name: 'Agua',
    transactions: [
      { month: 8, year: 2024, amount: 100.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 100.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 100.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 100.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 100.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 100.00 },   // janeiro 2025
      { month: 2, year: 2025, amount: 100.00 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 100.00 },   // março 2025
      { month: 4, year: 2025, amount: 100.00 },   // abril 2025
      { month: 5, year: 2025, amount: 100.00 },   // maio 2025
      { month: 6, year: 2025, amount: 100.00 },   // junho 2025
      { month: 7, year: 2025, amount: 100.00 },   // julho 2025
      { month: 8, year: 2025, amount: 100.00 },   // agosto 2025
      { month: 9, year: 2025, amount: 100.00 },   // setembro 2025
      { month: 10, year: 2025, amount: 100.00 },  // outubro 2025
      { month: 11, year: 2025, amount: 100.00 },  // novembro 2025
      { month: 12, year: 2025, amount: 100.00 },  // dezembro 2025
      { month: 1, year: 2026, amount: 100.00 },   // janeiro 2026
      { month: 2, year: 2026, amount: 100.00 },   // fevereiro 2026
      { month: 3, year: 2026, amount: 100.00 },   // março 2026
      { month: 4, year: 2026, amount: 100.00 },   // abril 2026
      { month: 5, year: 2026, amount: 100.00 },   // maio 2026
      { month: 6, year: 2026, amount: 100.00 },   // junho 2026
      { month: 7, year: 2026, amount: 100.00 }    // julho 2026
    ]
  },
  {
    name: 'Energia',
    transactions: [
      { month: 8, year: 2024, amount: 240.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 240.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 240.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 240.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 240.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 240.00 },   // janeiro 2025
      { month: 2, year: 2025, amount: 240.00 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 240.00 },   // março 2025
      { month: 4, year: 2025, amount: 240.00 },   // abril 2025
      { month: 5, year: 2025, amount: 240.00 },   // maio 2025
      { month: 6, year: 2025, amount: 240.00 },   // junho 2025
      { month: 7, year: 2025, amount: 240.00 },   // julho 2025
      { month: 8, year: 2025, amount: 240.00 },   // agosto 2025
      { month: 9, year: 2025, amount: 240.00 },   // setembro 2025
      { month: 10, year: 2025, amount: 240.00 },  // outubro 2025
      { month: 11, year: 2025, amount: 240.00 },  // novembro 2025
      { month: 12, year: 2025, amount: 240.00 },  // dezembro 2025
      { month: 1, year: 2026, amount: 240.00 },   // janeiro 2026
      { month: 2, year: 2026, amount: 240.00 },   // fevereiro 2026
      { month: 3, year: 2026, amount: 240.00 },   // março 2026
      { month: 4, year: 2026, amount: 240.00 },   // abril 2026
      { month: 5, year: 2026, amount: 240.00 },   // maio 2026
      { month: 6, year: 2026, amount: 240.00 },   // junho 2026
      { month: 7, year: 2026, amount: 240.00 }    // julho 2026
    ]
  },
  {
    name: 'Dizimo',
    transactions: [
      { month: 7, year: 2024, amount: 260.00 },   // julho 2024
      { month: 8, year: 2024, amount: 260.00 },   // agosto 2024
      { month: 9, year: 2024, amount: 260.00 },   // setembro 2024
      { month: 10, year: 2024, amount: 260.00 },  // outubro 2024
      { month: 11, year: 2024, amount: 260.00 },  // novembro 2024
      { month: 12, year: 2024, amount: 260.00 },  // dezembro 2024
      { month: 1, year: 2025, amount: 260.00 },   // janeiro 2025
      { month: 2, year: 2025, amount: 260.00 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 260.00 },   // março 2025
      { month: 4, year: 2025, amount: 260.00 },   // abril 2025
      { month: 5, year: 2025, amount: 260.00 },   // maio 2025
      { month: 6, year: 2025, amount: 260.00 },   // junho 2025
      { month: 7, year: 2025, amount: 260.00 },   // julho 2025
      { month: 8, year: 2025, amount: 260.00 },   // agosto 2025
      { month: 9, year: 2025, amount: 260.00 },   // setembro 2025
      { month: 10, year: 2025, amount: 260.00 },  // outubro 2025
      { month: 11, year: 2025, amount: 260.00 },  // novembro 2025
      { month: 12, year: 2025, amount: 260.00 },  // dezembro 2025
      { month: 1, year: 2026, amount: 260.00 },   // janeiro 2026
      { month: 2, year: 2026, amount: 260.00 },   // fevereiro 2026
      { month: 3, year: 2026, amount: 260.00 },   // março 2026
      { month: 4, year: 2026, amount: 260.00 },   // abril 2026
      { month: 5, year: 2026, amount: 260.00 },   // maio 2026
      { month: 6, year: 2026, amount: 260.00 },   // junho 2026
      { month: 7, year: 2026, amount: 260.00 }    // julho 2026
    ]
  },
  {
    name: 'Emprestimo',
    transactions: [
      { month: 8, year: 2024, amount: 394.25 },   // agosto 2024
      { month: 9, year: 2024, amount: 394.25 },   // setembro 2024
      { month: 10, year: 2024, amount: 394.25 },  // outubro 2024
      { month: 11, year: 2024, amount: 394.25 },  // novembro 2024
      { month: 12, year: 2024, amount: 394.25 },  // dezembro 2024
      { month: 1, year: 2025, amount: 394.25 },   // janeiro 2025
      { month: 2, year: 2025, amount: 394.25 },   // fevereiro 2025
      { month: 3, year: 2025, amount: 394.25 },   // março 2025
      { month: 4, year: 2025, amount: 394.25 },   // abril 2025
      { month: 5, year: 2025, amount: 394.25 },   // maio 2025
      { month: 6, year: 2025, amount: 394.25 },   // junho 2025
      { month: 7, year: 2025, amount: 394.25 },   // julho 2025
      { month: 8, year: 2025, amount: 394.25 },   // agosto 2025
      { month: 9, year: 2025, amount: 394.25 },   // setembro 2025
      { month: 10, year: 2025, amount: 394.25 }   // outubro 2025
    ]
  }
  // ADICIONE NOVAS DESPESAS AQUI SEGUINDO O MESMO FORMATO
]

async function addMultipleExpenses() {
  try {
    console.log('🔄 Iniciando criação de múltiplas despesas recorrentes...')
    
    // Obter credenciais dos argumentos da linha de comando
    const email = process.argv[2]
    const password = process.argv[3]
    
    if (!email || !password) {
      console.error('❌ Uso: node scripts/add_multiple_expenses.cjs <email> <senha>')
      console.error('   Exemplo: node scripts/add_multiple_expenses.cjs usuario@email.com minhasenha')
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
    
    let totalTransactions = 0
    let totalAmount = 0
    
    // Processar cada despesa
    for (const expense of expensesConfig) {
      console.log(`\n🔄 Processando despesa: ${expense.name}...`)
      
      // Preparar dados para inserção
      const transactionsToInsert = expense.transactions.map(transaction => {
        const date = new Date(transaction.year, transaction.month - 1, 1)
        const dateString = date.toISOString().split('T')[0]
        
        return {
          user_id: authData.user.id,
          date: dateString,
          amount: transaction.amount,
          account_id: accountId,
          category_id: categoryId,
          description: expense.name,
          type: 'expense',
          created_at: new Date().toISOString()
        }
      })
      
      console.log(`   📝 Inserindo ${transactionsToInsert.length} transações...`)
      
      // Inserir transações desta despesa
      const { data: insertedTransactions, error: insertError } = await supabase
        .from('transactions')
        .insert(transactionsToInsert)
        .select()
      
      if (insertError) {
        console.error(`   ❌ Erro ao inserir transações de ${expense.name}:`, insertError.message)
        continue
      }
      
      const expenseTotal = transactionsToInsert.reduce((sum, t) => sum + t.amount, 0)
      totalTransactions += insertedTransactions.length
      totalAmount += expenseTotal
      
      console.log(`   ✅ ${insertedTransactions.length} transações de ${expense.name} criadas (Total: R$ ${expenseTotal.toFixed(2)})`)
    }
    
    console.log('\n🎉 RESUMO FINAL:')
    console.log(`   📊 Total de despesas processadas: ${expensesConfig.length}`)
    console.log(`   📝 Total de transações criadas: ${totalTransactions}`)
    console.log(`   💰 Valor total de todas as despesas: R$ ${totalAmount.toFixed(2)}`)
    
    console.log('\n📋 Detalhes por despesa:')
    expensesConfig.forEach(expense => {
      const expenseTotal = expense.transactions.reduce((sum, t) => sum + t.amount, 0)
      console.log(`   - ${expense.name}: ${expense.transactions.length} transações, R$ ${expenseTotal.toFixed(2)}`)
    })
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar o script
addMultipleExpenses()
  .then(() => {
    console.log('\n🎉 Script finalizado!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })