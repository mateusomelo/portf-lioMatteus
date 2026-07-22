# Portfólio — Matteus Oliveira de Melo

Portfólio pessoal, premium, moderno e responsivo, construído com HTML5, CSS3 e JavaScript puro (vanilla).

## Estrutura

```
portfolio-matteus/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   ├── img/perfil.jpg        -> foto de perfil (Hero)
│   ├── projects/projeto-N.jpg -> imagens dos projetos
│   └── cv/curriculo-*.pdf    -> currículo em PDF
└── README.md
```

## Como visualizar

Basta abrir o `index.html` em um navegador, ou servir a pasta com um servidor local:

```bash
npx serve .
```

## Pontos para personalizar

- **Foto de perfil**: `assets/img/perfil.jpg`
- **Currículo em PDF**: `assets/cv/curriculo-matteus-oliveira-melo.pdf`
- **Imagens dos projetos**: `assets/projects/projeto-1.jpg` até `projeto-5.jpg`
- **Links reais** (LinkedIn, GitHub, WhatsApp, e-mail, telefone, repositórios dos projetos): buscar por `href="#"` em `index.html` e substituir pelos links corretos.
- **Período de cada experiência** na Linha do Tempo: buscar por `Período: <em>adicionar</em>` em `index.html`.
- **Mapa de contato**: o `iframe` do Google Maps está com uma localização genérica (São Paulo) — troque a query `q=` na URL pela sua cidade/endereço.
- **Formulário de contato**: atualmente é apenas front-end (mostra uma mensagem de sucesso simulada). Para envio real de e-mails, integre com um serviço como Formspree, EmailJS, ou um back-end próprio.

## Tecnologias

HTML5 · CSS3 (Glassmorphism, gradientes, animações) · JavaScript (vanilla) · Font Awesome 6 · Google Fonts (Outfit + Inter)
