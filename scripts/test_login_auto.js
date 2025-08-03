// scripts/test_login_auto.js
// Script automatizado para testar login com credenciais específicas

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

// Credenciais fornecidas pelo usuário
const EMAIL = 'pedrovictorpina@gmail.com'
const PASSWORD = 'Juliane'

// Função de teste de login automatizado
async function testLoginAuto() {
  try {
    console.log('\n🧪 TESTE DE LOGIN AUTOMATIZADO - Finance App')
    console.log('==========================================\n')
    
    console.log('📋 Informações do ambiente:')
    console.log(`   Supabase URL: ${supabaseUrl}`)
    console.log(`   Chave: ${supabaseAnonKey.slice(0, 20)}...\n`)
    
    console.log('🔐 Testando credenciais:')
    console.log(`   Email: ${EMAIL}`)
    console.log(`   Senha: ${'*'.repeat(PASSWORD.length)}\n`)
    
    console.log('🔄 Tentando fazer login...')
    
    // Tentar fazer login
    const { data, error } = await supabase.auth.signInWithPassword({
      email: EMAIL,
      password: PASSWORD
    })
    
    if (error) {
      console.error('❌ ERRO NO LOGIN:', error.message)
      console.log('\n💡 Possíveis soluções:')
      
      if (error.message.includes('Invalid login credentials')) {
        console.log('   🔍 Email ou senha incorretos')
        console.log('   1. Verifique se o email está correto: pedrovictorpina@gmail.com')
        console.log('   2. Verifique se a senha está correta: Juliane')
        console.log('   3. Teste fazer login no app web primeiro')
        console.log('   4. Certifique-se de que a conta foi criada')
      } else if (error.message.includes('Email not confirmed')) {
        console.log('   📧 Email não confirmado')
        console.log('   1. Verifique sua caixa de entrada')
        console.log('   2. Clique no link de confirmação')
        console.log('   3. Ou execute: node disable-email-confirmation.sql')
      } else {
        console.log(`   ⚠️ Erro específico: ${error.message}`)
      }
      
      console.log('\n🔧 Para resolver:')
      console.log('   1. Abra o Finance App: http://localhost:9000')
      console.log('   2. Tente fazer login manualmente')
      console.log('   3. Se não conseguir, crie uma nova conta')
      
      return
    }
    
    console.log('✅ LOGIN REALIZADO COM SUCESSO!')
    console.log(`👤 Usuário: ${data.user.email}`)
    console.log(`🆔 ID: ${data.user.id}`)
    console.log(`📅 Criado em: ${new Date(data.user.created_at).toLocaleDateString('pt-BR')}`)
    
    // Testar busca de contas
    console.log('\n🔄 Verificando contas...')
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', data.user.id)
    
    if (accountsError) {
      console.error('❌ Erro ao buscar contas:', accountsError.message)
    } else if (!accounts || accounts.length === 0) {
      console.warn('⚠️ NENHUMA CONTA ENCONTRADA!')
      console.log('\n💡 Para criar uma conta:')
      console.log('   1. Abra o Finance App: http://localhost:9000')
      console.log('   2. Faça login com suas credenciais')
      console.log('   3. Vá em "Contas" no menu')
      console.log('   4. Clique em "Adicionar Conta"')
      console.log('   5. Crie pelo menos uma conta (ex: "Conta Principal")')
    } else {
      console.log(`✅ Encontradas ${accounts.length} conta(s):`)
      accounts.forEach(acc => {
        console.log(`   - ${acc.name} (${acc.type}) - Saldo: R$ ${acc.balance.toFixed(2)}`)
      })
    }
    
    // Testar busca de categorias
    console.log('\n🔄 Verificando categorias de despesa...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', data.user.id)
      .eq('type', 'expense')
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError.message)
    } else if (!categories || categories.length === 0) {
      console.warn('⚠️ NENHUMA CATEGORIA DE DESPESA ENCONTRADA!')
      console.log('\n💡 As categorias são criadas automaticamente no primeiro login.')
      console.log('   Se não existem, pode ser que você precise:')
      console.log('   1. Fazer logout e login novamente no app')
      console.log('   2. Ou executar o script de setup do Supabase')
    } else {
      console.log(`✅ Encontradas ${categories.length} categorias de despesa:`)
      const requiredCategories = ['Compras', 'Moradia', 'Outros']
      
      categories.forEach(cat => {
        const isRequired = requiredCategories.includes(cat.name) ? '⭐' : '  '
        console.log(`   ${isRequired} ${cat.name} (${cat.color})`)
      })
      
      // Verificar se tem as categorias necessárias
      const hasRequired = requiredCategories.every(req => 
        categories.some(cat => cat.name === req)
      )
      
      if (!hasRequired) {
        console.log('\n⚠️ Algumas categorias necessárias estão faltando:')
        requiredCategories.forEach(req => {
          const exists = categories.some(cat => cat.name === req)
          console.log(`   ${exists ? '✅' : '❌'} ${req}`)
        })
      }
    }
    
    // Verificar se está pronto para importação
    const hasAccounts = accounts && accounts.length > 0
    const hasCategories = categories && categories.length > 0
    const readyForImport = hasAccounts && hasCategories
    
    console.log('\n📊 STATUS PARA IMPORTAÇÃO:')
    console.log('==========================')
    
    if (readyForImport) {
      console.log('🎉 PRONTO PARA IMPORTAR!')
      console.log('\n✅ Checklist completo:')
      console.log('   ✅ Login funcionando')
      console.log(`   ✅ ${accounts.length} conta(s) disponível(is)`)
      console.log(`   ✅ ${categories.length} categoria(s) de despesa`)
      
      console.log('\n▶️ Para importar os dados da planilha:')
      console.log('   node scripts/import_expenses_interactive.js')
      console.log('\n📊 Dados que serão importados:')
      console.log('   - 132 transações de despesa')
      console.log('   - 12 meses de dados (jul/2024 a jun/2025)')
      console.log('   - R$ 51.799,72 em despesas totais')
      
    } else {
      console.log('⚠️ NÃO ESTÁ PRONTO PARA IMPORTAR')
      console.log('\n📋 Checklist:')
      console.log(`   ${hasAccounts ? '✅' : '❌'} Pelo menos uma conta criada`)
      console.log(`   ${hasCategories ? '✅' : '❌'} Categorias de despesa disponíveis`)
      
      console.log('\n🔧 Para resolver:')
      if (!hasAccounts) {
        console.log('   1. Crie uma conta no Finance App')
      }
      if (!hasCategories) {
        console.log('   2. Faça login no app para criar categorias automáticas')
      }
    }
    
    // Fazer logout
    await supabase.auth.signOut()
    console.log('\n🔓 Logout realizado')
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message)
    console.log('\n🔧 Possíveis soluções:')
    console.log('   1. Verifique se o arquivo .env está configurado')
    console.log('   2. Verifique se as dependências estão instaladas (npm install)')
    console.log('   3. Teste a conexão: node test-supabase.js')
  }
}

// Executar teste
console.log('🚀 Iniciando teste automatizado...')
testLoginAuto().catch(console.error)