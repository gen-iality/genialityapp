import { Modal, Typography, Form, Input, Checkbox, Select, Button } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { useState } from 'react';
import { IAnswers } from '../interfaces/Millonaire';
const { Title } = Typography;

const answerLetter: { 0: string; 1: string; 2: string; 3: string } = {
  0: 'A',
  1: 'B',
  2: 'C',
  3: 'D',
};

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
          <Form.Item label={`Respuesta ${answerLetter[index]}`}>
            <Input
              style={{ borderColor: answers[index]?.isCorrect === true ? '#52C41A' : '' }}
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
