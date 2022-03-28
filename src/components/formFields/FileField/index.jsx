import { useCallback } from 'react';
import FormItem from 'antd/es/form/FormItem';
import { concat, omit, pick } from 'ramda';
import { Field } from 'formik';
import FileInput from '../../shared/fileInput';
import axios from 'axios/index';
import { Actions } from '../../../helpers/request';
import { FormattedMessage, useIntl } from 'react-intl';
import { DispatchMessageService } from '../../../context/MessageService';

const FORMIK_PROPS_KEYS = ['form', 'field', 'meta'];
const FORM_ITEM_PROPS_KEYS = ['label', 'required'];
const NOT_PROPS_KEYS = concat(FORMIK_PROPS_KEYS, FORM_ITEM_PROPS_KEYS);

function FileField(rawProps) {
  let ancho = '200';
  let alto = '200';
  let errorMsg = '';
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

  const validate = useCallback(() => {
    return undefined;
  });
  let saveEventImage = (form, field, files) => {
    const file = files[0];
    const url = '/api/files/upload';

    if (file) {
      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) {
            handleChange(image, form, field);
            handleBlur(form, field);
          }
        });
      });

      //cuando todaslas promesas de envio de imagenes al servidor se completan
      axios.all(uploaders).then(async () => {
        DispatchMessageService({
          type: 'success',
          msj: this.props.intl.formatMessage({id: 'toast.img', defaultMessage: 'Ok!'}),
          action: 'show',
        });
      });
    } else {
      //this.setState( { errImg: "Solo se permiten imágenes. Intentalo de nuevo" } );
    }
  };

  return (
    <Field name={name} validate={validate}>
      {({ field, form, meta }) => {
        const fieldError = meta.touched && meta.error;

        return (
          <FormItem
            label={formItemProps.label}
            required={formItemProps.required}
            help={fieldError}
            validateStatus={fieldError ? 'error' : undefined}>
            {/* <Input value={field.value} /> */}
            <FileInput
              picture={field.value}
              width={ancho}
              height={alto}
              changeImg={(files) => {
                saveEventImage(form, field, files, 'nombre');
              }}
              errImg={errorMsg}
              {...props}
            />
          </FormItem>
        );
      }}
    </Field>
  );
}

export default FileField;
