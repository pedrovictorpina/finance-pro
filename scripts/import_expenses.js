// scripts/import_expenses.js
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

// Dados da planilha extraídos da imagem
const expenseData = {
  // Meses e seus valores por categoria
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
    'Emprestimo': 0,
    total: 2780.62
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
    'Emprestimo': 1498.88,
    total: 4924.99
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
    'Emprestimo': 1545.31,
    total: 4955.42
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
    'Emprestimo': 1837.34,
    total: 4746.08
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
    'Emprestimo': 1595.30,
    total: 4404.04
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
    'Emprestimo': 1591.70,
    total: 4400.44
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
    'Emprestimo': 2522.84,
    total: 4926.29
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
    'Emprestimo': 2522.84,
    total: 5136.68
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
    'Emprestimo': 1916.13,
    total: 4444.61
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
    'Emprestimo': 1916.13,
    total: 4232.26
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
    'Emprestimo': 1916.13,
    total: 4232.26
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
    'Emprestimo': 1299.90,
    total: 3616.03
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

// Função principal de importação
async function importExpenses() {
  try {
    console.log('🚀 Iniciando importação de despesas...')
    
    // 1. Verificar se o usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Usuário não autenticado. Faça login primeiro.')
      return
    }
    
    console.log(`👤 Usuário: ${user.email}`)
    
    // 2. Buscar categorias do usuário
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'expense')
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError)
      return
    }
    
    console.log(`📂 Encontradas ${categories.length} categorias`)
    
    // 3. Buscar conta padrão do usuário
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
    
    if (accountsError || !accounts.length) {
      console.error('❌ Nenhuma conta encontrada. Crie uma conta primeiro.')
      return
    }
    
    const defaultAccount = accounts[0]
    console.log(`💳 Usando conta: ${defaultAccount.name}`)
    
    // 4. Preparar transações para inserção
    const transactions = []
    
    for (const [monthName, expenses] of Object.entries(expenseData)) {
      const date = getDateFromMonth(monthName)
      
      for (const [expenseType, amount] of Object.entries(expenses)) {
        // Pular o total
        if (expenseType === 'total' || amount === 0) continue
        
        // Encontrar categoria correspondente
        const categoryName = categoryMapping[expenseType] || 'Outros'
        const category = categories.find(c => c.name === categoryName)
        
        if (!category) {
          console.warn(`⚠️ Categoria '${categoryName}' não encontrada para '${expenseType}'`)
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
    
    console.log(`📊 Preparadas ${transactions.length} transações`)
    
    // 5. Inserir transações em lotes
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
      console.log(`✅ Inseridas ${inserted}/${transactions.length} transações`)
    }
    
    console.log('🎉 Importação concluída com sucesso!')
    console.log(`📈 Total de transações inseridas: ${inserted}`)
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error)
  }
}

// Executar importação
importExpenses().catch(console.error)