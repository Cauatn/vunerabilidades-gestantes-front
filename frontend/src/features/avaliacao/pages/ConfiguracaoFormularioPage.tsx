import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'

import { Page } from '@/components/Layout/Page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SortablePerguntaCard } from '@/features/avaliacao/components/SortablePerguntaCard'
import { usePerguntas } from '@/features/avaliacao/composables/usePerguntasStore'
import type { Pergunta } from '@/features/avaliacao/types/pergunta'

const SEM_CATEGORIA = 'Sem categoria'

function agruparPorCategoria(perguntas: Pergunta[]) {
	const grupos = new Map<string, Pergunta[]>()
	for (const pergunta of perguntas) {
		const chave = pergunta.categoria.trim() || SEM_CATEGORIA
		if (!grupos.has(chave)) grupos.set(chave, [])
		grupos.get(chave)!.push(pergunta)
	}
	return grupos
}

function GrupoDeCategoria({
	categoria,
	numeroPagina,
	perguntasDoGrupo,
	onAddPergunta,
}: {
	categoria: string
	numeroPagina: number
	perguntasDoGrupo: Pergunta[]
	onAddPergunta: (categoria: string) => void
}) {
	const {
		removePergunta,
		reorderPerguntas,
		updatePerguntaCategoria,
		updatePerguntaTexto,
		addOpcao,
		removeOpcao,
		updateOpcaoTexto,
		updateOpcaoPontuacao,
	} = usePerguntas()

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const ids = perguntasDoGrupo.map((pergunta) => pergunta.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		const de = ids.indexOf(String(active.id))
		const para = ids.indexOf(String(over.id))
		if (de === -1 || para === -1) return
		reorderPerguntas(arrayMove(ids, de, para))
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<Badge variant="blue">Página {numeroPagina}</Badge>
				<p className="text-lg font-semibold text-p-600">{categoria}</p>
			</div>
			<p className="-mt-2 text-caption text-n-500">
				Cada categoria vira uma página do formulário; a gestante só avança quando responde tudo aqui.
			</p>

			<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
				<SortableContext items={ids} strategy={rectSortingStrategy}>
					<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
						{perguntasDoGrupo.map((pergunta, index) => (
							<SortablePerguntaCard
								key={pergunta.id}
								pergunta={pergunta}
								index={index}
								onRemove={removePergunta}
								onCategoriaChange={updatePerguntaCategoria}
								onTextoChange={updatePerguntaTexto}
								onAddOpcao={addOpcao}
								onRemoveOpcao={removeOpcao}
								onOpcaoTextoChange={updateOpcaoTexto}
								onOpcaoPontuacaoChange={updateOpcaoPontuacao}
							/>
						))}
					</div>
				</SortableContext>
			</DndContext>

			<Button type="button" variant="outline" size="sm" onClick={() => onAddPergunta(categoria)}>
				<Plus className="size-4" />
				Adicionar pergunta em "{categoria}"
			</Button>
		</div>
	)
}

export function ConfiguracaoFormularioPage() {
	const { perguntas, addPergunta } = usePerguntas()
	const grupos = useMemo(() => agruparPorCategoria(perguntas), [perguntas])

	return (
		<Page
			title="Configurar Formulário"
			description="Defina categorias, perguntas, opções de resposta e a pontuação de cada uma."
		>
			<div className="w-full space-y-10">
				{Array.from(grupos.entries()).map(([categoria, perguntasDoGrupo], index) => (
					<GrupoDeCategoria
						key={categoria}
						categoria={categoria}
						numeroPagina={index + 1}
						perguntasDoGrupo={perguntasDoGrupo}
						onAddPergunta={(cat) => addPergunta(cat === SEM_CATEGORIA ? '' : cat)}
					/>
				))}

				<Button type="button" variant="outline" onClick={() => addPergunta()}>
					<Plus className="size-4" />
					Adicionar nova categoria
				</Button>
			</div>
		</Page>
	)
}
