-- Script para adicionar campos de parcelamento à tabela transactions
-- Execute este script no SQL Editor do Supabase

-- Adicionar coluna installment_number (número da parcela atual)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS installment_number INTEGER DEFAULT NULL;

-- Adicionar coluna total_installments (total de parcelas)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS total_installments INTEGER DEFAULT NULL;

-- Adicionar coluna installment_group_id (ID para agrupar parcelas da mesma compra)
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS installment_group_id UUID DEFAULT NULL;

-- Comentários para documentação
COMMENT ON COLUMN transactions.installment_number IS 'Número da parcela atual (ex: 1, 2, 3...)';
COMMENT ON COLUMN transactions.total_installments IS 'Total de parcelas da compra (ex: 12 para 12x)';
COMMENT ON COLUMN transactions.installment_group_id IS 'UUID para agrupar todas as parcelas de uma mesma compra';

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_transactions_installment_group ON transactions(installment_group_id) WHERE installment_group_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_transactions_installments ON transactions(installment_number, total_installments) WHERE installment_number IS NOT NULL;

-- Adicionar constraint para garantir que installment_number seja válido
ALTER TABLE transactions 
ADD CONSTRAINT check_installment_number 
CHECK (installment_number IS NULL OR (installment_number > 0 AND installment_number <= total_installments));

-- Adicionar constraint para garantir que total_installments seja válido
ALTER TABLE transactions 
ADD CONSTRAINT check_total_installments 
CHECK (total_installments IS NULL OR total_installments > 0);