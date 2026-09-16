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
import { FaixasEscalaBar } from '../components/FaixasEscalaBar'
import { GrauVulnerabilidadeCard } from '../components/GrauVulnerabilidadeCard'
import { InstrumentoLayout } from '../components/InstrumentoLayout'
import { LimitesRange } from '../components/LimitesRange'
import { SortableItem } from '../components/SortableItem'
import { PONTUACAO_SUGERIDA } from '../constants'
import { useInstrumentoDraft } from '../composables/useInstrumentoDraft'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { toast } from 'sonner'

type Remocao = { tipo: 'grau' | 'recomendacao'; grauId: string; recId?: string }

export function ConfigurarEscalaPage() {
	const navigate = useNavigate()
	const {
		escala: config,
		publicar,
		publicando,
		rascunhoPronto,
		erroCarregamento,
		versionNumber,
	} = useInstrumentoDraft()

	const [avisoVisivel, setAvisoVisivel] = useState(true)
	const [remocao, setRemocao] = useState<Remocao | null>(null)
	const [publicarAberto, setPublicarAberto] = useState(false)
	const [descartarAberto, setDescartarAberto] = useState(false)

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
	)
	const grausIds = config.graus.map((g) => g.id)

	const temErroValidacao = config.validacao.gerais.length > 0

	function handleDragEnd(e: DragEndEvent) {
		const { active, over } = e
		if (!over || active.id === over.id) return
		config.reordenarGraus(String(active.id), String(over.id))
	}

	function handlePublicar() {
		if (publicando) return
		setPublicarAberto(false)
		publicar({
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
		<InstrumentoLayout
			versao={
				versionNumber
					? `Versão atual v${versionNumber}`
					: 'Sem versão publicada'
			}
			titulo="Configurar escala"
			descricao="Defina os intervalos de pontuação de cada grau de vulnerabilidade e as recomendações associadas."
			onCancelar={() => setDescartarAberto(true)}
			onPublicar={() => setPublicarAberto(true)}
			publicarDisabled={temErroValidacao || publicando || !rascunhoPronto}
		>
			{temErroValidacao ? (
				<div className="flex items-start gap-2 rounded-lg border border-danger bg-r-100 px-5 py-4 text-sm text-r-600">
					<CircleAlert className="mt-0.5 size-5 shrink-0" />
					<ul className="space-y-1">
						{config.validacao.gerais.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			) : null}
			{erroCarregamento ? (
				<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
					{apiErrorMessage(
						erroCarregamento,
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
								{PONTUACAO_SUGERIDA} pontos. Se a escala definir
								um teto diferente, pontuações fora dele ficarão
								sem grau.
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
						<LimitesRange
							min={config.limites.min}
							max={config.limites.max}
							onMinChange={(v) =>
								config.atualizarLimite('min', v)
							}
							onMaxChange={(v) =>
								config.atualizarLimite('max', v)
							}
							idPrefix="escala"
						/>
					</div>
					<Button
						type="button"
						onClick={() =>
							config.usarPontuacaoSugerida(PONTUACAO_SUGERIDA)
						}
					>
						Usar pontuação sugerida
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Divider text="Graus de vulnerabilidade" />

				<FaixasEscalaBar
					graus={config.graus}
					min={config.limites.min}
					max={config.limites.max}
				/>

				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext
						items={grausIds}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex flex-col gap-3">
							{config.graus.map((g) => (
								<SortableItem key={g.id} id={g.id}>
									{(h) => (
										<GrauVulnerabilidadeCard
											grau={g}
											config={config}
											erro={
												config.validacao.porGrau[g.id]
											}
											dragHandle={h}
											onRemover={() =>
												setRemocao({
													tipo: 'grau',
													grauId: g.id,
												})
											}
											onRemoverRecomendacao={(
												grauId,
												recId,
											) =>
												setRemocao({
													tipo: 'recomendacao',
													grauId,
													recId,
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
					onClick={config.addGrau}
				/>
			</div>

			<Modal
				open={!!remocao}
				onOpenChange={(o) => !o && setRemocao(null)}
				variant="danger"
				title={
					remocao?.tipo === 'grau'
						? 'Remover grau de vulnerabilidade'
						: 'Remover recomendação'
				}
				description={
					remocao?.tipo === 'grau'
						? 'Ao clicar em remover você estará removendo o grau de vulnerabilidade e todas as recomendações associadas a ele. Essa ação não pode ser desfeita.'
						: 'Ao clicar em remover você estará removendo uma recomendação sugerida deste grau. Essa ação não pode ser desfeita.'
				}
				onConfirm={() => {
					if (!remocao) return
					if (remocao.tipo === 'grau') {
						config.removeGrau(remocao.grauId)
						toast.success(
							'Grau de vulnerabilidade removido com sucesso.',
						)
					} else if (remocao.recId) {
						config.removeRecomendacao(remocao.grauId, remocao.recId)
						toast.success('Recomendação removida com sucesso.')
					}
					setRemocao(null)
				}}
				confirmLabel="Confirmar"
			/>

			<Modal
				open={publicarAberto}
				onOpenChange={setPublicarAberto}
				variant="warning"
				title="Publicar nova versão"
				description="Ao publicar as alterações, uma nova versão da escala será disponibilizada. As avaliações já registradas não serão afetadas."
				confirmLabel="Publicar"
				onConfirm={handlePublicar}
			/>

			<Modal
				open={descartarAberto}
				onOpenChange={setDescartarAberto}
				variant="warning"
				title="Descarte de alterações"
				description="Ao continuar, todas as alterações feitas nesta escala serão descartadas e não poderão ser recuperadas."
				confirmLabel="Continuar"
				onConfirm={() => {
					setDescartarAberto(false)
					navigate('/configuracao')
				}}
			/>
		</InstrumentoLayout>
	)
}
