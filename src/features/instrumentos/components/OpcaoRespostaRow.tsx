import { GripVertical, Trash2 } from 'lucide-react'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import type { QuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import type { DragHandle } from '@/features/instrumentos/components/SortableItem'
import type { OpcaoResposta } from '@/features/instrumentos/types/questionario'

import { PontuavelField } from './PontuavelField'

interface OpcaoRespostaRowProps {
	perguntaId: string
	opcao: OpcaoResposta
	total: number
	config: QuestionarioConfig
	dragHandle: DragHandle
	onRemover: () => void
}

export function OpcaoRespostaRow({
	perguntaId,
	opcao,
	total,
	config,
	dragHandle,
	onRemover,
}: OpcaoRespostaRowProps) {
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
				value={opcao.texto}
				placeholder="Opção de resposta"
				onChange={(e) =>
					config.atualizarOpcao(perguntaId, opcao.id, { texto: e.target.value })
				}
			/>

			<PontuavelField
				pontuavel={opcao.pontuavel}
				pontuacao={opcao.pontuacao}
				onTogglePontuavel={(next) =>
					config.atualizarOpcao(perguntaId, opcao.id, {
						pontuavel: next,
						pontuacao: next ? opcao.pontuacao : null,
					})
				}
				onPontuacaoChange={(v) =>
					config.atualizarOpcao(perguntaId, opcao.id, { pontuacao: v })
				}
			/>

			<IconButton
				icon={Trash2}
				variant="danger"
				tooltipText="Remover opção"
				disabled={total <= 1}
				onClick={onRemover}
			/>
		</div>
	)
}
