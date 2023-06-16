export interface OrganizationUserType {
  _id?: string
  organization_id: string
  user_properties: { [x: string]: any }
  properties: any
  account_id: string
  user: any // TODO: use the User type that does not exist yet
  position_id?: string
  rol_id: string
  payment_plan?: {
    price: number
    date_until: string
  }
}
