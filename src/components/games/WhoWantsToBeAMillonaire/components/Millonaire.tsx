import { Button, Space, Typography, Slider } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
const { Title, Paragraph } = Typography;

export default function Millonaire() {
  const { currentStage, question, onSaveAnswer, time, score, stage, millonaire } = useMillonaireLanding();
  console.log('🚀 ~ file: Millonaire.tsx ~ line 8 ~ Millonaire ~ currentStage', question, stage);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        <span>{time}</span>
        <span>{currentStage.score}</span>
        <Paragraph>{question.question}</Paragraph>
        <Space direction='vertical' align='center'>
          {question &&
            question.answers.length > 0 &&
            question.answers.map((answer, index) => {
              return (
                <Button key={index} onClick={() => onSaveAnswer(question, answer)}>
                  {answer.answer}
                </Button>
              );
            })}
          {question && question.answers.length === 0 && (
            <Typography.Title>No hay respuestas asigandas</Typography.Title>
          )}
        </Space>
      </div>
      <Slider
        defaultValue={stage}
        value={stage}
        step={1}
        disabled
        max={millonaire?.stages?.length}
        marks={millonaire?.stages?.reverse().map((stage) => {
          return Number(stage.stage);
        })}
      />
    </div>
  );
}
