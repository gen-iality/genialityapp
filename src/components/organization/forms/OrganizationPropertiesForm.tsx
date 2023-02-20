/**
 * This module define a component of form that enables edit the organization
 * properties data of an specify organization user.
 */

// React stuffs
import * as React from 'react'
import {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react'

// Ant Design stuffs
import {
  Button,
  Form,
  Col,
  Row,
  Card,
  Typography,
  Input,
  Divider,
  Checkbox,
  Collapse,
  Select,
  Upload,
} from 'antd'

// API methods
import { UsersApi, TicketsApi, EventsApi, EventFieldsApi, countryApi } from '@helpers/request'

import { areaCode } from '@helpers/constants'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'
import { Rule, ValidateErrorEntity } from 'rc-field-form/lib/interface'
import { useIntl } from 'react-intl'

import ReactSelect from 'react-select'
import { DispatchMessageService } from '@context/MessageService'
import { RcFile, UploadFile } from 'antd/lib/upload/interface'
import ImgCrop from 'antd-img-crop'

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

// This type should be used in the options written in helpers/constants.jsx
type FieldType = 'text'
  | 'country'
  | 'region'
  | 'city'
  | 'longtext'
  | 'email'
  | 'number'
  | 'list'
  | 'multiplelist'
  | 'date'
  | 'boolean'
  | 'file'
  | 'complex'
  | 'tituloseccion'
  | 'password'
  | 'multiplelisttable'
  | 'codearea'
  | 'onlyCodearea'
  | 'avatar' // Is it new?

type DynamicField = {
  type?: FieldType,
  props?: any,
  name: string,
  label: string,
  mandatory: boolean,
  description?: string,
  labelPosition: any, // NOTE: Check this
  visibleByAdmin?: boolean,
  options?: { label: string, value: string }[]
}

type FormValuesType = any

interface IOrganizationPropertiesFormProps {
  basicDataUser: object,
  orgMember: any,
  organization: any,
  onProperyChange: (propertyName: string, propertyValue: any) => void,
  otherFields?: DynamicField[],
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
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>(
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

  const getFilenameFromURL = useCallback((url: any) => {
    if (typeof url !== 'string') return null
    const splittedUrl = url.split('/')
    return splittedUrl[splittedUrl.length - 1]
  }, [])

  const handleBeforeUpload = useCallback((file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      DispatchMessageService({
        type: 'error',
        msj: 'Image must smaller than 5MB!',
        action: 'show',
      })
    }
    return isLt5M ? true : false
  }, [])

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

  /**
   * Count the fields that are different to common organization user fields
   */
  const dynamicFieldsLength: number = useMemo(() => (
    dynamicFields
      .filter((field) => (
        !['names', 'email'].includes(field.name)
        && (field.type !== 'password' || field.name === 'contrasena')
      )).length
  ), [dynamicFields])

  const Fields = useMemo(() => dynamicFields.map((field, index) => {
    if (field.visibleByAdmin) return
    if (['contrasena', 'password'].includes(field.name)) return

    const {
      type = 'text',
      props = {},
      name,
      label,
      mandatory,
      description,
      labelPosition,
      options = [],
    } = field

    const target: string = name

    const value = initialValues[target]

    const requiredFieldErrorMessage = intl.formatMessage({ id: 'form.field.required' })

    // visible

    /**
     * Active the validation for region, country or city if there are data.
     */
    const isAciveValidations = 
      type === 'region' ? allRegions.length === 0 :
      type === 'country' ? allCountries.length === 0 :
      type === 'city' ? allCities.length === 0 :
      false
    
    /**
     * It is hidden if the name is email or names.
     */
    const isHiddenField =
      initialValues?.email ? name === 'email' :
      initialValues?.names ? name === 'names' :
      false
    
    // With this we know if the form item is required
    const requirementRule: Rule = {
      required: ['names', 'email'].includes(name) || mandatory || type === 'password',
      type: (type === 'email' ? 'email' : undefined),
      pattern: type === 'password' ? new RegExp(/^[A-Za-z0-9_-]{8,}$/) : undefined,
      message: (
        type === 'password'
        ? 'Mínimo 8 caracteres con letras y números, no se permiten caracteres especiales'
        : 'Es un campo necesario'
      ),
    }

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

    // Medium simple, because that we return only
    if (type === 'boolean') {
      const requirementRule: Rule = {
        required: mandatory,
        validator: (rule, value) => {
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
      }

      return (
        <div key={`div ${index}`}>
          <Form.Item
            valuePropName="checked"
            name={name}
            rules={[requirementRule]}
            key={`item ${index}`}
            initialValue={value}
          >
            <Checkbox
              {...props}
              key={index}
              name={name}
              defaultChecked={!!value}
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
          </Form.Item>

          {description && description.length < 500 && <p>{description}</p>}
          {description && description.length > 500 && (
            <Collapse defaultActiveKey={['0']} style={{ marginBottom: '15px' }}>
              <Collapse.Panel
                key='1'
                header={intl.formatMessage({
                  id: 'registration.message.policy',
                })}
              >
                <pre
                  dangerouslySetInnerHTML={{
                    __html: description,
                  }}
                  style={{ whiteSpace: 'normal' }}
                ></pre>
              </Collapse.Panel>
            </Collapse>
          )}
        </div>
      )
    }

    let CurrentDynamicField: ReactNode

    switch (type) {
      case 'codearea': {
        CurrentDynamicField = (
          <Input
            addonBefore={(
              <Form.Item noStyle name="code">
                <Select
                  showSearch
                  filterOption={searchInSelectComponent}
                  optionFilterProp="children"
                  style={{ fontSize: '12px', width: 150 }}
                  placeholder="Código de area del pais"
                  options={areaCode.map((code) => ({
                    label: `${code.label} (${code.value})`,
                    value: code.value,
                  }))}
                />
              </Form.Item>
            )}
            defaultValue={value?.toString().split()[2]}
            type='number'
            style={{ width: '100%' }}
            placeholder='Numero de telefono'
          />
        )
        break;
      }
      case 'onlyCodearea': {
        CurrentDynamicField = (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={searchInSelectComponent}
            style={{ width: '100%' }}
            onChange={(value) => {
              // form.setFieldsValue({ code: value })
            }}
            placeholder='Código de area del pais'
            options={areaCode.map((code) => ({
              label: `${code.label} (${code.value})`,
              value: code.value,
            }))}
          />
        )
        break;
      }
      case 'multiplelisttable': {
        requirementRule.transform = (value) => {
          const transformed = value.map((item: any) => item.value)
          console.debug('transformed', transformed)
          return transformed
        }
        requirementRule.validator = (_, value) => {
          if (value.length > 0) return Promise.resolve()
          return Promise.reject(`${name} is empty`)
        }
        // TODO: read the documentation of ReactSelect to know how is the props
        //       to set value and get changes
        // NOTE: it can crash 
        CurrentDynamicField = (
          <ReactSelect
            isMulti
            options={options}
          />
        )
        break;
      }
      case 'longtext': {
        CurrentDynamicField = (
          <Input.TextArea
            rows={4}
            autoSize={{ minRows: 3, maxRows: 25 }}
          />
        )
        break;
      }
      case 'multiplelist': {
        if (options.length === 0) {
          CurrentDynamicField = (
            <Text>No hay opciones para selecciona</Text>
          )
        } else {
          // requirementRule.transform = (value) => {
          //   console.log('transform:', value)
          //   return value
          // }
          // NOTE: this rule additional stuffs should be in the requirementRule
          //       definition, no here
          requirementRule.validator = (_, value) => {
            if (value.length > 0) return Promise.resolve()
            return Promise.reject(`${name} is empty`)
          }
          CurrentDynamicField = (
            <Checkbox.Group
              options={options}
              // defaultValue={value}
              // onChange={(checkedValues) => {
              //   value = JSON.stringify(checkedValues);
              // }}
            />
          )
        }
        break;
      }
      case 'file': {
        requirementRule.transform = (value: any) => {
          return value.fileList[0].name
        }
        CurrentDynamicField = (
          <Upload
            accept="application/pdf,image/png, image/jpeg,image/jpg,application/msword,.docx"
            action="https://api.evius.co/api/files/upload/"
            multiple={false}
            listType="text"
            beforeUpload={handleBeforeUpload}
            // defaultFileList={
            //   value
            //     ? [
            //         {
            //           name: typeof value == 'string' ? getFilenameFromURL(value) : null,
            //           url: typeof value == 'string' ? value : null,
            //         },
            //       ]
            //     : []
            // }
          >
            <Button icon={<UploadOutlined />}>Subir</Button>
          </Upload>
        )
        break;
      }
      case 'list': {
        // NOTE: the feature of unique by user is not implement yet
        CurrentDynamicField = (
          <Select
            style={{ width: '100%' }}
            options={[
              { label: 'Seleccionar...', value: '' },
              ...options.map((option) => (
                {
                  label: option.label,
                  value: option.value,
                }
              ))
            ]}
          />
        )
        break;
      }
      case 'country': {
        CurrentDynamicField = (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={searchInSelectComponent}
            style={{ width: '100%' }}
            disabled={isLoading || allCountries.length === 0}
            loading={isLoading}
            placeholder="Seleccione un país"
            options={allCountries.map((country) => (
              {
                label: country.name,
                value: country.iso2,
                key: country.iso2,
              }
            ))}
            onChange={(value, option) => {
              if (Array.isArray(option)) {
                [option] = option
              }
              console.debug('chosen country:', {option})
              requestAllRegionsByCountry(option.key)
              setLastSelectedCountry(option.key) // I dont like using external state...
            }}
          />
        )
        break;
      }
      case 'region': {
        CurrentDynamicField = (
          <Select
            showSearch
            filterOption={searchInSelectComponent}
            optionFilterProp="children"
            style={{ width: '100%' }}
            disabled={isLoading || allRegions.length === 0}
            loading={isLoading}
            placeholder="Seleccione una región"
            options={allRegions.map((region) => (
              {
                label: region.name,
                value: region.name,
                key: region.iso2,
              }
            ))}
            onChange={(value, option) => {
              console.debug('chosen region:', {option, lastSelectedCountry})
              requestAllCitiesByCountryRegion(lastSelectedCountry, (option as unknown as any).key)
            }}
          />
        )
        break;
      }
      case 'city': {
        CurrentDynamicField = (
          <Select
            showSearch
            optionFilterProp="children"
            filterOption={searchInSelectComponent}
            loading={isLoading}
            style={{ width: '100%' }}
            disabled={isLoading || allCities.length === 0}
            onChange={(value, option) => {
              // setCity({ name: value, regionCode: option.key, inputName: name });
            }}
            placeholder="Seleccione una ciudad"
            options={allCities.map((city) => (
              {
                label: city.name,
                value: city.name,
                key: city.iso2 ?? city.id,
              }
            ))}
          />
        )
        break;
      }
      case 'avatar': {
        const imageUrl = [{ url: value }]
        requirementRule.transform = (value: any) => {
          console.info('wanna validate', {value})
          return value.fileList[0].name
        }
        requirementRule.validator = (_, value) => {
          console.log('???', value, _)
          return Promise.resolve()
        }
        CurrentDynamicField = (
          <ImgCrop
            rotate
            shape="round"
            // onModalOk={(file) => {
            //   console.log({file})
            //   form.setFieldsValue({ [name]: file })
            // }}
          >
            <Upload
              action="https://api.evius.co/api/files/upload/"
              accept="image/png,image/jpeg"
              onChange={(file) => {
                console.log('file changed', {file})
                form.setFieldsValue({ [name]: file })
              }}
              multiple={false}
              listType="picture"
              maxCount={1}
              onRemove={(file) => {
                console.log('remove', {file})
                form.setFieldsValue({ [name]: undefined })
              }}
              // defaultFileList={
              //   value
              //     ? [
              //         {
              //           name: typeof value == 'string' ? getFilenameFromURL(value) : null,
              //           url: typeof value == 'string' ? value : null,
              //         },
              //       ]
              //     : []
              // }
              beforeUpload={handleBeforeUpload}
            >
              <Button type='primary' icon={<UploadOutlined />}>
                {intl.formatMessage({
                  id: 'form.button.avatar',
                  defaultMessage: 'Subir imagen de perfil',
                })}
              </Button>
            </Upload>
          </ImgCrop>
        )
        break;
      }
      default: {
        CurrentDynamicField = (
          <Input
            {...props}
            addonBefore={
              labelPosition === 'izquierda' && (
                <span>
                  {mandatory && <span style={{ color: 'red' }}>* </span>}
                  <strong>{label}</strong>
                </span>
              )
            }
            type={type}
            // defaultValue={value}
          />
        )
      }
    }

    return (
      <div key={`item ${index}`}>
        {isHiddenField && <code>hidden {name}</code>}
        <>
          {type}
          {':'}
          {name}
          {JSON.stringify(requirementRule)}
          <br />
        </>
        <Form.Item
          noStyle={isHiddenField}
          hidden={isHiddenField}
          valuePropName="value"
          label={
            label
            // (labelPosition !== 'izquierda' || !labelPosition)
            //   ? label
            //   : '' && (labelPosition !== 'arriba' || !labelPosition)
          }
          name={name}
          rules={isAciveValidations ? [{ required: false }] : [requirementRule]}
          key={`item ${index}`}
          initialValue={value}
        >
          {CurrentDynamicField}
        </Form.Item>

        {description && description.length < 500 && <p>{description}</p>}
        {description && description.length > 500 && (
          <Collapse defaultActiveKey={['0']} style={{ marginBottom: '15px' }}>
            <Collapse.Panel
              key='1'
              header={intl.formatMessage({
                id: 'registration.message.policy',
              })}
            >
              <pre style={{ whiteSpace: 'normal' }}>{description}</pre>
            </Collapse.Panel>
          </Collapse>
        )}
      </div>
    )

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
