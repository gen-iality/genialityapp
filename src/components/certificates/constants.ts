import { CertRow } from "html2pdf-certs";

export const availableTags = [
  { tag: 'event.name', label: 'Nombre del curso', value: 'name' },
  { tag: 'event.start', label: 'Fecha inicio del curso', value: 'datetime_from' },
  { tag: 'event.end', label: 'Fecha fin del curso', value: 'datetime_to' },
  { tag: 'event.venue', label: 'Lugar del curso', value: 'venue' },
  { tag: 'event.address', label: 'Dirección del curso', value: 'location.FormattedAddress' },
  { tag: 'user.names', label: 'Nombre(s) de asistente', value: 'names' },
  { tag: 'user.email', label: 'Correo de asistente', value: 'email' },
  { tag: 'ticket.name', label: 'Nombre del tiquete', value: 'ticket.title' },
  { tag: 'rol.name', label: 'Nombre del Rol' },
];

export const defaultCertRows: CertRow[] = [
  {type: 'break', times: 19},
  {type: 'h3', content: 'Certificamos que'},
  {type: 'break', times: 2},
  {type: 'h4', content: '[user.names]'},
  {type: 'break', times: 3},
  {type: 'h3', content: 'participo con éxito el curso'},
  {type: 'break'},
  {type: 'h2', content: '[event.name]'},
  {type: 'break', times: 1},
  {type: 'h4', content: 'realizado del [event.start] al [event.end]'},
]
