import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Divider } from '@/components/ui/divider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { ESTADOS } from '@/features/core/constants/localizacao'
import {
	registroSchema,
	type RegistroFormValues,
} from '@/features/auth/validation/registroSchema'
import { useAcceptInvitation } from '@/features/auth/composables/useAcceptInvitation'
import { apiErrorMessage } from '@/features/core/utils/apiError'
import { CATEGORIAS_ENFERMAGEM } from '../constants/nursingCategories'

export function RegistroForm() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const isEnfermeiro = searchParams.get('categoria') === 'enfermeiro'
	const token = searchParams.get('token')
	const conselhoLabel = isEnfermeiro ? 'COREN' : 'CRM'
	const aceitarConvite = useAcceptInvitation({ onSuccess: () => navigate('/login', { replace: true }) })

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RegistroFormValues>({
		resolver: zodResolver(registroSchema),
		defaultValues: {
			nome: '',
			conselhoUf: '',
			conselhoNumero: '',
			categoriaConselho: '',
			senha: '',
			confirmarSenha: '',
		},
	})

	const onSubmit = (values: RegistroFormValues) => {
		if (!token) return
		aceitarConvite.mutate({
			token,
			name: values.nome,
			password: values.senha,
			professionalRegistration: buildProfessionalRegistrationData(values),
		})
	}

	function buildProfessionalRegistrationData(values: RegistroFormValues) {
		const data = `${conselhoLabel}-${values.conselhoUf} ${values.conselhoNumero}`;
		if (isEnfermeiro) return `${data}-${values.categoriaConselho}`;
		return data;
	}

	return (
		<form className="flex w-full flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
			{!token ? <p className="text-caption text-danger">Convite inválido ou sem token de confirmação.</p> : null}
			<section className="flex flex-col gap-3">
				<Divider text="Informações gerais" />
				<div className="space-y-1.5">
					<Label htmlFor="reg-nome" required>
						Nome
					</Label>
					<Input
						id="reg-nome"
						placeholder="Digite..."
						aria-invalid={!!errors.nome}
						{...register('nome')}
					/>
					{errors.nome ? <p className="text-caption text-danger">{errors.nome.message}</p> : null}
				</div>
			</section>

			<section className="flex flex-col gap-3">
				<Divider text={conselhoLabel} />
				<div className="flex items-start gap-3">
					<div className="w-38 space-y-1.5">
						<Label required>UF</Label>
						<Controller
							control={control}
							name="conselhoUf"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione" />
									</SelectTrigger>
									<SelectContent>
										{ESTADOS.map((estado) => (
											<SelectItem key={estado.uf} value={estado.uf}>
												{estado.uf}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						{errors.conselhoUf ? (
							<p className="text-caption text-danger">{errors.conselhoUf.message}</p>
						) : null}
					</div>
					<div className="flex-1 space-y-1.5">
						<Label htmlFor="reg-numero" required>
							Número
						</Label>
						<Input
							id="reg-numero"
							placeholder="Digite..."
							aria-invalid={!!errors.conselhoNumero}
							{...register('conselhoNumero')}
						/>
						{errors.conselhoNumero ? (
							<p className="text-caption text-danger">{errors.conselhoNumero.message}</p>
						) : null}
					</div>
				</div>
				{isEnfermeiro ? (
					<div className="space-y-1.5">
						<Label required>Categoria</Label>
						<Controller
							control={control}
							name="categoriaConselho"
							render={({ field }) => (
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Selecione" />
									</SelectTrigger>
									<SelectContent>
										{CATEGORIAS_ENFERMAGEM.map((cat) => (
											<SelectItem key={cat.name} value={cat.key}>
												{cat.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>
				) : null}
			</section>

			<section className="flex flex-col gap-3">
				<Divider text="Segurança" />
				<div className="space-y-1.5">
					<Label htmlFor="reg-senha" required>
						Senha
					</Label>
					<Input
						id="reg-senha"
						type="password"
						placeholder="Digite..."
						aria-invalid={!!errors.senha}
						{...register('senha')}
					/>
					{errors.senha ? <p className="text-caption text-danger">{errors.senha.message}</p> : null}
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="reg-confirmar" required>
						Confirmar senha
					</Label>
					<Input
						id="reg-confirmar"
						type="password"
						placeholder="Digite..."
						aria-invalid={!!errors.confirmarSenha}
						{...register('confirmarSenha')}
					/>
					{errors.confirmarSenha ? (
						<p className="text-caption text-danger">{errors.confirmarSenha.message}</p>
					) : null}
				</div>
			</section>

			{aceitarConvite.isError ? (
				<p className="text-caption text-danger">
					{apiErrorMessage(aceitarConvite.error, 'Não foi possível confirmar o convite.')}
				</p>
			) : null}
			<Button type="submit" size="lg" className="w-full" isLoading={aceitarConvite.isPending} disabled={!token}>
				Finalizar cadastro
			</Button>
		</form>
	)
}
