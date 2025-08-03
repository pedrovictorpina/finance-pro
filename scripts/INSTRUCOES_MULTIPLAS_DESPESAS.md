# Instruções para Adicionar Múltiplas Despesas Recorrentes

Este script permite adicionar várias despesas recorrentes de uma só vez.

## Despesas já configuradas:

### 1. Tenda
- **Período**: julho/2024 a julho/2026 (25 transações)
- **Valores**: R$ 509,00 mensais + R$ 3.876,28 em julho/2025, janeiro/2026 e julho/2026
- **Total**: R$ 23.940,84

### 2. Will
- **Período**: agosto/2024 a junho/2025 (11 transações)
- **Valor**: R$ 184,84 mensais
- **Total**: R$ 2.033,24

### 3. Itau Juli
- **Período**: agosto/2024 a novembro/2024 (4 transações)
- **Valores**: R$ 369,19 (agosto) + R$ 52,66 (setembro, outubro, novembro)
- **Total**: R$ 527,17

### 4. Will Pedro
- **Período**: agosto/2024 a junho/2025 (11 transações)
- **Valores**: Variáveis de R$ 98,04 a R$ 881,80
- **Total**: R$ 4.873,56

### 5. Facu Juli
- **Período**: agosto/2024 a dezembro/2024 (5 transações)
- **Valor**: R$ 148,46 mensais
- **Total**: R$ 742,30

### 6. Will Juli
- **Período**: agosto/2024 a fevereiro/2025 (7 transações)
- **Valores**: R$ 286,16 (ago-set) + R$ 145,36 (out-fev)
- **Total**: R$ 1.299,12

### 7. Nubank
- **Período**: agosto/2024 a janeiro/2025 (6 transações)
- **Valores**: Variáveis de R$ 13,04 a R$ 338,18
- **Total**: R$ 1.111,58

### 8. Itaucard 6823
- **Período**: agosto/2024 a fevereiro/2025 (7 transações)
- **Valor**: R$ 149,00 mensais
- **Total**: R$ 1.043,00

### 9. Casa
- **Período**: julho/2024 a dezembro/2024 (6 transações)
- **Valor**: R$ 800,00 mensais
- **Total**: R$ 4.800,00

### 10. Agua
- **Período**: agosto/2024 a julho/2026 (24 transações)
- **Valor**: R$ 100,00 mensais
- **Total**: R$ 2.400,00

### 11. Energia
- **Período**: agosto/2024 a julho/2026 (24 transações)
- **Valor**: R$ 240,00 mensais
- **Total**: R$ 5.760,00

### 12. Dizimo
- **Período**: julho/2024 a julho/2026 (25 transações)
- **Valor**: R$ 260,00 mensais
- **Total**: R$ 6.500,00

### 13. Emprestimo
- **Período**: agosto/2024 a outubro/2025 (15 transações)
- **Valor**: R$ 394,25 mensais
- **Total**: R$ 5.913,75

## Como adicionar novas despesas:

### 1. Editar o arquivo:
Abra o arquivo `scripts/add_multiple_expenses.cjs` e localize a seção:
```javascript
// ADICIONE NOVAS DESPESAS AQUI SEGUINDO O MESMO FORMATO
```

### 2. Adicionar nova despesa:
Adicione um novo objeto no array `expensesConfig` seguindo este formato:
```javascript
{
  name: 'Nome da Despesa',
  transactions: [
    { month: 1, year: 2025, amount: 100.00 },   // janeiro 2025
    { month: 2, year: 2025, amount: 100.00 },   // fevereiro 2025
    // ... adicione mais meses conforme necessário
  ]
}
```

### 3. Exemplo de nova despesa:
```javascript
{
  name: 'Internet',
  transactions: [
    { month: 1, year: 2025, amount: 89.90 },
    { month: 2, year: 2025, amount: 89.90 },
    { month: 3, year: 2025, amount: 89.90 },
    { month: 4, year: 2025, amount: 89.90 },
    { month: 5, year: 2025, amount: 89.90 },
    { month: 6, year: 2025, amount: 89.90 }
  ]
}
```

## Como executar:

### 1. Instalar dependências (se necessário):
```bash
npm install @supabase/supabase-js dotenv
```

### 2. Executar o script:
```bash
node scripts/add_multiple_expenses.cjs seu-email@exemplo.com sua-senha
```

## O que o script faz:

1. **Autentica** com suas credenciais
2. **Busca** a primeira conta e categoria de despesa disponíveis
3. **Processa** cada despesa configurada
4. **Cria** todas as transações de uma vez
5. **Mostra** um resumo detalhado do que foi criado

## Vantagens:

- ✅ **Eficiência**: Cria todas as despesas de uma vez
- ✅ **Organização**: Todas as configurações em um só lugar
- ✅ **Flexibilidade**: Fácil de adicionar novas despesas
- ✅ **Resumo**: Mostra totais por despesa e geral
- ✅ **Segurança**: Validação de erros para cada despesa

## Observações:

- Se uma despesa falhar, as outras continuam sendo processadas
- Todas as transações são criadas no dia 1º de cada mês
- O script pode ser executado apenas uma vez para evitar duplicatas
- Use a primeira conta e categoria de despesa encontradas

## Troubleshooting:

- **Erro de autenticação**: Verifique email e senha
- **Nenhuma conta/categoria**: Crie pelo menos uma conta e categoria de despesa primeiro
- **Erro em despesa específica**: O script continua com as outras despesas