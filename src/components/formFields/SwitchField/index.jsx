import { Switch } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { getIn } from 'formik'
import { concat, omit, pick } from 'ramda'
import React, { useCallback } from 'react'

const formikProps = ['form', 'field', 'meta']
const formItemProps = ['label', 'required']
const notProps = concat(formikProps, formItemProps)
const switchStyle = { marginRight: '10px' }

function SwitchField(rawProps) {
  const props = omit(notProps, rawProps)
  const _formik = pick(formikProps, rawProps)
  const _formItem = pick(formItemProps, rawProps)

  const fieldError = getIn(_formik.form.touched, _formik.field.name) && getIn(_formik.form.errors, _formik.field.name)

  const handleChange = useCallback((newValue) => {
    _formik.form.setFieldValue(_formik.field.name, newValue)
  }, [_formik.field.name, _formik.form])

  const handleBlur = useCallback(() => {
    _formik.form.setFieldTouched(_formik.field.name, true)
  }, [_formik.field.name, _formik.form])

  return (
    <FormItem
      label={_formItem.label}
      required={_formItem.required}
      help={fieldError}
      validateStatus={fieldError ? "error" : undefined}
    >
      <Switch
        style={switchStyle}
        {...props}
        name={_formik.field.name}
        checked={_formik.field.value}
        onBlur={handleBlur}
        onChange={handleChange}
      />
    </FormItem>
  )
}

export default SwitchField
