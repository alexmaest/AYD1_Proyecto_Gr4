export interface User {
  id: number
  name: string
  role: string
  email: string
  accessToken: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface Combo {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  products: ComboProduct[]
}

export interface Category {
  id: number
  name: string
  image: string
  type: string
}

export interface ComboProduct {
  id: number
  name: string
  quantity: number
}

export interface Department {
  departamento_id: number
  descripcion: string
  municipios: Town[]
}

export interface Town {
  municipio_id: number
  descripcion: string
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

export interface CompanyOrder {
  order_id: number
  order_date: string
  state_id: string
  total: number
  card_number: string
  description: string
  combos: any[]
  products: any[]
}

export interface UserOrderHistory {
  combos: ItemsUserOrderHistory[]
  company_name: string
  coupon_applied: string
  description: string
  order_date: Date
  order_hour: string
  order_id: number
  products: ItemsUserOrderHistory[]
  state: string
  subtotal: number
  total: number
}

export interface ItemsUserOrderHistory {
  id: number
  quantity: number
  unitary_price: number
}
export interface DeliveryOrder {
  order_id: number
  client_names: string
  last_names: string
  phone: string
  department: string
  municipality: string
  company_name: string
  description: string
  total: number
  coupon_applied: string
}

export interface Commission {
  order_id: number
  order_date: string
  total: number
  commission: number
  state: string
}

export interface DeliveryHistory {
  order_id: number
  client_names: string
  last_names: string
  phone: string
  department: string
  municipality: string
  company_name: string
  calification: number
  calification_description: string
  order_date: string
  state: string
  total: number
}
