import { useMutation, useQueryClient } from '@tanstack/react-query'

import { publishQuestionnaire } from '../service/questionarioService'

export function usePublishQuestionario() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: publishQuestionnaire,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessment'] }),
	})
}
