import { applyMask, onlyDigits } from '@/components/ui/input'

export { onlyDigits }

export function formatCpf(rawValue: string): string {
	return applyMask('cpf', rawValue)
}

export function formatCns(rawValue: string): string {
	return applyMask('cns', rawValue)
}
