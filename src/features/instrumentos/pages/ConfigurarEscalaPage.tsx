import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { isAxiosError } from 'axios'
import { CircleAlert, Info, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'

import { ConfirmacaoModal } from '../components/ConfirmacaoModal'
import { DashedAddButton } from '../components/DashedAddButton'
import { FaixasEscalaBar } from '../components/FaixasEscalaBar'
import { GrauVulnerabilidadeCard } from '../components/GrauVulnerabilidadeCard'
import { InstrumentoLayout } from '../components/InstrumentoLayout'
import { LimitesRange } from '../components/LimitesRange'
import { SortableItem } from '../components/SortableItem'
import { useEscalaConfig } from '../composables/useEscalaConfig'
import { useGetQuestionarioAtivo } from '../composables/useGetQuestionarioAtivo'
import { usePublicarQuestionario } from '../composables/usePublicarQuestionario'
import { PublicacaoInvalidaError } from '../utils/publicarQuestionario'
import { pontuacaoMaxima, versaoParaGraus, versaoParaSecoes } from '../utils/questionarioMapper'

type Remocao = { tipo: 'grau' | 'recomendacao'; grauId: string; recId?: string }

function mensagemErro(erro: unknown): string {
	if (erro instanceof PublicacaoInvalidaError) return erro.message
	if (isAxiosError(erro)) {
		const corpo = erro.response?.data as { message?: string | string[] } | undefined
		const msg = Array.isArray(corpo?.message) ? corpo?.message.join(' ') : corpo?.message
		return msg || 'Não foi possível publicar a nova versão.'
	}
	return 'Não foi possível publicar a nova versão.'
}

export function ConfigurarEscalaPage() {
	const navigate = useNavigate()
	const { data: ativo, isLoading } = useGetQuestionarioAtivo()

	const secoesVigentes = useMemo(() => (ativo ? versaoParaSecoes(ativo) : []), [ativo])
	const pontuacaoSugerida = useMemo(() => pontuacaoMaxima(secoesVigentes), [secoesVigentes])
	const escalaInicial = useMemo(
		() => (ativo ? { graus: versaoParaGraus(ativo), max: pontuacaoSugerida } : undefined),
		[ativo, pontuacaoSugerida],
	)
	const config = useEscalaConfig(escalaInicial)

	const [avisoVisivel, setAvisoVisivel] = useState(true)
	const [remocao, setRemocao] = useState<Remocao | null>(null)
	const [publicarAberto, setPublicarAberto] = useState(false)
	const [descartarAberto, setDescartarAberto] = useState(false)
	const [erroPublicacao, setErroPublicacao] = useState<string | null>(null)

	const publicar = usePublicarQuestionario({
		onSuccess: () => {
			setPublicarAberto(false)
			navigate('/configuracao')
		},
	})

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))
	const grausIds = config.graus.map((g) => g.id)
	const temErro = config.validacao.gerais.length > 0

	function handleDragEnd(e: DragEndEvent) {
		const { active, over } = e
		if (!over || active.id === over.id) return
		config.reordenarGraus(String(active.id), String(over.id))
	}

	function handlePublicar() {
		setErroPublicacao(null)
		publicar.mutate(
			{ secoes: secoesVigentes, graus: config.graus, versaoVigente: ativo },
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
			titulo="Configurar escala"
			descricao="Defina os intervalos de pontuação de cada grau de vulnerabilidade e as recomendações associadas."
			onCancelar={() => setDescartarAberto(true)}
			onPublicar={() => setPublicarAberto(true)}
			publicarDisabled={temErro || publicar.isPending || config.graus.length === 0}
		>
			{erroPublicacao ? (
				<div className="flex items-start gap-2 rounded-lg border border-danger bg-r-100 px-5 py-4 text-sm text-r-600">
					<CircleAlert className="mt-0.5 size-5 shrink-0" />
					<span>{erroPublicacao}</span>
				</div>
			) : null}

			{temErro ? (
				<div className="flex items-start gap-2 rounded-lg border border-danger bg-r-100 px-5 py-4 text-sm text-r-600">
					<CircleAlert className="mt-0.5 size-5 shrink-0" />
					<ul className="space-y-1">
						{config.validacao.gerais.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				</div>
			) : null}

			<div className="flex flex-col gap-3">
				<Divider text="Limites da escala" />

				{avisoVisivel ? (
					<div className="flex items-center justify-between gap-3 rounded-lg border border-(--color-b-200) bg-b-100 px-5 py-4">
						<div className="flex items-center gap-2 text-sm font-medium text-b-400">
							<Info className="size-5 shrink-0" />
							<span>
								A versão mais atual do formulário soma {pontuacaoSugerida} pontos. Se a escala
								definir um teto diferente, pontuações fora dele ficarão sem grau.
							</span>
						</div>
						<button type="button" aria-label="Fechar aviso" onClick={() => setAvisoVisivel(false)}>
							<X className="size-4 text-b-400" />
						</button>
					</div>
				) : null}

				<div className="flex items-end gap-2.5">
					<div className="flex-1">
						<LimitesRange
							min={config.limites.min}
							max={config.limites.max}
							onMinChange={(v) => config.atualizarLimite('min', v)}
							onMaxChange={(v) => config.atualizarLimite('max', v)}
							idPrefix="escala"
						/>
					</div>
					<Button type="button" onClick={() => config.usarPontuacaoSugerida(pontuacaoSugerida)}>
						Usar pontuação sugerida
					</Button>
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<Divider text="Graus de vulnerabilidade" />

				<FaixasEscalaBar graus={config.graus} min={config.limites.min} max={config.limites.max} />

				<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
					<SortableContext items={grausIds} strategy={verticalListSortingStrategy}>
						<div className="flex flex-col gap-3">
							{config.graus.map((g) => (
								<SortableItem key={g.id} id={g.id}>
									{(h) => (
										<GrauVulnerabilidadeCard
											grau={g}
											config={config}
											erro={config.validacao.porGrau[g.id]}
											dragHandle={h}
											onRemover={() => setRemocao({ tipo: 'grau', grauId: g.id })}
											onRemoverRecomendacao={(grauId, recId) =>
												setRemocao({ tipo: 'recomendacao', grauId, recId })
											}
										/>
									)}
								</SortableItem>
							))}
						</div>
					</SortableContext>
				</DndContext>

				<DashedAddButton label="Adicionar grau de vulnerabilidade" onClick={config.addGrau} />
			</div>

			<ConfirmacaoModal
				open={!!remocao}
				onOpenChange={(o) => !o && setRemocao(null)}
				tom="danger"
				titulo={remocao?.tipo === 'grau' ? 'Remover grau de vulnerabilidade' : 'Remover recomendação'}
				descricao={
					remocao?.tipo === 'grau'
						? 'Ao clicar em remover você estará removendo o grau de vulnerabilidade e todas as recomendações associadas a ele. Essa ação não pode ser desfeita.'
						: 'Ao clicar em remover você estará removendo uma recomendação sugerida deste grau. Essa ação não pode ser desfeita.'
				}
				confirmarLabel="Remover"
				onConfirmar={() => {
					if (!remocao) return
					if (remocao.tipo === 'grau') config.removeGrau(remocao.grauId)
					else if (remocao.recId) config.removeRecomendacao(remocao.grauId, remocao.recId)
					setRemocao(null)
				}}
			/>

			<ConfirmacaoModal
				open={publicarAberto}
				onOpenChange={setPublicarAberto}
				tom="warning"
				titulo="Publicar nova versão"
				descricao="Ao publicar as alterações, uma nova versão da escala será disponibilizada. As avaliações já registradas não serão afetadas."
				confirmarLabel={publicar.isPending ? 'Publicando…' : 'Publicar'}
				onConfirmar={handlePublicar}
			/>

			<ConfirmacaoModal
				open={descartarAberto}
				onOpenChange={setDescartarAberto}
				tom="warning"
				titulo="Descarte de alterações"
				descricao="Ao continuar, todas as alterações feitas nesta escala serão descartadas e não poderão ser recuperadas."
				confirmarLabel="Continuar"
				onConfirmar={() => {
					setDescartarAberto(false)
					navigate('/configuracao')
				}}
			/>
		</InstrumentoLayout>
	)
}
