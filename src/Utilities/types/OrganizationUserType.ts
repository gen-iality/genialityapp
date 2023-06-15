export interface OrganizationUserType {
  organization_id: string
  user_properties: { [x: string]: any }
  properties: any
  account_id: string
  position_id?: string
  rol_id: string
  payment_plan?: {
    price: number
    date_until: string
  }
}
