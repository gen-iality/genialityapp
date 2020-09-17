import React, {useState, useEffect} from 'react'
import { Select  } from "antd";
const { Option } = Select;

export default function FilterNetWorking({properties, filterProperty}) {
    const [options, setOptions] = useState([])

    useEffect(()=>{
        const propertySelected =  properties.filter(property => property.name === filterProperty);
        console.log('property Selected', propertySelected)    
        setOptions(propertySelected.options)
    },[properties, filterProperty])

    return (
        <>
        {options && (
            <Select 
            placeholder="Seleccione una opción" 
            style={{ width: '240px' }} >
                {options.map((value, index)=>{
                    return <Option key={index} >{`val${value}`}</Option>               
                })}
            </Select>
        )}
        </>
    )
}
