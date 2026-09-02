import { useMutation, useQueryClient } from '@tanstack/react-query'

import { questionarioQueryKey } from '@/features/instrumentos/composables/useGetQuestionarioAtivo'
import type { GrauConfig } from '@/features/instrumentos/types/escala'
import type { SecaoConfig } from '@/features/instrumentos/types/questionario'
import type { QuestionnaireVersion } from '@/features/instrumentos/types/questionnaire'
import { publicarQuestionario } from '@/features/instrumentos/utils/publicarQuestionario'

interface Params {
	secoes: SecaoConfig[]
	graus: GrauConfig[]
	versaoVigente: QuestionnaireVersion | undefined
}

export function usePublicarQuestionario(options?: { onSuccess?: () => void }) {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ secoes, graus, versaoVigente }: Params) =>
			publicarQuestionario(secoes, graus, versaoVigente),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: questionarioQueryKey })
			options?.onSuccess?.()
		},
	})
}
