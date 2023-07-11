// This type should be used in the options written in helpers/constants.jsx
export type FieldType =
  | 'text'
  | 'country'
  | 'region'
  | 'city'
  | 'longtext'
  | 'email'
  | 'number'
  | 'list'
  | 'multiplelist'
  | 'date'
  | 'boolean'
  | 'file'
  | 'complex'
  | 'tituloseccion'
  | 'password'
  | 'multiplelisttable'
  | 'codearea'
  | 'onlyCodearea'
  | 'avatar' // Is it new?
  | 'TTCC' // Terms and condictions

export interface IDynamicFieldData {
  _id?: string
  type?: FieldType
  props?: any
  name: string
  label: string
  mandatory?: boolean
  description?: string
  labelPosition?: any // NOTE: Check this
  justonebyattendee?: boolean
  visibleByContacts?: boolean
  visibleByAdmin?: boolean
  options?: { label: string; value: string }[]
  dependency?: {
    fieldName: string
    triggerValues: string[]
  }
  link?: string
}

export interface IDynamicFieldProps {
  fieldData: IDynamicFieldData
  allInitialValues?: any
}

export type DynamicFieldOptionsType = {
  value: FieldType
  label: string
}
