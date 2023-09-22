import { Button, Space, Tooltip, Card, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@/context/MessageService';
import { useState } from 'react';
import { ModalConfirm } from '@/components/ModalConfirm/ModalConfirm';

interface Props {
  dataSource: any;
  openCategoryModal: any;
  handledSelectCategory: any;
  organizationId: string;
  isLoadingCategories: boolean;
  handledDeleteCategory: (categoryId: string) => Promise<void>;
}
interface ICategory {
  name: string;
  key: string
}
const CardCategory = ({
  dataSource,
  openCategoryModal,
  handledSelectCategory,
  isLoadingCategories,
  organizationId,
  handledDeleteCategory,
}: Props) => {
  const [modalConfirm, setModalConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ICategory>();

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await handledDeleteCategory(categoryId);
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se elimino correctamente' });
      setModalConfirm(false);
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'error', msj: 'No se pudo eliminar, intentelo mas tarde' });
    }
  };

  const onOpenModalConfirn = (record: any) => {
    setItemToDelete(record);
    setModalConfirm(true);
  };

  const onCloseModalConfirm = () => {
    setModalConfirm(false);
  };

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
      render: (text: any, record: { key: any }) => (
        <Space>
          <Tooltip title='Editar'>
            <Button
              type='primary'
              onClick={() => {
                handledSelectCategory(record);
                openCategoryModal();
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
      title={'Categorías'}
      extra={
        <Button type='primary' icon={<PlusCircleOutlined />} onClick={openCategoryModal}>
          {'Agregar'}
        </Button>
      }>
      <Table
        loading={isLoadingCategories}
        columns={columns}
        dataSource={dataSource}
        size='small'
        rowKey='key'
        pagination={false}
      />
      {modalConfirm && itemToDelete && (
        <ModalConfirm
          visible={modalConfirm}
          onCancel={onCloseModalConfirm}
          nameItem={itemToDelete.name}
          onAction={() => {
            handleDeleteCategory(itemToDelete.key);
          }}
          titleConfirm={`¿Desea borrar a "${itemToDelete.name}" de la lista?`}
          descriptionConfirm={`Esta acción borrará permanentemente los datos de la categoría`}
        />
      )}
    </Card>
  );
};

export default CardCategory;
