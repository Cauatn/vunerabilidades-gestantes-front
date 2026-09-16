import {
	createContext,
	useContext,
	useEffect,
	useRef,
	type ReactNode,
} from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

import {
	activeQuestionnaireQueryKey,
	useGetActiveQuestionnaire,
} from '@/features/instrumentos/composables/useGetActiveQuestionnaire'
import {
	useScaleConfig,
	type ScaleConfig,
} from '@/features/instrumentos/composables/useScaleConfig'
import {
	useQuestionnaireConfig,
	type QuestionnaireConfig,
} from '@/features/instrumentos/composables/useQuestionnaireConfig'
import {
	createQuestionnaireDraft,
	publishQuestionnaireVersion,
	replaceQuestions,
	replaceVulnerabilityBands,
} from '@/features/instrumentos/services/questionnaire'
import {
	toScale,
	toReplaceVulnerabilityBandsPayload,
} from '@/features/instrumentos/utils/scaleMapper'
import {
	toReplaceQuestionsPayload,
	toSections,
} from '@/features/instrumentos/utils/questionnaireMapper'

interface InstrumentDraftContextValue {
	config: QuestionnaireConfig
	scale: ScaleConfig
	draftId: string | undefined
	versionNumber: number | undefined
	draftReady: boolean
	publish: (options?: {
		onSuccess?: () => void
		onError?: (error: unknown) => void
	}) => void
	publishing: boolean
	publishError: unknown
	loadError: unknown
}

function isQuestionnaireNotFound(error: unknown): boolean {
	return isAxiosError(error) && error.response?.status === 404
}

const InstrumentDraftContext =
	createContext<InstrumentDraftContextValue | null>(null)

export function InstrumentDraftProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient()
	const config = useQuestionnaireConfig()
	const scale = useScaleConfig()
	const activeQuestionnaire = useGetActiveQuestionnaire()

	const createDraft = useMutation({ mutationFn: createQuestionnaireDraft })
	const initializedRef = useRef(false)

	useEffect(() => {
		if (initializedRef.current || activeQuestionnaire.isPending) return
		if (
			activeQuestionnaire.isError &&
			!isQuestionnaireNotFound(activeQuestionnaire.error)
		)
			return

		initializedRef.current = true

		const active = activeQuestionnaire.data
		if (active) {
			config.replaceSections(toSections(active))
			scale.replaceScale(toScale(active))
		}
		createDraft.mutate(active?.id)
	}, [
		activeQuestionnaire.isPending,
		activeQuestionnaire.isError,
		activeQuestionnaire.error,
		activeQuestionnaire.data,
		config,
		scale,
		createDraft,
	])

	const draftId = createDraft.data?.data.id

	const publishMutation = useMutation({
		mutationFn: async () => {
			if (!draftId) throw new Error('O rascunho ainda não está pronto.')
			await replaceQuestions(
				draftId,
				toReplaceQuestionsPayload(config.sections),
			)
			await replaceVulnerabilityBands(
				draftId,
				toReplaceVulnerabilityBandsPayload(scale.levels),
			)
			await publishQuestionnaireVersion(draftId)
			return draftId
		},
		onSuccess: (publishedVersionId) => {
			queryClient.invalidateQueries({
				queryKey: activeQuestionnaireQueryKey,
			})
			queryClient.invalidateQueries({ queryKey: ['assessment'] })
			// A versão que acabou de publicar deixa de ser DRAFT: abre um rascunho
			// novo clonado dela pra manter as duas telas editáveis em seguida.
			createDraft.mutate(publishedVersionId)
		},
	})

	return (
		<InstrumentDraftContext.Provider
			value={{
				config,
				scale,
				draftId,
				versionNumber: activeQuestionnaire.data?.versionNumber,
				draftReady: !!draftId,
				publish: (options) =>
					publishMutation.mutate(undefined, {
						onSuccess: () => {
							options?.onSuccess?.()
						},
						onError: (error) => {
							options?.onError?.(error)
						},
					}),
				publishing: publishMutation.isPending,
				publishError: publishMutation.error,
				loadError:
					activeQuestionnaire.isError &&
					!isQuestionnaireNotFound(activeQuestionnaire.error)
						? activeQuestionnaire.error
						: undefined,
			}}
		>
			{children}
		</InstrumentDraftContext.Provider>
	)
}

export function useInstrumentDraft() {
	const context = useContext(InstrumentDraftContext)
	if (!context)
		throw new Error(
			'useInstrumentDraft deve ser usado dentro de InstrumentDraftProvider',
		)
	return context
}
