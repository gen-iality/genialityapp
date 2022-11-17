import { Modal, Typography, Form, Input, Checkbox, Select, Button } from 'antd';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import AnswersFours from './AnswersFours';

const { Title } = Typography;

export default function CreateAnswers() {
  const {
    question,
    isEditAnswer,
    isEditQuestion,
    answer,
    answers,
    loading,
    isVisibleModalAnswer,
    onChangeVisibleModalAnswer,
    onSubmitAnswer,
    onChangeAnswer,
    onChangeAnswerFour,
    onSaveAnswerFour,
  } = useMillonaireCMS();

  return (
    <>
      <Button onClick={() => onChangeVisibleModalAnswer()}> Respuestas</Button>
      <Modal
        visible={isVisibleModalAnswer}
        maskClosable={false}
        onCancel={() => onChangeVisibleModalAnswer()}
        destroyOnClose={true}
        footer={[
          <Button
            disabled={
              // answer.answer === '' ||
              // answer.type === '' ||
              // (!isEditAnswer && question.answers.length === 4) ||
              // (question.answers.length === 3 &&
              //   !question.answers.find((answer) => answer.isCorrect === true) &&
              //   answer.isCorrect === false) ||
              answers.find((answer) => answer.answer === '') !== undefined ||
              answers.every((answer) => answer.isCorrect === false) ||
              loading
            }
            onClick={() => onSubmitAnswer()}
            loading={loading}>
            {isEditQuestion ? 'Actualizar' : 'Crear'}
          </Button>,
        ]}>
        {/* <Title
          style={{
            marginTop: '20px',
            marginBottom: '20px',
          }}
          level={4}
          type='secondary'>
          {isEditAnswer ? 'Editar respuesta' : 'Agregar respuesta'}
        </Title>
        <Form.Item label='Respuesta'>
          <Input.TextArea value={answer.answer} onChange={(e) => onChangeAnswer('answer', e.target.value)} />
        </Form.Item>
        <Form.Item label='Es la respuesta correcta'>
          <Checkbox
            disabled={question.answers.find((answer) => answer.isCorrect === true)}
            checked={answer.isCorrect}
            onChange={() => onChangeAnswer('isCorrect', !answer.isCorrect)}
          />
        </Form.Item>
        <Form.Item label='Tipo'>
          <Select value={answer.type} onChange={(e) => onChangeAnswer('type', e)}>
            <Select.Option value='text'>Texto</Select.Option>
            <Select.Option disabled value='image'>
              Imagen
            </Select.Option>
          </Select>
        </Form.Item> */}
        <AnswersFours />
      </Modal>
    </>
  );
}
