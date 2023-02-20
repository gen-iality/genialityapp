import * as React from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { Rule } from 'antd/lib/form'
import { IDynamicFieldProps } from './types'
import DynamicFormItem from './DynamicFormItem'
import { useMemo, useState } from 'react'
import { Input } from 'antd'


export interface IDynamicTextFieldProps extends IDynamicFieldProps {
}

/**
 * Accept text and password type for now.
 * @param props {}
 * @returns ReactNode
 */
const DynamicTextField: React.FunctionComponent<IDynamicTextFieldProps> = (props) => {
  const {
    fieldData,
    allInitialValues,
  } = props

  const {
    type,
    mandatory,
    name,
    label,
    labelPosition,
  } = fieldData

  const [rules] = useState<Rule[]>([
    {
      required: ['names', 'email'].includes(name) || mandatory || type === 'password',
      type: (type === 'email' ? 'email' : undefined),
      message: (
        type === 'password'
        ? 'Mínimo 8 caracteres con letras y números, no se permiten caracteres especiales'
        : 'Es un campo necesario'
      ),
    }
  ])

  const isHiddenField = useMemo(() => (
      allInitialValues?.email ? name === 'email' :
      allInitialValues?.names ? name === 'names' :
      false
  ), [allInitialValues])

  return (
    <DynamicFormItem
      fieldData={fieldData}
      rules={rules}
      hidden={isHiddenField}
      initialValue={allInitialValues[name]}
    >
      <Input
        {...props}
        addonBefore={
          labelPosition === 'izquierda' && (
            <span>
              {mandatory && <span style={{ color: 'red' }}>* </span>}
              <strong>{label}</strong>
            </span>
          )
        }
        type={type}
      />
    </DynamicFormItem>
  )
}

export default DynamicTextField
