# Gestantes Frontend

React + Vite + TanStack Query + nuqs + Tailwind + shadcn (componentes copiados manualmente, sem o CLI).

Stack instalada: `@tanstack/react-query`, `nuqs`, `axios`, `tailwindcss` (via `@tailwindcss/vite`), `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/*`.

## Estrutura de feature

```
src/features/<feature>/
  types/         # entidades e tipos de API da feature
  services/      # só chamadas HTTP (axios)
  composables/   # hooks React Query
  validation/    # schemas de validação (se/quando necessário)
  components/
  pages/
```

`src/features/core/` guarda o que é usado por mais de uma feature (utils, tipos, componentes genéricos). Comece novas features seguindo essa mesma pasta.

## UI (`src/components/ui`)

Componentes base (button, input, label, card, badge, etc.) seguem o padrão shadcn/ui (estilo "new-york", CVA para variantes, `cn()` de `src/lib/utils.ts` para merge de classes). São as variantes **default** do shadcn — sem tema de marca. Ao trazer um novo componente shadcn, mantenha esse padrão: `data-slot`, `cva` para variantes, tokens de `src/index.css` (`bg-primary`, `text-muted-foreground`, etc.), nunca cor hardcoded.

Tokens de cor/raio ficam em `src/index.css` (`@theme inline` + variáveis `:root`/`.dark`). Para novas cores/tokens, adicione ali — não em componentes individuais.

## Services (`services/`)

- Apenas `api.get/post/patch/delete` — sem `.then`, sem mappers, sem builders de payload.

```ts
// ✅
export const getUsers = (page: number, limit: number) =>
  api.get('/users', { params: { page, limit } })

// ❌ buildCreateUserPayload, mapUserToX, unwrap manual de response.data
```

Instância do axios em `src/lib/api.ts`.

## Types (`types/`)

Tipos da feature ficam em **um arquivo por domínio** (ex.: `types/user.ts`). Não criar arquivos `*Api.ts` separados.

## Composables

- **`useQuery`**: unwrap e transformação no `select`.
- **`useMutation`**: `mutationFn` chama o service; invalidação de cache no `onSuccess`.
- Query keys exportadas no composable de listagem.
- **Paginação e filtros usam `nuqs`** (`useQueryState`/`useQueryStates`) dentro do composable — nunca `useState` na página.
- "Filtro vazio" é `null` em todas as camadas — o axios descarta params `null` na query string.
- Não espalhe `?? valorPadrão` na página só para cobrir o loading do React Query: o componente aceita `data` opcional e renderiza seu próprio `Skeleton` quando `undefined`.

## Utils

- Util usado por **mais de uma feature** → `features/core/utils/`.
- Util usado por **uma única feature** → `features/<feature>/utils/`.
- Não redefinir uma função utilitária dentro de um composable/componente só porque "é pequena" — extrair para `utils/` assim que for usada em mais de um lugar.

## Convenções gerais

- Arquivos em **camelCase** (`createUserModal.tsx`).
- Não exportar helpers não usados fora do módulo.
- Commits: mensagens concisas em português, sem co-autoria do Claude.
