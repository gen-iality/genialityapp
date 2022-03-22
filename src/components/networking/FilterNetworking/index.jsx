import { useState, useEffect } from 'react';
import { Select } from 'antd';
const { Option } = Select;

export default function FilterNetWorking({ properties, filterProperty, handleSelect }) {
  const [options, setOptions] = useState([]);
  properties = properties || [];
  useEffect(() => {
    const propertySelected = properties.filter((property) => property.name === filterProperty);
    const options = propertySelected[0] ? propertySelected[0].options : [];

    setOptions(options);
  }, [properties, filterProperty]);

  return (
    <Select
      style={{ textAlign: 'left' }}
      size={'middle'}
      onChange={handleSelect}
      placeholder={`Seleccione ${filterProperty}`}
      defaultValue=''>
      <option key={0} value=''>
        Ver todo
      </option>
      {options.map((option, index) => {
        return (
          <Option key={index + 1} value={option.value}>
            {option.label}
          </Option>
        );
      })}
    </Select>
  );
}
