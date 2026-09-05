import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConfirmacaoModal } from '@/features/instrumentos/components/ConfirmacaoModal'
import { DashedAddButton } from '@/features/instrumentos/components/DashedAddButton'
import { InstrumentoLayout } from '@/features/instrumentos/components/InstrumentoLayout'
import { PerguntaCard } from '@/features/instrumentos/components/PerguntaCard'
import { SecaoTabs } from '@/features/instrumentos/components/SecaoTabs'
import { SortableItem } from '@/features/instrumentos/components/SortableItem'
import { useQuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import { usePublishQuestionario } from '@/features/instrumentos/composables/usePublishQuestionario'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { getActiveQuestionnaire } from '@/features/instrumentos/services/questionario'
import { toSections } from '@/features/instrumentos/utils/questionarioMapper'

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
	const config = useQuestionarioConfig()
	const publicar = usePublishQuestionario()
	const [carregado, setCarregado] = useState(false)

	const [remocao, setRemocao] = useState<Remocao | null>(null)
	const [publicarAberto, setPublicarAberto] = useState(false)
	const [descartarAberto, setDescartarAberto] = useState(false)

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const perguntas = config.secaoAtiva?.perguntas ?? []
	const perguntasIds = perguntas.map((pergunta) => pergunta.id)

	useEffect(() => {
		if (carregado) return
		void getActiveQuestionnaire()
			.then(({ data }) => config.substituirSecoes(toSections(data)))
			.finally(() => setCarregado(true))
	}, [carregado, config])

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reordenarPerguntas(String(active.id), String(over.id))
	}

	return (
		<InstrumentoLayout
			versao="Versão atual v1.1.0"
			titulo="Configurar questionário"
			descricao="Configure as seções e perguntas do formulário para disponibilizar novas versões."
			onCancelar={() => setDescartarAberto(true)}
			onPublicar={() => setPublicarAberto(true)}
			publicarDisabled={publicar.isPending}
		>
			{publicar.isError ? (
				<p className="rounded-md bg-r-100 px-4 py-3 text-sm text-r-500">
					{apiErrorMessage(publicar.error, 'Não foi possível publicar o questionário.')}
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

			<ConfirmacaoModal
				open={!!remocao}
				onOpenChange={(o) => !o && setRemocao(null)}
				tom="danger"
				titulo={remocao ? TITULO_REMOCAO[remocao.tipo] : ''}
				descricao={remocao ? DESCRICAO_REMOCAO[remocao.tipo] : ''}
				confirmarLabel="Remover"
				onConfirmar={() => {
					if (!remocao) return
					if (remocao.tipo === 'secao') config.removeSecao(remocao.id)
					else if (remocao.tipo === 'pergunta') config.removePergunta(remocao.id)
					else if (remocao.perguntaId) config.removeOpcao(remocao.perguntaId, remocao.id)
					setRemocao(null)
				}}
			/>

			<ConfirmacaoModal
				open={publicarAberto}
				onOpenChange={setPublicarAberto}
				tom="warning"
				titulo="Publicar nova versão"
				descricao="Ao publicar as alterações, uma nova versão do questionário será disponibilizada. As respostas já registradas não serão afetadas."
			confirmarLabel="Publicar"
			onConfirmar={() => {
					if (publicar.isPending) return
					setPublicarAberto(false)
					publicar.mutate(config.secoes)
				}}
			/>

			<ConfirmacaoModal
				open={descartarAberto}
				onOpenChange={setDescartarAberto}
				tom="warning"
				titulo="Descarte de alterações"
				descricao="Ao continuar, todas as alterações feitas neste questionário serão descartadas e não poderão ser recuperadas."
				confirmarLabel="Continuar"
				onConfirmar={() => {
					setDescartarAberto(false)
					navigate('/')
				}}
			/>
		</InstrumentoLayout>
	)
}
