// scripts/test_login.js
// Script simples para testar login antes da importação

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import readline from 'readline'
dotenv.config()

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas')
  console.log('\n🔧 Verifique se o arquivo .env contém:')
  console.log('   VITE_SUPABASE_URL=sua_url_aqui')
  console.log('   VITE_SUPABASE_ANON_KEY=sua_chave_aqui')
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

// Função de teste de login
async function testLogin() {
  try {
    console.log('\n🧪 TESTE DE LOGIN - Finance App')
    console.log('==============================\n')
    
    console.log('📋 Informações do ambiente:')
    console.log(`   Supabase URL: ${supabaseUrl}`)
    console.log(`   Chave: ${supabaseAnonKey.slice(0, 20)}...\n`)
    
    // Solicitar credenciais
    console.log('🔐 Digite suas credenciais do Finance App:')
    const email = await question('📧 Email: ')
    
    // Validar email básico
    if (!email || !email.includes('@')) {
      console.error('❌ Email inválido! Digite um email completo (ex: usuario@dominio.com)')
      rl.close()
      return
    }
    
    const password = await question('🔒 Senha: ')
    
    if (!password) {
      console.error('❌ Senha não pode estar vazia!')
      rl.close()
      return
    }
    
    console.log('\n🔄 Testando login...')
    
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    })
    
    if (error) {
      console.error('❌ Erro no login:', error.message)
      console.log('\n💡 Possíveis soluções:')
      console.log('   1. Verifique se o email está correto')
      console.log('   2. Verifique se a senha está correta')
      console.log('   3. Teste o login no app web primeiro')
      console.log('   4. Certifique-se de que a conta existe')
      rl.close()
      return
    }
    
    console.log('✅ Login realizado com sucesso!')
    console.log(`👤 Usuário: ${data.user.email}`)
    console.log(`🆔 ID: ${data.user.id}`)
    
    // Testar busca de contas
    console.log('\n🔄 Verificando contas...')
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', data.user.id)
    
    if (accountsError) {
      console.error('❌ Erro ao buscar contas:', accountsError.message)
    } else if (!accounts || accounts.length === 0) {
      console.warn('⚠️ Nenhuma conta encontrada!')
      console.log('\n💡 Para usar o importador:')
      console.log('   1. Abra o Finance App')
      console.log('   2. Vá em "Contas"')
      console.log('   3. Crie pelo menos uma conta')
    } else {
      console.log(`✅ Encontradas ${accounts.length} conta(s):`)
      accounts.forEach(acc => {
        console.log(`   - ${acc.name} (${acc.type}) - Saldo: R$ ${acc.balance}`)
      })
    }
    
    // Testar busca de categorias
    console.log('\n🔄 Verificando categorias...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', data.user.id)
      .eq('type', 'expense')
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError.message)
    } else if (!categories || categories.length === 0) {
      console.warn('⚠️ Nenhuma categoria de despesa encontrada!')
      console.log('\n💡 Para criar categorias:')
      console.log('   1. Faça login no Finance App pelo menos uma vez')
      console.log('   2. As categorias são criadas automaticamente')
    } else {
      console.log(`✅ Encontradas ${categories.length} categorias de despesa:`)
      categories.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.color})`)
      })
    }
    
    // Verificar se está pronto para importação
    const readyForImport = accounts && accounts.length > 0 && categories && categories.length > 0
    
    console.log('\n📊 STATUS PARA IMPORTAÇÃO:')
    if (readyForImport) {
      console.log('🎉 PRONTO PARA IMPORTAR!')
      console.log('\n▶️ Para importar os dados da planilha, execute:')
      console.log('   node scripts/import_expenses_interactive.js')
    } else {
      console.log('⚠️ NÃO ESTÁ PRONTO PARA IMPORTAR')
      console.log('\n📋 Checklist:')
      console.log(`   ${accounts && accounts.length > 0 ? '✅' : '❌'} Pelo menos uma conta criada`)
      console.log(`   ${categories && categories.length > 0 ? '✅' : '❌'} Categorias de despesa disponíveis`)
    }
    
    // Fazer logout
    await supabase.auth.signOut()
    console.log('\n🔓 Logout realizado')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
  } finally {
    rl.close()
  }
}

// Executar teste
testLogin().catch(console.error)