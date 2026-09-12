# Controle Financeiro — Frontend

Interface web simples (Vue 3 + Vue Router + Axios + Tailwind CSS) para consumir a
API FastAPI do projeto [App_Controle_Financeiro](https://github.com/Osvaldo065/App_Controle_Financeiro).

Feita para viver em um repositório separado do backend, como você pediu.

## Telas

- **Login** (`/login`) e **Cadastro** (`/cadastro`)
- **Painel** (`/dashboard`): saldo, receitas, despesas, gastos por categoria e últimos lançamentos, com filtro de mês/ano
- **Lançamentos** (`/lancamentos`): listagem com filtros e paginação, editar e excluir
- **Novo/Editar lançamento** (`/lancamentos/novo`, `/lancamentos/:id/editar`)

## Como rodar

```bash
npm install
cp .env.example .env   # ajuste VITE_API_URL se sua API não estiver em http://127.0.0.1:8000
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Importante: CORS no backend

Como o front roda em uma origem diferente da API, adicione o middleware de
CORS no FastAPI (em `app/main.py`) liberando `http://localhost:5173`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Pontos que eu assumi (confira e ajuste se necessário)

Eu não tinha acesso aos arquivos de `schema/`, então assumi nomes de campos
comuns em português. Cada lugar relevante está marcado com um comentário
`NOTA:` no código-fonte. Os principais pontos são:

1. **Login** (`src/views/LoginView.vue`): assumi que `LoginRequest` usa
   `email` e `senha`. Se for `username`, ajuste o objeto enviado em `entrar()`.
2. **Cadastro de usuário** (`src/views/RegisterView.vue`): assumi
   `UsuarioCreate` com `nome`, `email`, `senha`.
3. **Lançamento** (`src/views/LancamentoFormView.vue`): assumi
   `descricao`, `valor`, `data`, `id_categoria`, `tipo_transacao`
   (`RECEITA`/`DESPESA`) e `status_pagamento` (`PAGO`/`PENDENTE`), conforme
   os enums citados no seu README.
4. **Resposta do dashboard** (`src/views/DashboardView.vue`): assumi os
   campos `saldo_atual`, `total_receitas`, `total_despesas`,
   `quantidade_receitas`, `quantidade_despesas` e uma lista
   `ultimos_lancamentos`. Ajuste os nomes se o `DashboardResponse` for diferente.
5. **Paginação de lançamentos**: assumi que `GET /lancamentos` retorna uma
   lista simples. Se vier um envelope como `{ items, total }`, o código já
   trata os dois casos, mas vale conferir.

Nenhum desses ajustes deve levar mais que trocar o nome de uma chave nos
arquivos indicados.

## Estrutura

```
src/
├── components/NavBar.vue
├── router/index.js
├── services/api.js       # instância axios com JWT automático
├── stores/auth.js         # token em localStorage (sem Vuex/Pinia, de propósito)
├── views/
│   ├── LoginView.vue
│   ├── RegisterView.vue
│   ├── DashboardView.vue
│   ├── LancamentosView.vue
│   └── LancamentoFormView.vue
└── style.css
```
