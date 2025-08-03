# Instruções para Adicionar Múltiplas Receitas Recorrentes

Este script permite adicionar várias receitas recorrentes de uma só vez.

## Receitas já configuradas:

### 1. Dia 15 Pedro
- **Período**: agosto/2024 a julho/2025 (12 transações)
- **Valor**: R$ 1.400,00 mensais
- **Dia**: 15 de cada mês
- **Total**: R$ 16.800,00

### 2. Dia 30 Pedro
- **Período**: agosto/2024 a julho/2025 (12 transações)
- **Valores**: R$ 1.600,00 (agosto) + R$ 1.400,00 (demais meses)
- **Dia**: 30 de cada mês (28 em fevereiro)
- **Total**: R$ 16.600,00

### 3. Juli
- **Período**: agosto/2024 a julho/2025 (12 transações)
- **Valor**: R$ 1.130,00 mensais
- **Total**: R$ 13.560,00

### 4. Ajuda
- **Período**: julho/2024 a dezembro/2024 (6 transações)
- **Valor**: R$ 800,00 mensais
- **Total**: R$ 4.800,00

### 5. David
- **Período**: julho/2024 a dezembro/2024 (6 transações)
- **Valor**: R$ 65,00 mensais
- **Total**: R$ 390,00

### 6. Luciene
- **Período**: julho/2024 a janeiro/2025 (7 transações)
- **Valor**: R$ 25,00 mensais
- **Total**: R$ 175,00

### 7. Sueva
- **Período**: julho/2024 a dezembro/2024 (6 transações)
- **Valor**: R$ 250,00 mensais
- **Total**: R$ 1.500,00

### 8. Jac
- **Período**: julho/2024 a outubro/2024 (4 transações)
- **Valores**: R$ 152,66 (julho) + R$ 52,66 (agosto-outubro)
- **Total**: R$ 310,64

### 9. Ney
- **Período**: julho/2024 (1 transação)
- **Valor**: R$ 80,00
- **Total**: R$ 80,00

### 10. Rose
- **Período**: julho/2024 a setembro/2024 (3 transações)
- **Valor**: R$ 112,00 mensais
- **Total**: R$ 336,00

## Como adicionar novas receitas:

### 1. Editar o arquivo:
Abra o arquivo `scripts/add_multiple_incomes.cjs` e localize a seção:
```javascript
// ADICIONE NOVAS RECEITAS AQUI SEGUINDO O MESMO FORMATO
```

### 2. Adicionar nova receita:
Adicione um novo objeto no array `incomesConfig` seguindo este formato:
```javascript
{
  name: 'Nome da Receita',
  transactions: [
    { month: 1, year: 2025, amount: 1000.00, day: 15 },   // janeiro 2025 dia 15
    { month: 2, year: 2025, amount: 1000.00 },            // fevereiro 2025 dia 1
    // ... adicione mais meses conforme necessário
  ]
}
```

### 3. Exemplo de nova receita:
```javascript
{
  name: 'Salário',
  transactions: [
    { month: 1, year: 2025, amount: 2500.00, day: 5 },
    { month: 2, year: 2025, amount: 2500.00, day: 5 },
    { month: 3, year: 2025, amount: 2500.00, day: 5 },
    { month: 4, year: 2025, amount: 2500.00, day: 5 },
    { month: 5, year: 2025, amount: 2500.00, day: 5 },
    { month: 6, year: 2025, amount: 2500.00, day: 5 }
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
node scripts/add_multiple_incomes.cjs seu-email@exemplo.com sua-senha
```

## O que o script faz:

1. **Autentica** com suas credenciais
2. **Busca** a primeira conta e categoria de receita disponíveis
3. **Processa** cada receita configurada
4. **Cria** todas as transações de uma vez
5. **Mostra** um resumo detalhado do que foi criado
6. **Respeita** dias específicos do mês quando informados

## Vantagens:

- ✅ **Eficiência**: Cria todas as receitas de uma vez
- ✅ **Organização**: Todas as configurações em um só lugar
- ✅ **Flexibilidade**: Fácil de adicionar novas receitas
- ✅ **Resumo**: Mostra totais por receita e geral
- ✅ **Dias específicos**: Permite definir dia do mês para cada transação
- ✅ **Segurança**: Validação de erros para cada receita

## Observações:

- Se uma receita falhar, as outras continuam sendo processadas
- Se não especificar o dia, será usado o dia 1º do mês
- Para fevereiro, dia 30 é automaticamente ajustado para 28
- O script pode ser executado apenas uma vez para evitar duplicatas
- Use a primeira conta e categoria de receita encontradas

## Troubleshooting:

- **Erro de autenticação**: Verifique email e senha
- **Nenhuma conta/categoria**: Crie pelo menos uma conta e categoria de receita primeiro
- **Erro em receita específica**: O script continua com as outras receitas
- **Categoria não encontrada**: Certifique-se de ter pelo menos uma categoria do tipo 'income'

## Total Geral:

- **Total de receitas**: 10 diferentes
- **Total de transações**: 69 transações
- **Valor total**: R$ 54.641,64