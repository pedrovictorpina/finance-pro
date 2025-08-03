# Instruções para Adicionar Despesa Recorrente "Will"

Este script adiciona automaticamente todas as transações da despesa "Will" conforme especificado:

## Valores e Períodos:
- **Agosto 2024 a Junho 2025**: R$ 184,84 mensais
- **Total**: 11 transações
- **Valor total**: R$ 2.033,24

## Como usar:

### 1. Instalar dependências (se necessário):
```bash
npm install @supabase/supabase-js dotenv
```

### 2. Executar o script:
```bash
node scripts/add_will_expense.cjs seu-email@exemplo.com sua-senha
```
Substitua `seu-email@exemplo.com` e `sua-senha` pelas suas credenciais reais.

### 3. Verificar resultado:
O script irá:
- Fazer login automaticamente
- Buscar sua primeira conta disponível
- Buscar sua primeira categoria de despesa
- Criar todas as 11 transações do "Will"
- Mostrar um resumo do que foi criado

## Observações:
- O script usa a primeira conta e categoria de despesa encontradas
- Todas as transações serão criadas no dia 1º de cada mês
- Se você já tiver transações do "Will", elas serão duplicadas
- O script pode ser executado apenas uma vez para evitar duplicatas

## Verificação:
Após executar o script, você pode verificar as transações criadas:
1. Acesse o dashboard da aplicação
2. Verifique se as transações do "Will" aparecem nos meses corretos
3. Confirme o valor: R$ 184,84 em todos os meses
4. Período: agosto/2024 a junho/2025

## Troubleshooting:
- **Erro de autenticação**: Verifique se email e senha estão corretos
- **Nenhuma conta encontrada**: Crie pelo menos uma conta na aplicação primeiro
- **Nenhuma categoria encontrada**: Crie pelo menos uma categoria de despesa primeiro
- **Erro de inserção**: Verifique se as políticas RLS estão configuradas corretamente