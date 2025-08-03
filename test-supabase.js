// Script de teste para verificar a conexão com o Supabase
// Execute com: node test-supabase.js

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Credenciais do Supabase não encontradas no .env')
  console.log('Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão configurados')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔄 Testando conexão com o Supabase...')
  console.log(`📍 URL: ${supabaseUrl}`)
  console.log(`🔑 Key: ${supabaseKey.slice(0, 20)}...`)
  console.log('')

  try {
    // Teste 1: Verificar se as tabelas existem
    console.log('📋 Teste 1: Verificando tabelas...')
    
    const tables = ['profiles', 'accounts', 'categories', 'transactions']
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1)
        
        if (error) {
          console.log(`❌ Tabela '${table}': ${error.message}`)
        } else {
          console.log(`✅ Tabela '${table}': OK`)
        }
      } catch (err) {
        console.log(`❌ Tabela '${table}': ${err.message}`)
      }
    }

    console.log('')

    // Teste 2: Verificar autenticação
    console.log('🔐 Teste 2: Verificando autenticação...')
    
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log(`❌ Erro de autenticação: ${authError.message}`)
    } else {
      console.log('✅ Sistema de autenticação: OK')
      if (authData.session) {
        console.log(`👤 Usuário logado: ${authData.session.user.email}`)
      } else {
        console.log('👤 Nenhum usuário logado (normal para teste)')
      }
    }

    console.log('')

    // Teste 3: Verificar RLS (Row Level Security)
    console.log('🔒 Teste 3: Verificando RLS...')
    
    try {
      // Tentar inserir dados sem autenticação (deve falhar)
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: 'Teste',
          type: 'income',
          user_id: '00000000-0000-0000-0000-000000000000'
        })
      
      if (error && error.message.includes('RLS')) {
        console.log('✅ RLS está funcionando corretamente')
      } else if (error) {
        console.log(`⚠️  RLS pode não estar configurado: ${error.message}`)
      } else {
        console.log('⚠️  RLS pode não estar configurado (inserção permitida sem auth)')
      }
    } catch (err) {
      console.log(`❌ Erro no teste RLS: ${err.message}`)
    }

    console.log('')
    console.log('🎉 Teste de conexão concluído!')
    console.log('')
    console.log('📝 Próximos passos:')
    console.log('1. Se alguma tabela não existe, execute o script supabase-setup.sql')
    console.log('2. Se RLS não está funcionando, verifique as políticas no Supabase')
    console.log('3. Teste a aplicação fazendo login e criando transações')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

// Executar teste
testConnection()