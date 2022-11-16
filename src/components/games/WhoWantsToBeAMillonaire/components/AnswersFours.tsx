import React from 'react';
import { Modal, Typography, Form, Input, Checkbox, Select, Button } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';

const { Title } = Typography;

const ANSWER_TO_RENDER = 4;

export default function AnswersFours() {
  const {
    question,
    isEditAnswer,
    answer,
    loading,
    isVisibleModalAnswer,
    onChangeVisibleModalAnswer,
    onSubmitAnswer,
    onChangeAnswer,
  } = useMillonaireCMS();

  const defaultAnswer = {
    isCorrect: false,
    type: 'text',
    isTrueOrFalse: false,
  };

  // const onChangeAnswer = (key: string, value: any) => {
  //   setAnswer({
  //     ...answer,
  //     [key]: {
  //       ...answers[key],
  //       ...defaultAnswer,
  //       answer: value,
  //     },
  //   });
  // };

  return (
    //Cuatro opciones cada opcion tiene un input y un checkbox para indicar si es la respuesta correcta
    <div>
      <Title
        style={{
          marginTop: '20px',
          marginBottom: '20px',
        }}
        level={4}
        type='secondary'>
        {isEditAnswer ? 'Editar respuesta' : 'Agregar respuesta'}
      </Title>
      {[...Array(ANSWER_TO_RENDER)].map((_, index) => {
        return (
          <Form.Item
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            label={`Respuesta ${index + 1}`}>
            <Input value={answer.answer} onChange={(e) => onChangeAnswer('answer', e.target.value)} />
            <Form.Item label='Es la respuesta correcta'>
              <Checkbox
                disabled={question.answers.find((answer) => answer.isCorrect === true)}
                checked={answer.isCorrect}
                onChange={() => onChangeAnswer('isCorrect', !answer.isCorrect)}
              />
            </Form.Item>
          </Form.Item>
        );
      })}
    </div>
  );
}
