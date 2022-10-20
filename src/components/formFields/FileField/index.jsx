import { useCallback, useState } from 'react';
import FormItem from 'antd/es/form/FormItem';
import { pick } from 'ramda';
import { Field } from 'formik';
import { Upload, Spin, Card } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';
import { uploadImagedummyRequest, handleImageName } from '@Utilities/imgUtils';
import { uploadImageData } from '@Utilities/uploadImageData';

const FORM_ITEM_PROPS_KEYS = ['label', 'required'];

function FileField(rawProps) {
  const formItemProps = pick(FORM_ITEM_PROPS_KEYS, rawProps);
  const [isUploading, setIsUploading] = useState(false);

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
  const saveEventImage = async (files, form, field) => {
    const { status, originFileObj } = files.file;
    switch (status) {
      case 'done':
        const imagenUrl = await uploadImageData(originFileObj);
        handleChange(imagenUrl, form, field);
        handleBlur(form, field);
        setIsUploading(false);
        break;

      case 'error':
        break;

      case 'removed':
        setIsUploading(false);
        break;

      default:
        setIsUploading(true);
        break;
    }
    /* DispatchMessageService({
      type: 'success',
      msj: this.props.intl.formatMessage({ id: 'toast.img', defaultMessage: 'Ok!' }),
      action: 'show',
    }); */
  };

  const draggerprops = {
    listType: 'picture',
    name: 'file',
    multiple: false,
    maxCount: 1,
    customRequest: uploadImagedummyRequest,
    /** props para no mostrar la mini previa de antDesing */
    isImageUrl(file) {
      return;
    },
    iconRender(file) {
      return <FileImageOutlined style={{ color: '#009fd9' }} />;
    },
    onPreview(file) {},
    /**------------------------------------------------- */
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
            <Spin tip='Cargando imagen...' spinning={isUploading}>
              <Card
                hoverable
                style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', textAlign: 'center' }}>
                <Upload.Dragger
                  {...draggerprops}
                  defaultFileList={[{ name: handleImageName(field.value), url: field.value }]}
                  onChange={(files) => {
                    saveEventImage(files, form, field);
                  }}>
                  <>
                    <p className='ant-upload-drag-icon'>
                      <FileImageOutlined style={{ color: '#009fd9' }} />
                    </p>
                    <p className='ant-upload-text'>Haga clic o arrastre el archivo a esta área para cargarlo</p>
                    <p className='ant-upload-hint'>Tipos de archivos: pdf, excel, word, entre otros.</p>
                  </>
                </Upload.Dragger>
              </Card>
            </Spin>
          </FormItem>
        );
      }}
    </Field>
  );
}

export default FileField;
