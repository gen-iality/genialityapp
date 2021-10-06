import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { membersGetColumnSearchProps } from '../searchFunctions/membersGetColumnSearchProps';

export const columns = (goToEvent, columnsData) => [
   {
      title: 'Editar',
      dataIndex: 'index',
      width: 60,
      fixed: 'left',
      render(val, item, index) {
         return <EditOutlined />;
      },
   },
   {
      title: 'Avatar',
      dataIndex: 'count',
      align: 'center',
   },
   {
      title: 'Nombres',
      dataIndex: 'name',
      align: 'center',
      ...membersGetColumnSearchProps('name', columnsData),
   },
   {
      title: 'Correo',
      dataIndex: 'email',
      align: 'center',

      ...membersGetColumnSearchProps('email', columnsData),
   },
   {
      title: 'Rol',
      dataIndex: 'position',
      align: 'center',

      ...membersGetColumnSearchProps('position', columnsData),
   },
   {
      title: 'Creado',
      dataIndex: 'created_at',
      align: 'center',
      render(val, item) {
         return item.created_at;
      },
   },
   {
      title: 'Actualizado',
      dataIndex: 'updated_at',
      align: 'center',
      render(val, item) {
         return item.updated_at;
      },
   },
];
