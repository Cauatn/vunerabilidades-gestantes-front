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

const mockAssessmentsResponse: Paginated<Assessment> = {
	items: [
		{
			id: "asm-001",
			patientId: "Maria Oliveira da Silva",
			appliedAt: "2026-08-20T10:30:00.000Z",
			appliedByUserId: "Dr. José Victor Cruz (Médico)",
			healthUnitId: "ubs-country-club",
			snapshot: {
				questionnaireVersionId: "qv-2026-v1",
				versionNumber: 1,
				capturedAt: "2026-08-01T08:00:00.000Z",
				questions: [],
				vulnerabilityBands: [
					{
						id: "band-baixa",
						level: "BAIXA",
						minScore: 0,
						maxScore: 22,
						order: 1,
						recommendations: [
							{
								id: "rec-1",
								text: "Manter acompanhamento pré-natal habitual.",
								order: 1,
							},
						],
					},
				],
			},
			answers: [
				{
					id: "ans-001",
					questionId: "vspn01",
					questionStatement:
						"Qual foi o maior nível de estudo que você concluiu?",
					optionId: "opt-sup-comp",
					optionLabel: "Superior completo",
					score: 0,
				},
			],
			result: {
				totalScore: 12,
				vulnerabilityLevel: "BAIXA",
				vulnerabilityBandId: "band-baixa",
				calculatedAt: "2026-08-20T10:35:00.000Z",
			},
			recommendations: [
				{
					id: "rec-1",
					text: "Registrar os resultados no prontuário.",
					order: 1,
					fromSnapshot: true,
				},
			],
			createdAt: "2026-08-20T10:35:00.000Z",
			updatedAt: "2026-08-20T10:35:00.000Z",
		},
		{
			id: "asm-002",
			patientId: "Juliana Santos Costa",
			appliedAt: "2026-08-22T14:15:00.000Z",
			appliedByUserId: "Enfª. Mariana Lima (Enfermeira)",
			healthUnitId: "ubs-centro",
			snapshot: {
				questionnaireVersionId: "qv-2026-v1",
				versionNumber: 1,
				capturedAt: "2026-08-01T08:00:00.000Z",
				questions: [],
				vulnerabilityBands: [
					{
						id: "band-mod",
						level: "MODERADA",
						minScore: 23,
						maxScore: 46,
						order: 2,
						recommendations: [
							{
								id: "rec-2",
								text: "Avaliar inserção em programas de suporte social.",
								order: 1,
							},
						],
					},
				],
			},
			answers: [
				{
					id: "ans-002",
					questionId: "vspn02",
					questionStatement: "Atualmente, você está trabalhando?",
					optionId: "opt-sem-carteira",
					optionLabel: "Sim, sem carteira assinada",
					score: 6,
				},
			],
			result: {
				totalScore: 34,
				vulnerabilityLevel: "MODERADA",
				vulnerabilityBandId: "band-mod",
				calculatedAt: "2026-08-22T14:20:00.000Z",
			},
			recommendations: [
				{
					id: "rec-2",
					text: "Discutir o caso com a equipe de assistência social da unidade.",
					order: 1,
					fromSnapshot: true,
				},
			],
			createdAt: "2026-08-22T14:20:00.000Z",
			updatedAt: "2026-08-22T14:20:00.000Z",
		},
		{
			id: "asm-003",
			patientId: "Camila Ferreira Alves",
			appliedAt: "2026-08-25T09:40:00.000Z",
			appliedByUserId: "Dr. Roberto Santos (Médico)",
			healthUnitId: "ubs-country-club",
			snapshot: {
				questionnaireVersionId: "qv-2026-v1",
				versionNumber: 1,
				capturedAt: "2026-08-01T08:00:00.000Z",
				questions: [],
				vulnerabilityBands: [
					{
						id: "band-alta",
						level: "ALTA",
						minScore: 47,
						maxScore: 60,
						order: 3,
						recommendations: [
							{
								id: "rec-3",
								text: "Encaminhamento prioritário para serviço social e visita domiciliar.",
								order: 1,
							},
						],
					},
				],
			},
			answers: [
				{
					id: "ans-003",
					questionId: "vspn05",
					questionStatement:
						"Nos últimos meses, os alimentos acabaram antes de você ter dinheiro para comprar mais?",
					optionId: "opt-alim-sim",
					optionLabel: "Sim",
					score: 5,
				},
			],
			result: {
				totalScore: 52,
				vulnerabilityLevel: "ALTA",
				vulnerabilityBandId: "band-alta",
				calculatedAt: "2026-08-25T09:45:00.000Z",
			},
			recommendations: [
				{
					id: "rec-3",
					text: "Articular suporte intersetorial imediato (CRAS/CREAS).",
					order: 1,
					fromSnapshot: true,
				},
			],
			createdAt: "2026-08-25T09:45:00.000Z",
			updatedAt: "2026-08-25T09:45:00.000Z",
		},
	],
	total: 3,
	page: 1,
	pageSize: 10,
};

export const getAssessments = async (): Promise<
	AxiosResponse<Paginated<Assessment>>
> => {
	return {
		data: mockAssessmentsResponse,
		status: 200,
		statusText: "OK",
		headers: {},
		config: {} as any,
	};

	// Chamada real da API quando backend estiver integrado:
	// return api.get<Paginated<Assessment>>('/assessments');
};

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
