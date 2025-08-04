# 🚀 Guia de Deploy Automático

## Configuração do Deploy Automático com Vercel

### 1. Preparação do Projeto

O projeto já está configurado com:
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Configuração do Vercel (`vercel.json`)
- ✅ Repositório Git conectado

### 2. Configuração no Vercel

#### Passo 1: Criar conta no Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Autorize o Vercel a acessar seus repositórios

#### Passo 2: Importar o projeto
1. No dashboard do Vercel, clique em "New Project"
2. Selecione o repositório `finance-pro`
3. Configure as seguintes opções:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/spa`
   - **Install Command**: `npm install`

#### Passo 3: Configurar variáveis de ambiente
No Vercel, vá em Settings > Environment Variables e adicione:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 3. Configuração dos Secrets no GitHub

Para o deploy automático funcionar, configure os seguintes secrets no GitHub:

1. Vá para seu repositório no GitHub
2. Settings > Secrets and variables > Actions
3. Adicione os seguintes secrets:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
VERCEL_TOKEN=seu_token_do_vercel
VERCEL_ORG_ID=id_da_organizacao_vercel
VERCEL_PROJECT_ID=id_do_projeto_vercel
```

#### Como obter os tokens do Vercel:

**VERCEL_TOKEN:**
1. Vá para [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Crie um novo token
3. Copie o token gerado

**VERCEL_ORG_ID e VERCEL_PROJECT_ID:**
1. No terminal, instale a CLI do Vercel: `npm i -g vercel`
2. Execute: `vercel link`
3. Siga as instruções para conectar o projeto
4. Os IDs serão salvos em `.vercel/project.json`

### 4. Como funciona o Deploy Automático

- **Push para main/master**: Deploy automático para produção
- **Pull Request**: Deploy de preview para testar mudanças
- **Build automático**: A cada commit, o projeto é buildado e deployado

### 5. Comandos úteis

```bash
# Deploy manual (opcional)
npm run build
vercel --prod

# Preview local
npm run dev

# Verificar status do deploy
vercel ls
```

### 6. URLs do projeto

Após o deploy:
- **Produção**: `https://seu-projeto.vercel.app`
- **Preview**: URLs geradas automaticamente para cada PR

### 7. Monitoramento

- Dashboard do Vercel: Monitore deploys, logs e performance
- GitHub Actions: Veja o status dos builds na aba "Actions"

---

## Deploy Alternativo com Netlify

Se preferir usar Netlify:

1. Conecte seu repositório no [netlify.com](https://netlify.com)
2. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/spa`
3. Adicione as variáveis de ambiente do Supabase

---

## 📱 Próximos Passos: APK Android

Para criar o APK Android, consulte o arquivo principal de instruções que foi fornecido anteriormente.