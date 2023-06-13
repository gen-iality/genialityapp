export interface CertificateRequirementConfigType {
  enable: boolean
  completion: number
  ignore_event_type: string[]
}

export default interface CertificateType {
  _id?: string
  name: string
  content: string
  background: string
  event_id: string
  event: any
  rol_id?: string
  cert_width?: number
  cert_height?: number
  requirement_config?: CertificateRequirementConfigType
}
