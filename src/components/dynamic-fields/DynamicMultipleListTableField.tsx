import { Rule } from 'antd/lib/form'
import ReactSelect from 'react-select'
import * as React from 'react'
import { useEffect, useState } from 'react'
import DynamicFormItem from './DynamicFormItem'
import useMandatoryRule from './hooks/useMandatoryRule'
import { IDynamicFieldProps } from './types'

interface IDynamicMultipleListTableFieldProps extends IDynamicFieldProps {
}

const DynamicMultipleListTableField: React.FunctionComponent<IDynamicMultipleListTableFieldProps> = (props) => {
  const {
    fieldData,
    allInitialValues,
  } = props

  const { name, options } = fieldData

  const [rules, setRules] = useState<Rule[]>([])

  const { basicRule } = useMandatoryRule(fieldData)

  // Clone the basic rule and inject a validator & transform method
  useEffect(() => {
    const newRule: Rule = { ...basicRule }
    newRule.transform = (value) => {
      const transformed = value.map((item: any) => item.value)
      console.debug('transformed', transformed)
      return transformed
    }
    newRule.validator = (_, value) => {
      if (value.length > 0) return Promise.resolve()
      return Promise.reject(`${name} is empty`)
    }
    setRules([newRule])
    console.log('update rules')
  }, [basicRule])

  return (
    <DynamicFormItem
      rules={rules}
      fieldData={fieldData}
      initialValue={allInitialValues[name]}
    >
      <ReactSelect
        isMulti
        options={options}
      />
    </DynamicFormItem>
  )
}

export default DynamicMultipleListTableField
