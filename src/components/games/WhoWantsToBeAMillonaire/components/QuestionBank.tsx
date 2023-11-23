import Header from '@/antdComponents/Header';
import { Button, Card, Modal, Space, Table, Typography, Form, Select, Input, Divider } from 'antd';
import generateColumnsQuestion from '../functions/genereteColumnsQuestions';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { VALUES_TIME_PER_ANSWERS } from '../constants/formData';
import CreateAnswers from './CreateAnswers';
import ImportBankQuestions from './ImportBankQuestions';

const { Title } = Typography;

export default function QuestionBank() {
  const columns = generateColumnsQuestion();
  const {
    question,
    millonaire,
    isEditQuestion,
    onCancelModalQuestion,
    isVisibleModalQuestion,
    setIsVisibleModalQuestion,
    onChangeQuestion,
    onSubmitQuestion,
    loading,
  } = useMillonaireCMS();
  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header
            title='Banco de preguntas'
            extra={<ImportBankQuestions />}
            addFn={() => setIsVisibleModalQuestion(!isVisibleModalQuestion)}
          />
          <Table size='small' columns={columns} dataSource={millonaire.questions} />
        </Space>
      </Card>
      <Modal
        bodyStyle={{
          textAlign: 'center',
        }}
        visible={isVisibleModalQuestion}
        maskClosable={false}
        onCancel={() => onCancelModalQuestion()}
        destroyOnClose={true}
        footer={[
          <Button key='back' onClick={() => onCancelModalQuestion()}>
            Cancelar
          </Button>,
          <Button
            key='submit'
            type='primary'
            disabled={
              question.question === '' ||
              question.timeForQuestion === 0 ||
              question.type === '' ||
              question.answers.length < 4 ||
              loading
            }
            loading={loading}
            onClick={() => onSubmitQuestion()}>
            {isEditQuestion ? 'Editar valores' : ' Agregar valores'}
          </Button>,
        ]}>
        <>
          <Title
            style={{
              marginTop: '20px',
              marginBottom: '20px',
            }}
            level={4}
            type='secondary'>
            Gestionar valores
          </Title>

          {/* <Form.Item label='Tipo'>
            <Select value={question.type} onChange={(e) => onChangeQuestion('type', e)}>
              <Select.Option value='text'>Texto</Select.Option>
              <Select.Option disabled value='image'>
                Imagen
              </Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item label='Pregunta'>
            <Input.TextArea value={question.question} onChange={(e) => onChangeQuestion('question', e.target.value)} />
          </Form.Item>
          <Form.Item label='Tiempo por pregunta'>
            <Select value={question.timeForQuestion} onChange={(e) => onChangeQuestion('timeForQuestion', String(e))}>
              {VALUES_TIME_PER_ANSWERS.map((timeForQuestion) => {
                return <Select.Option value={timeForQuestion.value}>{timeForQuestion.label}</Select.Option>;
              })}
            </Select>
          </Form.Item>
          <Divider />
          <Space>
            <CreateAnswers />
          </Space>
        </>
      </Modal>
    </>
  );
}
