/** Darkens a hex color to guarantee contrast when used as text over its own light tint as background. */
export function darkenForText(hex: string, amount = 0.35): string {
	const normalized = hex.replace('#', '')
	if (normalized.length !== 6) return hex

	const num = parseInt(normalized, 16)
	const channel = (shift: number) =>
		Math.round(((num >> shift) & 0xff) * (1 - amount))
	const toHex = (value: number) => value.toString(16).padStart(2, '0')

	return `#${toHex(channel(16))}${toHex(channel(8))}${toHex(channel(0))}`
}
