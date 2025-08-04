# 🔑 Configuração dos Secrets do GitHub

## Problema Identificado

O deploy está falhando com o erro "Project not found" porque os secrets `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` não estão configurados no GitHub.

## Solução: Configurar Secrets no GitHub

### Passo 1: Acessar as Configurações de Secrets

1. Vá para o seu repositório no GitHub: `https://github.com/pedrovictorpina/finance-pro`
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Secrets and variables** > **Actions**

### Passo 2: Adicionar os Secrets Necessários

Clique em **New repository secret** e adicione os seguintes secrets:

#### Secrets do Supabase (se ainda não configurados):
- **Nome**: `VITE_SUPABASE_URL`
- **Valor**: Sua URL do Supabase (ex: `https://xxxxx.supabase.co`)

- **Nome**: `VITE_SUPABASE_ANON_KEY`
- **Valor**: Sua chave anônima do Supabase

#### Secrets do Vercel (OBRIGATÓRIOS para o deploy funcionar):

- **Nome**: `VERCEL_TOKEN`
- **Valor**: Token de acesso do Vercel

- **Nome**: `VERCEL_ORG_ID`
- **Valor**: ID da sua organização no Vercel

- **Nome**: `VERCEL_PROJECT_ID`
- **Valor**: ID do projeto no Vercel

### Passo 3: Como Obter os Valores do Vercel

#### Para obter o VERCEL_TOKEN:
1. Acesse [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Clique em **Create Token**
3. Dê um nome para o token (ex: "GitHub Actions")
4. Copie o token gerado

#### Para obter VERCEL_ORG_ID e VERCEL_PROJECT_ID:

**Opção 1: Via CLI do Vercel (Recomendado)**
```bash
# Instalar CLI do Vercel
npm i -g vercel

# Fazer login
vercel login

# Conectar o projeto
vercel link
```

Após executar `vercel link`, os IDs serão salvos em `.vercel/project.json`:
```json
{
  "orgId": "seu_org_id_aqui",
  "projectId": "seu_project_id_aqui"
}
```

**Opção 2: Via Dashboard do Vercel**
1. Acesse [vercel.com](https://vercel.com)
2. Vá para o seu projeto
3. Em **Settings** > **General**:
   - **Project ID**: Copie o valor mostrado
   - **Team ID** (ou **Personal Account ID**): Este é o ORG_ID

### Passo 4: Verificar a Configuração

Após adicionar todos os secrets:
1. Vá para a aba **Actions** do seu repositório
2. Execute um novo deploy fazendo um push ou clicando em **Re-run jobs**
3. O deploy deve funcionar sem erros

## ✅ Checklist de Secrets

Marque os secrets que você já configurou:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_PROJECT_ID`

## 🚨 Importante

- **Nunca** compartilhe esses valores publicamente
- Os secrets são criptografados e só podem ser vistos por administradores do repositório
- Se você regenerar algum token no Vercel, lembre-se de atualizar o secret correspondente no GitHub

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique se todos os 5 secrets estão configurados
2. Confirme se os valores estão corretos (sem espaços extras)
3. Tente fazer um novo deploy após a configuração