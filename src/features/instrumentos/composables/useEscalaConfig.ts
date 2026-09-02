import { useEffect, useMemo, useState } from 'react'

import { COR_GRAU_PADRAO } from '../constants'
import type { GrauConfig, LimitesEscala, RecomendacaoConfig, ValidacaoEscala } from '../types/escala'
import { reorderById } from '../utils/reorder'

function novaRecomendacao(): RecomendacaoConfig {
	return { id: crypto.randomUUID(), texto: '' }
}

function validar(limites: LimitesEscala, graus: GrauConfig[]): ValidacaoEscala {
	const gerais: string[] = []
	const porGrau: Record<string, string> = {}
	const ordenados = [...graus].sort((a, b) => a.min - b.min)

	ordenados.forEach((grau, indice) => {
		if (grau.min > grau.max) {
			porGrau[grau.id] = 'A pontuação mínima não pode ser maior que a máxima.'
			return
		}
		if (indice === 0) return
		const anterior = ordenados[indice - 1]
		if (grau.min <= anterior.max) {
			porGrau[grau.id] = 'Este intervalo se sobrepõe ao grau anterior.'
		} else if (grau.min > anterior.max + 1) {
			porGrau[grau.id] = 'Há uma lacuna de pontuação entre este grau e o anterior.'
		}
	})

	if (ordenados.length > 0) {
		if (ordenados[0].min !== limites.min) {
			gerais.push('O primeiro grau deve começar na pontuação mínima da escala.')
		}
		if (ordenados[ordenados.length - 1].max !== limites.max) {
			gerais.push('O último grau deve terminar na pontuação máxima da escala.')
		}
	}

	if (Object.keys(porGrau).length > 0) {
		gerais.unshift('Existem intervalos com sobreposição ou lacunas entre os graus de vulnerabilidade.')
	}

	return { gerais, porGrau }
}

interface EscalaInicial {
	graus?: GrauConfig[]
	max?: number
}

export function useEscalaConfig(inicial?: EscalaInicial) {
	const [limites, setLimites] = useState<LimitesEscala>({ min: 0, max: inicial?.max ?? 0 })
	const [graus, setGraus] = useState<GrauConfig[]>(inicial?.graus ?? [])

	useEffect(() => {
		if (!inicial) return
		if (inicial.graus) setGraus(inicial.graus)
		if (typeof inicial.max === 'number') setLimites((atual) => ({ ...atual, max: inicial.max as number }))
	}, [inicial])

	const validacao = useMemo(() => validar(limites, graus), [limites, graus])

	function mapGrau(id: string, fn: (grau: GrauConfig) => GrauConfig) {
		setGraus((atual) => atual.map((grau) => (grau.id === id ? fn(grau) : grau)))
	}

	return {
		limites,
		graus,
		validacao,

		atualizarLimite(campo: keyof LimitesEscala, valor: number) {
			setLimites((atual) => ({ ...atual, [campo]: valor }))
		},
		usarPontuacaoSugerida(valor: number) {
			setLimites((atual) => ({ ...atual, max: valor }))
		},

		addGrau() {
			setGraus((atual) => [
				...atual,
				{
					id: crypto.randomUUID(),
					nome: `Novo grau ${atual.length + 1}`,
					cor: COR_GRAU_PADRAO,
					min: limites.min,
					max: limites.min,
					recomendacoes: [],
				},
			])
		},
		removeGrau(id: string) {
			setGraus((atual) => atual.filter((grau) => grau.id !== id))
		},
		atualizarGrau(id: string, patch: Partial<GrauConfig>) {
			mapGrau(id, (grau) => ({ ...grau, ...patch }))
		},
		reordenarGraus(activeId: string, overId: string) {
			setGraus((atual) => reorderById(atual, activeId, overId))
		},

		addRecomendacao(grauId: string) {
			mapGrau(grauId, (grau) => ({ ...grau, recomendacoes: [...grau.recomendacoes, novaRecomendacao()] }))
		},
		removeRecomendacao(grauId: string, recomendacaoId: string) {
			mapGrau(grauId, (grau) => ({
				...grau,
				recomendacoes: grau.recomendacoes.filter((item) => item.id !== recomendacaoId),
			}))
		},
		atualizarRecomendacao(grauId: string, recomendacaoId: string, texto: string) {
			mapGrau(grauId, (grau) => ({
				...grau,
				recomendacoes: grau.recomendacoes.map((item) =>
					item.id === recomendacaoId ? { ...item, texto } : item,
				),
			}))
		},
		reordenarRecomendacoes(grauId: string, activeId: string, overId: string) {
			mapGrau(grauId, (grau) => ({
				...grau,
				recomendacoes: reorderById(grau.recomendacoes, activeId, overId),
			}))
		},
	}
}

export type EscalaConfig = ReturnType<typeof useEscalaConfig>
