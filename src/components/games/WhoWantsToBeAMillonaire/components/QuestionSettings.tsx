import generateColumnsQuestion from '../functions/genereteColumnsQuestions';
import { Card, Space, Table } from 'antd';
import Header from '../../../../antdComponents/Header';
const QuestionSettings = () => {
  const columns = generateColumnsQuestion();
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
export default QuestionSettings;
