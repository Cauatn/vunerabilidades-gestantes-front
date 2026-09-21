import { useLocation, useNavigate } from 'react-router-dom'

import { Page } from '@/components/Layout/Page'
import { Button } from '@/components/ui/button'
import { ResultadoAvaliacao } from '@/features/avaliacao/components/ResultadoAvaliacao'
import { usePerguntas } from '@/features/avaliacao/composables/usePerguntasStore'
import {
	CLASSIFICACAO_LABEL,
	SYNTHETIC_VULNERABILITY_BANDS,
} from '@/features/avaliacao/constants'
import {
	calcularPontuacao,
	classificar,
} from '@/features/avaliacao/utils/calcularPontuacao'

export function ResultadoPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const { perguntas } = usePerguntas()
	const state = location.state as {
		respostas?: Record<string, string>
		nomeGestante?: string
	} | null
	const respostas = state?.respostas ?? {}
	const pontuacao = calcularPontuacao(respostas, perguntas)

	return (
		<Page
			title="Resultado da Avaliação"
			description="Resultado da aplicação da Escala"
		>
			<ResultadoAvaliacao
				nomeGestante={state?.nomeGestante ?? 'Antonietta Silva'}
				pontuacao={pontuacao}
				vulnerabilityLevel={CLASSIFICACAO_LABEL[classificar(pontuacao)]}
				vulnerabilityBandId={classificar(pontuacao)}
				bands={SYNTHETIC_VULNERABILITY_BANDS}
			/>
			<div className="flex items-center gap-4">
				<Button variant="ghost" onClick={() => navigate('/')}>
					Voltar ao formulário
				</Button>
			</div>
		</Page>
	)
}
