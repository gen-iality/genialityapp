import { Select } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { getIn } from 'formik'
import { isArray } from 'ramda-adjunct'
import { omit, path, pathOr, pick } from 'ramda'
import React, { useCallback } from 'react'

function optionsMapper(option, index) {
  const value = path(['value'], option)
  const label = path(['label'], option)
  const key = pathOr(`option-${index}-${value}`, ['key'], option)

  return (
    <Option key={key} value={value}>{label}</Option>
  )
}

const { Option } = Select
const formikProps = ['form', 'field', 'meta']
const formItemProps = ['label', 'required']
const notProps = [...formikProps, ...formItemProps, 'options', 'children']

function SelectField(rawProps) {
  const props = omit(notProps, rawProps)
  const _formik = pick(formikProps, rawProps)
  const _formItem = pick(formItemProps, rawProps)
  const { children, options } = rawProps

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
      <Select
        {...props}
        {..._formik.field}
        onBlur={handleBlur}
        onChange={handleChange}
      >
        {isArray(options)
          ? options.map(optionsMapper)
          : children
        }
      </Select>
    </FormItem>
  )
}

export default SelectField
