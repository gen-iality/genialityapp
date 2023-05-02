/** React's libraries */
import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'

/** Antd imports */
import { Checkbox, Typography } from 'antd'
import { Rule } from 'antd/lib/form'

/** Hooks, helpers and utils */
import { IDynamicFieldProps } from './types'
import useMandatoryRule from './hooks/useMandatoryRule'

/** Components */
import DynamicFormItem from './DynamicFormItem'

interface IDynamicTermsAndCondictionsFieldProps extends IDynamicFieldProps {}

const DynamicTermsAndCondictionsField: React.FunctionComponent<
  IDynamicTermsAndCondictionsFieldProps
> = (props) => {
  const { fieldData, allInitialValues } = props

  const { name, mandatory, label, link, props: secondProps } = fieldData

  const [rules, setRules] = useState<Rule[]>([])

  const intl = useIntl()

  const requiredFieldErrorMessage = intl.formatMessage({ id: 'form.field.required' })

  const { basicRule, setCondiction } = useMandatoryRule(
    fieldData,
    requiredFieldErrorMessage,
  )

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

  const TTCC = () => (
    <Typography.Text>
      Acepto que he leído y entendido los{' '}
      <Typography.Link target="_blank" href={link || '#'}>
        términos y condiciones
      </Typography.Link>
      .
    </Typography.Text>
  )

  return (
    <DynamicFormItem
      fieldData={fieldDataWithoutLabel}
      rules={rules}
      valuePropName="checked"
      initialValue={allInitialValues[name]}>
      <Checkbox
        {...secondProps}
        name={name}
        defaultChecked={!!allInitialValues[name]} // Removable because `initialValue`
      >
        {mandatory ? (
          <span>
            <span style={{ color: 'red' }}>*</span>{' '}
            <strong>
              <TTCC />
            </strong>
          </span>
        ) : (
          <TTCC />
        )}
      </Checkbox>
    </DynamicFormItem>
  )
}

export default DynamicTermsAndCondictionsField
