import { DynamicFieldOptionsType } from './types'

type EmptyOptionType = {
  value: ''
  label: string
}

export const dynamicFieldOptions: (DynamicFieldOptionsType | EmptyOptionType)[] = [
  { value: '', label: 'Seleccione una opción' },
  { value: 'text', label: 'Texto' },
  { value: 'country', label: 'Pais ' },
  { value: 'region', label: 'Region ' },
  { value: 'city', label: 'Ciudad ' },
  { value: 'longtext', label: 'Texto largo' },
  { value: 'email', label: 'Correo' },
  { value: 'number', label: 'Numérico' },
  { value: 'list', label: 'Lista opciones' },
  { value: 'multiplelist', label: 'Selección multiple' },
  { value: 'date', label: 'Fecha (DD/MM/YYYY)' },
  { value: 'boolean', label: 'Si/No' },
  { value: 'file', label: 'Archivo' },
  { value: 'complex', label: 'JSON' },
  { value: 'tituloseccion', label: 'Titulo para indicar campos relacionados' },
  { value: 'password', label: 'Password' },
  { value: 'multiplelisttable', label: 'Selección multiple con buscar' },
  { value: 'codearea', label: 'Código de área para números' },
  { value: 'TTCC', label: 'Términos y condiciones' },
  /* { value: 'avatar', label: 'Imagen de perfil' }, */
]
