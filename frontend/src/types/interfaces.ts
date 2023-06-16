export interface User {
  name?: string | null | undefined
  role?: string
  email?: string | null | undefined
  accessToken?: string
}

export interface Product {
  id?: number
  name?: string
  description?: string
  price?: number
  image?: string
  category?: string
}

export interface Combo {
  id?: number
  name?: string
  description?: string
  price?: number
  image?: string
  category?: string
  products?: Product[]
}

export interface Category {
  id?: number
  name?: string
  image?: string
}

export interface CompanyRequest {
  categoria_empresa: string
  correo: string
  departamento: string
  descripcion: string
  documentos: string[]
  estado_solicitud: string
  fecha_solicitud: Date
  municipio: string
  nombre: string
  solicitud_empresa_id: number
  zona: string
}

export interface UserReport {
  disabledUsers: number
  enabledUsers: number
}
