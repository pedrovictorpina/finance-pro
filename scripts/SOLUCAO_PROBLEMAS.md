# 🔧 Solução de Problemas - Importador de Despesas

## ❌ Erro: "missing email or phone"

### Problema
Você viu esta mensagem:
```
❌ Erro no login: missing email or phone
❌ Não foi possível fazer login. Encerrando...
```

### Causa
O email não foi fornecido corretamente durante o login.

### ✅ Solução

1. **Execute o script novamente**:
   ```bash
   node scripts/import_expenses_interactive.js
   ```

2. **Digite um EMAIL VÁLIDO** quando solicitado:
   ```
   📧 Email: seu_email@exemplo.com
   ```
   **⚠️ IMPORTANTE**: Digite o email completo (ex: `pedro@gmail.com`)

3. **Digite sua senha** quando solicitado:
   ```
   🔒 Senha: sua_senha_aqui
   ```

### Exemplo Correto de Execução

```
💰 IMPORTADOR DE DESPESAS - Finance App
=====================================

🔐 Login necessário para importar dados
📧 Email: pedro@gmail.com          ← Digite seu email completo
🔒 Senha: minhasenha123           ← Digite sua senha
✅ Login realizado com sucesso!
```

## 🔍 Outros Problemas Comuns

### 1. Erro: "Invalid login credentials"
**Causa**: Email ou senha incorretos
**Solução**: 
- Verifique se o email está correto
- Verifique se a senha está correta
- Teste o login no app web primeiro

### 2. Erro: "Nenhuma conta encontrada"
**Causa**: Usuário não tem contas criadas no app
**Solução**:
1. Abra o Finance App no navegador
2. Vá em "Contas"
3. Crie pelo menos uma conta
4. Execute o script novamente

### 3. Erro: "Categoria não encontrada"
**Causa**: Categorias padrão não foram criadas
**Solução**:
1. Faça login no Finance App pelo menos uma vez
2. As categorias são criadas automaticamente
3. Execute o script novamente

### 4. Script não inicia
**Causa**: Dependências não instaladas ou diretório errado
**Solução**:
```bash
# Verifique se está no diretório correto
cd finance-app
pwd  # Deve mostrar: .../finance-app

# Instale dependências se necessário
npm install

# Execute o script
node scripts/import_expenses_interactive.js
```

## 📋 Checklist Antes de Executar

- [ ] Estou no diretório `finance-app`
- [ ] Tenho uma conta no Finance App
- [ ] Sei meu email e senha corretos
- [ ] Já fiz login no app pelo menos uma vez
- [ ] Tenho pelo menos uma conta/carteira criada
- [ ] O arquivo `.env` está configurado
- [ ] As dependências estão instaladas (`npm install`)

## 🆘 Se Nada Funcionar

1. **Teste a conexão com Supabase**:
   ```bash
   node test-supabase.js
   ```

2. **Verifique o arquivo .env**:
   ```bash
   cat .env
   ```
   Deve conter:
   ```
   VITE_SUPABASE_URL=sua_url_aqui
   VITE_SUPABASE_ANON_KEY=sua_chave_aqui
   ```

3. **Teste o app web**:
   ```bash
   npm run dev
   ```
   Acesse http://localhost:9000 e faça login

4. **Reinstale dependências**:
   ```bash
   rm -rf node_modules
   npm install
   ```

## 💡 Dicas Importantes

- ✅ **Use o email completo** (ex: `usuario@dominio.com`)
- ✅ **Digite a senha exatamente** como cadastrada
- ✅ **Aguarde** o script processar (pode demorar alguns segundos)
- ✅ **Não interrompa** o processo durante a importação
- ⚠️ **Não execute múltiplas vezes** (criará dados duplicados)

## 📞 Próximos Passos

Após resolver o problema de login:
1. Execute o script novamente
2. Forneça email e senha corretos
3. Confirme a importação quando solicitado
4. Aguarde a conclusão
5. Verifique os dados no dashboard do app