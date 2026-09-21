export const capitalizeFirst = (s: string | null | undefined) => {
	const lower = s?.trim().toLowerCase()
	if (!lower) return ''

	return lower[0].toUpperCase() + lower.slice(1)
}
