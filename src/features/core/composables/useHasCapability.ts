import { useSession } from '@/features/auth/composables/useSession'
import { ROLE_CAPABILITIES } from '@/features/roles/types/roles'
import type { Capability } from '@/features/roles/types/roles'

export function useHasCapability() {
	const { user } = useSession()

	return (capability: Capability) => {
		if (!user) return false
		return ROLE_CAPABILITIES[user.role].includes(capability)
	}
}
