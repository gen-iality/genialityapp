export type CertificateData = {
  name: string,
  content: string,
  background: string,
  event_id: string,
  rol?: { _id: string, [key: string]: any },
  cert_width?: number,
  cert_height?: number,
}
