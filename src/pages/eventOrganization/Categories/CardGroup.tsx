import { Button, Space, Tooltip, Card, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@/context/MessageService';
import { ModalConfirm } from '@/components/ModalConfirm/ModalConfirm';
import { useState } from 'react';
import { GroupEventMongo } from '../interface/group.interfaces';
//@ts-ignore

interface Props {
  dataSource: any;
  handledOpenModalGroup: any;
  toggleModalGroup: any;
  organizationId: any;
  selectGroup: any;
  handledDelete: (groupId: string) => Promise<void>;
  isLoadingGroup: boolean;
}
const CardGroupEvent = ({
  dataSource,
  handledOpenModalGroup,
  toggleModalGroup,
  organizationId,
  selectGroup,
  handledDelete,
  isLoadingGroup,
}: Props) => {
  const [modalConfirm, setModalConfirm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupEventMongo>();

  const handleDeleteGroupLocal = async (group: GroupEventMongo) => {
    try {
      await handledDelete(group.value);
      DispatchMessageService({ msj: 'Se elimino correctamente', type: 'success', action: 'show' });
    } catch (error) {
      DispatchMessageService({ msj: 'No se pudo eliminar el grupo', type: 'info', action: 'show' });
    }
  };

  const onOpenModalConfirn = (group: GroupEventMongo) => {
    setSelectedGroup(group);
    setModalConfirm(true);
  };

  const onCloseModalConfirm = () => {
    setModalConfirm(false);
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
      render: (text: any, record: GroupEventMongo) => (
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
            <Button type='primary' danger onClick={() => onOpenModalConfirn(record)} icon={<DeleteOutlined />} />
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
      <Table
        loading={isLoadingGroup}
        columns={columns}
        dataSource={dataSource}
        size='small'
        rowKey='key'
        pagination={false}
      />
      {modalConfirm && selectedGroup && (
        <ModalConfirm
          visible={modalConfirm}
          onCancel={onCloseModalConfirm}
          nameItem={selectedGroup.label}
          onAction={() => {
            handleDeleteGroupLocal(selectedGroup);
          }}
          titleConfirm={`¿Desea borrar a "${selectedGroup.label}" de la lista?`}
          descriptionConfirm={`Esta acción borrará permanentemente los datos de "${selectedGroup.label}" de la lista y los evenots asociados seran retirados de este grupo.`}
        />
      )}
    </Card>
  );
};

export default CardGroupEvent;
