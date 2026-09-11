import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import { questionarioAtivoQueryKey, useGetQuestionarioAtivo } from '@/features/instrumentos/composables/useGetQuestionarioAtivo'
import { useEscalaConfig, type EscalaConfig } from '@/features/instrumentos/composables/useEscalaConfig'
import { useQuestionarioConfig, type QuestionarioConfig } from '@/features/instrumentos/composables/useQuestionarioConfig'
import {
	createQuestionnaireDraft,
	publishQuestionnaireVersion,
	replaceQuestions,
	replaceVulnerabilityBands,
} from '@/features/instrumentos/services/questionario'
import { toEscala, toReplaceVulnerabilityBandsPayload } from '@/features/instrumentos/utils/escalaMapper'
import { toReplaceQuestionsPayload, toSections } from '@/features/instrumentos/utils/questionarioMapper'

interface InstrumentoDraftContextValue {
	config: QuestionarioConfig
	escala: EscalaConfig
	draftId: string | undefined
	versionNumber: number | undefined
	rascunhoPronto: boolean
	publicar: () => void
	publicando: boolean
	erroPublicacao: unknown
	erroCarregamento: unknown
}

function isQuestionarioInexistente(error: unknown): boolean {
	return isAxiosError(error) && error.response?.status === 404
}

const InstrumentoDraftContext = createContext<InstrumentoDraftContextValue | null>(null)

export function InstrumentoDraftProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient()
	const config = useQuestionarioConfig()
	const escala = useEscalaConfig()
	const questionarioAtivo = useGetQuestionarioAtivo()

	const criarDraft = useMutation({ mutationFn: createQuestionnaireDraft })
	const iniciadoRef = useRef(false)

	useEffect(() => {
		if (iniciadoRef.current || questionarioAtivo.isPending) return
		if (questionarioAtivo.isError && !isQuestionarioInexistente(questionarioAtivo.error)) return

		iniciadoRef.current = true

		const ativo = questionarioAtivo.data
		if (ativo) {
			config.substituirSecoes(toSections(ativo))
			escala.substituirEscala(toEscala(ativo))
		}
		criarDraft.mutate(ativo?.id)
	}, [
		questionarioAtivo.isPending,
		questionarioAtivo.isError,
		questionarioAtivo.error,
		questionarioAtivo.data,
		config,
		escala,
		criarDraft,
	])

	const draftId = criarDraft.data?.data.id

	const publicarMutation = useMutation({
		mutationFn: async () => {
			if (!draftId) throw new Error('O rascunho ainda não está pronto.')
			await replaceQuestions(draftId, toReplaceQuestionsPayload(config.secoes))
			await replaceVulnerabilityBands(draftId, toReplaceVulnerabilityBandsPayload(escala.graus))
			await publishQuestionnaireVersion(draftId)
			return draftId
		},
		onSuccess: (versaoPublicadaId) => {
			queryClient.invalidateQueries({ queryKey: questionarioAtivoQueryKey })
			queryClient.invalidateQueries({ queryKey: ['assessment'] })
			// A versão que acabou de publicar deixa de ser DRAFT: abre um rascunho
			// novo clonado dela pra manter as duas telas editáveis em seguida.
			criarDraft.mutate(versaoPublicadaId)
		},
	})

	return (
		<InstrumentoDraftContext.Provider
			value={{
				config,
				escala,
				draftId,
				versionNumber: questionarioAtivo.data?.versionNumber,
				rascunhoPronto: !!draftId,
				publicar: () => publicarMutation.mutate(),
				publicando: publicarMutation.isPending,
				erroPublicacao: publicarMutation.error,
				erroCarregamento: questionarioAtivo.isError && !isQuestionarioInexistente(questionarioAtivo.error)
					? questionarioAtivo.error
					: undefined,
			}}
		>
			{children}
		</InstrumentoDraftContext.Provider>
	)
}

export function useInstrumentoDraft() {
	const context = useContext(InstrumentoDraftContext)
	if (!context) throw new Error('useInstrumentoDraft deve ser usado dentro de InstrumentoDraftProvider')
	return context
}
