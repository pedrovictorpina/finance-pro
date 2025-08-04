require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function clearUserData() {
  try {
    console.log('🔄 Iniciando limpeza FORÇADA de todos os dados...');
    
    // Estratégia 1: Deletar TODAS as transações (sem filtro de user_id)
    console.log('🗑️ Removendo TODAS as transações...');
    const { data: deletedTrans, error: deleteTransError } = await supabase
      .from('transactions')
      .delete()
      .neq('id', 0) // Deleta tudo que tenha id diferente de 0 (ou seja, tudo)
      .select('id');
    
    if (deleteTransError) {
      console.error('❌ Erro ao deletar transações:', deleteTransError.message);
    } else {
      const count = deletedTrans ? deletedTrans.length : 0;
      console.log(`✅ ${count} transações removidas`);
    }
    
    // Estratégia 2: Deletar TODAS as contas
    console.log('🗑️ Removendo TODAS as contas...');
    const { data: deletedAccounts, error: deleteAccountsError } = await supabase
      .from('accounts')
      .delete()
      .neq('id', 0) // Deleta tudo
      .select('id');
    
    if (deleteAccountsError) {
      console.error('❌ Erro ao deletar contas:', deleteAccountsError.message);
    } else {
      const count = deletedAccounts ? deletedAccounts.length : 0;
      console.log(`✅ ${count} contas removidas`);
    }
    
    // Estratégia 3: Deletar TODAS as categorias
    console.log('🗑️ Removendo TODAS as categorias...');
    const { data: deletedCategories, error: deleteCategoriesError } = await supabase
      .from('categories')
      .delete()
      .neq('id', 0) // Deleta tudo
      .select('id');
    
    if (deleteCategoriesError) {
      console.error('❌ Erro ao deletar categorias:', deleteCategoriesError.message);
    } else {
      const count = deletedCategories ? deletedCategories.length : 0;
      console.log(`✅ ${count} categorias removidas`);
    }
    
    console.log('\n🎉 Limpeza FORÇADA concluída!');
    console.log('📱 Banco de dados completamente limpo.');
    console.log('🔗 URL do app: https://finance-pro-ivory.vercel.app');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse o app');
    console.log('2. Faça login com pedrovictorpina@gmail.com');
    console.log('3. O app criará automaticamente contas e categorias padrão');
    console.log('4. Comece a adicionar suas transações!');
    
    // Verificação final
    console.log('\n🔍 Verificando se a limpeza foi bem-sucedida...');
    
    const { data: remainingTrans } = await supabase
      .from('transactions')
      .select('id')
      .limit(1);
    
    const { data: remainingAccounts } = await supabase
      .from('accounts')
      .select('id')
      .limit(1);
    
    const { data: remainingCategories } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    const transCount = remainingTrans ? remainingTrans.length : 0;
    const accountsCount = remainingAccounts ? remainingAccounts.length : 0;
    const categoriesCount = remainingCategories ? remainingCategories.length : 0;
    
    console.log(`📊 Dados restantes:`);
    console.log(`   - Transações: ${transCount}`);
    console.log(`   - Contas: ${accountsCount}`);
    console.log(`   - Categorias: ${categoriesCount}`);
    
    if (transCount === 0 && accountsCount === 0 && categoriesCount === 0) {
      console.log('\n✅ SUCESSO: Banco de dados completamente limpo!');
    } else {
      console.log('\n⚠️ ATENÇÃO: Ainda existem alguns dados no banco.');
    }
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error.message);
  }
}

// Executar a limpeza
clearUserData().catch(console.error);