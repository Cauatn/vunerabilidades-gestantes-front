import { useMutation, useQuery } from '@tanstack/react-query'

import { getPatientAssessments, startAssessment, submitAssessment, type Assessment } from '@/features/avaliacao/services/assessments'
import { getGestantes } from '@/features/gestantes/services/gestantes'

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

export type AssessmentHistoryEntry = Assessment & { patientName: string }

export function useAssessmentsHistory() {
	return useQuery({
		queryKey: ['assessments-history'],
		queryFn: async (): Promise<AssessmentHistoryEntry[]> => {
			const { data: patients } = await getGestantes({ page: 1, pageSize: 100 })
			const pages = await Promise.all(
				patients.items.map(async (patient) => {
					const { data } = await getPatientAssessments(patient.id, { page: 1, pageSize: 100 })
					return data.assessments.items.map((assessment) => ({ ...assessment, patientName: patient.name }))
				}),
			)
			return pages.flat().sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
		},
	})
}
