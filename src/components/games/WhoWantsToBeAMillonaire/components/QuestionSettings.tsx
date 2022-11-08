import generateColumnsStages from '../functions/genereteColumnsStages';
import { Button, Card, Modal, Space, Table, Typography, Form } from 'antd';
import Header from '../../../../antdComponents/Header';

const { Title } = Typography;

const StageSettings = () => {
  const columns = generateColumnsStages();
  return (
    <>
      <Card hoverable={true} style={{ cursor: 'auto', marginBottom: '20px', borderRadius: '20px', height: '100%' }}>
        <Space style={{ width: '100%' }} direction='vertical'>
          <Header title='Preguntas' />
          <Table size='small' columns={columns} />
        </Space>
      </Card>

    </>
  );
};
export default StageSettings;
