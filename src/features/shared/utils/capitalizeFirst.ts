export const capitalizeFirst = (s: string) => {
	const lower = s.toLowerCase()

	return lower[0].toUpperCase() + lower.slice(1)
}
