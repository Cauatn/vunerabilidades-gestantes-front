import {
	createQuestionnaireVersion,
	publishQuestionnaireVersion,
	removeQuestion,
	upsertBand,
	upsertBandRecommendation,
	upsertQuestion,
} from '@/features/instrumentos/services/questionnaires'
import type { GrauConfig } from '@/features/instrumentos/types/escala'
import type { PerguntaConfig, SecaoConfig } from '@/features/instrumentos/types/questionario'
import type {
	QuestionnaireVersion,
	UpsertQuestionPayload,
	VulnerabilityBand,
} from '@/features/instrumentos/types/questionnaire'
import { tipoConfigParaBackend } from '@/features/instrumentos/utils/questionarioMapper'

export class PublicacaoInvalidaError extends Error {}

function normalizar(texto: string) {
	return texto
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.trim()
}

function opcoesPayload(pergunta: PerguntaConfig) {
	return pergunta.opcoes
		.filter((opcao) => opcao.texto.trim())
		.map((opcao, index) => ({
			label: opcao.texto.trim(),
			score: opcao.pontuavel ? (opcao.pontuacao ?? 0) : 0,
			order: index,
		}))
}

function todasPerguntas(secoes: SecaoConfig[]): PerguntaConfig[] {
	return secoes.flatMap((secao) => [
		...secao.perguntas,
		...secao.perguntas.flatMap((pergunta) => pergunta.subPerguntas ?? []),
	])
}

function validar(secoes: SecaoConfig[]) {
	for (const secao of secoes) {
		if (!secao.nome.trim()) throw new PublicacaoInvalidaError('Toda seção precisa de um nome.')
	}
	for (const pergunta of todasPerguntas(secoes)) {
		const rotulo = pergunta.enunciado.trim() || 'sem enunciado'
		if (pergunta.tipo === 'numerica') {
			throw new PublicacaoInvalidaError(
				`A pergunta "${rotulo}" é numérica — o backend só aceita múltipla escolha e sim/não.`,
			)
		}
		if (!pergunta.enunciado.trim()) {
			throw new PublicacaoInvalidaError('Toda pergunta precisa de um enunciado.')
		}
		const validas = opcoesPayload(pergunta)
		if (validas.length < 2) {
			throw new PublicacaoInvalidaError(`A pergunta "${rotulo}" precisa de ao menos duas opções.`)
		}
		if (tipoConfigParaBackend(pergunta.tipo) === 'YES_NO' && validas.length !== 2) {
			throw new PublicacaoInvalidaError(
				`A pergunta dicotômica "${rotulo}" precisa de exatamente duas opções.`,
			)
		}
	}
}

function mapearPorPosicao<T extends { id: string }>(
	origem: T[] | undefined,
	destino: T[] | undefined,
): Map<string, string> {
	const mapa = new Map<string, string>()
	if (!origem || !destino) return mapa
	origem.forEach((item, index) => {
		const par = destino[index]
		if (par) mapa.set(item.id, par.id)
	})
	return mapa
}

function idRecemCriado<T extends { id: string }>(antes: Set<string>, atuais: T[]): string {
	const novo = atuais.find((item) => !antes.has(item.id))
	if (!novo) throw new Error('Não foi possível identificar o item recém-criado no rascunho.')
	return novo.id
}

export async function publicarQuestionario(
	secoes: SecaoConfig[],
	graus: GrauConfig[],
	versaoVigente: QuestionnaireVersion | undefined,
): Promise<QuestionnaireVersion> {
	validar(secoes)

	const { data: rascunho } = await createQuestionnaireVersion(
		versaoVigente
			? { cloneFromVersionId: versaoVigente.id, reuseOpenDraft: true }
			: { reuseOpenDraft: true },
	)
	const versionId = rascunho.id

	const perguntaIdMap = mapearPorPosicao(versaoVigente?.questions, rascunho.questions)
	const faixaIdMap = mapearPorPosicao(versaoVigente?.vulnerabilityBands, rascunho.vulnerabilityBands)

	let version = rascunho

	const idsEditor = new Set(todasPerguntas(secoes).map((pergunta) => pergunta.id))
	for (const [editorId, rascunhoId] of perguntaIdMap) {
		if (!idsEditor.has(editorId)) await removeQuestion(versionId, rascunhoId)
	}

	let ordem = 0
	const paiInfo = new Map<string, { backendId: string; simOptionId: string }>()

	for (const secao of secoes) {
		for (const pergunta of secao.perguntas) {
			const rascunhoId = perguntaIdMap.get(pergunta.id)
			const antes = new Set(version.questions.map((q) => q.id))
			const payload: UpsertQuestionPayload = {
				...(rascunhoId ? { questionId: rascunhoId } : {}),
				section: secao.nome.trim(),
				statement: pergunta.enunciado.trim(),
				type: tipoConfigParaBackend(pergunta.tipo),
				order: ordem++,
				required: true,
				options: opcoesPayload(pergunta),
			}
			version = (await upsertQuestion(versionId, payload)).data
			const backendId = rascunhoId ?? idRecemCriado(antes, version.questions)
			const criada = version.questions.find((q) => q.id === backendId)
			const sim =
				criada?.options.find((opcao) => normalizar(opcao.label) === 'sim') ?? criada?.options[0]
			if (sim) paiInfo.set(pergunta.id, { backendId, simOptionId: sim.id })
		}
	}

	for (const secao of secoes) {
		for (const pergunta of secao.perguntas) {
			const pai = paiInfo.get(pergunta.id)
			if (!pai) continue
			for (const sub of pergunta.subPerguntas ?? []) {
				const rascunhoId = perguntaIdMap.get(sub.id)
				const payload: UpsertQuestionPayload = {
					...(rascunhoId ? { questionId: rascunhoId } : {}),
					section: secao.nome.trim(),
					statement: sub.enunciado.trim(),
					type: tipoConfigParaBackend(sub.tipo),
					order: ordem++,
					required: false,
					visibleWhenQuestionId: pai.backendId,
					visibleWhenOptionId: pai.simOptionId,
					options: opcoesPayload(sub),
				}
				version = (await upsertQuestion(versionId, payload)).data
			}
		}
	}

	const grausOrdenados = [...graus].sort((a, b) => a.min - b.min)
	for (let indice = 0; indice < grausOrdenados.length; indice++) {
		const grau = grausOrdenados[indice]
		const rascunhoId = faixaIdMap.get(grau.id)
		const antes = new Set(version.vulnerabilityBands.map((banda) => banda.id))
		version = (
			await upsertBand(versionId, {
				...(rascunhoId ? { bandId: rascunhoId } : {}),
				level: grau.nome.trim(),
				minScore: grau.min,
				maxScore: grau.max,
				order: indice,
			})
		).data
		const bandId = rascunhoId ?? idRecemCriado(antes, version.vulnerabilityBands)

		const vigenteFaixa: VulnerabilityBand | undefined = versaoVigente?.vulnerabilityBands.find(
			(banda) => banda.id === grau.id,
		)
		const rascunhoFaixa = rascunho.vulnerabilityBands.find((banda) => banda.id === bandId)
		const recIdMap = mapearPorPosicao(vigenteFaixa?.recommendations, rascunhoFaixa?.recommendations)

		let ordemRec = 0
		for (const recomendacao of grau.recomendacoes) {
			if (!recomendacao.texto.trim()) continue
			const recId = recIdMap.get(recomendacao.id)
			version = (
				await upsertBandRecommendation(versionId, bandId, {
					...(recId ? { recommendationId: recId } : {}),
					text: recomendacao.texto.trim(),
					order: ordemRec++,
				})
			).data
		}
	}

	return (await publishQuestionnaireVersion(versionId, {})).data
}
