import { Input } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import { getIn } from 'formik';
import { concat, omit, pick } from 'ramda';

const FORMIK_PROPS_KEYS = ['form', 'field', 'meta'];
const FORM_ITEM_PROPS_KEYS = ['label', 'required'];
const NOT_PROPS_KEYS = concat(FORMIK_PROPS_KEYS, FORM_ITEM_PROPS_KEYS);

function InputField(rawProps) {
  const props = omit(NOT_PROPS_KEYS, rawProps);
  const formikProps = pick(FORMIK_PROPS_KEYS, rawProps);
  const formItemProps = pick(FORM_ITEM_PROPS_KEYS, rawProps);

  const fieldError =
    getIn(formikProps.form.touched, formikProps.field.name) && getIn(formikProps.form.errors, formikProps.field.name);

  return (
    <FormItem
      label={formItemProps.label}
      required={formItemProps.required}
      help={fieldError}
      validateStatus={fieldError ? 'error' : undefined}>
      <Input {...props} {...formikProps.field} />
    </FormItem>
  );
}

export default InputField;
