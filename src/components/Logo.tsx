import logoUrl from '@/assets/logo-gestare.svg'
import { cn } from '@/lib/utils'

interface LogoProps {
	className?: string
}

/** Marca "Gestare" (símbolo + wordmark), exportada do Figma. */
export function Logo({ className }: LogoProps) {
	return (
		<img src={logoUrl} alt="Gestare" className={cn('block h-auto w-[164px] select-none', className)} />
	)
}
