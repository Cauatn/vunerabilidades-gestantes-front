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
import { InstrumentoLayout } from '@/features/instrumentos/components/InstrumentoLayout'
import { PerguntaCard } from '@/features/instrumentos/components/PerguntaCard'
import { SecaoTabs } from '@/features/instrumentos/components/SecaoTabs'
import { SortableItem } from '@/features/instrumentos/components/SortableItem'
import { useInstrumentoDraft } from '@/features/instrumentos/composables/useInstrumentoDraft'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { toast } from 'sonner'

type Remocao = {
	tipo: 'secao' | 'pergunta' | 'opcao'
	id: string
	perguntaId?: string
}

const DESCRICAO_REMOCAO: Record<Remocao['tipo'], string> = {
	secao:
		'Ao clicar em remover você estará removendo a seção e todas as perguntas contidas nela. Essa ação não pode ser desfeita.',
	pergunta:
		'Ao clicar em remover você estará removendo uma pergunta inteira do formulário. Essa ação não pode ser desfeita.',
	opcao:
		'Ao clicar em remover você estará removendo uma opção de resposta da pergunta. Essa ação não pode ser desfeita.',
}

const TITULO_REMOCAO: Record<Remocao['tipo'], string> = {
	secao: 'Remover seção',
	pergunta: 'Remover pergunta',
	opcao: 'Remover opção de resposta',
}

export function ConfigurarQuestionarioPage() {
	const navigate = useNavigate()
	const { config, publicar, publicando, rascunhoPronto, erroCarregamento, versionNumber } = useInstrumentoDraft()

	const [remocao, setRemocao] = useState<Remocao | null>(null)
	const [publicarAberto, setPublicarAberto] = useState(false)
	const [descartarAberto, setDescartarAberto] = useState(false)

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const perguntas = config.secaoAtiva?.perguntas ?? []
	const perguntasIds = perguntas.map((pergunta) => pergunta.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reordenarPerguntas(String(active.id), String(over.id))
	}

	function handlePublicar() {
		if (publicando) return
		setPublicarAberto(false)
		publicar({
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
		<InstrumentoLayout
			versao={versionNumber ? `Versão atual v${versionNumber}` : 'Sem versão publicada'}
			titulo="Configurar questionário"
			descricao="Configure as seções e perguntas do formulário para disponibilizar novas versões."
			onCancelar={() => setDescartarAberto(true)}
			onPublicar={() => setPublicarAberto(true)}
			publicarDisabled={publicando || !rascunhoPronto}
		>
			{erroCarregamento ? (
				<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
					{apiErrorMessage(erroCarregamento, 'Não foi possível carregar o questionário vigente. Recarregue a página antes de publicar.')}
				</p>
			) : null}
			<SecaoTabs
				config={config}
				onRemoverSecao={(id) => setRemocao({ tipo: 'secao', id })}
			/>

			<div className="flex flex-col gap-3">
				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={perguntasIds} strategy={verticalListSortingStrategy}>
						{perguntas.map((p) => (
							<SortableItem key={p.id} id={p.id}>
								{(h) => (
									<PerguntaCard
										pergunta={p}
										config={config}
										dragHandle={h}
										onRemoverPergunta={(id) => setRemocao({ tipo: 'pergunta', id })}
										onRemoverOpcao={(perguntaId, opcaoId) =>
											setRemocao({ tipo: 'opcao', id: opcaoId, perguntaId })
										}
									/>
								)}
							</SortableItem>
						))}
					</SortableContext>
				</DndContext>
			</div>

			<DashedAddButton label="Adicionar item" onClick={config.addPergunta} />

			<Modal
				open={!!remocao}
				onOpenChange={(o) => !o && setRemocao(null)}
				variant="danger"
				title={remocao ? TITULO_REMOCAO[remocao.tipo] : ''}
				description={remocao ? DESCRICAO_REMOCAO[remocao.tipo] : ''}
				confirmLabel="Remover"
				onConfirm={() => {
					if (!remocao) return
					if (remocao.tipo === 'secao') {
						config.removeSecao(remocao.id)
						toast.success('Seção removida com sucesso.')
					} else if (remocao.tipo === 'pergunta') {
						config.removePergunta(remocao.id)
						toast.success('Pergunta removida com sucesso.')
					} else if (remocao.perguntaId) {
						config.removeOpcao(remocao.perguntaId, remocao.id)
						toast.success('Opção de resposta removida com sucesso.')
					}
					setRemocao(null)
				}}
			/>

			<Modal
				open={publicarAberto}
				onOpenChange={setPublicarAberto}
				variant="warning"
				title="Publicar nova versão"
				description="Ao publicar as alterações, uma nova versão do questionário será disponibilizada. As respostas já registradas não serão afetadas."
				confirmLabel="Publicar"
				onConfirm={handlePublicar}
			/>

			<Modal
				open={descartarAberto}
				onOpenChange={setDescartarAberto}
				variant="warning"
				title="Descarte de alterações"
				description="Ao continuar, todas as alterações feitas neste questionário serão descartadas e não poderão ser recuperadas."
				confirmLabel="Continuar"
				onConfirm={() => {
					setDescartarAberto(false)
					navigate('/')
				}}
			/>
		</InstrumentoLayout>
	)
}
