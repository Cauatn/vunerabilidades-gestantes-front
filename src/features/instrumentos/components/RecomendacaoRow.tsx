import { GripVertical, Trash2 } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'

import type { DragHandle } from './SortableItem'
import type { EscalaConfig } from '../composables/useEscalaConfig'
import type { RecomendacaoConfig } from '../types/escala'

interface RecomendacaoRowProps {
	grauId: string
	recomendacao: RecomendacaoConfig
	config: EscalaConfig
	dragHandle: DragHandle
	onRemover: () => void
}

export function RecomendacaoRow({
	grauId,
	recomendacao,
	config,
	dragHandle,
	onRemover,
}: RecomendacaoRowProps) {
	return (
		<div className="flex items-center gap-3">
			<button
				type="button"
				className="shrink-0 cursor-grab text-n-400 active:cursor-grabbing"
				{...dragHandle.attributes}
				{...dragHandle.listeners}
			>
				<GripVertical className="size-5" />
			</button>
			<Input
				className="flex-1"
				value={recomendacao.texto}
				placeholder="Recomendação sugerida"
				onChange={(e) => config.atualizarRecomendacao(grauId, recomendacao.id, e.target.value)}
			/>
			<IconButton
				icon={Trash2}
				variant="danger"
				tooltipText="Remover recomendação"
				onClick={onRemover}
			/>
		</div>
	)
}
