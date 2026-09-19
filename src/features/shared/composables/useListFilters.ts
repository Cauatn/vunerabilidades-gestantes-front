import { parseAsString, useQueryStates } from 'nuqs'


export function useListFilters() {
	return useQueryStates({
		healthUnitId: parseAsString.withDefault(''),
		appliedByUserId: parseAsString.withDefault(''),
		patientId: parseAsString.withDefault(''),
		doctorId: parseAsString.withDefault(''),
		vulnerabilityLevel: parseAsString.withDefault(''),
		state: parseAsString.withDefault(''),
		city: parseAsString.withDefault(''),
		from: parseAsString.withDefault(''),
		to: parseAsString.withDefault(''),
	})
}
