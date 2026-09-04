import type { AxiosResponse } from "axios";

import { api } from "@/features/core/service/apiService";
import type { Paginated } from "@/features/core/types/pagination";
import type { Assessment, AssessmentQuestion } from "../types/assessment";

export const startAssessment = (payload: {
	patientId: string;
	healthUnitId: string;
}) =>
	api.post<{ questionnaire: { questions: AssessmentQuestion[] } }>(
		"/assessments/start",
		payload,
	);

export const submitAssessment = (payload: {
	patientId: string;
	healthUnitId: string;
	answers: Array<{ questionId: string; optionId: string }>;
}) => api.post<Assessment>("/assessments", payload);

export const getAssessment = (id: string) =>
	api.get<Assessment>(`/assessments/${id}`);

export const getAssessments = async (): Promise<
	AxiosResponse<Paginated<Assessment>>
> => api.get<Paginated<Assessment>>("/assessments");

export const updateAssessmentRecommendations = (
	id: string,
	recommendations: Array<{ id?: string; text: string; order: number }>,
) =>
	api.put<Assessment>(`/assessments/${id}/recommendations`, {
		recommendations,
	});

export const getPatientAssessments = (
	patientId: string,
	params = { page: 1, pageSize: 20 },
) =>
	api.get<{
		assessments: {
			items: Assessment[];
			total: number;
			page: number;
			pageSize: number;
		};
	}>(`/patients/${patientId}/assessments`, { params });
