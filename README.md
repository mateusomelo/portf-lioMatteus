# Portfólio — Matteus Oliveira de Melo

Portfólio pessoal premium com uma plataforma de **Projetos Ao Vivo**: cadastre a URL de um projeto na área
administrativa e ele aparece automaticamente na página inicial — ao vivo em um iframe quando o site permite,
ou com uma screenshot automática (gerada via Puppeteer) quando não permite. Tudo monitorado a cada 6 horas.

## Estrutura

```
portfolio-matteus/
├── index.html            -> site público (inclui a seção "Projetos Ao Vivo")
├── projeto.html           -> página individual de projeto (/projetos/:slug)
├── css/style.css
├── js/script.js
├── assets/                -> foto, currículo, imagens dos projetos estáticos
├── admin/                 -> área administrativa (login + gestão de projetos)
│   ├── login.html
│   ├── dashboard.html
│   ├── admin.css
│   └── admin.js
├── server/                -> backend (Node.js + Express)
│   ├── server.js
│   ├── config/            -> banco de dados (node:sqlite) e variáveis de ambiente
│   ├── repositories/      -> acesso ao banco de dados
│   ├── controllers/       -> regras de cada rota
│   ├── services/          -> iframe check, screenshot (Puppeteer), health check, verificação
│   ├── routes/             -> definição das rotas (auth, projetos públicos, admin)
│   ├── middleware/         -> autenticação JWT e upload de imagens
│   ├── scheduler/          -> monitoramento automático a cada 6h (node-cron)
│   └── scripts/            -> script para criar o usuário administrador
├── uploads/
│   ├── screenshots/        -> screenshots geradas automaticamente
│   └── projects/           -> imagens personalizadas enviadas no admin
└── package.json
```

## Como rodar

Pré-requisitos: [Node.js](https://nodejs.org) 22.5 ou superior (usa o módulo nativo `node:sqlite`, sem dependências de banco externas).

```bash
# 1. Instalar dependências (baixa também o Chromium usado pelo Puppeteer)
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# edite o .env e troque JWT_SECRET por um valor aleatório

# 3. Criar o usuário administrador
npm run create-admin -- --email=seu@email.com --password=SenhaForte123

# 4. Iniciar o servidor
npm start
```

Depois disso:

- Site: **http://localhost:3000**
- Login administrativo: **http://localhost:3000/admin/login.html**

> O site agora precisa rodar através do servidor Node (não abra mais o `index.html` direto no navegador),
> pois a seção "Projetos Ao Vivo" consome a API do backend.

## Como funciona a verificação automática

Ao salvar um projeto na área administrativa, o sistema:

1. Salva os dados no banco (SQLite local, em `server/data/portfolio.sqlite`).
2. Acessa a URL informada e mede o tempo de resposta.
3. Verifica os headers `X-Frame-Options` e `Content-Security-Policy` para saber se o site permite ser
   incorporado em um `<iframe>`.
4. Se permitir → o card mostra o site **ao vivo**.
5. Se não permitir (ou estiver offline) → o sistema gera uma **screenshot automática** com Puppeteer e usa
   como capa do projeto. O visitante nunca vê essa decisão, apenas o resultado final.
6. A cada 6 horas, um job (`node-cron`) reverifica todos os projetos cadastrados, atualizando status,
   tempo de resposta e, se necessário, gerando uma nova screenshot.

## Pontos para personalizar

- **Foto de perfil**: `assets/img/perfil.jpg`
- **Currículo em PDF**: `assets/cv/curriculo-matteus-oliveira-melo.pdf`
- **Imagens dos projetos estáticos** (seção "Projetos"): `assets/projects/projeto-1.jpg` até `projeto-5.jpg`
- **Período de cada experiência** na Linha do Tempo: buscar por `Período: <em>adicionar</em>` em `index.html`.
- **Mapa de contato**: o `iframe` do Google Maps está com uma localização genérica — troque a query `q=` na URL.
- **Formulário de contato** (seção Contato): é front-end apenas. Para envio real, integre Formspree, EmailJS ou backend próprio.
- **Projetos Ao Vivo**: cadastre e gerencie pela área administrativa, não editando HTML diretamente.

## Tecnologias

**Frontend:** HTML5 · CSS3 (Glassmorphism, gradientes, animações) · JavaScript (vanilla) · Font Awesome 6 · Google Fonts
**Backend:** Node.js · Express · `node:sqlite` (nativo) · JWT · bcryptjs · Multer · node-cron · Puppeteer
