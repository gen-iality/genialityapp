import { Button, Space, Tooltip, Card, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
//@ts-ignore
const CardGroupEvent = ({ dataSource, showEditModalGroup, handleDeleteGroup, toggleModalGroup }) => {
  const columns = [
    {
      title: 'Nombre grupo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 100,
      render: (text: any, record: { key: any; }) => (
        <Space>
          <Tooltip title='Editar'>
            <Button type='primary' onClick={() => showEditModalGroup(record)} icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Button type='primary' danger onClick={() => handleDeleteGroup(record.key)} icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      headStyle={{ border: 'none' }}
      title={'Grupos'}
      extra={
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={toggleModalGroup}>
          {'Agregar'}
        </Button>
      }>
      <Table columns={columns} dataSource={dataSource} size='small' rowKey='key' pagination={false} />
    </Card>
  );
};

export default CardGroupEvent;
