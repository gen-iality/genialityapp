import { createContext } from 'react';
export const MessageController = createContext({});
import { message } from 'antd';

const PositiveAnswer = ['Excelente', 'Perfecto', 'Genial', 'Cool', 'Lo haz hecho', 'Éxito'];
const NegativeAnswer = ['Ups', 'Error', 'Lo siento', 'Lo sentimos', 'Sorry'];
const LoadingAnswer = ['Cargando', 'Procesando'];

interface PropsOptions {
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  msj: string;
  duration?: number;
  action: 'show' | 'hide' | 'destroy';
  key?: string;
}

//TIPOS DE MENSAJES
//success, error, warning, info, loading
//api doc=> https://ant.design/components/message/

export const DispatchMessageService = ({ type, msj, duration, action, key }: PropsOptions) => {
  try {
    switch (action) {
      case 'show':
        message.open({
          content: MessageReducer({ type, msj, action }),
          key: key || '',
          duration: duration || 3,
          type: null as any,
        });
        break;

      case 'destroy':
        message.destroy(key);
        break;
    }
  } catch (error) {
    console.log(error);
  }
};

const MessageReducer = ({ type, msj }: PropsOptions) => {
  let ramdon = Math.floor(Math.random() * PositiveAnswer.length);
  let ramdonN = Math.floor(Math.random() * NegativeAnswer.length);
  let ramdonLoading = Math.floor(Math.random() * LoadingAnswer.length);
  let iconRender = '';
  let finalMsj = '';

  switch (type) {
    case 'success':
      iconRender = '✅';
      break;
    case 'error':
      iconRender = '❌';
      break;
    case 'warning':
      iconRender = '⚠️';
      break;
    case 'info':
      iconRender = 'ℹ️';
      break;
    case 'loading':
      iconRender = '⏳';
      break;
    default:
      iconRender = '🤷‍♂️';
  }

  if (type === 'success') {
    finalMsj = `${iconRender} ${PositiveAnswer[ramdon]}, ${msj}`;
  } else if (type === 'loading') {
    finalMsj = `${iconRender} ${LoadingAnswer[ramdonLoading]}, ${msj}`;
  } else {
    finalMsj = `${iconRender} ${NegativeAnswer[ramdonN]}, ${msj}`;
  }

  return finalMsj;
};
