import Header from '@/antdComponents/Header';
import { Button, Card, Modal, Space, Table, Typography, Form, Select, Input } from 'antd';
import generateColumnsQuestion from '../functions/genereteColumnsQuestions';
import { useState } from 'react';
const { Title } = Typography;
import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { VALUES_TIME_PER_ANSWERS } from '../constants/formData';
export default function QuestionBank() {
  const columns = generateColumnsQuestion();
  const {
    onSaveQuestion,
    question,
    onCancelModalQuestion,
    isVisibleModalQuestion,
    setIsVisibleModalQuestion,
  } = useMillonaireCMS();

  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header title='Banco de preguntas' addFn={() => setIsVisibleModalQuestion(!isVisibleModalQuestion)} />
          <Table size='small' columns={columns} />
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
            disabled={question.question === ''}
            loading={false}
            onClick={() => onSaveQuestion()}>
            Aceptar
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
            <Select>
              <Select.Option value='text'>Texto</Select.Option>
              <Select.Option disabled value='img'>
                Imagen
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label='Pregunta'>
            <Input />
          </Form.Item>
          <Form.Item label='Tiempo por pregunta'>
            <Select>
              {VALUES_TIME_PER_ANSWERS.map((timeForQuestion) => {
                return (
                  <Select.Option disabled={timeForQuestion.value !== 30} value={timeForQuestion.value}>
                    {timeForQuestion.label}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label='Respuesta 1'>
            <Input />
          </Form.Item>
          <Form.Item label='Respuesta 2'>
            <Input />
          </Form.Item>
          <Form.Item label='Respuesta 3'>
            <Input />
          </Form.Item>
          <Form.Item label='Respuesta 4'>
            <Input />
          </Form.Item>
        </>
      </Modal>
    </>
  );
}
