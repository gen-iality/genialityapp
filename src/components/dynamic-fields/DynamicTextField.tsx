import * as React from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { Rule } from 'antd/lib/form'
import { IDynamicFieldProps } from './types'
import DynamicFormItem from './DynamicFormItem'
import { useEffect, useMemo, useState } from 'react'
import { Input } from 'antd'
import useMandatoryRule from './hooks/useMandatoryRule'


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
    props: secondProps,
  } = fieldData

  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [rules, setRules] = useState<Rule[]>([])

  const {basicRule, setCondiction} = useMandatoryRule(fieldData, errorMessage)

  const isHiddenField = useMemo(() => (
      (allInitialValues?.email && name === 'email') ||
      (allInitialValues?.names && name === 'names') ||
      false
  ), [allInitialValues])

  // Set the second condiction to be required, additional of mandatory
  useEffect(() => {
    setCondiction(['names', 'email'].includes(name) || type === 'password')
    if (type === 'password') {
      setErrorMessage('Mínimo 8 caracteres con letras y números, no se permiten caracteres especiales')
    }
  }, [type, name])

  // Clone the basic rule and inject the type for email type
  useEffect(() => {
    const newRule: Rule = { ...basicRule }
    newRule.type = (type === 'email' ? 'email' : undefined)
    setRules([newRule])
  }, [basicRule, type])

  return (
    <DynamicFormItem
      fieldData={fieldData}
      rules={rules}
      hidden={isHiddenField}
      initialValue={allInitialValues[name]}
    >
      <Input
        {...secondProps}
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
