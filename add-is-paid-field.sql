-- Script para adicionar o campo is_paid à tabela transactions
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna is_paid à tabela transactions
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;

-- Comentário para documentação
COMMENT ON COLUMN transactions.is_paid IS 'Indica se a despesa foi paga (aplicável apenas para despesas)';

-- Criar índice para melhor performance nas consultas de despesas não pagas
CREATE INDEX IF NOT EXISTS idx_transactions_is_paid ON transactions(is_paid) WHERE type = 'expense';

-- Atualizar transações existentes do tipo 'income' para is_paid = true
-- (receitas são consideradas "pagas" por padrão)
UPDATE transactions 
SET is_paid = TRUE 
WHERE type = 'income' AND is_paid IS NULL;

-- Atualizar transações existentes do tipo 'expense' para is_paid = false
-- (despesas são consideradas "não pagas" por padrão)
UPDATE transactions 
SET is_paid = FALSE 
WHERE type = 'expense' AND is_paid IS NULL;