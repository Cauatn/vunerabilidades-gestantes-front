import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GripVertical, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Divider } from '@/components/ui/divider'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { QuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import { DashedAddButton } from '@/features/instrumentos/components/DashedAddButton'
import { FieldLabel } from '@/features/instrumentos/components/FieldLabel'
import { SortableItem, type DragHandle } from '@/features/instrumentos/components/SortableItem'
import {
	TIPO_COM_CONDICIONAL,
	TIPO_PERGUNTA_LABEL,
	TIPO_PERGUNTA_OPCOES,
} from '@/features/instrumentos/constants'
import type { PerguntaConfig, TipoPergunta } from '@/features/instrumentos/types/questionario'

import { OpcaoRespostaRow } from './OpcaoRespostaRow'

interface PerguntaCardProps {
	pergunta: PerguntaConfig
	config: QuestionarioConfig
	condicional?: boolean
	dragHandle?: DragHandle
	onRemoverPergunta: (id: string) => void
	onRemoverOpcao: (perguntaId: string, opcaoId: string) => void
}

export function PerguntaCard({
	pergunta,
	config,
	condicional,
	dragHandle,
	onRemoverPergunta,
	onRemoverOpcao,
}: PerguntaCardProps) {
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const opcoesIds = pergunta.opcoes.map((opcao) => opcao.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reordenarOpcoes(pergunta.id, String(active.id), String(over.id))
	}

	const codigoId = `pergunta-${pergunta.id}-codigo`

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
					<span className="text-sm text-n-500">{pergunta.codigo || '—'}</span>
					<span className="line-clamp-1 text-sm text-n-900">
						{pergunta.enunciado || 'Nova pergunta'}
					</span>
				</div>

				<div className="flex items-center gap-3">
					{condicional ? <Badge variant="orange">Condicional</Badge> : null}
					<Badge variant="blue">{TIPO_PERGUNTA_LABEL[pergunta.tipo]}</Badge>
					<IconButton
						icon={Trash2}
						variant="danger"
						tooltipText="Remover pergunta"
						onClick={() => onRemoverPergunta(pergunta.id)}
					/>
				</div>
			</div>

			<div className="flex flex-col gap-2.5 p-4">
				<Divider text="Dados da pergunta" />

				<div className="flex items-end gap-3">
					<div>
						<FieldLabel required htmlFor={codigoId}>
							Código da pergunta
						</FieldLabel>
						<Input
							id={codigoId}
							className="w-[150px]"
							value={pergunta.codigo}
							onChange={(e) =>
								config.atualizarCampos(pergunta.id, { codigo: e.target.value })
							}
						/>
					</div>
					<div className="flex-1">
						<FieldLabel required>Enunciado</FieldLabel>
						<Input
							value={pergunta.enunciado}
							onChange={(e) =>
								config.atualizarCampos(pergunta.id, { enunciado: e.target.value })
							}
						/>
					</div>
				</div>

				<div>
					<FieldLabel required>Tipo da pergunta</FieldLabel>
					<Select
						value={pergunta.tipo}
						onValueChange={(v) =>
							config.atualizarCampos(pergunta.id, { tipo: v as TipoPergunta })
						}
					>
						<SelectTrigger className="w-full max-w-[504px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TIPO_PERGUNTA_OPCOES.map((t) => (
								<SelectItem key={t} value={t}>
									{TIPO_PERGUNTA_LABEL[t]}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<Divider text="Opções de resposta" />

				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={opcoesIds} strategy={verticalListSortingStrategy}>
						<div className="flex flex-col gap-2.5">
							{pergunta.opcoes.map((opcao) => (
								<SortableItem key={opcao.id} id={opcao.id}>
									{(h) => (
										<OpcaoRespostaRow
											perguntaId={pergunta.id}
											opcao={opcao}
											total={pergunta.opcoes.length}
											config={config}
											dragHandle={h}
											onRemover={() => onRemoverOpcao(pergunta.id, opcao.id)}
										/>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DndContext>

				<DashedAddButton
					label="Adicionar opção"
					onClick={() => config.addOpcao(pergunta.id)}
				/>

				{pergunta.tipo === TIPO_COM_CONDICIONAL ? (
					<>
						<Divider text="Se sim" />
						<div className="flex gap-3 pl-5">
							<div className="w-0.5 shrink-0 self-stretch rounded bg-o-400" />
							<div className="flex flex-1 flex-col gap-3">
								{(pergunta.subPerguntas ?? []).map((sub) => (
									<PerguntaCard
										key={sub.id}
										pergunta={sub}
										config={config}
										condicional
										onRemoverPergunta={onRemoverPergunta}
										onRemoverOpcao={onRemoverOpcao}
									/>
								))}
								<DashedAddButton
									tone="orange"
									label="Adicionar pergunta"
									onClick={() => config.addSubPergunta(pergunta.id)}
								/>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	)
}
