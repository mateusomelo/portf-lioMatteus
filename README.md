# Portfólio — Matteus Oliveira de Melo

Portfólio pessoal premium, 100% estático (HTML5, CSS3, JavaScript puro). Basta hospedar em qualquer serviço
estático — Netlify, GitHub Pages, Vercel — sem precisar de servidor rodando.

## Estrutura

```
portfolio-matteus/
├── index.html
├── css/style.css
├── js/script.js
├── assets/
│   ├── img/perfil.jpg         -> foto de perfil (Hero)
│   ├── projects/projeto-N.jpg -> imagens dos projetos
│   └── cv/curriculo-*.pdf     -> currículo em PDF
└── README.md
```

## Como visualizar

Basta abrir o `index.html` em um navegador, ou servir a pasta com um servidor local:

```bash
npx serve .
```

## Deploy no Netlify

1. Suba este repositório no GitHub (já feito).
2. No Netlify: "Add new site" → "Import an existing project" → selecione o repositório.
3. Build command: (deixe em branco) · Publish directory: `.` (raiz do projeto).
4. Deploy — pronto, o site é servido direto como estático.

## Pontos para personalizar

- **Foto de perfil**: `assets/img/perfil.jpg`
- **Currículo em PDF**: `assets/cv/curriculo-matteus-oliveira-melo.pdf`
- **Imagens dos projetos**: `assets/projects/projeto-1.jpg` até `projeto-6.jpg`
- **Links reais** (LinkedIn, GitHub, WhatsApp, repositórios dos projetos): buscar por `href="#"` em `index.html`.
- **Período de cada experiência** na Linha do Tempo: buscar por `Período: <em>adicionar</em>` em `index.html`.
- **Mapa de contato**: o `iframe` do Google Maps está com uma localização genérica — troque a query `q=` na URL.
- **Formulário de contato**: é front-end apenas (mostra uma mensagem de sucesso simulada). Para envio real,
  integre um serviço como Formspree ou EmailJS (funcionam com sites 100% estáticos, sem precisar de backend).

## Tecnologias

HTML5 · CSS3 (Glassmorphism, gradientes, animações) · JavaScript (vanilla) · Font Awesome 6 · Google Fonts (Outfit + Inter)

## Plataforma "Projetos Ao Vivo" (opcional, não faz parte do site publicado)

Este repositório também contém, nas pastas `server/` e `admin/`, uma plataforma full-stack completa
(Node.js + Express + `node:sqlite` + Puppeteer + JWT) que cadastra projetos, verifica automaticamente se
estão no ar, mede tempo de resposta e gera screenshot de fallback quando o site bloqueia incorporação em
iframe — com painel administrativo e monitoramento a cada 6h.

Ela **não está conectada ao site público** (que voltou a ser estático para simplificar a hospedagem no
Netlify), mas fica preservada no repositório como projeto próprio — inclusive já aparece como card na seção
"Projetos" do site. Para rodá-la localmente:

```bash
npm install
cp .env.example .env
npm run create-admin -- --email=seu@email.com --password=SenhaForte123
npm start
# site: http://localhost:3000 · admin: http://localhost:3000/admin/login.html
```

Se preferir remover essa parte do repositório por completo, é só apagar as pastas `server/`, `admin/`,
`uploads/`, `projeto.html`, `package.json`, `package-lock.json` e `.env.example`.
