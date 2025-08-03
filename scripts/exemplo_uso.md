# 📋 Exemplo de Uso - Importador de Despesas

## 🚀 Como Executar o Script

### 1. Abrir Terminal
Abra o terminal na pasta do projeto:
```bash
cd C:\Users\pedro\dev\finance-app\finance-app
```

### 2. Executar o Script
```bash
node scripts/import_expenses_interactive.js
```

### 3. Exemplo de Execução

```
💰 IMPORTADOR DE DESPESAS - Finance App
=====================================

🔐 Login necessário para importar dados
📧 Email: seu_email@exemplo.com
🔒 Senha: sua_senha_aqui
✅ Login realizado com sucesso!

👤 Usuário logado: seu_email@exemplo.com

📂 Buscando categorias...
✅ Encontradas 8 categorias de despesa
   - Alimentação
   - Transporte
   - Moradia
   - Saúde
   - Educação
   - Lazer
   - Compras
   - Outros

💳 Buscando contas...
✅ Usando conta: Conta Principal (checking)

📊 Dados a serem importados:
   - 12 meses de dados
   - 11 tipos de despesa

❓ Deseja continuar com a importação? (s/n): s

🔄 Preparando transações...
✅ Preparadas 132 transações

💾 Inserindo transações no banco de dados...
   ✅ 50/132 transações inseridas
   ✅ 100/132 transações inseridas
   ✅ 132/132 transações inseridas

🎉 IMPORTAÇÃO CONCLUÍDA COM SUCESSO!
📈 Total de transações inseridas: 132

💡 Agora você pode visualizar os dados no dashboard do app.
```

## 📊 Dados que Serão Importados

### Resumo por Mês

| Mês | Total de Despesas |
|-----|------------------|
| Julho 2024 | R$ 2.780,62 |
| Agosto 2024 | R$ 4.924,99 |
| Setembro 2024 | R$ 4.955,42 |
| Outubro 2024 | R$ 4.746,08 |
| Novembro 2024 | R$ 4.404,04 |
| Dezembro 2024 | R$ 4.400,44 |
| Janeiro 2025 | R$ 4.926,29 |
| Fevereiro 2025 | R$ 5.136,68 |
| Março 2025 | R$ 4.444,61 |
| Abril 2025 | R$ 4.232,26 |
| Maio 2025 | R$ 4.232,26 |
| Junho 2025 | R$ 3.616,03 |

**Total Geral: R$ 51.799,72**

### Detalhamento por Categoria

#### Compras (Will Pedro + Facu Juli + Will Juli)
- Gastos pessoais dos membros da família
- Variação mensal conforme atividade

#### Moradia (Casa + Água + Energia)
- Casa: R$ 100,00/mês
- Água: R$ 240,00/mês  
- Energia: R$ 260,00/mês
- **Total fixo: R$ 600,00/mês**

#### Outros (Nubank + Itaucard + Dízimo + Internet + Empréstimo)
- Nubank: R$ 149,00/mês
- Itaucard 6822: R$ 800,00/mês
- Dízimo: R$ 130,00/mês
- Internet: R$ 394,25/mês
- Empréstimo: Variável (R$ 0 a R$ 2.522,84)

## ⚠️ Antes de Executar

### Pré-requisitos Obrigatórios

1. **Conta no Finance App**
   - Crie uma conta através do aplicativo
   - Faça pelo menos um login para gerar categorias padrão

2. **Pelo menos uma conta/carteira criada**
   - Acesse "Contas" no app
   - Crie uma conta (ex: "Conta Principal")

3. **Arquivo .env configurado**
   ```
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_supabase
   ```

### Verificações Recomendadas

1. **Teste a conexão com Supabase**:
   ```bash
   node test-supabase.js
   ```

2. **Verifique se as dependências estão instaladas**:
   ```bash
   npm install
   ```

3. **Confirme que o app está funcionando**:
   ```bash
   npm run dev
   ```

## 🔧 Solução de Problemas Comuns

### Erro: "Cannot find module"
```bash
# Certifique-se de estar no diretório correto
cd finance-app
pwd  # Deve mostrar: .../finance-app
```

### Erro: "Variáveis de ambiente não encontradas"
```bash
# Verifique se o arquivo .env existe
ls -la .env

# Verifique o conteúdo
cat .env
```

### Erro: "Nenhuma conta encontrada"
1. Abra o Finance App
2. Vá em "Contas"
3. Clique em "Adicionar Conta"
4. Crie pelo menos uma conta

### Erro de Login
- Verifique email e senha
- Teste login no app web primeiro
- Confirme que a conta existe

## 📱 Após a Importação

1. **Abra o Finance App**
2. **Vá para o Dashboard**
3. **Verifique os gráficos atualizados**
4. **Confira a lista de transações**
5. **Analise os dados por categoria**

### O que você verá:
- ✅ Gráfico de receitas/despesas por mês
- ✅ 132 novas transações de despesa
- ✅ Dados distribuídos ao longo de 12 meses
- ✅ Categorização automática das despesas
- ✅ Tooltip interativo no gráfico

## 🎯 Próximos Passos

Após a importação bem-sucedida:

1. **Adicione receitas** para balancear os dados
2. **Ajuste categorias** se necessário
3. **Crie metas** de gastos por categoria
4. **Monitore** o progresso financeiro
5. **Exporte relatórios** quando necessário