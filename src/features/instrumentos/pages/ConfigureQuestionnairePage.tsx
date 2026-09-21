import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Modal } from '@/features/core/components/Modal'
import { DashedAddButton } from '@/features/instrumentos/components/DashedAddButton'
import { InstrumentLayout } from '@/features/instrumentos/components/InstrumentLayout'
import { QuestionCard } from '@/features/instrumentos/components/QuestionCard'
import { SectionTabs } from '@/features/instrumentos/components/SectionTabs'
import { SortableItem } from '@/features/instrumentos/components/SortableItem'
import { useInstrumentDraft } from '@/features/instrumentos/composables/useInstrumentDraft'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { toast } from 'sonner'

type RemovalTarget = {
	tipo: 'secao' | 'pergunta' | 'opcao'
	id: string
	questionId?: string
}

const REMOVAL_DESCRIPTION: Record<RemovalTarget['tipo'], string> = {
	secao: 'Ao clicar em remover você estará removendo a seção e todas as perguntas contidas nela. Essa ação não pode ser desfeita.',
	pergunta:
		'Ao clicar em remover você estará removendo uma pergunta inteira do formulário. Essa ação não pode ser desfeita.',
	opcao: 'Ao clicar em remover você estará removendo uma opção de resposta da pergunta. Essa ação não pode ser desfeita.',
}

const REMOVAL_TITLE: Record<RemovalTarget['tipo'], string> = {
	secao: 'Remover seção',
	pergunta: 'Remover pergunta',
	opcao: 'Remover opção de resposta',
}

export function ConfigureQuestionnairePage() {
	const navigate = useNavigate()
	const {
		config,
		publish,
		publishing,
		draftReady,
		loadError,
		versionNumber,
	} = useInstrumentDraft()

	const [removalTarget, setRemovalTarget] = useState<RemovalTarget | null>(
		null,
	)
	const [publishModalOpen, setPublishModalOpen] = useState(false)
	const [discardModalOpen, setDiscardModalOpen] = useState(false)

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	)
	const questions = config.activeSection?.questions ?? []
	const questionIds = questions.map((question) => question.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reorderQuestions(String(active.id), String(over.id))
	}

	function handlePublish() {
		if (publishing) return
		setPublishModalOpen(false)
		publish({
			onSuccess: () => {
				toast.success('Questionário publicado com sucesso.')
			},
			onError: (error) => {
				toast.error('Houve um erro ao publicar o questionário', {
					description: apiErrorMessage(
						error,
						'Por favor tente novamente. Se o erro persistir, entre em contato com o suporte.',
					),
				})
			},
		})
	}

	return (
		<InstrumentLayout
			version={
				versionNumber
					? `Versão atual v${versionNumber}`
					: 'Sem versão publicada'
			}
			title="Configurar questionário"
			description="Configure as seções e perguntas do formulário para disponibilizar novas versões."
			onCancel={() => setDiscardModalOpen(true)}
			onPublish={() => setPublishModalOpen(true)}
			publishDisabled={publishing || !draftReady}
		>
			{loadError ? (
				<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
					{apiErrorMessage(
						loadError,
						'Não foi possível carregar o questionário vigente. Recarregue a página antes de publicar.',
					)}
				</p>
			) : null}
			<SectionTabs
				config={config}
				onRemoveSection={(id) =>
					setRemovalTarget({ tipo: 'secao', id })
				}
			/>

			<div className="flex flex-col gap-3">
				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext
						items={questionIds}
						strategy={verticalListSortingStrategy}
					>
						{questions.map((p) => (
							<SortableItem key={p.id} id={p.id}>
								{(h) => (
									<QuestionCard
										question={p}
										config={config}
										dragHandle={h}
										onRemoveQuestion={(id) =>
											setRemovalTarget({
												tipo: 'pergunta',
												id,
											})
										}
										onRemoveOption={(
											questionId,
											optionId,
										) =>
											setRemovalTarget({
												tipo: 'opcao',
												id: optionId,
												questionId,
											})
										}
									/>
								)}
							</SortableItem>
						))}
					</SortableContext>
				</DndContext>
			</div>

			<DashedAddButton
				label="Adicionar item"
				onClick={config.addQuestion}
			/>

			<Modal
				open={!!removalTarget}
				onOpenChange={(o) => !o && setRemovalTarget(null)}
				variant="danger"
				title={removalTarget ? REMOVAL_TITLE[removalTarget.tipo] : ''}
				description={
					removalTarget ? REMOVAL_DESCRIPTION[removalTarget.tipo] : ''
				}
				confirmLabel="Remover"
				onConfirm={() => {
					if (!removalTarget) return
					if (removalTarget.tipo === 'secao') {
						config.removeSection(removalTarget.id)
						toast.success('Seção removida com sucesso.')
					} else if (removalTarget.tipo === 'pergunta') {
						config.removeQuestion(removalTarget.id)
						toast.success('Pergunta removida com sucesso.')
					} else if (removalTarget.questionId) {
						config.removeOption(
							removalTarget.questionId,
							removalTarget.id,
						)
						toast.success('Opção de resposta removida com sucesso.')
					}
					setRemovalTarget(null)
				}}
			/>

			<Modal
				open={publishModalOpen}
				onOpenChange={setPublishModalOpen}
				variant="warning"
				title="Publicar nova versão"
				description="Ao publicar as alterações, uma nova versão do questionário será disponibilizada. As respostas já registradas não serão afetadas."
				confirmLabel="Publicar"
				onConfirm={handlePublish}
			/>

			<Modal
				open={discardModalOpen}
				onOpenChange={setDiscardModalOpen}
				variant="warning"
				title="Descarte de alterações"
				description="Ao continuar, todas as alterações feitas neste questionário serão descartadas e não poderão ser recuperadas."
				confirmLabel="Continuar"
				onConfirm={() => {
					setDiscardModalOpen(false)
					navigate('/')
				}}
			/>
		</InstrumentLayout>
	)
}
