import { Affix, Card, Form, Input, InputNumber, Select, Typography } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { VALUES_TIME_PER_ANSWERS, VALUES_TOTAL_QUESTIONS } from '../constants/formData';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Option } = Select;

export default function CreateMillonaire() {
  const { onChangeMillonaire, millonaire, isNewGame, loading } = useMillonaireCMS();
  return (
    <Affix offsetTop={80}>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
        <Form.Item required label={<Typography.Text style={{ marginTop: '2%' }}>Nombre</Typography.Text>}>
          <Input
            defaultValue={millonaire?.name}
            value={millonaire?.name}
            onChange={(e) => onChangeMillonaire('name', e.target.value)}
            placeholder={'Titulo de ¿Quien quiere ser Millonario?'}
            required
          />
        </Form.Item>
        <Form.Item tooltip={'Las etapas representan el número de preguntas que debe superar un participante.'} label={<Typography.Text style={{ marginTop: '2%' }}>Cantidad de etapas</Typography.Text>}>
          <Select
            defaultValue={isNewGame === true ? '' : millonaire?.numberOfQuestions}
            onChange={(value) => onChangeMillonaire('numberOfQuestions', Number(value))}
            value={millonaire?.numberOfQuestions}>
            {VALUES_TOTAL_QUESTIONS.map((totalQuestion) => (
              <Option key={'time--' + totalQuestion} value={totalQuestion}>
                {totalQuestion}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* <Form.Item label='Selecciona el tiempo para responder' name='timeForQuestions'>
        <Select
          onChange={(value) => onChangeMillonaire('timeForQuestions', Number(value))}
          value={millonaire?.timeForQuestions}
          disabled
          defaultValue={millonaire?.timeForQuestions}>
          {VALUES_TIME_PER_ANSWERS.map((timePerAnswer) => (
            <Option
              key={'time--' + timePerAnswer.value}
              disabled={timePerAnswer.value !== 30}
              value={timePerAnswer.value}>
              {timePerAnswer.label}
            </Option>
          ))}
        </Select>
      </Form.Item> */}
        <Form.Item label='Reglas' name='rules'>
          <TextArea
            autoSize={{ minRows: 8, maxRows: 8 }}
            cols={20}
            defaultValue={millonaire?.rules}
            value={millonaire?.rules}
            onChange={(e) => onChangeMillonaire('rules', e.target.value)}
            placeholder={'Reglas para ¿Quien quiere ser Millonario?'}
          />
        </Form.Item>
      </Card>
    </Affix>
  );
}
