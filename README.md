# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/2f757418-eae3-41ac-835e-65874bf94ce2

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/2f757418-eae3-41ac-835e-65874bf94ce2) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Documentação da Tela de Login (SisgesLan)

- Visão geral: Tela de login construída com `React`, `shadcn-ui` e `Tailwind CSS`, com imagem de fundo e formulário centralizado.
- Rotas de acesso:
  - Aplicação React: `http://localhost:8080/login`
  - Página estática: `public/login.html` servida em `http://localhost:8080/login.html`
- Fluxo do processo de login:
  - Compatibilidade: verifica suporte a `fetch` e `localStorage` para exibir alerta se necessário.
  - Entrada: campos controlados de `Usuário` e `Senha` com validação obrigatória.
  - Validação: considera login válido quando ambos os campos estão preenchidos.
  - Sessão: persiste em `localStorage` com a chave `sisgeslan_session` e `isLoggedIn: true`.
  - Navegação: redireciona para `/` após sucesso usando `useNavigate`.
- Arquivos e recursos:
  - Componente: `src/pages/Login.tsx`
  - Página estática: `public/login.html`
  - Assets: `src/assets/burger-hero.jpg` (fundo) e `src/assets/burger-icon.svg` (logo)
  - Estilos base: `src/index.css` (variáveis e tema Tailwind)
- Dependências visuais:
  - Ícones: `lucide-react`
  - Componentes UI: `shadcn-ui` (`Card`, `Input`, `Label`, `Button`)
- Como executar:
  - Iniciar servidor: `npm run dev`
  - Abrir rota React: `http://localhost:8080/login`
  - Abrir página estática: `http://localhost:8080/login.html`

Observações:
- A página `public/login.html` é estática e não executa a lógica de navegação do React; serve para documentação e referência visual.
- A autenticação completa deve ser integrada a uma API futura; atualmente, o login usa verificação básica e `localStorage`.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/2f757418-eae3-41ac-835e-65874bf94ce2) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
