import { Button, Space, Tooltip, Card, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { GroupsApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';
//@ts-ignore

interface Props {
  dataSource: any;
  handledOpenModalGroup: any;
  toggleModalGroup: any;
  organizationId: any;
  selectGroup: any;
  updateListGroup: any;
  handledDelete: any;
}
const CardGroupEvent = ({
  dataSource,
  handledOpenModalGroup,
  toggleModalGroup,
  organizationId,
  selectGroup,
  updateListGroup,
  handledDelete,
}: Props) => {
  const handleDeleteGroupLocal = async (groupId: string) => {
    try {
      await GroupsApi.deleteOne(organizationId, groupId);
      updateListGroup();
      DispatchMessageService({ msj: 'Se elimino correctamente', type: 'success', action: 'show' });
    } catch (error) {
      DispatchMessageService({ msj: 'No se pudo eliminar el grupo', type: 'info', action: 'show' });
    }
  };
  const columns = [
    {
      title: 'Nombre grupo',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 100,
      render: (text: any, record: { key: any; item: any; label: string; value: string }) => (
        <Space>
          <Tooltip title='Editar'>
            <Button
              type='primary'
              onClick={() => {
                handledOpenModalGroup();
                selectGroup(record.item);
              }}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Button
              type='primary'
              danger
              onClick={() => handleDeleteGroupLocal(record.value)}
              icon={<DeleteOutlined />}
            />
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
