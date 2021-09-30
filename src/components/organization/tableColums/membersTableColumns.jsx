import React from 'react';
import { Tag, Button } from 'antd';
import { EditOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const columns = (goToEvent) => [
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
      title: 'Ingreso',
      dataIndex: 'name',
      align: 'center',
      render(val, item) {
         return item.name;
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
      render(val, item) {
         return item.properties.name;
      },
   },
   {
      title: 'Correo',
      dataIndex: 'checked_in_not',
      align: 'center',
      render(val, item) {
         return item.properties.email;
      },
   },
   {
      title: 'Rol',
      dataIndex: 'position',
      align: 'center',
      render(val, item) {
         return item.properties.position;
      },
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
