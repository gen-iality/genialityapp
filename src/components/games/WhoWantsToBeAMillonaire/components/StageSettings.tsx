import generateColumnsStages from '../functions/genereteColumnsStages';
import { Button, Card, Modal, Space, Table, Typography, Form, Select, Input, Divider, Checkbox, List } from 'antd';
import Header from '../../../../antdComponents/Header';
import { useMillonaireCMS } from '../hooks/useMillonaireCMS';
import { STAGES_VALUES } from '../constants/formData';

const { Title } = Typography;

const StageSettings = () => {
  const columns = generateColumnsStages();
  const {
    onSaveStage,
    question,
    millonaire,
    onCancelModalStage,
    isVisibleModalStage,
    setIsVisibleModalStage,
    onChangeStage,
    stage,
    isEditStage,
    onSubmitStage,
  } = useMillonaireCMS();

  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header title='Preguntas' addFn={() => setIsVisibleModalStage(!isVisibleModalStage)} />
          <Table size='small' columns={columns} dataSource={millonaire.stages} />
        </Space>
      </Card>
      <Modal
        bodyStyle={{
          textAlign: 'center',
        }}
        visible={isVisibleModalStage}
        maskClosable={false}
        onOk={() => console.log('OK', question)}
        onCancel={() => onCancelModalStage()}
        destroyOnClose={true}
        footer={[
          <Button key='back' onClick={() => onCancelModalStage()}>
            Cancelar
          </Button>,
          <Button
            key='submit'
            type='primary'
            disabled={millonaire?.stages?.find((stageToFind) => stageToFind.score >= stage.score)}
            loading={false}
            onClick={() => onSubmitStage()}>
            {isEditStage ? 'Editar' : 'Agregar'}
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
            Gestionar etapas
          </Title>

          <Form.Item label='Etapa'>
            <Select value={stage.stage} onChange={(e) => onChangeStage('stage', e)}>
              {STAGES_VALUES.map((stage) => {
                return (
                  <Select.Option
                    value={stage}
                    disabled={millonaire?.stages?.find((stageToFind) => stageToFind.stage === stage)}>
                    {stage}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label='Pregunta'>
            <Select value={stage.question} onChange={(e) => onChangeStage('question', String(e))}>
              {millonaire?.questions?.map((questions) => {
                return (
                  <Select.Option
                    disabled={millonaire?.questions?.find((question) => question.id === stage.question)}
                    value={questions.id}>
                    {questions.question}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label='Puntaje'>
            <Input value={stage.score} onChange={(e) => onChangeStage('score', e.target.value)} />
          </Form.Item>
          <Form.Item label='Es salvavidas'>
            <Checkbox value={stage.lifeSaver} onChange={() => onChangeStage('lifeSaver', !stage.lifeSaver)} />
          </Form.Item>
        </>
      </Modal>
    </>
  );
};
export default StageSettings;
