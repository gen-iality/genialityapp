import { Select } from 'antd'
import * as React from 'react'
import { useMemo } from 'react'
import DynamicFormItem from './DynamicFormItem'
import useMandatoryRule from './hooks/useMandatoryRule'
import useSearchInSelectOptions from './hooks/useSearchInSelectComponent'
import { IDynamicFieldProps } from './types'

type OptionLike = {
  label: string
  value: any
  [k: string]: any
}

interface IDynamicSelectFieldProps extends IDynamicFieldProps {
  items?: any[]
  isLoading?: boolean
  placeholder?: string
  onChange?: (value: string, option: any) => void
  transformOption?: (option: any) => OptionLike
  afterTransformOptions?: (options: any[]) => OptionLike[]
}

const DynamicSelectField: React.FunctionComponent<IDynamicSelectFieldProps> = (props) => {
  const {
    isLoading,
    items,
    fieldData,
    allInitialValues,
    placeholder = '',
    onChange = () => {},
    transformOption = (option) => option,
    afterTransformOptions = (options) => options,
  } = props

  const { name, options: importedOptions } = fieldData

  const searchInSelectOptions = useSearchInSelectOptions()

  const { basicRule } = useMandatoryRule(fieldData)

  const options = useMemo(() => {
    if (items && items.length > 0) return items
    if (importedOptions && importedOptions.length > 0) return importedOptions
    return []
  }, [items, importedOptions])

  return (
    <DynamicFormItem
      fieldData={fieldData}
      initialValue={allInitialValues[name]}
      rules={options.length === 0 ? [{ required: false }] : [basicRule]}
    >
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={searchInSelectOptions}
        style={{ width: '100%' }}
        disabled={isLoading || options.length === 0}
        loading={isLoading}
        placeholder={placeholder}
        options={afterTransformOptions(options.map((option) => transformOption(option)))}
        onChange={onChange}
      />
    </DynamicFormItem>
  )
}

export default DynamicSelectField
