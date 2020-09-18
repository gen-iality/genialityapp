import React, {useState, useEffect} from 'react'
import { Select  } from "antd";
const { Option } = Select;

export default function FilterNetWorking({properties, filterProperty, handleSelect}) {
    const [options, setOptions] = useState([])

    useEffect(()=>{
        const propertySelected =  properties.filter(property => property.name === filterProperty);
        const options = propertySelected[0].options    
        setOptions(options)    
    },[properties, filterProperty])

    
    return (
        <Select
        style={{ width: '330px', marginBottom: '15px' }}
        onChange={handleSelect}
        placeholder={`Seleccione ${filterProperty}`}
        >
            {options.map((option, index)=>{
                return <Option key={index} value={option.value}>{option.label}</Option>               
            })}
        </Select>
    )
}
