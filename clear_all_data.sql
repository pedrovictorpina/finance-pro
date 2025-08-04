-- Script para limpeza completa de todos os dados do Finance Pro
-- Execute este script no SQL Editor do Supabase
-- ATENÇÃO: Este script irá remover TODOS os dados das tabelas!

-- 1. Remover todas as transações
DELETE FROM transactions;

-- 2. Remover todas as contas
DELETE FROM accounts;

-- 3. Remover todas as categorias
DELETE FROM categories;

-- 4. Resetar as sequências (IDs) para começar do 1 novamente
ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
ALTER SEQUENCE accounts_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;

-- 5. Verificar se a limpeza foi bem-sucedida
SELECT 
  'transactions' as tabela, 
  COUNT(*) as registros_restantes 
FROM transactions
UNION ALL
SELECT 
  'accounts' as tabela, 
  COUNT(*) as registros_restantes 
FROM accounts
UNION ALL
SELECT 
  'categories' as tabela, 
  COUNT(*) as registros_restantes 
FROM categories;

-- Resultado esperado: todas as tabelas devem mostrar 0 registros_restantes