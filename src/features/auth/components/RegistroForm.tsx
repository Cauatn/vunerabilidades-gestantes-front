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

const CATEGORIAS_ENFERMAGEM = ['Enfermeiro(a)', 'Obstetriz', 'Técnico(a) de enfermagem']

export function RegistroForm() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const isEnfermeiro = searchParams.get('categoria') === 'enfermeiro'
	const conselhoLabel = isEnfermeiro ? 'COREN' : 'CRM'

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

	function onSubmit() {
		navigate('/login')
	}

	return (
		<form className="flex w-full flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
			<section className="flex flex-col gap-3">
				<Divider text="Informações gerais" />
				<div className="space-y-1.5">
					<Label htmlFor="reg-nome">
						Nome <span className="text-r-500">*</span>
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
					<div className="w-[150px] space-y-1.5">
						<Label>
							UF <span className="text-r-500">*</span>
						</Label>
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
						<Label htmlFor="reg-numero">
							Número <span className="text-r-500">*</span>
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
						<Label>
							Categoria <span className="text-r-500">*</span>
						</Label>
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
											<SelectItem key={cat} value={cat}>
												{cat}
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
					<Label htmlFor="reg-senha">
						Senha <span className="text-r-500">*</span>
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
					<Label htmlFor="reg-confirmar">
						Confirmar senha <span className="text-r-500">*</span>
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

			<Button type="submit" size="lg" className="w-full">
				Finalizar cadastro
			</Button>
		</form>
	)
}
