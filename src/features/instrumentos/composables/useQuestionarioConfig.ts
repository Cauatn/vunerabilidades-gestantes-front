import { useEffect, useMemo, useState } from 'react'

import { QUESTIONARIO_INICIAL } from '../data/mock'
import type { OpcaoResposta, PerguntaConfig, SecaoConfig } from '../types/questionario'
import { reorderById } from '../utils/reorder'

const STORAGE_KEY = 'gestare:questionario-config'

function carregarSecoes(): SecaoConfig[] {
	try {
		const salvo = localStorage.getItem(STORAGE_KEY)
		if (salvo) return JSON.parse(salvo) as SecaoConfig[]
	} catch {
		// O formulário inicial continua disponível se o armazenamento não puder ser lido.
	}
	return QUESTIONARIO_INICIAL
}

function novaOpcao(): OpcaoResposta {
	return { id: crypto.randomUUID(), texto: '', pontuavel: true, pontuacao: null }
}

function novaPergunta(codigo = ''): PerguntaConfig {
	return {
		id: crypto.randomUUID(),
		codigo,
		enunciado: '',
		tipo: 'multipla',
		opcoes: [novaOpcao(), novaOpcao()],
	}
}

function atualizarPergunta(
	perguntas: PerguntaConfig[],
	id: string,
	fn: (pergunta: PerguntaConfig) => PerguntaConfig,
): PerguntaConfig[] {
	return perguntas.map((pergunta) => {
		if (pergunta.id === id) return fn(pergunta)
		if (pergunta.subPerguntas?.length) {
			return { ...pergunta, subPerguntas: atualizarPergunta(pergunta.subPerguntas, id, fn) }
		}
		return pergunta
	})
}

function removerPergunta(perguntas: PerguntaConfig[], id: string): PerguntaConfig[] {
	return perguntas
		.filter((pergunta) => pergunta.id !== id)
		.map((pergunta) =>
			pergunta.subPerguntas?.length
				? { ...pergunta, subPerguntas: removerPergunta(pergunta.subPerguntas, id) }
				: pergunta,
		)
}

export function useQuestionarioConfig() {
	const [secoes, setSecoes] = useState<SecaoConfig[]>(carregarSecoes)
	const [secaoAtivaId, setSecaoAtivaId] = useState<string>(() => carregarSecoes()[0]?.id ?? '')

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(secoes))
		} catch {
			// Não impede a edição se o navegador bloquear o armazenamento.
		}
	}, [secoes])

	const secaoAtiva = useMemo(
		() => secoes.find((secao) => secao.id === secaoAtivaId) ?? secoes[0],
		[secoes, secaoAtivaId],
	)

	function mapSecaoAtiva(fn: (secao: SecaoConfig) => SecaoConfig) {
		setSecoes((atual) => atual.map((secao) => (secao.id === secaoAtiva?.id ? fn(secao) : secao)))
	}

	function mapPerguntas(fn: (perguntas: PerguntaConfig[]) => PerguntaConfig[]) {
		mapSecaoAtiva((secao) => ({ ...secao, perguntas: fn(secao.perguntas) }))
	}

	return {
		secoes,
		secaoAtiva,
		secaoAtivaId: secaoAtiva?.id ?? '',
		selecionarSecao: setSecaoAtivaId,
		substituirSecoes(novasSecoes: SecaoConfig[]) {
			setSecoes(novasSecoes)
			setSecaoAtivaId(novasSecoes[0]?.id ?? '')
		},

		addSecao() {
			const secao: SecaoConfig = {
				id: crypto.randomUUID(),
				nome: `Nova seção ${secoes.length + 1}`,
				perguntas: [],
			}
			setSecoes((atual) => [...atual, secao])
			setSecaoAtivaId(secao.id)
		},
		removeSecao(id: string) {
			setSecoes((atual) => {
				const proximas = atual.filter((secao) => secao.id !== id)
				if (id === secaoAtivaId) setSecaoAtivaId(proximas[0]?.id ?? '')
				return proximas
			})
		},
		renomearSecao(id: string, nome: string) {
			setSecoes((atual) => atual.map((secao) => (secao.id === id ? { ...secao, nome } : secao)))
		},
		reordenarSecoes(activeId: string, overId: string) {
			setSecoes((atual) => reorderById(atual, activeId, overId))
		},

		addPergunta() {
			mapPerguntas((perguntas) => [...perguntas, novaPergunta()])
		},
		addSubPergunta(parentId: string) {
			mapPerguntas((perguntas) =>
				atualizarPergunta(perguntas, parentId, (pergunta) => ({
					...pergunta,
					subPerguntas: [...(pergunta.subPerguntas ?? []), novaPergunta()],
				})),
			)
		},
		removePergunta(id: string) {
			mapPerguntas((perguntas) => removerPergunta(perguntas, id))
		},
		atualizarCampos(id: string, patch: Partial<PerguntaConfig>) {
			mapPerguntas((perguntas) => atualizarPergunta(perguntas, id, (pergunta) => ({ ...pergunta, ...patch })))
		},
		reordenarPerguntas(activeId: string, overId: string) {
			mapPerguntas((perguntas) => reorderById(perguntas, activeId, overId))
		},

		addOpcao(perguntaId: string) {
			mapPerguntas((perguntas) =>
				atualizarPergunta(perguntas, perguntaId, (pergunta) => ({
					...pergunta,
					opcoes: [...pergunta.opcoes, novaOpcao()],
				})),
			)
		},
		removeOpcao(perguntaId: string, opcaoId: string) {
			mapPerguntas((perguntas) =>
				atualizarPergunta(perguntas, perguntaId, (pergunta) => ({
					...pergunta,
					opcoes: pergunta.opcoes.filter((opcao) => opcao.id !== opcaoId),
				})),
			)
		},
		atualizarOpcao(perguntaId: string, opcaoId: string, patch: Partial<OpcaoResposta>) {
			mapPerguntas((perguntas) =>
				atualizarPergunta(perguntas, perguntaId, (pergunta) => ({
					...pergunta,
					opcoes: pergunta.opcoes.map((opcao) =>
						opcao.id === opcaoId ? { ...opcao, ...patch } : opcao,
					),
				})),
			)
		},
		reordenarOpcoes(perguntaId: string, activeId: string, overId: string) {
			mapPerguntas((perguntas) =>
				atualizarPergunta(perguntas, perguntaId, (pergunta) => ({
					...pergunta,
					opcoes: reorderById(pergunta.opcoes, activeId, overId),
				})),
			)
		},
	}
}

export type QuestionarioConfig = ReturnType<typeof useQuestionarioConfig>
