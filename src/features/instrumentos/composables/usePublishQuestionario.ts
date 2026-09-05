import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	createQuestionnaireDraft,
	getActiveQuestionnaire,
	publishQuestionnaireVersion,
	replaceQuestions,
} from '@/features/instrumentos/services/questionario'
import type { SecaoConfig } from '@/features/instrumentos/types/questionario'
import { toReplaceQuestionsPayload } from '@/features/instrumentos/utils/questionarioMapper'

async function publishQuestionnaire(secoes: SecaoConfig[]) {
	const { data: active } = await getActiveQuestionnaire()
	const { data: draft } = await createQuestionnaireDraft(active.id)
	await replaceQuestions(draft.id, toReplaceQuestionsPayload(secoes))
	await publishQuestionnaireVersion(draft.id)
}

export function usePublishQuestionario() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: publishQuestionnaire,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessment'] }),
	})
}
