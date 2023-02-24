import { FormInstance } from 'antd/lib/form'
import * as React from 'react'
import { useIntl } from 'react-intl'
import PhoneInput from 'react-phone-number-input'
import DynamicFormItem from './DynamicFormItem'
import useMandatoryRule from './hooks/useMandatoryRule'
import { IDynamicFieldProps } from './types'

interface IDynamicPhoneInputFieldProps extends IDynamicFieldProps {
  form?: FormInstance,
  placeholder?: string,
  defaultCountry?: string,
}

const DynamicPhoneInputField: React.FunctionComponent<IDynamicPhoneInputFieldProps> = (props) => {
  const {
    form,
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
        onChange={(phone) => {
          if (phone && form) {
            form.setFieldsValue({
              [name]: phone,
            })
          }
        }}
        defaultCountry={defaultCountry as unknown as any}
        international
      />
    </DynamicFormItem>
  )
}

export default DynamicPhoneInputField
