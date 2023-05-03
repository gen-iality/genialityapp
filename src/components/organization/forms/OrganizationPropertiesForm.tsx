/**
 * This module define a component of form that enables edit the organization
 * properties data of an specify organization user.
 */

// React stuffs
import * as React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'

// Ant Design stuffs
import { Button, Form, Col, Card, Typography, Divider } from 'antd'

// API methods
import {
  UsersApi,
  TicketsApi,
  EventsApi,
  EventFieldsApi,
  countryApi,
} from '@helpers/request'

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
import DynamicForm from '@components/dynamic-fields/DynamicForm'
import { FormInstance } from 'antd/es/form/Form'

const { Text, Paragraph, Title } = Typography

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
  basicDataUser: any
  organization: any
  onProperyChange?: (propertyName: string, propertyValue: any) => void
  otherFields?: IDynamicFieldData[]
  // initialOtherValues: let us set our initial values for
  onSubmit?: (values: any) => void
  form?: FormInstance
  noSubmitButton?: boolean
}

const OrganizationPropertiesForm: React.FunctionComponent<
  IOrganizationPropertiesFormProps
> = (props) => {
  const { noSubmitButton, otherFields = [] } = props

  const intl = useIntl()
  const [newForm] = Form.useForm<FormValuesType>()

  const [isSubmiting, setIsSubmiting] = useState(false)
  const [form, setForm] = useState<FormInstance | undefined>(props.form)
  const [dynamicFields, setDynamicFields] = useState<IDynamicFieldData[]>(
    props.organization.user_properties || otherFields,
  )
  // This state will be used for the form
  const [initialValues, setInitialValues] = useState<FormValuesType>({})

  const onFinish = useCallback((values: FormValuesType) => {
    setIsSubmiting(true)
    console.debug('form will submit:', { values })
    props.onSubmit && props.onSubmit(values)
    setIsSubmiting(false)
  }, [])

  const onFinishFailed = useCallback((errorInfo: ValidateErrorEntity<FormValuesType>) => {
    // TODO: implement a code like of `showGeneralMessage`, but nice
  }, [])

  const onValueChange = useCallback(
    (changedValues: any, values: FormValuesType) => {
      console.info(changedValues)
      // TODO: validate empty fields here
      for (const key in changedValues) {
        const value: any = changedValues[key]
        props.onProperyChange && props.onProperyChange(key, value)
      }
      // TODO: update field visibility
    },
    [props.onProperyChange],
  )

  useEffect(() => {
    setInitialValues((previous: any) => ({
      ...previous,
      ...(props.basicDataUser || {}),
      ID: props.basicDataUser.password, // Clone the ID-password as only ID
    }))
  }, [props.basicDataUser])

  useEffect(() => {
    // Update all fields from the initial values - this can delete last values
    if (form) {
      console.log('(re)set all the form fields')
      form.setFieldsValue(initialValues)
    }
  }, [form, initialValues])

  useEffect(() => {
    if (props.form) {
      setForm(props.form)
    } else {
      setForm(newForm)
    }
  }, [props.form, newForm])

  return (
    <Col xs={24} sm={22} md={24} lg={24} xl={24} style={centerStyle}>
      {isSubmiting ? (
        <LoadingOutlined style={{ fontSize: '50px' }} />
      ) : (
        form && (
          <Card bordered={false} bodyStyle={textLeftStyle}>
            <DynamicForm
              noSubmitButton={noSubmitButton}
              form={form}
              dynamicFields={dynamicFields}
              initialValues={initialValues}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onValueChange={onValueChange}
            />
          </Card>
        )
      )}
    </Col>
  )
}

export default OrganizationPropertiesForm
