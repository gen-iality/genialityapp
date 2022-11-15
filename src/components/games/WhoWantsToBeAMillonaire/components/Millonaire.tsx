import { Button, Space, Typography, Slider } from 'antd';
import { useMillonaireLanding } from '../hooks/useMillonaireLanding';
const { Title, Paragraph } = Typography;
import type { SliderMarks } from 'antd/lib/slider';
import { IStages } from '../interfaces/Millonaire';
export default function Millonaire() {
  const { currentStage, question, onSaveAnswer, time, score, stage, millonaire } = useMillonaireLanding();
const marksRender: SliderMarks = (millonaire?.stages?.map ((stage:IStages) => {
    return {
    [stage.stage]: Number(stage.stage)
    };
  }) || []).reduce((acc, curr) => ({ ...acc, ...curr }), {});


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
        <span>{time} o {question.timeForQuestion}</span>
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
 
        marks={marksRender}
      />
    </div>
  );
}
