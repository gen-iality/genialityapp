import { Card, Form, Input, InputNumber, Select } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { VALUES_TIME_PER_ANSWERS, VALUES_TOTAL_QUESTIONS } from '../constants/formData';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
const { Option } = Select;

export default function CreateMillonaire() {
  const { onChangeMillonaire, millonaire } = useMillonaireCMS();
  return (
    <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px' }}>
      <Form.Item label='Nombre' name='name' rules={[{ required: true, message: 'El nombre es requerido' }]}>
        <Input
          value={millonaire?.name}
          onChange={(e) => onChangeMillonaire('name', e.target.value)}
          placeholder={'Titulo de ¿Quien quiere ser Millonario?'}
        />
      </Form.Item>
      <Form.Item
        label='Cantidad de preguntas'
        name='numberOfQuestions'
        rules={[{ required: true, message: 'El nombre es requerido' }]}>
        <Select
          onChange={(value) => onChangeMillonaire('numberOfQuestions', Number(value))}
          value={millonaire?.numberOfQuestions}>
          {VALUES_TOTAL_QUESTIONS.map((totalQuestion) => (
            <Option key={'time--' + totalQuestion} value={totalQuestion}>
              {totalQuestion}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Selecciona el tiempo para responder' name='timeForQuestions'>
        <Select
          onChange={(value) => onChangeMillonaire('timeForQuestions', Number(value))}
          value={millonaire?.timeForQuestions}>
          {VALUES_TIME_PER_ANSWERS.map((timePerAnswer) => (
            <Option key={'time--' + timePerAnswer.value} value={timePerAnswer.value}>
              {timePerAnswer.label}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='Reglas para el bingo' name='rules'>
        <TextArea
          value={millonaire?.rules}
          onChange={(e) => onChangeMillonaire('rules', e.target.value)}
          placeholder={'Reglas para ¿Quien quiere ser Millonario?'}
        />
      </Form.Item>
    </Card>
  );
}
