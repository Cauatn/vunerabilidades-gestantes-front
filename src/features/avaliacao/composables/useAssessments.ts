import { useMutation, useQuery } from '@tanstack/react-query'

import { getPatientAssessments, startAssessment, submitAssessment } from '@/features/avaliacao/services/assessments'

export function useStartAssessment() {
	return useMutation({ mutationFn: startAssessment })
}

export function useSubmitAssessment() {
	return useMutation({ mutationFn: submitAssessment })
}

export function usePatientAssessments(patientId?: string) {
	return useQuery({
		queryKey: ['patient-assessments', patientId],
		queryFn: () => getPatientAssessments(patientId!),
		enabled: Boolean(patientId),
	})
}
