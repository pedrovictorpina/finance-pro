require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function executeSQLCommands() {
  console.log('🔧 Executando comandos SQL para adicionar colunas...');

  const commands = [
    'ALTER TABLE transactions ADD COLUMN IF NOT EXISTS due_date DATE',
    'ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE',
    'ALTER TABLE transactions ADD COLUMN IF NOT EXISTS payment_date DATE'
  ];

  console.log('\n=== COMANDOS PARA EXECUTAR NO PAINEL SUPABASE ===');
  console.log('1. Acesse: https://supabase.com/dashboard');
  console.log('2. Vá para seu projeto: cixyepvpthlrrskyzbxm');
  console.log('3. Clique em "SQL Editor" no menu lateral');
  console.log('4. Cole e execute os seguintes comandos SQL:\n');

  commands.forEach((cmd, i) => {
    console.log(`${i + 1}. ${cmd};`);
  });

  console.log('\n=== FIM DOS COMANDOS ===');
  console.log('\n✅ Após executar estes comandos no painel do Supabase, o erro será resolvido!');
  console.log('🚀 As colunas due_date, is_paid e payment_date estarão disponíveis na tabela transactions.');
}

executeSQLCommands().catch(console.error);
