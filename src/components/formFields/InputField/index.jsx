import { Input } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { getIn } from 'formik'
import { concat, omit, pick } from 'ramda'
import React from 'react'

const formikProps = ['form', 'field', 'meta']
const formItemProps = ['label', 'required']
const notProps = concat(formikProps, formItemProps)

function InputField(rawProps) {
  const props = omit(notProps, rawProps)
  const _formik = pick(formikProps, rawProps)
  const _formItem = pick(formItemProps, rawProps)

  const fieldError = getIn(_formik.form.touched, _formik.field.name) && getIn(_formik.form.errors, _formik.field.name)

  return (
    <FormItem
      label={_formItem.label}
      required={_formItem.required}
      help={fieldError}
      validateStatus={fieldError ? "error" : undefined}
    >
      <Input
        {...props}
        {..._formik.field}
      />
    </FormItem>
  )
}

export default InputField
