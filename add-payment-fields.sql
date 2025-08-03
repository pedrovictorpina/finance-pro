-- Script para adicionar campos de dia de pagamento e status de pagamento
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna due_date (dia de vencimento/pagamento)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS due_date DATE;

-- Adicionar coluna is_paid (se foi pago)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;

-- Adicionar coluna payment_date (data do pagamento efetivo)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS payment_date DATE;

-- Comentários para documentação
COMMENT ON COLUMN transactions.due_date IS 'Data de vencimento da despesa (aplicável apenas para despesas)';
COMMENT ON COLUMN transactions.is_paid IS 'Indica se a despesa foi paga (aplicável apenas para despesas)';
COMMENT ON COLUMN transactions.payment_date IS 'Data em que a despesa foi efetivamente paga';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_due_date ON transactions(due_date) WHERE type = 'expense';
CREATE INDEX IF NOT EXISTS idx_transactions_is_paid ON transactions(is_paid) WHERE type = 'expense';
CREATE INDEX IF NOT EXISTS idx_transactions_payment_date ON transactions(payment_date) WHERE type = 'expense';

-- Atualizar transações existentes do tipo 'income' para is_paid = true
-- (receitas são consideradas "pagas" por padrão)
UPDATE transactions 
SET is_paid = TRUE, payment_date = date
WHERE type = 'income' AND is_paid IS NULL;

-- Para despesas existentes, definir due_date igual à data da transação se não especificado
UPDATE transactions 
SET due_date = date
WHERE type = 'expense' AND due_date IS NULL;

-- Atualizar transações existentes do tipo 'expense' para is_paid = false
-- (despesas são consideradas "não pagas" por padrão)
UPDATE transactions 
SET is_paid = FALSE 
WHERE type = 'expense' AND is_paid IS NULL;