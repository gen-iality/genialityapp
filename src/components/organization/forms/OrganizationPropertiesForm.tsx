/**
 * This module define a component of form that enables edit the organization
 * properties data of an specify organization user.
 */

// React stuffs
import * as React from 'react'
import { useState, useEffect, useCallback } from 'react'

// Ant Design stuffs
import { Form, Col, Card } from 'antd'

import { LoadingOutlined } from '@ant-design/icons'
import { ValidateErrorEntity } from 'rc-field-form/lib/interface'

import { IDynamicFieldData } from '../../dynamic-fields/types'

import DynamicForm from '@components/dynamic-fields/DynamicForm'
import { FormInstance } from 'antd/es/form/Form'

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

  const [newForm] = Form.useForm<FormValuesType>()

  const [isSubmiting, setIsSubmiting] = useState(false)
  const [form, setForm] = useState<FormInstance | undefined>(props.form)
  const [dynamicFields] = useState<IDynamicFieldData[]>(
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
