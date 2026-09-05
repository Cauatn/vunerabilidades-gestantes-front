import { useHasCapability } from '@/features/core/composables/useHasCapability'
import type { Capability } from '@/features/roles/types/roles'
import type { ReactNode } from 'react'

interface RestrictedProps {
	capability: Capability
	fallback?: ReactNode
	children: ReactNode
}

export function Restricted({ capability, fallback = null, children }: RestrictedProps): ReactNode {
	const can = useHasCapability()

	if (!can(capability)) {
		return fallback
	}

	return children
}
