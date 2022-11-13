import generateColumnsStages from '../functions/genereteColumnsStages';
import { Button, Card, Modal, Space, Table, Typography, Form, Select, Input, Tooltip, Checkbox, List } from 'antd';
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
    previusStage,
    laterStage,
    onCancelModalStage,
    isVisibleModalStage,
    setIsVisibleModalStage,
    onChangeStage,
    stage,
    isEditStage,
    onSubmitStage,
    onActiveModalStage,
  } = useMillonaireCMS();

  console.log(
    'STAGE',
    previusStage.score > stage.score || laterStage.score < stage.score,
    'PREVIUS',
    previusStage.score,
    'LATER',
    laterStage.score,
    'STAGE',
    stage.score
  );

  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header
            title='Configuración de etapas'
            addFn={millonaire?.stages?.length < millonaire.numberOfQuestions! ? () => onActiveModalStage() : null}
          />
          <Table size='small' columns={columns} dataSource={millonaire.stages} />
        </Space>
      </Card>
      <Modal
        bodyStyle={{
          textAlign: 'center',
        }}
        visible={isVisibleModalStage}
        maskClosable={false}
        onCancel={() => onCancelModalStage()}
        destroyOnClose={true}
        footer={[
          <Button key='back' onClick={() => onCancelModalStage()}>
            Cancelar
          </Button>,

          <Button
            key='submit'
            type='primary'
            disabled={
              isEditStage
                ? Number(previusStage.score) >= Number(stage.score) || Number(laterStage.score) <= Number(stage.score)
                : millonaire?.stages?.find((stageToFind) => Number(stageToFind.score) >= Number(stage.score))
            }
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
            {/* <Select value={Number.isNaN(stage.stage) ? '' : stage.stage} onChange={(e) => onChangeStage('stage', e)}>
              {STAGES_VALUES.map((stage) => {
                // Solo mostrar la etapa que no esta seleccionada y que no sea menor a la etapa actual o que no sea la etapa actual
                return <Select.Option value={stage}>{stage}</Select.Option>;
              })}
            </Select> */}
            <Input value={stage.stage} onChange={(e) => onChangeStage('stage', e.target.value)} disabled />
          </Form.Item>
          <Form.Item label='Pregunta'>
            <Select value={stage.question} onChange={(e) => onChangeStage('question', String(e))}>
              {millonaire?.questions?.map((questions) => {
                return (
                  <Select.Option
                    disabled={millonaire?.stages?.find((stageToFind) => stageToFind.question === questions.id)}
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
