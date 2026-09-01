<p align="center">
  <img src="docs/logo-gestare.svg" width="200" alt="Gestare" />
</p>

# gestare-frontend

Frontend do **Sistema de Avaliação de Vulnerabilidade no Pré-Natal** — interface web para os profissionais de saúde (médicos e enfermeiros) que aplicam o questionário de vulnerabilidade de gestantes nas Unidades Básicas de Saúde. A paciente é o objeto da avaliação e **não acessa a aplicação**.

O backend fica em [`gestare-backend`](https://barauna.univasf.edu.br/externo/gestare/gestare-backend).

## Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) com [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) para rotas
- [TanStack Query](https://tanstack.com/query) e [TanStack Table](https://tanstack.com/table) para dados e listagens
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) nos formulários
- [Tailwind CSS 4](https://tailwindcss.com/) + componentes [Radix UI](https://www.radix-ui.com/) (padrão shadcn/ui)
- [Axios](https://axios-http.com/) para o cliente HTTP

## Requisitos

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env
```

| Variável            | Uso                                                        |
| ------------------- | --------------------------------------------------------- |
| `VITE_API_BASE_URL` | base da API do backend (ex.: `http://localhost:3000/api`) |

## Executando

```bash
npm run dev      # servidor de desenvolvimento com HMR
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
npm run lint     # oxlint
```

## Docker

Dois Dockerfiles, seguindo o mesmo padrão do restante da infraestrutura da UNIVASF:

- **`Dockerfile`** — build multi-stage servido por nginx na porta `3000`, com fallback de SPA e proxy de `/api` para o serviço `backend` (uso local via `docker compose`).
- **`Dockerfile.prod`** — usado no deploy da UNIVASF. Recebe `APP_BASE_PATH` (padrão `/gestare/`) e `VITE_API_BASE_URL` (padrão `/gestare-api`) como `--build-arg`; publica os assets sob o base path e serve na porta `80`. O roteamento de `/gestare-api` é feito pelo proxy reverso da infraestrutura.

```bash
docker compose up --build          # sobe só o frontend (porta 8080)
```

Para subir a stack completa (frontend + backend + MongoDB), use o `docker-compose.yml` na raiz do monorepo local.

## Deploy

`.gitlab-ci.yml` dispara o deploy no push:

| Branch    | Runner                | Ambiente   |
| --------- | --------------------- | ---------- |
| `develop` | `deploy-gestare`      | homologação |
| `main`    | `deploy-gestare-prod` | produção   |

O job chama `sudo /root/docker_deploy/gestare/deploy.sh www "$CI_COMMIT_BRANCH"` no host de destino, que faz o `git pull` + `docker compose build` + `up -d`.
