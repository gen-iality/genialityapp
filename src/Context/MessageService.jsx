import React from 'react';
import { createContext } from 'react';
export const MessageController = createContext({});
import { Card, message } from 'antd';
import Meta from 'antd/lib/card/Meta';
const styleMessage = {
  marginTop: '0px',
  marginBottom: '0px',
  padding: '0px',
  textAlign: 'center',
  border: 'none',
  boxShadow: 'none',
  fontFamily: 'Poppins',
};
const PositiveAnswer = ['Excelente', 'Perfecto', 'Genial', 'Cool', 'Lo haz hecho', 'Exito'];
const NegativeAnswer = ['Ups', 'Error', 'Lo siento', 'Lo sentimos', 'Sorry'];

export const ProviderMessageController = ({ children }) => {
  //TIPOS DE MENSAJES
  //success, error, warning, info, loading
  //api doc=> https://ant.design/components/message/

  const DispatchMessage = (type = '', msj = '') => {
    try {
      message.open({
        content: TypeMessageAnswer(type, msj),
        className: 'custom-class',
        style: {
          ...styleMessage,
        },
        icon: WhatIsEmoji(type),
        duration: 0,
      });
    } catch (e) {
      new Error(e);
    }
  };

  return (
    <MessageController.Provider
      value={{
        DispatchMessage: DispatchMessage,
      }}>
      {children}
    </MessageController.Provider>
  );
};

const WhatIsEmoji = (type) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    case 'loading':
      return '⏳';
    default:
      return '🤷‍♂️';
  }
};

const TypeMessageAnswer = (type, msj) => {
  let ramdon = Math.floor(Math.random() * PositiveAnswer.length);
  if (type === 'success') {
    return PositiveAnswer[ramdon] + ', ' + msj;
  } else {
    return NegativeAnswer[ramdon] + ', ' + msj;
  }
};
