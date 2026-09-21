/** Darkens a hex color to guarantee contrast when used as text over its own light tint as background. */
export function scaleColor(value: string | null | undefined): string {
	if (!value || !/^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(value)) return '#64748b'
	return value.length === 4 ? `#${[...value.slice(1)].map((c) => c + c).join('')}` : value
}

export function darkenForText(hex: string | null | undefined, amount = 0.35): string {
	const normalized = scaleColor(hex).replace('#', '')

	const num = parseInt(normalized, 16)
	const channel = (shift: number) =>
		Math.round(((num >> shift) & 0xff) * (1 - amount))
	const toHex = (value: number) => value.toString(16).padStart(2, '0')

	return `#${toHex(channel(16))}${toHex(channel(8))}${toHex(channel(0))}`
}
