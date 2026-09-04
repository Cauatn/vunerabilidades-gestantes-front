import {
	getAssessment,
	getAssessments,
	getPatientAssessments,
	startAssessment,
	submitAssessment,
	updateAssessmentRecommendations,
} from "@/features/avaliacao/services/assessments";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useStartAssessment() {
	return useMutation({ mutationFn: startAssessment });
}

export function useSubmitAssessment() {
	return useMutation({ mutationFn: submitAssessment });
}

export function useUpdateAssessmentRecommendations() {
	return useMutation({
		mutationFn: ({
			id,
			recommendations,
		}: {
			id: string;
			recommendations: Array<{ id?: string; text: string; order: number }>;
		}) => updateAssessmentRecommendations(id, recommendations),
	});
}

export function usePatientAssessments(patientId?: string) {
	return useQuery({
		queryKey: ["patient-assessments", patientId],
		queryFn: () => getPatientAssessments(patientId!),
		enabled: Boolean(patientId),
	});
}

export function useAssessment(id?: string) {
	return useQuery({
		queryKey: ["assessment", id],
		queryFn: () => getAssessment(id!),
		enabled: Boolean(id),
		select: (response) => response.data,
	});
}

export function useAssessments() {
	return useQuery({
		queryKey: ["assessments"],
		queryFn: () => getAssessments(),
		select: (response) => response.data,
	});
}
