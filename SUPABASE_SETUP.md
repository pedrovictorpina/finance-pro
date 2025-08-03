# 🚀 Guia de Configuração do Supabase - Finance App

Este guia irá te ajudar a configurar completamente o Supabase para a aplicação Finance App.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Projeto criado no Supabase
- Credenciais já configuradas no arquivo `.env`

## 🔧 Passo a Passo

### 1. Acesse o Dashboard do Supabase

1. Faça login em [supabase.com](https://supabase.com)
2. Acesse seu projeto: `cixyepvpthlrrskyzbxm`
3. Vá para a seção **SQL Editor** no menu lateral

### 2. Execute o Script de Configuração

1. No SQL Editor, clique em **"New Query"**
2. Copie todo o conteúdo do arquivo `supabase-setup.sql`
3. Cole no editor SQL
4. Clique em **"Run"** para executar o script

### 3. Verificar se as Tabelas foram Criadas

1. Vá para a seção **Table Editor**
2. Você deve ver as seguintes tabelas:
   - `profiles` - Perfis dos usuários
   - `accounts` - Contas/carteiras
   - `categories` - Categorias de transações
   - `transactions` - Transações financeiras

### 4. Configurar Autenticação (se necessário)

1. Vá para **Authentication > Settings**
2. Configure os provedores de autenticação desejados
3. Para email/senha, certifique-se de que está habilitado

### 5. Verificar Políticas de Segurança

1. Vá para **Authentication > Policies**
2. Verifique se as políticas RLS foram criadas para todas as tabelas
3. Cada tabela deve ter políticas para SELECT, INSERT, UPDATE e DELETE

## 📊 Estrutura das Tabelas

### `profiles`
- Armazena informações adicionais dos usuários
- Conectada automaticamente com `auth.users`
- Campos: `id`, `full_name`, `phone`, `bio`, `avatar_url`

### `accounts`
- Contas/carteiras dos usuários
- Tipos: checking, savings, credit, cash
- Campos: `id`, `user_id`, `name`, `type`, `balance`, `currency`

### `categories`
- Categorias personalizáveis por usuário
- Tipos: income, expense
- Campos: `id`, `user_id`, `name`, `type`, `color`, `icon`

### `transactions`
- Transações financeiras
- Tipos: income, expense, transfer
- Campos: `id`, `user_id`, `account_id`, `category_id`, `amount`, `type`, `description`, `date`

## 🔒 Segurança

- **RLS (Row Level Security)** habilitado em todas as tabelas
- Usuários só podem acessar seus próprios dados
- Políticas automáticas baseadas em `auth.uid()`

## 🎯 Funcionalidades Automáticas

### Criação Automática de Perfil
- Quando um usuário se registra, um perfil é criado automaticamente
- Trigger `on_auth_user_created` executa a função `handle_new_user()`

### Categorias Padrão
- Categorias padrão são criadas automaticamente para novos usuários
- **Receitas**: Salário, Freelance, Investimentos, Outros
- **Despesas**: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Compras, Outros

## 🧪 Testando a Configuração

### 1. Teste de Autenticação
```javascript
// No console do navegador (F12)
const { data, error } = await supabase.auth.signUp({
  email: 'teste@exemplo.com',
  password: '123456'
})
console.log(data, error)
```

### 2. Teste de Inserção de Dados
```javascript
// Inserir uma transação de teste
const { data, error } = await supabase
  .from('transactions')
  .insert({
    amount: 100.00,
    type: 'income',
    description: 'Teste',
    date: new Date().toISOString().split('T')[0]
  })
console.log(data, error)
```

### 3. Teste de Consulta
```javascript
// Buscar transações do usuário
const { data, error } = await supabase
  .from('transactions')
  .select('*')
console.log(data, error)
```

## 🚨 Solução de Problemas

### Erro: "relation does not exist"
- Verifique se o script SQL foi executado completamente
- Confirme se todas as tabelas foram criadas no Table Editor

### Erro: "Row Level Security"
- Verifique se o usuário está autenticado
- Confirme se as políticas RLS foram criadas corretamente

### Erro de Conexão
- Verifique as credenciais no arquivo `.env`
- Confirme se a URL e a chave anônima estão corretas

## 📝 Próximos Passos

1. ✅ Execute o script SQL
2. ✅ Verifique se as tabelas foram criadas
3. ✅ Teste a autenticação na aplicação
4. ✅ Crie algumas transações de teste
5. ✅ Verifique se os dados aparecem no dashboard

## 🔗 Links Úteis

- [Documentação do Supabase](https://supabase.com/docs)
- [Guia de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Reference](https://supabase.com/docs/reference/sql)

---

**Dica**: Mantenha este arquivo como referência para futuras configurações ou troubleshooting!