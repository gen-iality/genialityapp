import * as React from 'react';
import { Input, Form, Result, Typography } from 'antd';

const { Paragraph } = Typography;

type UrlProcessorType = (e: React.ChangeEvent<HTMLInputElement>) => string;

const rules = {
  // NOTE: hook-able
  youTube: [
    {
      required: true,
      message: 'Por favor ingrese el ID o la URL de YouTube.',
    },
    ({}: any) => ({
      validator(_: any, value: string) {
        // Aquí validamos si el ID es valido o si la url es validad
        // si cualquiera de los dos es valido entonces retornamos `true`,
        // si no retornamos el error.
        const regexpURL = new RegExp(
          /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        );
        const regId = new RegExp(/^((\w|-){11})(?:\S+)?$/);
        if (regexpURL.test(value) || (regId.test(value) && value.length === 11)) {
          return Promise.resolve();
        }
        return Promise.reject('Por favor ingrese un ID o URL valido de Youtube.');
      },
    }),
  ],
  vimeo: [
    {
      required: true,
      message: 'Por favor ingrese un ID de Vimeo.',
    },
    { type: 'string', min: 8, max: 10, message: 'El ID debe tener entre 8 a 10 dígitos.' },
  ],
  url: [
    { required: true, message: 'Por favor ingrese la URL del video.' },
    { type: 'url', message: 'Por favor ingrese una URL valida.' },
    { type: 'string', min: 6, message: 'La URL debe ser mayor a 6 caracteres.' },
  ],
};

const urlProcessorSet: { [key: string]: UrlProcessorType } = {
  // NOTE: hook-able
  youTube: (e) => {
    // obtenemos el ID del youtube
    const id = e.target.value.match(
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    );
    // reternamos el ID si existe, si no retornamos el valor del input
    return id ? id[1] : e.target.value;
  },
  vimeo: (e) => {
    const idVimeo = e.target.value.match(/(videos|video|channels|event|\.com)\/([\d]+)/);
    return idVimeo ? idVimeo[2] : e.target.value;
  },
  url: (e) => {
    return e.target.value;
  },
};

export interface ActivityExternalUrlFieldProps {
  type: string,
  subtitle?: string,
  iconSrc?: string,
  placeholder?: string,
  addonBefore: React.ReactNode,
  onInput: (input: string) => void,
};

function ActivityExternalUrlField(props: ActivityExternalUrlFieldProps) {
  const {
    type,
    subtitle,
    iconSrc,
    placeholder,
    addonBefore,
    onInput,
  } = props;

  return (
    <Result
      style={{ margin: '0px 100px 0px 100px' }}
      icon={<img width={150} src={iconSrc} />}
      subTitle={<Paragraph>{subtitle}</Paragraph>}
      title={
        <Form>
          <Form.Item name='url' rules={rules[type as keyof typeof rules] as unknown as undefined || [{ required: true }]}>
            <Input
              type={type === 'vimeo' ? 'number' : 'text'}
              addonBefore={addonBefore}
              placeholder={placeholder}
              size='large'
              onChange={(e) => {
                // This is for send the ID only if the URL is from YouTube or Vimeo
                onInput(urlProcessorSet[type](e));
              }}
            />
          </Form.Item>
        </Form>
      }
    />
  );
}

export default ActivityExternalUrlField;
