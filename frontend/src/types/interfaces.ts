export interface User {
  name?: string | null | undefined
  role?: string
  email?: string | null | undefined
  accessToken?: string
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
