import { CertifiRow } from "../types";
import { availableTags } from "./constants";

export const defaultCertRows: CertifiRow[] = [
    { type: 'break', times: 2 },
    { type: 'h4', content: 'Certificamos que' },
    { type: 'h2', content: '[user.names]' },
    { type: 'h4', content: 'participo con éxito el curso' },
    { type: 'h2', content: '[event.name]' },
    { type: 'h4', content: 'realizado del [event.start] al [event.end]' },
  ]
  
  export function replaceAllTagValues(
    event: any,
    userData: any,
    roles: any[] = [],
    certRows: CertifiRow[],
  ) {
    let newCertRows: CertifiRow[] = JSON.parse(JSON.stringify(certRows))
    availableTags.forEach((item) => {
      let value
      if (item.tag.includes('event.')) value = event[item.value || '']
      else if (item.tag.includes('ticket.'))
        value = userData.ticket ? userData.ticket.title : 'Sin tiquete'
      else if (item.tag.includes('rol.')) {
        const rols = roles.find((currentRol) => currentRol._id === userData.rol_id)
        const rolName = rols ? rols.name.toUpperCase() : 'Sin rol'
        value = rolName
      } else {
        value = userData.properties[item.value || '']
      }
  
      if (item.tag) {
        const wantedTag = item.tag
        const wishedValue = value
  
        // Replace in all rows
        newCertRows = newCertRows.map((row) => {
          if (row.content) {
            if (typeof row.content === 'string') {
              row.content = row.content.replace(`[${wantedTag}]`, wishedValue)
            }
          }
          return row
        })
      }
    })
  
    return newCertRows
  }
  
  export function ArrayToStringCerti(rows : CertifiRow[]){
    let CertificateHtml = ''
    rows.forEach((row)=> {
      if(row.type === 'break' && row.times){
        let index = 0
        while( index < row.times){
          CertificateHtml += `<p class="ql-align-center"><br></p>`
          index++
        }
      }else  {
        CertificateHtml += `<${row.type} class="ql-align-center">${row.content}</${row.type}>`
      }
     
    })
    return CertificateHtml
  }