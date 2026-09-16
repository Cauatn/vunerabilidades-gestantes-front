import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CircleAlert, Info, X } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'

import { Modal } from '@/features/core/components/Modal'
import { DashedAddButton } from '../components/DashedAddButton'
import { ScaleBandsBar } from '../components/ScaleBandsBar'
import { VulnerabilityLevelCard } from '../components/VulnerabilityLevelCard'
import { InstrumentLayout } from '../components/InstrumentLayout'
import { LimitsRange } from '../components/LimitsRange'
import { SortableItem } from '../components/SortableItem'
import { SUGGESTED_SCORE } from '../constants'
import { useInstrumentDraft } from '../composables/useInstrumentDraft'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { toast } from 'sonner'

type RemovalTarget = {
	tipo: 'grau' | 'recomendacao'
	levelId: string
	recommendationId?: string
}

export function ConfigureScalePage() {
	const navigate = useNavigate()
	const {
		scale: config,
		publish,
		publishing,
		draftReady,
		loadError,
		versionNumber,
	} = useInstrumentDraft()

	const [avisoVisivel, setAvisoVisivel] = useState(true)
	const [removalTarget, setRemovalTarget] = useState<RemovalTarget | null>(
		null,
	)
	const [publishModalOpen, setPublishModalOpen] = useState(false)
	const [discardModalOpen, setDiscardModalOpen] = useState(false)

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	)
	const levelIds = config.levels.map((l) => l.id)

	const hasValidationError = config.validation.general.length > 0

	function handleDragEnd(e: DragEndEvent) {
		const { active, over } = e
		if (!over || active.id === over.id) return
		config.reorderLevels(String(active.id), String(over.id))
	}

	function handlePublish() {
		if (publishing) return
		setPublishModalOpen(false)
		publish({
			onSuccess: () => {
				toast.success('Escala publicada com sucesso.')
			},
			onError: (error) => {
				toast.error('Houve um erro ao publicar a escala', {
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
			title="Configurar escala"
			description="Defina os intervalos de pontuação de cada grau de vulnerabilidade e as recomendações associadas."
			onCancel={() => setDiscardModalOpen(true)}
			onPublish={() => setPublishModalOpen(true)}
			publishDisabled={hasValidationError || publishing || !draftReady}
		>
			{hasValidationError ? (
				<div className="flex items-start gap-2 rounded-lg border border-danger bg-r-100 px-5 py-4 text-sm text-r-600">
					<CircleAlert className="mt-0.5 size-5 shrink-0" />
					<ul className="space-y-1">
						{config.validation.general.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			) : null}
			{loadError ? (
				<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
					{apiErrorMessage(
						loadError,
						'Não foi possível carregar o questionário vigente. Recarregue a página antes de publicar.',
					)}
				</p>
			) : null}

			<div className="flex flex-col gap-3">
				<Divider text="Limites da escala" />

				{avisoVisivel ? (
					<div className="flex items-center justify-between gap-3 rounded-lg border border-(--color-b-200) bg-b-100 px-5 py-4">
						<div className="flex items-center gap-2 text-sm font-medium text-b-400">
							<Info className="size-5 shrink-0" />
							<span>
								A versão mais atual do formulário soma{' '}
								{SUGGESTED_SCORE} pontos. Se a escala definir um
								teto diferente, pontuações fora dele ficarão sem
								grau.
							</span>
						</div>
						<button
							type="button"
							aria-label="Fechar aviso"
							onClick={() => setAvisoVisivel(false)}
						>
							<X className="size-4 text-b-400" />
						</button>
					</div>
				) : null}

				<div className="flex items-end gap-2.5">
					<div className="flex-1">
						<LimitsRange
							min={config.limits.min}
							max={config.limits.max}
							onMinChange={(v) => config.updateLimit('min', v)}
							onMaxChange={(v) => config.updateLimit('max', v)}
							idPrefix="escala"
						/>
					</div>
					<Button
						type="button"
						onClick={() =>
							config.useSuggestedScore(SUGGESTED_SCORE)
						}
					>
						Usar pontuação sugerida
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Divider text="Graus de vulnerabilidade" />

				<ScaleBandsBar
					levels={config.levels}
					min={config.limits.min}
					max={config.limits.max}
				/>

				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext
						items={levelIds}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex flex-col gap-3">
							{config.levels.map((l) => (
								<SortableItem key={l.id} id={l.id}>
									{(h) => (
										<VulnerabilityLevelCard
											level={l}
											config={config}
											erro={
												config.validation.byLevel[l.id]
											}
											dragHandle={h}
											onRemover={() =>
												setRemovalTarget({
													tipo: 'grau',
													levelId: l.id,
												})
											}
											onRemoveRecommendation={(
												levelId,
												recId,
											) =>
												setRemovalTarget({
													tipo: 'recomendacao',
													levelId,
													recommendationId: recId,
												})
											}
										/>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DndContext>

				<DashedAddButton
					label="Adicionar grau de vulnerabilidade"
					onClick={config.addLevel}
				/>
			</div>

			<Modal
				open={!!removalTarget}
				onOpenChange={(o) => !o && setRemovalTarget(null)}
				variant="danger"
				title={
					removalTarget?.tipo === 'grau'
						? 'Remover grau de vulnerabilidade'
						: 'Remover recomendação'
				}
				description={
					removalTarget?.tipo === 'grau'
						? 'Ao clicar em remover você estará removendo o grau de vulnerabilidade e todas as recomendações associadas a ele. Essa ação não pode ser desfeita.'
						: 'Ao clicar em remover você estará removendo uma recomendação sugerida deste grau. Essa ação não pode ser desfeita.'
				}
				onConfirm={() => {
					if (!removalTarget) return
					if (removalTarget.tipo === 'grau') {
						config.removeLevel(removalTarget.levelId)
						toast.success(
							'Grau de vulnerabilidade removido com sucesso.',
						)
					} else if (removalTarget.recommendationId) {
						config.removeRecommendation(
							removalTarget.levelId,
							removalTarget.recommendationId,
						)
						toast.success('Recomendação removida com sucesso.')
					}
					setRemovalTarget(null)
				}}
				confirmLabel="Confirmar"
			/>

			<Modal
				open={publishModalOpen}
				onOpenChange={setPublishModalOpen}
				variant="warning"
				title="Publicar nova versão"
				description="Ao publicar as alterações, uma nova versão da escala será disponibilizada. As avaliações já registradas não serão afetadas."
				confirmLabel="Publicar"
				onConfirm={handlePublish}
			/>

			<Modal
				open={discardModalOpen}
				onOpenChange={setDiscardModalOpen}
				variant="warning"
				title="Descarte de alterações"
				description="Ao continuar, todas as alterações feitas nesta escala serão descartadas e não poderão ser recuperadas."
				confirmLabel="Continuar"
				onConfirm={() => {
					setDiscardModalOpen(false)
					navigate('/configuracao')
				}}
			/>
		</InstrumentLayout>
	)
}
