/**
 * This module define a component of form that enables edit the organization
 * properties data of an specify organization user.
 */

// React stuffs
import * as React from 'react'
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'

// Ant Design stuffs
import {
  Button,
  Form,
  Col,
  Card,
  Typography,
  Divider,
} from 'antd'

// API methods
import { UsersApi, TicketsApi, EventsApi, EventFieldsApi, countryApi } from '@helpers/request'

import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { useIntl } from 'react-intl'

import { IDynamicFieldData } from '../../dynamic-fields/types'
import DynamicTextField from '../..//dynamic-fields/DynamicTextField'
import DynamicLongTextField from '../..//dynamic-fields/DynamicLongTextField'
import DynamicMultipleListField from '../..//dynamic-fields/DynamicMultipleListField'
import DynamicFileUploaderField from '@components/dynamic-fields/DynamicFileUploaderField'
import DynamicAvatarUploaderField from '@components/dynamic-fields/DynamicAvatarUploaderField'
import DynamicSelectField from '@components/dynamic-fields/DynamicSelectField'
import DynamicPhoneInputField from '@components/dynamic-fields/DynamicPhoneInputField'
import DynamicBooleanField from '@components/dynamic-fields/DynamicBooleanField'

const {
  Text,
  Paragraph,
  Title,
} = Typography

const centerStyle: any = {
  margin: '0 auto',
  textAlign: 'center',
}

const textLeftStyle: any = {
  textAlign: 'left',
  width: '100%',
  padding: '10px',
}

type FormValuesType = any

interface IOrganizationPropertiesFormProps {
  basicDataUser: object,
  orgMember: any,
  organization: any,
  onProperyChange: (propertyName: string, propertyValue: any) => void,
  otherFields?: IDynamicFieldData[],
  // initialOtherValues: let us set our initial values for
  onSubmit?: (values: any) => void,
}

const OrganizationPropertiesForm: React.FunctionComponent<IOrganizationPropertiesFormProps> = (props) => {
  const {
    otherFields = []
  } = props

  const intl = useIntl()

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [dynamicFields, setDynamicFields] = useState<IDynamicFieldData[]>(
    props.organization.user_properties || otherFields
  )
  // This state will be used for the form
  const [initialValues, setInitialValues] = useState<FormValuesType>({})

  const [lastSelectedCountry, setLastSelectedCountry] = useState<any>(undefined)
  const [allCountries, setAllCountries] = useState<any[]>([])
  // These regions can be changed when the country changes
  const [allRegions, setAllRegions] = useState<any[]>([])
  // Same with the cities
  const [allCities, setAllCities] = useState<any[]>([])

  const [form] = Form.useForm<FormValuesType>()

  // Hookable function
  /**
   * @param {label: string, value: string} option
   */
  const searchInSelectComponent = useCallback((input: string, option: any) => (
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    || (option?.value ?? '').toLowerCase().includes(input.toLowerCase())
  ), [])

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

  const requestAllRegionsByCountry = async (countryISO: string) => {
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
  }

  const requestAllCitiesByCountryRegion = async (countryISO: string, regionUnique?: string) => {
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
  }

  const onFinish = useCallback((values: FormValuesType) => {
    setIsSubmiting(true)
    console.debug('form will submit:', { values })
    props.onSubmit && props.onSubmit(values)
    setIsSubmiting(false)
  }, [])

  const onFinishFailed = useCallback((errorInfo: ValidateErrorEntity<FormValuesType>) => {
    // TODO: implement a code like of `showGeneralMessage`, but nice
  }, [])

  const onValueChange = useCallback((changedValues: any, values: FormValuesType) => {
    console.info(changedValues)
    // TODO: validate empty fields here
    for (let key in changedValues) {
      const value: any = changedValues[key]
      props.onProperyChange(key, value)
    }
    // TODO: update field visibility
  }, [props.onProperyChange])

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

  useEffect(() => {
    requestAllCountries()
  }, [])

  useEffect(() => {
    setInitialValues((previous: any) => (
      {
        ...previous,
        ...(props.basicDataUser || {}),
      }
    ))
  }, [props.basicDataUser])

  return (
    <Col xs={24} sm={22} md={24} lg={24} xl={24} style={centerStyle}>
      {isSubmiting ? (
        <LoadingOutlined style={{ fontSize: '50px' }} />
      ) : (
        <Card bordered={false} bodyStyle={textLeftStyle}>
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
        </Card>
      )}
    </Col>
  );
};

export default OrganizationPropertiesForm
