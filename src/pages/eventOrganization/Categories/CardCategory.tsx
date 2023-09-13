import { Button, Space, Tooltip, Card, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
//@ts-ignore
const CardCategory = ({ dataSource, showEditModal, handleDeleteCategory, toggleModal }) => {
  const columns = [
    {
      title: 'Nombre categoría',
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
            <Button type='primary' onClick={() => showEditModal(record)} icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Button type='primary' danger onClick={() => handleDeleteCategory(record.key)} icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
    headStyle={{border: 'none'}}
      title={'Categorías'}
      extra={
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={toggleModal}>
          {'Agregar'}
        </Button>
      }>
      <Table columns={columns} dataSource={dataSource} size='small' rowKey='key' pagination={false} />
    </Card>
  );
};

export default CardCategory;
