import { Card, Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { VALUES_TIME_PER_ANSWERS, VALUES_TOTAL_QUESTIONS } from '../constants/formData';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Option } = Select;

export default function CreateMillonaire() {
  const { onChangeMillonaire, millonaire, isNewGame, loading } = useMillonaireCMS();
  return (
    <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
      <Form.Item
        label={
          <label style={{ marginTop: '2%' }}>
            Nombre <label style={{ color: 'red' }}>*</label>
          </label>
        }>
        <Input
          defaultValue={millonaire?.name}
          value={millonaire?.name}
          onChange={(e) => onChangeMillonaire('name', e.target.value)}
          placeholder={'Titulo de ¿Quien quiere ser Millonario?'}
          required
        />
      </Form.Item>
      <Form.Item
        label={
          <label style={{ marginTop: '2%' }}>
            Cantidad de preguntas <label style={{ color: 'red' }}>*</label>
          </label>
        }>
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
          defaultValue={millonaire?.rules}
          value={millonaire?.rules}
          onChange={(e) => onChangeMillonaire('rules', e.target.value)}
          placeholder={'Reglas para ¿Quien quiere ser Millonario?'}
        />
      </Form.Item>
    </Card>
  );
}
