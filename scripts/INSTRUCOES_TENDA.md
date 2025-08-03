# Instruções para Adicionar Despesa Recorrente "Tenda"

Este script adiciona automaticamente todas as transações da despesa "Tenda" conforme especificado:

## Valores e Períodos:
- **Julho 2024 a Junho 2025**: R$ 509,00 mensais
- **Julho 2025**: R$ 3.876,28 (valor especial)
- **Agosto 2025 a Dezembro 2025**: R$ 509,00 mensais
- **Janeiro 2026**: R$ 3.876,28 (valor especial)
- **Fevereiro 2026 a Junho 2026**: R$ 509,00 mensais
- **Julho 2026**: R$ 3.876,28 (valor especial)

**Total**: 25 transações

## Como usar:

### 1. Instalar dependências (se necessário):
```bash
npm install @supabase/supabase-js dotenv
```

### 2. Executar o script:

**Opção A - Script interativo (solicita credenciais):**
```bash
node scripts/add_tenda_expense.cjs
```
O script solicitará seu email e senha.

**Opção B - Script com argumentos (mais rápido):**
```bash
node scripts/add_tenda_expense_args.cjs seu-email@exemplo.com sua-senha
```
Substitua `seu-email@exemplo.com` e `sua-senha` pelas suas credenciais reais.

### 4. Verificar resultado:
O script irá:
- Fazer login automaticamente
- Buscar sua primeira conta disponível
- Buscar sua primeira categoria de despesa
- Criar todas as 25 transações da "Tenda"
- Mostrar um resumo do que foi criado

## Observações:
- O script usa a primeira conta e categoria de despesa encontradas
- Todas as transações serão criadas no dia 1º de cada mês
- Se você já tiver transações da "Tenda", elas serão duplicadas
- O script pode ser executado apenas uma vez para evitar duplicatas

## Verificação:
Após executar o script, você pode verificar as transações criadas:
1. Acesse o dashboard da aplicação
2. Verifique se as transações da "Tenda" aparecem nos meses corretos
3. Confirme os valores: R$ 509,00 (normal) e R$ 3.876,28 (especiais)

## Troubleshooting:
- **Erro de autenticação**: Verifique se email e senha estão corretos
- **Nenhuma conta encontrada**: Crie pelo menos uma conta na aplicação primeiro
- **Nenhuma categoria encontrada**: Crie pelo menos uma categoria de despesa primeiro
- **Erro de inserção**: Verifique se as políticas RLS estão configuradas corretamente