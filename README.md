# 🏡 RentStayMVP – Experimento com Pythagora

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-server-lightgrey?style=for-the-badge&logo=express)
![Postgres](https://img.shields.io/badge/PostgreSQL-database-blue?style=for-the-badge&logo=postgresql)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.x-teal?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)

## 📄 Descrição do Projeto

Este repositório contém o **RentStayMVP**, um protótipo desenvolvido utilizando o **Pythagora** como alternativa ao **Lovable**.  
A aplicação foi construída com **React + Vite** no front-end, **Node.js/Express** no back-end, e integrações básicas para autenticação, reservas, mensagens e propriedades.  

> 🔎 Contexto: inicialmente o projeto começou após um **workshop do Lovable** (PM3).  
> Como não fui contemplado com acesso estendido ao plano *Pro*, explorei o **Pythagora** como alternativa.  
> Essa iniciativa acabou abrindo novos horizontes, pois descobri uma gama enorme de ferramentas disponíveis para acelerar o desenvolvimento.

---

## 🧠 Arquitetura Geral

```text
[Cliente - React/TS] ----> [Servidor - Node.js/Express]
        |                           |
        |  UI + Context API         |  Autenticação, rotas REST, LLM Service
        |                           |
        v                           v
  [Tailwind + shadcn/ui]      [Banco de Dados PostgreSQL]

🛠️ Tecnologias e Ferramentas

Front-end

React + Vite

TypeScript

TailwindCSS + shadcn/ui

Context API (Auth, Hooks customizados)

Back-end

Node.js + Express

Serviços e rotas modulares (auth, bookings, messages, properties, reviews)

Integração com LLM Service

Autenticação JWT e criptografia de senhas

Infraestrutura

PostgreSQL (configurado via server/config/database.js)

Estrutura modular client/, server/ e shared/

Scripts de configuração via package.json

📂 Estrutura do Código
RentStayMVP/
│
├── client/              # Front-end (React + TS + Vite + Tailwind)
│   ├── src/
│   │   ├── api/         # Consumo de rotas do back-end
│   │   ├── components/  # Componentes reutilizáveis
│   │   ├── contexts/    # AuthContext e hooks
│   │   ├── pages/       # Páginas principais (Login, Dashboard, Search, etc.)
│   │   └── lib/         # Funções utilitárias
│
├── server/              # Back-end (Node.js + Express)
│   ├── config/          # Configuração do banco de dados
│   ├── models/          # Modelos de usuário e init
│   ├── routes/          # Rotas e middlewares
│   ├── services/        # Lógica de negócio (User, LLM)
│   └── utils/           # Funções auxiliares (auth, password)
│
├── shared/              # Tipos e configs compartilhados
│   ├── config/
│   └── types/
│
└── package.json / tsconfig / vite.config.ts

🔎 Estado Atual

✅ Estrutura modular funcional no Pythagora.

✅ Integração cliente-servidor rodando localmente.

✅ Autenticação básica implementada.

✅ Design inicial com Tailwind + shadcn/ui.

⏳ Persistência completa em banco ainda em fase de testes.

⏳ Integração avançada com LLM Service em desenvolvimento.

🧪 Próximas Etapas
Finalizar CRUD completo de reservas e propriedades.
Implementar testes automatizados (unitários e integração).
Configurar deploy em nuvem (Railway/Render/Heroku).
Otimizar fluxo de autenticação e refresh tokens.
Melhorar UI/UX com novos componentes do shadcn/ui.

📢 Nota Final

Este projeto nasceu como experimento exploratório após o workshop do Lovable, mas ao testar o Pythagora percebi seu potencial em acelerar o desenvolvimento de aplicações full-stack.

🚀 O aprendizado foi além da ferramenta inicial: abriu portas para uma visão mais ampla sobre low-code, geração de código assistida e integração de IA no ciclo de desenvolvimento.
