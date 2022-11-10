import Header from '@/antdComponents/Header';
import { Button, Card, Modal, Space, Table, Typography, Form, Select, Input, Divider, Checkbox, List } from 'antd';
import generateColumnsQuestion from '../functions/genereteColumnsQuestions';
import { useState } from 'react';
const { Title } = Typography;
import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { VALUES_TIME_PER_ANSWERS } from '../constants/formData';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

export default function QuestionBank() {
  const columns = generateColumnsQuestion();
  const {
    question,
    answer,
    millonaire,
    isEditAnswer,
    isEditQuestion,
    onCancelModalQuestion,
    isVisibleModalQuestion,
    setIsVisibleModalQuestion,
    onChangeQuestion,
    onChangeAnswer,
    onSubmitQuestion,
    onSubmitAnswer,
    loading,
    onActionEditAnwser,
  } = useMillonaireCMS();
  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header title='Banco de preguntas' addFn={() => setIsVisibleModalQuestion(!isVisibleModalQuestion)} />
          <Table size='small' columns={columns} dataSource={millonaire.questions} />
        </Space>
      </Card>
      <Modal
        bodyStyle={{
          textAlign: 'center',
        }}
        visible={isVisibleModalQuestion}
        maskClosable={false}
        onOk={() => console.log('OK', question)}
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
              question.answers.length < 3 ||
              loading
            }
            loading={false}
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

          <Form.Item label='Tipo'>
            <Select value={question.type} onChange={(e) => onChangeQuestion('type', e)}>
              <Select.Option value='text'>Texto</Select.Option>
              <Select.Option disabled value='image'>
                Imagen
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Pregunta'>
            <Input.TextArea value={question.question} onChange={(e) => onChangeQuestion('question', e.target.value)} />
          </Form.Item>
          <Form.Item label='Tiempo por pregunta'>
            <Select value={question.timeForQuestion} onChange={(e) => onChangeQuestion('timeForQuestion', String(e))}>
              {VALUES_TIME_PER_ANSWERS.map((timeForQuestion) => {
                return (
                  <Select.Option disabled={timeForQuestion.value !== 30} value={timeForQuestion.value}>
                    {timeForQuestion.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Divider />
          <Typography.Text>Agregar respuestas</Typography.Text>
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
          </Form.Item>
          <Button
            disabled={
              answer.answer === '' ||
              answer.type === '' ||
              question.answers.length === 4 ||
              (question.answers.length === 3 &&
                !question.answers.find((answer) => answer.isCorrect === true) &&
                answer.isCorrect === false) ||
              loading
            }
            onClick={() => onSubmitAnswer()}>
            {isEditAnswer ? 'Editar respuesta' : 'Agregar respuesta'}
          </Button>

          {question.answers && question.answers.length > 0 && (
            <List
              dataSource={question.answers}
              renderItem={(item, index) => (
                <List.Item
                  actions={[
                    <Button
                      key={`removeAction${index}`}
                      id={`removeAction${index}`}
                      icon={<DeleteOutlined />}
                      danger
                      size='small'
                    />,
                    <Button
                      onClick={() => onActionEditAnwser(item)}
                      icon={<EditOutlined />}
                      type='primary'
                      size='small'
                    />,
                  ]}>
                  <List.Item.Meta
                    avatar={item.isCorrect ? <CheckOutlined /> : <CloseOutlined />}
                    title={'RESPUESTA:'}
                    description={item.answer}
                  />
                </List.Item>
              )}
            />
          )}
        </>
      </Modal>
    </>
  );
}
