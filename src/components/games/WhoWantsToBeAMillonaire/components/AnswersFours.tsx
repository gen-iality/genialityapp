import { Modal, Typography, Form, Input, Checkbox, Select, Button } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { useState } from 'react';
import { IAnswers } from '../interfaces/Millonaire';
const { Title } = Typography;

export default function AnswersFours() {
  const { answers, onChangeAnswerFour } = useMillonaireCMS();
  //  iscorret is only for one answer

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
        Respuestas
      </Title>
      {answers.map((_, index) => {
        return (
          <Form.Item
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            label={`Respuesta ${index + 1}`}>
            <Input
              value={answers[index]?.answer}
              onChange={(e) => onChangeAnswerFour(index, 'answer', e.target.value)}
            />
            <Form.Item label='Correcta'>
              <Checkbox
                checked={answers[index]?.isCorrect === true ? true : false}
                onChange={(e) => onChangeAnswerFour(index, 'isCorrect', e.target.checked)}
              />
            </Form.Item>
          </Form.Item>
        );
      })}
    </div>
  );
}
