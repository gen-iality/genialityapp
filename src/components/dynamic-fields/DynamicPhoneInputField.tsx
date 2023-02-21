import * as React from 'react'
import { useIntl } from 'react-intl'
import PhoneInput from 'react-phone-number-input'
import DynamicFormItem from './DynamicFormItem'
import useMandatoryRule from './hooks/useMandatoryRule'
import { IDynamicFieldProps } from './types'

interface IDynamicPhoneInputFieldProps extends IDynamicFieldProps {
  placeholder?: string,
  defaultCountry?: string,
}

const DynamicPhoneInputField: React.FunctionComponent<IDynamicPhoneInputFieldProps> = (props) => {
  const {
    fieldData,
    allInitialValues,
    placeholder = "Phone number",
    defaultCountry = 'CO',
  } = props

  const { name } = fieldData

  const intl = useIntl()

  const { basicRule } = useMandatoryRule(fieldData)

  return (
    <DynamicFormItem
      rules={[basicRule]}
      fieldData={fieldData}
      initialValue={allInitialValues[name]}
    >
      <PhoneInput
        placeholder={intl.formatMessage({
          id: 'form.phone',
          defaultMessage: placeholder,
        })}
        defaultCountry={defaultCountry as unknown as any}
        international
      />
    </DynamicFormItem>
  )
}

export default DynamicPhoneInputField
