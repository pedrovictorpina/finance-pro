# 📊 Scripts de Importação de Dados

Este diretório contém scripts para importar dados de despesas para o Finance App.

## 📁 Arquivos Disponíveis

### `test_login.js` 🧪
Script de teste para verificar se você pode fazer login e se está pronto para importar.

**Use este script PRIMEIRO** se tiver problemas de login!

### `import_expenses_interactive.js` ⭐
Script interativo para importar as despesas da planilha analisada. Este é o script **recomendado** para uso.

**Características:**
- ✅ Interface interativa com login
- ✅ Validação de dados antes da importação
- ✅ Mapeamento automático de categorias
- ✅ Inserção em lotes para melhor performance
- ✅ Feedback detalhado do progresso

### `import_expenses.js`
Script básico para importação automática (requer usuário já autenticado).

### `SOLUCAO_PROBLEMAS.md` 🔧
Guia completo de solução de problemas comuns.

## 🚀 Como Usar

### ⚠️ Se você teve erro de login, COMECE AQUI:

1. **Teste seu login primeiro**:
   ```bash
   node scripts/test_login.js
   ```
   
2. **Se der erro, consulte**:
   ```bash
   cat scripts/SOLUCAO_PROBLEMAS.md
   ```

### Pré-requisitos

1. **Node.js** instalado
2. **Dependências** instaladas:
   ```bash
   npm install
   ```
3. **Arquivo .env** configurado com as credenciais do Supabase
4. **Conta criada** no Finance App com pelo menos:
   - Uma conta/carteira
   - Categorias padrão (criadas automaticamente no primeiro login)

### Executando a Importação

1. **Abra o terminal** na pasta do projeto

2. **(OPCIONAL) Teste o login primeiro**:
   ```bash
   node scripts/test_login.js
   ```

3. **Execute o script interativo**:
   ```bash
   node scripts/import_expenses_interactive.js
   ```

4. **Faça login** quando solicitado:
   - Digite seu **email COMPLETO** (ex: usuario@dominio.com)
   - Digite sua senha

5. **Confirme a importação** quando perguntado

6. **Aguarde** a conclusão do processo

## 📋 Dados Importados

O script importa dados de **12 meses** (julho 2024 a junho 2025) com as seguintes categorias:

### Tipos de Despesa da Planilha → Categorias do App

| Tipo da Planilha | Categoria no App | Descrição |
|------------------|------------------|------------|
| Will Pedro | Compras | Gastos pessoais Will Pedro |
| Facu Juli | Compras | Gastos pessoais Facu Juli |
| Will Juli | Compras | Gastos pessoais Will Juli |
| Nubank | Outros | Cartão Nubank |
| Itaucard 6822 | Outros | Cartão Itaú |
| Casa | Moradia | Despesas da casa |
| Agua | Moradia | Conta de água |
| Energia | Moradia | Conta de energia |
| Dizimo | Outros | Dízimo |
| Internet | Outros | Conta de internet |
| Emprestimo | Outros | Pagamentos de empréstimo |

### Estrutura dos Dados

- **Data**: Dia 15 de cada mês (padrão)
- **Tipo**: Todas as transações são marcadas como 'expense' (despesa)
- **Descrição**: Formato "[Tipo] - [Mês]" (ex: "Casa - julho")
- **Valores**: Valores exatos da planilha (valores zero são ignorados)

## ⚠️ Observações Importantes

1. **Backup**: Faça backup dos seus dados antes de executar a importação

2. **Duplicação**: O script não verifica duplicatas. Se executado múltiplas vezes, criará transações duplicadas

3. **Categorias**: Certifique-se de que as categorias padrão existem:
   - Compras
   - Moradia
   - Outros

4. **Conta**: O script usa a primeira conta encontrada do usuário

5. **Autenticação**: Você deve ter uma conta válida no Finance App

## 🔧 Solução de Problemas

### Erro: "Variáveis de ambiente não encontradas"
- Verifique se o arquivo `.env` existe e contém:
  ```
  VITE_SUPABASE_URL=sua_url_aqui
  VITE_SUPABASE_ANON_KEY=sua_chave_aqui
  ```

### Erro: "Nenhuma conta encontrada"
- Acesse o Finance App e crie pelo menos uma conta/carteira

### Erro: "Categoria não encontrada"
- Faça login no Finance App para criar as categorias padrão automaticamente
- Ou crie manualmente as categorias: Compras, Moradia, Outros

### Erro de Login
- Verifique se o email e senha estão corretos
- Certifique-se de que a conta existe no Finance App

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs de erro no terminal
2. Confirme se todas as dependências estão instaladas
3. Teste a conexão com o Supabase usando `test-supabase.js`

## 📈 Após a Importação

Após a importação bem-sucedida:
1. Acesse o Finance App
2. Vá para o Dashboard
3. Visualize os gráficos atualizados com os novos dados
4. Confira as transações na lista de movimentações