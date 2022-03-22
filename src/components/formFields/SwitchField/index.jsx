import { Switch } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { getIn } from 'formik';
import { concat, omit, pick } from 'ramda';
import { useCallback } from 'react';

const FORMIK_PROPS_KEYS = ['form', 'field', 'meta'];
const FORM_ITEM_PROPS_KEYS = ['label', 'required'];
const NOT_PROPS_KEYS = concat(FORMIK_PROPS_KEYS, FORM_ITEM_PROPS_KEYS);
const switchStyle = { marginRight: '10px' };

function SwitchField(rawProps) {
  const props = omit(NOT_PROPS_KEYS, rawProps);
  const formikProps = pick(FORMIK_PROPS_KEYS, rawProps);
  const formItemProps = pick(FORM_ITEM_PROPS_KEYS, rawProps);

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
      validateStatus={fieldError ? 'error' : undefined}
      labelCol={props.labelCol ? { span: 12 } : ''}>
      <Switch
        style={switchStyle}
        {...props}
        name={formikProps.field.name}
        checked={formikProps.field.value}
        onBlur={handleBlur}
        onChange={handleChange}
        checkedChildren={props.labelCol ? 'Sí' : ''}
        unCheckedChildren={props.labelCol ? 'No' : ''}
      />
    </FormItem>
  );
}

export default SwitchField;
