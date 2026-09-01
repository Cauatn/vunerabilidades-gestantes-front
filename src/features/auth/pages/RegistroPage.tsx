import doctorIllustration from '@/assets/illustrations/registro-doctor.svg'
import { AuthLayout } from '@/features/auth/components/AuthLayout'
import { RegistroForm } from '@/features/auth/components/RegistroForm'

export function RegistroPage() {
	return (
		<AuthLayout
			illustration={doctorIllustration}
			tagline="Finalize o cadastro na plataforma para acessá-la."
		>
			<RegistroForm />
		</AuthLayout>
	)
}
