import React from 'react';
import { Table, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
//@ts-expect-error
const CategoryTable = ({ dataSource, showEditModal, handleDeleteCategory }) => {
  const columns = [
    {
      title: 'Nombre categoría',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Eventos por categoría',
      dataIndex: 'eventosPorCategoria',
      key: 'eventosPorCategoria',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      width: 100,
      //@ts-ignore
      render: (text, record) => (
        <Space>
          <Tooltip title='Editar'>
            <Button type='primary' size='small' onClick={() => showEditModal(record)} icon={<EditOutlined />}></Button>
          </Tooltip>
          <Tooltip title='Eliminar'>
            <Button
              //@ts-ignore
              type='danger'
              size='small'
              onClick={() => {
                handleDeleteCategory(record.key);
              }}
              icon={<DeleteOutlined />}></Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={dataSource} size='small' rowKey='key' />;
};

export default CategoryTable;
