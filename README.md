🏡 RentStayMVP – Experimento com Pythagora

📄 Descrição do Projeto
Este repositório contém o RentStayMVP, um protótipo desenvolvido utilizando o Pythagora como alternativa ao Lovable.A aplicação foi construída com React + Vite no front-end, Node.js/Express no back-end, e integrações básicas para autenticação, reservas, mensagens e propriedades.  

🔎 Contexto: inicialmente o projeto começou após um workshop do Lovable (PM3).Como não fui contemplado com acesso estendido ao plano Pro, explorei o Pythagora como alternativa.Essa iniciativa acabou abrindo novos horizontes, pois descobri uma gama enorme de ferramentas disponíveis para acelerar o desenvolvimento.


🧠 Arquitetura Geral
[Cliente - React/TS] ----> [Servidor - Node.js/Express]
        |                           |
        |  UI + Context API         |  Autenticação, rotas REST, LLM Service
        |                           |
        v                           v
  [Tailwind + shadcn/ui]      [Banco de Dados MongoDB]

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

MongoDB (configurado via server/config/database.js)
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
✅ Finalizar CRUD completo de reservas e propriedades.
✅ Otimizar fluxo de autenticação e refresh tokens.
✅ Integração com AI agent 8n8.
✅ Melhorar UI/UX com novos componentes do shadcn/ui.
✅ Propriedades agora são reais e usam banco de dados MongoDB.
⏳ Persistência completa em banco ainda em fase de testes.
⏳ Integração avançada com LLM Service em desenvolvimento.


🧪 Próximas Etapas

Implementar testes automatizados (unitários e integração).
Configurar deploy em nuvem (Railway/Render/Heroku).


📢 Nota Final
Este projeto nasceu como experimento exploratório após o workshop do Lovable, mas ao testar o Pythagora percebi seu potencial em acelerar o desenvolvimento de aplicações full-stack.
🚀 O aprendizado foi além da expectativa, e agora, com a integração do AI agent 8n8, o projeto ganhou novas possibilidades para funcionalidades avançadas e interativas.
