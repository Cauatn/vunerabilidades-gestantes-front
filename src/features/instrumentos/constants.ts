import type { TipoPergunta } from './types/questionario'

export const TIPO_PERGUNTA_LABEL: Record<string, string> = {
	categorica_ordinal: 'Categórica ordinal',
	categorica_nominal: 'Categórica nominal',
	dicotomica: 'Dicotômica',
	dicotomica_complementar: 'Dicotômica + complementar',
	multipla: 'Múltipla',
	numerica: 'Numérica',
}

export const TIPO_PERGUNTA_OPCOES: TipoPergunta[] = ['dicotomica', 'dicotomica_complementar', 'multipla']

/** o tipo "dicotômica + complementar" habilita o bloco condicional "Se sim" */
export const TIPO_COM_CONDICIONAL: TipoPergunta = 'dicotomica_complementar'

/** soma da pontuação máxima da versão atual do formulário */
export const PONTUACAO_SUGERIDA = 60

/** paleta 4x4 do color picker de graus de vulnerabilidade (Figma) */
export const CORES_GRAU: string[][] = [
	['#729ee9', '#467bd8', '#2f64c1', '#2051a7'],
	['#6ddfb1', '#2db981', '#239f6d', '#1c7d56'],
	['#fdd286', '#f6bd5a', '#eda831', '#d89013'],
	['#f98b98', '#f3596c', '#e03e52', '#c92c3f'],
]

export const COR_GRAU_PADRAO = '#8794a1'
