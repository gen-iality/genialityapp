import { Select } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { getIn } from 'formik';
import { isArray } from 'ramda-adjunct';
import { omit, path, pathOr, pick } from 'ramda';
import { useCallback } from 'react';

function optionsMapper(option, index) {
  const value = path(['value'], option);
  const label = path(['label'], option);
  const key = pathOr(`option-${index}-${value}`, ['key'], option);

  return (
    <Option key={key} value={value}>
      {label}
    </Option>
  );
}

const { Option } = Select;
const FORMIK_PROPS_KEYS = ['form', 'field', 'meta'];
const FORM_ITEM_PROPS_KEYS = ['label', 'required'];
const NOT_PROPS_KEYS = [...FORMIK_PROPS_KEYS, ...FORM_ITEM_PROPS_KEYS, 'options', 'children'];

function SelectField(rawProps) {
  const props = omit(NOT_PROPS_KEYS, rawProps);
  const formikProps = pick(FORMIK_PROPS_KEYS, rawProps);
  const formItemProps = pick(FORM_ITEM_PROPS_KEYS, rawProps);
  const { children, options } = rawProps;

  const fieldError =
    getIn(formikProps.form.touched, formikProps.field.name) && getIn(formikProps.form.errors, formikProps.field.name);

  const handleChange = useCallback(
    (newValue) => {
      formikProps.form.setFieldValue(formikProps.field.name, newValue);
    },
    [formikProps.field.name, formikProps.form]
  );

  const handleBlur = useCallback(() => {
    formikProps.form.setFieldTouched(formikProps.field.name, true);
  }, [formikProps.field.name, formikProps.form]);

  return (
    <FormItem
      label={formItemProps.label}
      required={formItemProps.required}
      help={fieldError}
      validateStatus={fieldError ? 'error' : undefined}>
      <Select {...props} {...formikProps.field} onBlur={handleBlur} onChange={handleChange}>
        {isArray(options) ? (
          <>
            <Option value=''>Seleccionar una opción</Option>
            {options.map(optionsMapper)}
          </>
        ) : (
          children
        )}
      </Select>
    </FormItem>
  );
}

export default SelectField;
