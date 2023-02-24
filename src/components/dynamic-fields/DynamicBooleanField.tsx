import { Checkbox } from 'antd';
import { Rule } from 'antd/lib/form';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import DynamicFormItem from './DynamicFormItem';
import useMandatoryRule from './hooks/useMandatoryRule';
import { IDynamicFieldProps } from './types';

interface IDynamicBooleanFieldProps extends IDynamicFieldProps {
}

const DynamicBooleanField: React.FunctionComponent<IDynamicBooleanFieldProps> = (props) => {
  const {
    fieldData,
    allInitialValues,
  } = props

  const {
    name,
    mandatory,
    label,
    props: secondProps,
  } = fieldData
  
  const [rules, setRules] = useState<Rule[]>([])

  const intl = useIntl()
  
  const requiredFieldErrorMessage = intl.formatMessage({ id: 'form.field.required' })
  
  const {basicRule, setCondiction} = useMandatoryRule(fieldData, requiredFieldErrorMessage)

  // Clone the basic rule and inject the type for email type
  useEffect(() => {
    const newRule: Rule = { ...basicRule }
    newRule.validator = (rule, value) => {
      if (mandatory) {
        return value === true
          ? Promise.resolve()
          : Promise.reject(requiredFieldErrorMessage)
      } else {
        return value == true || value == false || value == '' || value == undefined
          ? Promise.resolve()
          : Promise.reject(requiredFieldErrorMessage)
      }
    },
    setRules([newRule])
  }, [basicRule])

  return (
    <DynamicFormItem
      fieldData={fieldData}
      rules={rules}
      valuePropName="checked"
      initialValue={allInitialValues[name]}
    >
      <Checkbox
        {...secondProps}
        name={name}
        defaultChecked={!!allInitialValues[name]} // Removable because `initialValue`
      >
        {mandatory ? (
          <span>
            <span style={{ color: 'red' }}>*</span>
            {' '}
            <strong>{label}</strong>
          </span>
        ) : (
          label
        )}
      </Checkbox>
    </DynamicFormItem>
  )
};

export default DynamicBooleanField;
