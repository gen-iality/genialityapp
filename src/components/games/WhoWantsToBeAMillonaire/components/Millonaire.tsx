import React from 'react';
import { Button, Space, Typography } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
const { Title, Paragraph } = Typography;

export default function Millonaire() {
  const { currentStage, onSaveAnswer } = useMillonaireLanding();

  if (typeof currentStage === 'string') return <Title>{currentStage}</Title>;

  return (
    <Space direction='vertical'>
      <span>{currentStage.question.timeForQuestion}</span>
      <span>{currentStage.score}</span>
      <Paragraph>{currentStage.question.question}</Paragraph>

      <Space direction='vertical'>
        {currentStage.question.answers.map((answer, index) => {
          return (
            <Button key={index} onClick={() => onSaveAnswer(currentStage.question, answer)}>
              {answer.answer}
            </Button>
          );
        })}
      </Space>
    </Space>
  );
}
