import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'

import { Divider } from '@/components/ui/divider'
import { IconButton } from '@/components/ui/icon-button'

import { ColorPickerPopover } from './ColorPickerPopover'
import { DashedAddButton } from './DashedAddButton'
import { LimitesRange } from './LimitesRange'
import { RecomendacaoRow } from './RecomendacaoRow'
import { SortableItem, type DragHandle } from './SortableItem'
import type { EscalaConfig } from '../composables/useEscalaConfig'
import type { GrauConfig } from '../types/escala'

interface GrauVulnerabilidadeCardProps {
	grau: GrauConfig
	config: EscalaConfig
	erro?: string
	dragHandle?: DragHandle
	onRemover: () => void
	onRemoverRecomendacao: (grauId: string, recId: string) => void
}

export function GrauVulnerabilidadeCard({
	grau,
	config,
	erro,
	dragHandle,
	onRemover,
	onRemoverRecomendacao,
}: GrauVulnerabilidadeCardProps) {
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const ids = grau.recomendacoes.map((r) => r.id)

	function handleDragEnd(e: DragEndEvent) {
		const { active, over } = e
		if (!over || active.id === over.id) return
		config.reordenarRecomendacoes(grau.id, String(active.id), String(over.id))
	}

	return (
		<div className="overflow-hidden rounded-xl border border-n-40 bg-n-0">
			<div className="flex items-center justify-between gap-4 border-b border-n-40 p-4">
				<div className="flex items-center gap-2">
					{dragHandle ? (
						<button
							type="button"
							className="shrink-0 cursor-grab text-n-400 active:cursor-grabbing"
							{...dragHandle.attributes}
							{...dragHandle.listeners}
						>
							<GripVertical className="size-5" />
						</button>
					) : null}
					<ColorPickerPopover
						cor={grau.cor}
						onChange={(c) => config.atualizarGrau(grau.id, { cor: c })}
					/>
					<input
						value={grau.nome}
						onChange={(e) => config.atualizarGrau(grau.id, { nome: e.target.value })}
						className="w-40 bg-transparent text-base text-n-900 outline-none"
					/>
				</div>
				<IconButton
					icon={Trash2}
					variant="danger"
					tooltipText="Remover grau"
					onClick={onRemover}
				/>
			</div>

			<div className="flex flex-col gap-2.5 p-4">
				<Divider text="Limites" />
				<LimitesRange
					min={grau.min}
					max={grau.max}
					onMinChange={(v) => config.atualizarGrau(grau.id, { min: v })}
					onMaxChange={(v) => config.atualizarGrau(grau.id, { max: v })}
					idPrefix={`grau-${grau.id}`}
				/>
				{erro ? <p className="text-sm text-r-600">{erro}</p> : null}

				<Divider text="Recomendações sugeridas" />
				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={ids} strategy={verticalListSortingStrategy}>
						<div className="flex flex-col gap-2.5">
							{grau.recomendacoes.map((r) => (
								<SortableItem key={r.id} id={r.id}>
									{(h) => (
										<RecomendacaoRow
											grauId={grau.id}
											recomendacao={r}
											config={config}
											dragHandle={h}
											onRemover={() => onRemoverRecomendacao(grau.id, r.id)}
										/>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DndContext>
				<DashedAddButton
					label="Adicionar recomendação"
					onClick={() => config.addRecomendacao(grau.id)}
				/>
			</div>
		</div>
	)
}
