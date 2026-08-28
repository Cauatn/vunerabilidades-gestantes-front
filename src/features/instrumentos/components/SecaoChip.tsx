import { GripHorizontal, X } from 'lucide-react'

import type { QuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import type { DragHandle } from '@/features/instrumentos/components/SortableItem'
import type { SecaoConfig } from '@/features/instrumentos/types/questionario'
import { cn } from '@/lib/utils'

interface SecaoChipProps {
	secao: SecaoConfig
	numero: number
	ativa: boolean
	podeRemover: boolean
	config: QuestionarioConfig
	dragHandle: DragHandle
	onRemover: () => void
}

export function SecaoChip({
	secao,
	numero,
	ativa,
	podeRemover,
	config,
	dragHandle,
	onRemover,
}: SecaoChipProps) {
	return (
		<div
			className={cn(
				'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm',
				ativa
					? 'border-(--color-t-300) bg-t-100 font-semibold text-t-600'
					: 'border-n-40 text-n-700',
			)}
		>
			<button
				type="button"
				className="cursor-grab active:cursor-grabbing"
				{...dragHandle.attributes}
				{...dragHandle.listeners}
			>
				<GripHorizontal className="size-4 opacity-60" />
			</button>

			<span className="opacity-60">{numero}.</span>

			{ativa ? (
				<>
					<input
						value={secao.nome}
						onChange={(e) => config.renomearSecao(secao.id, e.target.value)}
						className="w-[220px] max-w-[38vw] bg-transparent font-semibold outline-none"
					/>
					{podeRemover ? (
						<button
							type="button"
							aria-label="Remover seção"
							onClick={onRemover}
							className="opacity-70 hover:opacity-100"
						>
							<X className="size-3.5" />
						</button>
					) : null}
				</>
			) : (
				<button type="button" onClick={() => config.selecionarSecao(secao.id)}>
					{secao.nome || 'Sem nome'}
				</button>
			)}
		</div>
	)
}
