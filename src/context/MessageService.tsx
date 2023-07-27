import { createContext } from 'react';
import { message } from 'antd';

export const MessageController = createContext({});

const PositiveAnswer = ['Excelente', 'Perfecto', 'Genial', 'Cool', 'Lo haz hecho', 'Éxito'];
const NegativeAnswer = ['Ups', 'Error', 'Lo siento', 'Lo sentimos', 'Sorry'];
const LoadingAnswer = ['Cargando', 'Procesando'];

interface PropsOptions {
  type?: 'success' | 'error' | 'warning' | 'info' | 'loading';
  msj?: string;
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


const positiveAnswer = [
  'Excelente',
  'Perfecto',
  'Genial',
  'Cool',
  'Lo haz hecho',
  'Éxito',
  'Bien',
]
const negativeAnswer = ['Ups', 'Error', 'Lo siento', 'Lo sentimos', 'Sorry']
const loadingAnswer = ['Cargando', 'Procesando', 'Espérame']

type MessageType = 'success' | 'error' | 'warning' | 'info' | 'loading'

export const StateMessage = {
  show: (
    key: string | undefined | null,
    type: MessageType,
    textMessage: string,
    duration?: number,
  ) => {
    message.open({
      content: preProcessMessage(type, textMessage),
      key: key || '',
      duration: duration || 5,
      type: null as any,
    })
  },
  destroy: (key: string) => {
    message.destroy(key)
  },
}


const preProcessMessage = (type: string | undefined, textMessage: string) => {
  const randomPositive = Math.floor(Math.random() * positiveAnswer.length)
  const ramdonNegative = Math.floor(Math.random() * negativeAnswer.length)
  const ramdonLoading = Math.floor(Math.random() * loadingAnswer.length)

  let iconRender = ''
  let finalMessage = ''

  switch (type) {
    case 'success':
      iconRender = '✅'
      break
    case 'error':
      iconRender = '❌'
      break
    case 'warning':
      iconRender = '⚠️'
      break
    case 'info':
      iconRender = 'ℹ️'
      break
    case 'loading':
      iconRender = '⏳'
      break
    default:
      iconRender = '🤷‍♂️'
  }

  // Convert captioncase to lowercase
  const formatUpperCaseMissing = (text: string) => {
    if (text.length === 0) return text

    if (text[0] === text[0].toUpperCase()) {
      return text[0].toLowerCase() + text.slice(1)
    } else {
      return text
    }
  }

  if (textMessage !== undefined) {
    if (type === 'success') {
      finalMessage = `${iconRender} ${
        positiveAnswer[randomPositive]
      }, ${formatUpperCaseMissing(textMessage)}`
    } else if (type === 'loading') {
      finalMessage = `${iconRender} ${
        loadingAnswer[ramdonLoading]
      }, ${formatUpperCaseMissing(textMessage)}`
    } else {
      finalMessage = `${iconRender} ${
        negativeAnswer[ramdonNegative]
      }, ${formatUpperCaseMissing(textMessage)}`
    }
  }

  return finalMessage
}
