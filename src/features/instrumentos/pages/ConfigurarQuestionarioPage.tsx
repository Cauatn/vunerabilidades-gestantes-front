import {
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { isAxiosError } from 'axios'
import { CircleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ConfirmacaoModal } from '@/features/instrumentos/components/ConfirmacaoModal'
import { DashedAddButton } from '@/features/instrumentos/components/DashedAddButton'
import { InstrumentoLayout } from '@/features/instrumentos/components/InstrumentoLayout'
import { PerguntaCard } from '@/features/instrumentos/components/PerguntaCard'
import { SecaoTabs } from '@/features/instrumentos/components/SecaoTabs'
import { SortableItem } from '@/features/instrumentos/components/SortableItem'
import { useGetQuestionarioAtivo } from '@/features/instrumentos/composables/useGetQuestionarioAtivo'
import { usePublicarQuestionario } from '@/features/instrumentos/composables/usePublicarQuestionario'
import { useQuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import { PublicacaoInvalidaError } from '@/features/instrumentos/utils/publicarQuestionario'
import { versaoParaGraus, versaoParaSecoes } from '@/features/instrumentos/utils/questionarioMapper'

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

function mensagemErro(erro: unknown): string {
	if (erro instanceof PublicacaoInvalidaError) return erro.message
	if (isAxiosError(erro)) {
		const corpo = erro.response?.data as { message?: string | string[] } | undefined
		const msg = Array.isArray(corpo?.message) ? corpo?.message.join(' ') : corpo?.message
		return msg || 'Não foi possível publicar a nova versão.'
	}
	return 'Não foi possível publicar a nova versão.'
}

export function ConfigurarQuestionarioPage() {
	const navigate = useNavigate()
	const { data: ativo, isLoading } = useGetQuestionarioAtivo()

	const secoesIniciais = useMemo(() => (ativo ? versaoParaSecoes(ativo) : undefined), [ativo])
	const grausVigentes = useMemo(() => (ativo ? versaoParaGraus(ativo) : []), [ativo])
	const config = useQuestionarioConfig(secoesIniciais)

	const [remocao, setRemocao] = useState<Remocao | null>(null)
	const [publicarAberto, setPublicarAberto] = useState(false)
	const [descartarAberto, setDescartarAberto] = useState(false)
	const [erroPublicacao, setErroPublicacao] = useState<string | null>(null)

	const publicar = usePublicarQuestionario({
		onSuccess: () => {
			setPublicarAberto(false)
			navigate('/')
		},
	})

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const perguntas = config.secaoAtiva?.perguntas ?? []
	const perguntasIds = perguntas.map((pergunta) => pergunta.id)

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id) return
		config.reordenarPerguntas(String(active.id), String(over.id))
	}

	function handlePublicar() {
		setErroPublicacao(null)
		publicar.mutate(
			{ secoes: config.secoes, graus: grausVigentes, versaoVigente: ativo },
			{
				onError: (erro) => {
					setPublicarAberto(false)
					setErroPublicacao(mensagemErro(erro))
				},
			},
		)
	}

	return (
		<InstrumentoLayout
			versao={
				ativo
					? `Versão atual v${ativo.versionNumber}`
					: isLoading
						? 'Carregando…'
						: 'Nenhuma versão publicada'
			}
			titulo="Configurar questionário"
			descricao="Configure as seções e perguntas do formulário para disponibilizar novas versões."
			onCancelar={() => setDescartarAberto(true)}
			onPublicar={() => setPublicarAberto(true)}
			publicarDisabled={publicar.isPending || config.secoes.length === 0}
		>
			{erroPublicacao ? (
				<div className="flex items-start gap-2 rounded-lg border border-danger bg-r-100 px-5 py-4 text-sm text-r-600">
					<CircleAlert className="mt-0.5 size-5 shrink-0" />
					<span>{erroPublicacao}</span>
				</div>
			) : null}

			<SecaoTabs config={config} onRemoverSecao={(id) => setRemocao({ tipo: 'secao', id })} />

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
				confirmarLabel={publicar.isPending ? 'Publicando…' : 'Publicar'}
				onConfirmar={handlePublicar}
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
