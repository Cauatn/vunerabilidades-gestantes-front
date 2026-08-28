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

### Tailwind v4 — armadilhas conhecidas

- **NUNCA use `border-t-*`, `border-b-*`, `border-r-*`, `border-l-*`, `border-x-*`, `border-y-*` como COR.** As famílias de cor `t`/`b`/`r`/`l`/`x`/`y` colidem com os atalhos de **direção de borda** do Tailwind: `border-t-300` vira `border-top-width: 300px` (um bloco gigante), não "cor da borda `t-300`". Idem `divide-x-*`/`divide-y-*`. Para cor de borda com essas famílias, use a sintaxe de var: **`border-(--color-t-300)`** → `border-color: var(--color-t-300)`. As famílias `n`/`g`/`p`/`o` não colidem (`border-n-40` funciona como cor).
- **Só existem os _stops_ de cor declarados no `@theme`.** Por família: `n` 0–900; `t`/`p`/`g` 50–700; `r` **só 100,500,600,700**; `y` **só 100,400,600,700**; `b` **só 50,100,200,400,600,700**; `o` só 100,400. Usar um stop inexistente (`bg-r-200`, `text-y-500`) **não gera CSS nenhum**, sem erro. Confira `--color-<familia>-<n>` no `index.css` antes de usar.
- Valores arbitrários (`text-[44px]`, `w-[252px]`, `gap-13`) **funcionam** — no CSS gerado saem escapados (`.text-\[44px\]`), então não é bug se um `grep` simples não achar.
- Ao criar arquivos novos ou renomear pastas de `src/`, **reinicie o `vite dev`** (`rm -rf node_modules/.vite`). O scanner de conteúdo + HMR às vezes ficam com o grafo velho e o CSS sai quebrado até o restart.
- `cn()` (`tailwind-merge`) pode descartar classes que julga conflitantes — se um utilitário "sumiu", cheque se outro da mesma categoria está na mesma string.

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

- **Um composable por arquivo.** Nome do arquivo = nome do hook.
- **Nomes**: query de listagem `useGet<Plural>`, query de item `useGet<Singular>`, mutations `useCreate<X>` / `useUpdate<X>` / `useDeactivate<X>` / `use<Verbo><X>`.
- **`useQuery`**: o unwrap de `response.data` e qualquer transformação vão no `select` — **nunca `.then`** no `queryFn`.
- **`useMutation`**: `useMutation` **não tem `select`**. O `mutationFn` só chama o service: `mutationFn: (payload) => service(payload)` (ou `mutationFn: service`). Nunca desembrulha, nunca `.then`, nunca `async` só pra pegar `.data`. Quem precisa do corpo desestrutura no ponto de uso — `const { data } = await mutation.mutateAsync(payload)` — ou dentro do próprio `onSuccess` (`onSuccess: ({ data }) => …`). Invalidação de cache no `onSuccess`, seguida de `options?.onSuccess?.()`.
- **Query key** de cada feature é exportada do arquivo `useGet<Plural>` (ex.: `export const usuariosQueryKey = ['users']`); as mutations importam de lá.
- **Paginação e filtros usam `nuqs`** (`useQueryState`/`useQueryStates`) dentro do composable de listagem — nunca `useState` na página.
- `PAGE_SIZE` vem de `@/features/core/constants/pagination.ts` (padrão 50) — não redefinir por feature.
- "Filtro vazio" é `null` em todas as camadas — o axios descarta params `null` na query string.
- Não espalhe `?? valorPadrão` na página só para cobrir o loading do React Query: o componente aceita `data` opcional e renderiza seu próprio `Skeleton` quando `undefined`.

```ts
// useGetUsuarios.ts
export const usuariosQueryKey = ['users']

export function useGetUsuarios() {
	const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))
	const query = useQuery({
		queryKey: [...usuariosQueryKey, { page }],
		queryFn: () => getUsuarios({ page, pageSize: PAGE_SIZE }),
		select: (response) => response.data as PaginatedUsuarios,
	})
	return { ...query, page, setPage }
}

// useUpdateUsuarioStatus.ts
export function useUpdateUsuarioStatus(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: UsuarioStatus }) =>
			updateUsuarioStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: usuariosQueryKey })
			options?.onSuccess?.()
		},
	})
}

// uso quando precisa do corpo:
// const { data } = await criarGestante.mutateAsync(payload)
```

## Utils

- Util usado por **mais de uma feature** → `features/core/utils/`.
- Util usado por **uma única feature** → `features/<feature>/utils/`.
- Não redefinir uma função utilitária dentro de um composable/componente só porque "é pequena" — extrair para `utils/` assim que for usada em mais de um lugar.

## Convenções gerais

- Arquivos em **camelCase** (`createUserModal.tsx`).
- Não exportar helpers não usados fora do módulo.
- Commits: mensagens concisas em português. **Nunca** adicione `Co-Authored-By: Claude` nem qualquer trailer de co-autoria do Claude.
