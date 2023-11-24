import { CertifiRow } from '../types';
import { availableTags } from './constants';

export const defaultCertRows: CertifiRow[] = [
  { id: 'b64c746d-d4e0-46c2-87d8-d9038bddc4b5', type: 'break', times: 2 },
  { id: '7021df1b-57af-491f-a443-b3dc6ff6aeb3', type: 'h4', content: 'Certificamos que' },
  { id: 'de5cf5a7-54a1-4d8d-88f4-305710ce9361', type: 'h2', content: '[user.names]' },
  { id: 'e085e667-28c6-442f-8513-9d7295f2011e', type: 'h4', content: 'participo con éxito el curso' },
  { id: '3ca83cd6-85d0-4e51-993f-4c2ed447633c', type: 'h2', content: '[event.name]' },
  { id: '1a3949ea-fa72-401f-9e67-69f000e083d4', type: 'h4', content: 'realizado del [event.start] al [event.end]' },
];
export function replaceAllTagValues(event: any, userData: any, roles: any[] = [], certRows: CertifiRow[] = []) {
  const propertyKeys = Object.keys(userData.properties);

  propertyKeys.forEach((key) => {
    availableTags.push({
      tag: `properties.${key}`,
      label: `Valor de ${key}`,
      value: key,
    });
  });
  let newCertRows: CertifiRow[] = JSON.parse(JSON.stringify(certRows));
  availableTags.forEach((item) => {
    let value;
    if (item.tag.includes('event.')) value = event[item.value ?? ''];
    else if (item.tag.includes('ticket.')) value = userData.ticket ? userData.ticket.title : 'Sin tiquete';
    else if (item.tag.includes('rol.')) {
      const rols = roles.find((currentRol) => currentRol._id === userData.rol_id);
      const rolName = rols ? rols.name.toUpperCase() : 'Sin rol';
      value = rolName;
    } else {
      value = userData.properties[item.value ?? ''];
    }

    if (item.tag) {
      const wantedTag = item.tag;
      const wishedValue = value;

      // Replace in all rows
      newCertRows = newCertRows.map((row) => {
        if (typeof row.content === 'string') row.content = row.content.replace(`[${wantedTag}]`, wishedValue);
        return row;
      });
    }
  });

  return newCertRows;
}

export function ArrayToStringCerti(rows: CertifiRow[]) {
  let CertificateHtml = '';
  rows.forEach((row) => {
    if (row.type === 'break' && row.times) {
      let index = 0;
      while (index < row.times) {
        CertificateHtml += `<br>`;
        index++;
      }
    } else {
      CertificateHtml += `<${row.type} class="ql-align-center">${row.content}</${row.type}>`;
    }
  });
  return CertificateHtml;
}
