<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy on Vercel

Para fazer o deploy deste projeto no Vercel, siga os passos abaixo:

1. Conecte seu repositório Git ao Vercel.
2. No painel de configuração do projeto no Vercel, adicione as seguintes **Environment Variables**:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase.
   - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima (anon key) do Supabase.
   - `GEMINI_API_KEY`: Sua chave da API do Google Gemini.
3. O Vercel detectará automaticamente o Vite. O comando de build deve ser `npm run build` e o diretório de saída deve ser `dist`.
4. Clique em **Deploy**.

O arquivo `vercel.json` já está configurado para garantir que as rotas do React Router funcionem corretamente no ambiente de produção.
