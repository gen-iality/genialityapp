import React from 'react';
import { Tooltip, Button, Row, Col, Popover, Image, Avatar, Empty } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { membersGetColumnSearchProps } from '../searchFunctions/membersGetColumnSearchProps';

export const columns = (columnsData, editModalUser) => [
  {
    title: 'Avatar',
    dataIndex: 'picture',
    /* width: 70,
    align: 'center', */
    render(val, item, index) {
      return (
        <Row gutter={8}>
          <Col>
            <Popover
              placement='top'
              content={() => (
                <>
                  {item.picture ? (
                    <Image key={'img' + item._id} width={200} height={200} src={item.picture} />
                  ) : (
                    <Empty description='Imagen no encontrada' />
                  )}
                </>
              )}>
              {item.picture ? <Avatar key={'img' + item._id} src={item.picture} /> : <Avatar icon={<UserOutlined />} />}
            </Popover>
          </Col>
        </Row>
      );
    },
  },
  {
    title: 'Nombres',
    dataIndex: 'names',
    /* align: 'center', */
    ...membersGetColumnSearchProps('name', columnsData),
  },
  {
    title: 'Correo',
    dataIndex: 'email',
    /* align: 'center', */

    ...membersGetColumnSearchProps('email', columnsData),
  },
  {
    title: 'Rol',
    dataIndex: 'position',
    /* align: 'center', */

    ...membersGetColumnSearchProps('position', columnsData),
  },
  {
    title: 'Creado',
    dataIndex: 'created_at',
    /* align: 'center', */
    render(val, item) {
      return item.created_at;
    },
  },
  {
    title: 'Actualizado',
    dataIndex: 'updated_at',
    /* align: 'center', */
    render(val, item) {
      return item.updated_at;
    },
  },
  {
    title: 'Opción',
    dataIndex: 'index',
    /* width: 60,
    fixed: 'left',
    align: 'center', */
    render(val, item, index) {
      return (
        <Tooltip title='Editar'>
          <Button
            type='primary'
            size='small'
            onClick={(e) => {
              editModalUser(item);
            }}
            icon={<EditOutlined />}>
          </Button>
        </Tooltip>
      );
    },
  },
];
