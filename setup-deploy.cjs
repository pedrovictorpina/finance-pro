#!/usr/bin/env node

/**
 * Script para auxiliar na configuração do deploy automático
 * Execute: node setup-deploy.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Configuração de Deploy Automático - Finance Pro');
console.log('================================================\n');

// Verificar se o arquivo .env existe
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('⚠️  Arquivo .env não encontrado!');
  console.log('📋 Copiando .env.example para .env...');

  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Arquivo .env criado com sucesso!');
  } else {
    console.log('❌ Arquivo .env.example não encontrado!');
    process.exit(1);
  }
} else {
  console.log('✅ Arquivo .env já existe!');
}

// Ler variáveis do .env
const envContent = fs.readFileSync(envPath, 'utf8');
const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=') && !envContent.includes('your_supabase_project_url_here');
const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && !envContent.includes('your_supabase_anon_key_here');

console.log('\n📊 Status das Variáveis de Ambiente:');
console.log(`VITE_SUPABASE_URL: ${hasSupabaseUrl ? '✅ Configurado' : '❌ Não configurado'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${hasSupabaseKey ? '✅ Configurado' : '❌ Não configurado'}`);

if (!hasSupabaseUrl || !hasSupabaseKey) {
  console.log('\n⚠️  Configure as variáveis do Supabase no arquivo .env antes de continuar!');
  console.log('📝 Edite o arquivo .env e substitua os valores de exemplo pelos reais.');
}

console.log('\n📋 Próximos Passos para Deploy Automático:');
console.log('==========================================');
console.log('1. 🌐 Acesse https://vercel.com e faça login com GitHub');
console.log('2. 📁 Importe o projeto finance-pro');
console.log('3. ⚙️  Configure as variáveis de ambiente no Vercel:');
console.log('   - VITE_SUPABASE_URL');
console.log('   - VITE_SUPABASE_ANON_KEY');
console.log('4. 🔑 Configure os secrets no GitHub (Settings > Secrets):');
console.log('   - VITE_SUPABASE_URL');
console.log('   - VITE_SUPABASE_ANON_KEY');
console.log('   - VERCEL_TOKEN');
console.log('   - ORG_ID');
console.log('   - PROJECT_ID');
console.log('\n📖 Para instruções detalhadas, consulte o arquivo DEPLOY.md');
console.log('\n🎉 Após a configuração, cada push para main fará deploy automático!');
