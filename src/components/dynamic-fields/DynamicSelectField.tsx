import { Select } from 'antd';
import * as React from 'react';
import DynamicFormItem from './DynamicFormItem';
import useMandatoryRule from './hooks/useMandatoryRule';
import useSearchInSelectOptions from './hooks/useSearchInSelectComponent';
import { IDynamicFieldProps } from './types';

type OptionLike = {
  label: string,
  value: any,
  [k: string]: any,
}

interface IDynamicSelectFieldProps extends IDynamicFieldProps {
  items: any[],
  isLoading?: boolean,
  placeholder?: string,
  onChange?: (value: string, option: any) => void,
  transformOption: (option: any) => OptionLike,
}

const DynamicSelectField: React.FunctionComponent<IDynamicSelectFieldProps> = (props) => {
  const {
    isLoading,
    items,
    fieldData,
    allInitialValues,
    placeholder = '',
    transformOption,
    onChange = () => {},
  } = props

  const { name } = fieldData

  const searchInSelectOptions = useSearchInSelectOptions()

  const { basicRule } = useMandatoryRule(fieldData)

  return (
    <DynamicFormItem
      fieldData={fieldData}
      initialValue={allInitialValues[name]}
      rules={[basicRule]}
    >
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={searchInSelectOptions}
        style={{ width: '100%' }}
        disabled={isLoading || items.length === 0}
        loading={isLoading}
        placeholder={placeholder}
        options={items.map((item) => transformOption(item))}
        onChange={onChange}
      />
    </DynamicFormItem>
  );
};

export default DynamicSelectField;
