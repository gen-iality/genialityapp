import { Tooltip, Button, Row, Col, Popover, Image, Avatar, Empty } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { membersGetColumnSearchProps } from '../searchFunctions/membersGetColumnSearchProps';

export const columns = (columnsData, editModalUser) => [
  {
    title: 'Avatar',
    dataIndex: 'picture',
    width: 70,
    /* align: 'center', */
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
    width: 300,
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.names.localeCompare(b.names),
    ...membersGetColumnSearchProps('name', columnsData),
  },
  {
    title: 'Correo',
    dataIndex: 'email',
    width: 350,
    ellipsis: true,
    sorter: (a, b) => a.email.localeCompare(b.email),
    /* align: 'center', */

    ...membersGetColumnSearchProps('email', columnsData),
  },
  {
    title: 'Rol',
    dataIndex: 'position',
    /* align: 'center', */
    ellipsis: true,
    /* sorter: (a, b) => a.position?.localeCompare(b.position), */
    ...membersGetColumnSearchProps('position', columnsData),
  },
  {
    title: 'Progreso',
    dataIndex: 'progress',
    ellipsis: true,
    render: (text, item) => <div>{item.stats}</div>,
  },
  {
    title: 'Creado',
    dataIndex: 'created_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.created_at.localeCompare(b.created_at),
    ...membersGetColumnSearchProps('created_at', columnsData),
    render(val, item) {
      return item.created_at;
    },
  },
  {
    title: 'Actualizado',
    dataIndex: 'updated_at',
    /* align: 'center', */
    ellipsis: true,
    sorter: (a, b) => a.updated_at.localeCompare(b.updated_at),
    ...membersGetColumnSearchProps('updated_at', columnsData),
    render(val, item) {
      return item.updated_at;
    },
  },
  {
    title: 'Opción',
    dataIndex: 'index',
    /* align: 'center', */
    fixed: 'right',
    width: 80,
    render(val, item, index) {
      return (
        <Tooltip title='Editar'>
          <Button
            id={`editAction${index}`}
            type='primary'
            size='small'
            onClick={(e) => {
              editModalUser(item);
            }}
            icon={<EditOutlined />}></Button>
        </Tooltip>
      );
    },
  },
];
