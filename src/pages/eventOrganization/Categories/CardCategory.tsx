import { Button, Space, Tooltip, Card, Table } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { CategoriesApi } from '@/helpers/request';
import { DispatchMessageService } from '@/context/MessageService';

interface Props {
  dataSource: any;
  openCategoryModal: any;
  handledSelectCategory: any;
  organizationId: string;
  isLoadingCategories: boolean;
  handledDeleteCategory: (categoryId: string) => Promise<void>;
}
const CardCategory = ({
  dataSource,
  openCategoryModal,
  handledSelectCategory,
  isLoadingCategories,
  organizationId,
  handledDeleteCategory,
}: Props) => {
  
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await handledDeleteCategory(categoryId);
      DispatchMessageService({ action: 'show', type: 'success', msj: 'Se elimino correctamente' });
    } catch (error) {
      DispatchMessageService({ action: 'show', type: 'error', msj: 'No se pudo eliminar, intentelo mas tarde' });
    }
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
            <Button type='primary' danger onClick={() => handleDeleteCategory(record.key)} icon={<DeleteOutlined />} />
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
    </Card>
  );
};

export default CardCategory;
