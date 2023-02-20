import { Checkbox, Typography } from 'antd';
import { Rule } from 'antd/lib/form';
import * as React from 'react';
import { useEffect, useState } from 'react';
import DynamicFormItem from './DynamicFormItem';
import { IDynamicFieldProps } from './types';
import useMandatoryRule from './useMandatoryRule';

interface IDynamicMultipleListFieldProps extends IDynamicFieldProps {
}

const DynamicMultipleListField: React.FunctionComponent<IDynamicMultipleListFieldProps> = (props) => {
  const {
    fieldData,
    allInitialValues,
  } = props

  const {
    name,
    options = []
  } = fieldData

  const [rules, setRules] = useState<Rule[]>([])

  const { basicRule } = useMandatoryRule(fieldData)

  // Clone the basic rule and inject a validator method
  useEffect(() => {
    const newRule: Rule = { ...basicRule }
    newRule.validator = (_, value) => {
      if (value.length > 0) return Promise.resolve()
      return Promise.reject(`${name} is empty`)
    }
    setRules([newRule])
    console.log('update rules')
  }, [basicRule])

  if (options.length === 0) {
    return (
      <Typography.Text>
        No hay opciones para selecciona
      </Typography.Text>
    )
  }

  return (
    <DynamicFormItem
      fieldData={fieldData}
      rules={rules}
      initialValue={allInitialValues[name]}
    >
      <Checkbox.Group options={options} />
    </DynamicFormItem>
  );
};

export default DynamicMultipleListField;
