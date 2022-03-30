import { Input, Form } from 'antd';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';

/**
  addonBefore: 'https://vimeo.com/event/' || https://youtu.be/ || <LinkOutlined />
*/
interface propsOptions {
  addonBefore: React.ReactNode;
  placeholder?: string;
}

const rules = {
  //Esto se puede alojar en un archivo de configuracion
  // Reglas para los diferentes metodos de entrada
  youTube: [
    {
      required: true,
      message: 'Por favor ingrese el ID o la URL de YouTube.',
    },
    () => ({
      validator(_: any, value: string) {
        //Aqui validamos si el ID es valido o si la url es validad si cualquiera de los dos es valido entonces retornamos true si no  retornamos el error
        let regUrl = new RegExp(
          /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
        );
        let regId = new RegExp(/^((\w|-){11})(?:\S+)?$/);
        if (regUrl.test(value) || (regId.test(value) && value.length === 11)) {
          return Promise.resolve();
        }
        return Promise.reject('Por favor ingrese un ID o URL valido de Youtube.');
      },
    }),
  ],
  vimeo: [
    {
      required: true,
      message: 'Por favor ingrese el ID o la URL valido de Vimeo .',
    },
    () => ({
      validator(_: any, value: string) {
        //Aqui validamos si el ID es valido o si la url es validad si cualquiera de los dos es valido entonces retornamos true si no  retornamos el error
        let regUrl = new RegExp(
          /(?:http:|https:|)\/\/(?:player.|www.)?vimeo\.com\/(?:.|event\/|embed\/|watch\?\S*v=|v\/)?(\d*)/
        );
        // este regex validad las las urls de vimeo
        let regId = new RegExp(/^[0-9]{1,}$/);
        if (regUrl.test(value) || regId.test(value)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('Por favor ingrese un ID o URL valido de Vimeo.'));
      },
    }),
  ],
  url: [
    { required: true, message: 'Por favor ingrese la URL del video.' },
    { type: 'url', message: 'Por favor ingrese una URL valida.' },
    { type: 'string', min: 6, message: 'La URL debe ser mayor a 6 caracteres.' },
  ],
};

const onChange = {
  //Esto se puede alojar en un archivo de configuracion
  // Este ochenge cumple la funcion de
  youTube: (e: any) => {
    //obtenemos el ID del youtube
    let id = e.target.value.match(
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    );
    // reternamos el ID si existe si no retornamos el valor del input
    return id ? id[1] : e.target.value;
  },
  vimeo: (e: any) => {
    let idVimeo = e.target.value.match(/(videos|video|channels|event|\.com)\/([\d]+)/);
    return idVimeo ? idVimeo[2] : e.target.value;
  },
  url: (e: any) => {
    return e.target.value;
  },
};

const InputSource = ({ addonBefore, placeholder }: propsOptions) => {
  const { selectOption, typeOptions } = useTypeActivity();
  return (
    <Form>
      <Form.Item name='url' rules={rules[typeOptions.key] || [{ required: true }]}>
        <Input
          addonBefore={addonBefore}
          placeholder={placeholder}
          size='large'
          onChange={(e) => {
            //esto es para enviar solo el ID si es una url de youtube o vimeo
            selectOption(typeOptions.key, onChange[typeOptions.key](e));
          }}
        />
      </Form.Item>
    </Form>
  );
};

export default InputSource;
