// scripts/import_expenses_interactive.js
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import readline from 'readline'
dotenv.config()

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Interface para entrada do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

// Dados da planilha extraídos da imagem
const expenseData = {
  'julho': {
    'Will Pedro': 369.19,
    'Facu Juli': 0,
    'Will Juli': 338.18,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 0
  },
  'agosto': {
    'Will Pedro': 184.84,
    'Facu Juli': 881.86,
    'Will Juli': 286.16,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1498.88
  },
  'setembro': {
    'Will Pedro': 184.84,
    'Facu Juli': 647.54,
    'Will Juli': 504.48,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1545.31
  },
  'outubro': {
    'Will Pedro': 184.84,
    'Facu Juli': 505.29,
    'Will Juli': 145.36,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1837.34
  },
  'novembro': {
    'Will Pedro': 184.84,
    'Facu Juli': 505.29,
    'Will Juli': 145.36,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1595.30
  },
  'dezembro': {
    'Will Pedro': 184.84,
    'Facu Juli': 505.29,
    'Will Juli': 145.36,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1591.70
  },
  'janeiro': {
    'Will Pedro': 184.84,
    'Facu Juli': 0,
    'Will Juli': 145.36,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 2522.84
  },
  'fevereiro': {
    'Will Pedro': 184.84,
    'Facu Juli': 410.39,
    'Will Juli': 145.36,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 2522.84
  },
  'março': {
    'Will Pedro': 184.84,
    'Facu Juli': 270.39,
    'Will Juli': 0,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1916.13
  },
  'abril': {
    'Will Pedro': 184.84,
    'Facu Juli': 58.04,
    'Will Juli': 0,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1916.13
  },
  'maio': {
    'Will Pedro': 184.84,
    'Facu Juli': 58.04,
    'Will Juli': 0,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1916.13
  },
  'junho': {
    'Will Pedro': 184.84,
    'Facu Juli': 58.04,
    'Will Juli': 0,
    'Nubank': 149.00,
    'Itaucard 6822': 800.00,
    'Casa': 100.00,
    'Agua': 240.00,
    'Energia': 260.00,
    'Dizimo': 130.00,
    'Internet': 394.25,
    'Emprestimo': 1299.90
  }
}

// Mapeamento de categorias da planilha para categorias do sistema
const categoryMapping = {
  'Will Pedro': 'Compras',
  'Facu Juli': 'Compras', 
  'Will Juli': 'Compras',
  'Nubank': 'Outros',
  'Itaucard 6822': 'Outros',
  'Casa': 'Moradia',
  'Agua': 'Moradia',
  'Energia': 'Moradia',
  'Dizimo': 'Outros',
  'Internet': 'Outros',
  'Emprestimo': 'Outros'
}

// Função para converter nome do mês para data
function getDateFromMonth(monthName, year = 2024) {
  const months = {
    'janeiro': '01',
    'fevereiro': '02',
    'março': '03',
    'abril': '04',
    'maio': '05',
    'junho': '06',
    'julho': '07',
    'agosto': '08',
    'setembro': '09',
    'outubro': '10',
    'novembro': '11',
    'dezembro': '12'
  }
  
  return `${year}-${months[monthName]}-15` // Usar dia 15 como padrão
}

// Função de login
async function login() {
  console.log('\n🔐 Login necessário para importar dados')
  
  const email = await question('📧 Email: ')
  const password = await question('🔒 Senha: ')
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    console.error('❌ Erro no login:', error.message)
    return null
  }
  
  console.log('✅ Login realizado com sucesso!')
  return data.user
}

// Função principal de importação
async function importExpenses() {
  try {
    console.log('\n💰 IMPORTADOR DE DESPESAS - Finance App')
    console.log('=====================================\n')
    
    // 1. Fazer login
    const user = await login()
    if (!user) {
      console.log('❌ Não foi possível fazer login. Encerrando...')
      return
    }
    
    console.log(`\n👤 Usuário logado: ${user.email}`)
    
    // 2. Buscar categorias do usuário
    console.log('\n📂 Buscando categorias...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'expense')
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError)
      return
    }
    
    console.log(`✅ Encontradas ${categories.length} categorias de despesa`)
    categories.forEach(cat => console.log(`   - ${cat.name}`))
    
    // 3. Buscar conta padrão do usuário
    console.log('\n💳 Buscando contas...')
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (accountsError || !accounts.length) {
      console.error('❌ Nenhuma conta encontrada. Crie uma conta primeiro no app.')
      return
    }
    
    const defaultAccount = accounts[0]
    console.log(`✅ Usando conta: ${defaultAccount.name} (${defaultAccount.type})`)
    
    // 4. Confirmar importação
    console.log('\n📊 Dados a serem importados:')
    console.log(`   - ${Object.keys(expenseData).length} meses de dados`)
    console.log(`   - ${Object.keys(categoryMapping).length} tipos de despesa`)
    
    const confirm = await question('\n❓ Deseja continuar com a importação? (s/n): ')
    if (confirm.toLowerCase() !== 's' && confirm.toLowerCase() !== 'sim') {
      console.log('❌ Importação cancelada pelo usuário.')
      return
    }
    
    // 5. Preparar transações para inserção
    console.log('\n🔄 Preparando transações...')
    const transactions = []
    
    for (const [monthName, expenses] of Object.entries(expenseData)) {
      const date = getDateFromMonth(monthName)
      
      for (const [expenseType, amount] of Object.entries(expenses)) {
        // Pular valores zerados
        if (amount === 0) continue
        
        // Encontrar categoria correspondente
        const categoryName = categoryMapping[expenseType] || 'Outros'
        const category = categories.find(c => c.name === categoryName)
        
        if (!category) {
          console.warn(`⚠️ Categoria '${categoryName}' não encontrada para '${expenseType}' - pulando...`)
          continue
        }
        
        transactions.push({
          user_id: user.id,
          account_id: defaultAccount.id,
          category_id: category.id,
          amount: amount,
          type: 'expense',
          description: `${expenseType} - ${monthName}`,
          date: date
        })
      }
    }
    
    console.log(`✅ Preparadas ${transactions.length} transações`)
    
    // 6. Inserir transações em lotes
    console.log('\n💾 Inserindo transações no banco de dados...')
    const batchSize = 50
    let inserted = 0
    
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize)
      
      const { error: insertError } = await supabase
        .from('transactions')
        .insert(batch)
      
      if (insertError) {
        console.error(`❌ Erro ao inserir lote ${Math.floor(i/batchSize) + 1}:`, insertError)
        continue
      }
      
      inserted += batch.length
      console.log(`   ✅ ${inserted}/${transactions.length} transações inseridas`)
    }
    
    console.log('\n🎉 IMPORTAÇÃO CONCLUÍDA COM SUCESSO!')
    console.log(`📈 Total de transações inseridas: ${inserted}`)
    console.log('\n💡 Agora você pode visualizar os dados no dashboard do app.')
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error)
  } finally {
    rl.close()
  }
}

// Executar importação
importExpenses().catch(console.error)