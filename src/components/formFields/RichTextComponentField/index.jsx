import FormItem from 'antd/es/form/FormItem'
import { Field } from 'formik'
import { concat, omit, pick } from 'ramda'
import { isValidNumber, isNotValidNumber } from 'ramda-adjunct'
import React, { useCallback, useRef } from 'react'
import EviusReactQuill from "../../shared/eviusReactQuill";

import { toolbarEditor } from '../../../helpers/constants'

const FORM_ITEM_PROPS_KEYS = ['label', 'required']
const NOT_PROPS_KEYS = concat(FORM_ITEM_PROPS_KEYS, ['component', 'name', 'maxLength', 'children'])

function RichTextComponentField(rawProps) {
  const editorRef = useRef()
  const props = omit(NOT_PROPS_KEYS, rawProps)
  const formItemProps = pick(FORM_ITEM_PROPS_KEYS, rawProps)
  const { maxLength, name } = rawProps

  const validate = useCallback(() => {
    if (editorRef && editorRef.current && typeof editorRef.current.getEditor === 'function') {
      const editor = editorRef.current.getEditor()
      const textLength = editor.getLength() - 1

      if (formItemProps.required && textLength <= 0) {
        return 'Este campo es requerido'
      }
      if (isValidNumber(maxLength) && textLength > maxLength) {
        return `Este campo no debe tener mas de ${maxLength} caracteres`
      }
    }

    return undefined
  }, [formItemProps.required, maxLength])

  return (
    <Field
      name={name}
      validate={validate}
    >
      {({ field, form, meta }) => {
        const fieldError = meta.touched && meta.error

        return (
          <FormItem
            label={formItemProps.label}
            required={formItemProps.required}
            help={fieldError}
            validateStatus={fieldError ? "error" : undefined}
          >            
            <EviusReactQuill              
              value={field.value}              
              onChange={(newValue, _delta, _source, editor) => {
                const currentValue = field.value
                const newLength = editor.getLength() - 1

                if (isNotValidNumber(maxLength)) {
                  form.setFieldValue(field.name, newValue)
                } else {
                  if (newLength <= maxLength) {
                    form.setFieldValue(field.name, newValue)
                  } else {
                    form.setFieldValue(field.name, currentValue)
                  }
                }

              }}
            />
          </FormItem>
        )
      }}
    </Field>
  )
}

export default RichTextComponentField
