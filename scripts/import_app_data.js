// scripts/import_app_data.js
import XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

// Use VITE_ prefixed env vars for consistency with .env
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing SUPABASE URL or ANON KEY in environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function main() {
  const wb = XLSX.readFile('app.xlsx')
  const df = XLSX.utils.sheet_to_json(wb.Sheets['DINHEIROS'], { header: 1 })

  // 1) Extrair gastos de cartão
  const header = df[0].slice(2)
  const rows  = df.slice(1).filter(r => typeof r[1] === 'string' && /^[A-Za-z]+$/.test(r[1]))
  const cardRecords = []

  for (const r of rows) {
    const monthName = r[1]
    const monthDate = new Date(`${monthName} 1, ${new Date().getFullYear()}`)
    header.forEach((acct, i) => {
      const val = r[2 + i]
      if (typeof val === 'number') {
        cardRecords.push({
          month: monthDate.toISOString().slice(0,10),
          account: acct,
          amount: val
        })
      }
    })
  }

  // Insere em lotes de 100
  for (let i = 0; i < cardRecords.length; i += 100) {
    await supabase.from('card_expenses').insert(cardRecords.slice(i, i + 100))
  }

  // 2) Extrair receitas e despesas recorrentes
  const recStart = df.findIndex(r => r[1] && String(r[1]).includes('Despesas Recorrentes'))
  if (recStart !== -1) {
    const recBlock = df.slice(recStart + 1, recStart + 10)
    const recurringRecords = []
    for (const r of recBlock) {
      const name = r[1]
      const amount = r[2]
      const owner = r[3]
      if (name && typeof amount === 'number') {
        recurringRecords.push({
          name,
          amount,
          type: amount > 0 ? 'income' : 'expense',
          owner: owner === 'Pedro' ? 'Pedro' : 'Esposa',
          frequency: 'mensal'
        })
      }
    }
    await supabase.from('recurring').insert(recurringRecords)
  }

  console.log('Importação concluída.')
}

main().catch(err => {
  console.error('Error during import:', err)
  process.exit(1)
})
