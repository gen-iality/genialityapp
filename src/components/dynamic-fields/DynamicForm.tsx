import { countryApi } from '@helpers/request';
import { Button, Divider, Form, FormInstance } from 'antd';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DynamicAvatarUploaderField from './DynamicAvatarUploaderField';
import DynamicBooleanField from './DynamicBooleanField';
import DynamicFileUploaderField from './DynamicFileUploaderField';
import DynamicLongTextField from './DynamicLongTextField';
import DynamicMultipleListField from './DynamicMultipleListField';
import DynamicPhoneInputField from './DynamicPhoneInputField';
import DynamicSelectField from './DynamicSelectField';
import DynamicTextField from './DynamicTextField';
import { IDynamicFieldData } from './types';

type FormValuesType = any

interface IDynamicFormProps {
  form: FormInstance,
  dynamicFields: IDynamicFieldData[],
  initialValues: FormValuesType,
  onFinish: (values: FormValuesType) => void,
  onFinishFailed?: (errorInfo: ValidateErrorEntity<FormValuesType>) => void,
  onValueChange?: (changedValues: any, values: FormValuesType) => void,
}

const DynamicForm: React.FunctionComponent<IDynamicFormProps> = (props) => {
  const {
    form,
    initialValues,
    dynamicFields,
    onFinish,
    onFinishFailed = () => {},
    onValueChange = () => {},
  } = props

  const [isLoading, setIsLoading] = useState(false)
  const [lastSelectedCountry, setLastSelectedCountry] = useState<any>(undefined)
  const [allCountries, setAllCountries] = useState<any[]>([])
  // These regions can be changed when the country changes
  const [allRegions, setAllRegions] = useState<any[]>([])
  // Same with the cities
  const [allCities, setAllCities] = useState<any[]>([])

  const requestAllCountries = useCallback(async () => {
    setIsLoading(true)
    console.log('requesting all countries...')
    try {
      const response = await countryApi.getCountries()
      console.log('countries amount', response.length)
      setAllCountries(response)
    } catch (err) {
      console.error(err)
      setAllCountries([])
    }
    setIsLoading(false)
  }, [setIsLoading, setAllCountries])

  const requestAllRegionsByCountry = useCallback(async (countryISO: string) => {
    setIsLoading(true)
    console.log('requesting all regions...')
    try {
      const response = await countryApi.getStatesByCountry(countryISO)
      console.log('regions amount', response.length)
      setAllRegions(response)
    } catch (err) {
      console.error(err)
      setAllRegions([])
    }
    setIsLoading(false)
  }, [])

  const requestAllCitiesByCountryRegion = useCallback(async (countryISO: string, regionUnique?: string) => {
    setIsLoading(true)
    console.log('requesting all cities...', {countryISO, regionUnique})
    try {
      const allData: any[] = []
      if (regionUnique) {
        const response = await countryApi.getCities(countryISO, regionUnique)
        allData.push(...response)
      } else {
        const response = await countryApi.getCitiesByCountry(countryISO)
        allData.push(...response)
      }
      console.log('cities amount', allData.length)
      setAllCities(allData)
    } catch (err) {
      console.error(err)
      setAllCities([])
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    requestAllCountries()
  }, [])

  const Fields = useMemo(() => dynamicFields.map((field, index) => {

    if (field.visibleByAdmin) return
    if (['contrasena', 'password'].includes(field.name)) return

    const {
      type = 'text',
      label,
      mandatory,
    } = field

    // This is simple
    if (type === 'tituloseccion') {
      return (
        <div key={`g ${index}`}>
          <div className={`label has-text-grey ${mandatory ? 'required' : ''}`}>
            <div dangerouslySetInnerHTML={{ __html: label }}></div>
          </div>
          <Divider />
      </div>
      )
    }

    if (type === 'boolean') {
      return <DynamicBooleanField fieldData={field} allInitialValues={initialValues} />
    }

    if (type === 'longtext') {
      return <DynamicLongTextField fieldData={field} allInitialValues={initialValues} />
    }

    if (type === 'multiplelist') {
      return <DynamicMultipleListField fieldData={field} allInitialValues={initialValues} />
    }

    if (type === 'file') {
      return <DynamicFileUploaderField fieldData={field} allInitialValues={initialValues} />
    }

    if (type === 'avatar') {
      return <DynamicAvatarUploaderField form={form} fieldData={field} allInitialValues={initialValues} />
    }

    if (type === 'country') {
      return (
        <DynamicSelectField
          fieldData={field}
          allInitialValues={initialValues}
          isLoading={isLoading}
          onChange={(value, option) => {
            if (Array.isArray(option)) {
              [option] = option
            }
            console.debug('chosen country:', {option})
            requestAllRegionsByCountry(option.key)
            setLastSelectedCountry(option.key) // I dont like using external state...
          }}
          items={allCountries}
          placeholder="Seleccione un país"
          transformOption={(country) => (
            {
              label: country.name,
              value: country.iso2,
              key: country.iso2,
            }
          )}
        />
      )
    }

    if (type === 'region') {
      return (
        <DynamicSelectField
          fieldData={field}
          allInitialValues={initialValues}
          isLoading={isLoading}
          onChange={(value, option) => {
            console.debug('chosen region:', {option, lastSelectedCountry})
            requestAllCitiesByCountryRegion(lastSelectedCountry, (option as unknown as any).key)
          }}
          items={allRegions}
          placeholder="Seleccione una región"
          transformOption={(region) => (
            {
              label: region.name,
              value: region.name,
              key: region.iso2,
            }
          )}
        />
      )
    }

    if (type === 'city') {
      return (
        <DynamicSelectField
          fieldData={field}
          allInitialValues={initialValues}
          isLoading={isLoading}
          onChange={(value, option) => {}}
          items={allCities}
          placeholder="Seleccione una ciudad"
          transformOption={(city) => (
            {
              label: city.name,
              value: city.name,
              key: city.iso2 ?? city.id,
            }
          )}
        />
      )
    }

    if (type === 'list') {
      // NOTE: the feature of unique by user is not implement yet
      return (
        <DynamicSelectField
          fieldData={field}
          allInitialValues={initialValues}
          afterTransformOptions={(options) => [
            { label: 'Seleccionar...', value: '' },
            ...options,
          ]}
        />
      )
    }

    if (type === 'codearea') {
      return <DynamicPhoneInputField fieldData={field} allInitialValues={initialValues} />
    }

    if (type === 'multiplelisttable') {
      return <DynamicMultipleListField fieldData={field} allInitialValues={initialValues} />
    }

    return <DynamicTextField fieldData={field} allInitialValues={initialValues} />

  }), [dynamicFields, allCountries, allRegions, allCities, isLoading, lastSelectedCountry, setLastSelectedCountry])
  
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValueChange}
    >
      {Fields.filter((field) => !!field)}

      <Form.Item>
        <Button htmlType="submit">Enviar</Button>
      </Form.Item>
    </Form>
  );
};

export default DynamicForm;
