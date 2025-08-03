# Finance Pro 💰

Um aplicativo moderno de gestão financeira pessoal desenvolvido com Vue.js, Quasar Framework e Supabase.

## 🚀 Funcionalidades

- ✅ **Autenticação segura** com Supabase
- 📊 **Dashboard interativo** com gráficos de movimentação
- 💸 **Controle de receitas e despesas**
- 🌙 **Modo escuro/claro** com persistência
- 📱 **Design responsivo** para desktop e mobile
- 🔐 **"Lembrar acesso"** para login automático
- 📈 **Relatórios visuais** de gastos mensais

## 🛠️ Tecnologias

- **Frontend**: Vue.js 3 + TypeScript
- **Framework UI**: Quasar Framework
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Build Tool**: Vite

## ⚙️ Configuração do Ambiente

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/finance-pro.git
cd finance-pro
```

### 2. Instale as dependências
```bash
npm install
# ou
yarn
```

### 3. Configure o Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
4. Preencha as variáveis no arquivo `.env` com suas credenciais do Supabase:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```
5. Execute o script SQL fornecido em `supabase-setup.sql` no editor SQL do Supabase

### 4. Desabilitar confirmação de email (opcional)
Para desenvolvimento, você pode desabilitar a confirmação de email seguindo as instruções em `DISABLE_EMAIL_CONFIRMATION.md`

## 🚀 Executando o Projeto

### Modo de desenvolvimento
```bash
npm run dev
# ou
yarn dev
```
O aplicativo estará disponível em `http://localhost:9000`

### Build para produção
```bash
npm run build
# ou
yarn build
```

### Linting e formatação
```bash
# Verificar código
npm run lint

# Formatar código
npm run format
```

## 📱 Screenshots

*Em breve: adicione screenshots do aplicativo aqui*

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - seu.email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/finance-pro](https://github.com/seu-usuario/finance-pro)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!
