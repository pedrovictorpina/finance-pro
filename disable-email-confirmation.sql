-- Script para desabilitar confirmação de email no Supabase
-- Execute este script no SQL Editor do Supabase

-- Atualizar configuração de autenticação para não exigir confirmação de email
-- IMPORTANTE: Este script deve ser executado no SQL Editor do Supabase

-- Verificar configuração atual
SELECT * FROM auth.config;

-- Para desabilitar a confirmação de email, você precisa:
-- 1. Ir para Authentication > Settings no dashboard do Supabase
-- 2. Desmarcar "Enable email confirmations"
-- 3. Salvar as configurações

-- Alternativamente, você pode executar este comando se tiver permissões de admin:
-- UPDATE auth.config SET enable_signup = true, enable_email_confirmations = false;

-- Nota: A configuração de confirmação de email é controlada principalmente
-- através do dashboard do Supabase em Authentication > Settings
-- Este arquivo serve como referência para as configurações necessárias.