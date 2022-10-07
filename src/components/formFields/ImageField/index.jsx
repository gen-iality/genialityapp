import { Input } from 'antd';
import { concat, omit, pick } from 'ramda';
import { Field } from 'formik';
import { useIntl } from 'react-intl';
import ImageUploaderDragAndDrop from '@components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';

const FORMIK_PROPS_KEYS = ['form', 'field', 'meta'];
const FORM_ITEM_PROPS_KEYS = ['label', 'required'];
const NOT_PROPS_KEYS = concat(FORMIK_PROPS_KEYS, FORM_ITEM_PROPS_KEYS);

function ImageField(rawProps) {
  const intl = useIntl();
  let ancho = '200';
  let alto = '200';
  const props = omit(NOT_PROPS_KEYS, rawProps);
  const formItemProps = pick(FORM_ITEM_PROPS_KEYS, rawProps);

  const { name } = rawProps;

  const handleChange = (newValue, form, field) => {
    form.setFieldValue(field.name, newValue);
  };

  const handleBlur = (form, field) => {
    form.setFieldTouched(field.name, true);
  };
  //funciones para cargar imagenes y enviar un popup para avisar al usuario que la imagen ya cargo o cambiar la imagen

  let handleImage = (imageUrl, field, form) => {
    handleChange(imageUrl, form, field);
    handleBlur(form, field);
  };

  return (
    <Field name={name}>
      {({ field, form, meta }) => {
        const fieldError = meta.touched && meta.error;

        return (
          <div>
            <label style={{ marginTop: '2%' }}>
              <label style={{ color: 'red' }}>*</label>
              {formItemProps.label}
            </label>
            <ImageUploaderDragAndDrop
              imageDataCallBack={(imageUrl) => handleImage(imageUrl, field, form)}
              imageUrl={field.value}
              width={ancho}
              height={alto}
            />
          </div>
        );
      }}
    </Field>
  );
}

export default ImageField;
