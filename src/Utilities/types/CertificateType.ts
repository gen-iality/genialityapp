export default interface CertificateType {
  name: string
  content: string
  background: string
  event_id: string
  event: any
  rol?: { _id: string; [key: string]: any }
  cert_width?: number
  cert_height?: number
  requirement_config?: {
    enable: boolean
    completion: number
    ignore_event_type: string[]
  }
}
