import { Checkbox } from 'antd'
import { Rule } from 'antd/lib/form'
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import DynamicFormItem from './DynamicFormItem'
import useMandatoryRule from './hooks/useMandatoryRule'
import { IDynamicFieldProps } from './types'

type IDynamicBooleanFieldProps = IDynamicFieldProps

const DynamicBooleanField: React.FunctionComponent<IDynamicBooleanFieldProps> = (
  props,
) => {
  const { fieldData, allInitialValues } = props

  const { name, mandatory, label, props: secondProps } = fieldData

  const [rules, setRules] = useState<Rule[]>([])

  const intl = useIntl()

  const requiredFieldErrorMessage = intl.formatMessage({ id: 'form.field.required' })

  const { basicRule } = useMandatoryRule(fieldData, requiredFieldErrorMessage)

  // Clone the basic rule and inject the type for email type
  useEffect(() => {
    const newRule: Rule = { ...basicRule }
    ;(newRule.validator = (rule, value) => {
      if (mandatory) {
        return value ? Promise.resolve() : Promise.reject(requiredFieldErrorMessage)
      } else {
        return value || !value || value == '' || value == undefined
          ? Promise.resolve()
          : Promise.reject(requiredFieldErrorMessage)
      }
    }),
      setRules([newRule])
  }, [basicRule])

  // Create a copy of the fieldData object without the label property
  const fieldDataWithoutLabel = useMemo(() => {
    const newFieldData = { ...fieldData }
    newFieldData.label = ''
    return newFieldData
  }, [fieldData])

  return (
    <DynamicFormItem
      fieldData={fieldDataWithoutLabel}
      rules={rules}
      valuePropName="checked"
      initialValue={allInitialValues[name]}
    >
      <Checkbox
        {...secondProps}
        name={name}
        defaultChecked={!!allInitialValues[name]} // Removable because `initialValue`
      >
        {' '}
        {mandatory && <span style={{ color: 'red' }}>*</span>}
        <span dangerouslySetInnerHTML={{ __html: label }}></span>
      </Checkbox>
    </DynamicFormItem>
  )
}

export default DynamicBooleanField
