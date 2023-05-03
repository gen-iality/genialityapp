import { CertRow } from 'html2pdf-certs'
import { availableTags } from '../constants'

export function replaceAllTagValues(
  event: any,
  userData: any,
  roles: any[],
  certRows: CertRow[],
) {
  let newCertRows: CertRow[] = JSON.parse(JSON.stringify(certRows))

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
