import axios from 'axios'
import type { Localities } from '../types/brasilApi'

const baseUrl = 'https://brasilapi.com.br/api'

export const getLocalitiesByUf = (uf: string) =>
	axios.get<Localities[]>(`${baseUrl}/ibge/municipios/v1/${uf}`)
