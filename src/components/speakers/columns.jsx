import { useState } from 'react';
import { getColumnSearchProps } from './getColumnSearch';
import { Link } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { Button, Row, Col, Avatar, Tooltip, Popover, Image, Empty, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, UserOutlined, DragOutlined } from '@ant-design/icons';
import { sortableHandle } from 'react-sortable-hoc';
import { DispatchMessageService } from '../../context/MessageService';

export const columns = (columnsData) => [
  {
    title: '',
    dataIndex: 'move',
    width: '50px',
    align: 'center',
    render(val, item) {
      const DragHandle = sortableHandle(() => (
        <DragOutlined id={`drag${item.index}`} style={{ cursor: 'grab', color: '#999', visibility: 'visible' }} />
      ));
      return <DragHandle />;
    },
  },
  {
    title: 'Orden',
    dataIndex: 'index',
    width: '70px',
    render(val, item) {
      return <div>{val + 1}</div>;
    },
  },
  {
    title: 'Imagen',
    dataIndex: 'image',
    width: '100px',
    ellipsis: true,
    render(val, item) {
      /*
       * Dentro de la imagen se realizó al momento de mostrar en la tabla un Avatar, para darle mejor apariencia.
       * Para ver más amplia la imagen se realizó un popover con la etiqueta de "Image" que permite ver mejor la imagen
       */
      return (
        <Row gutter={8}>
          <Col>
            <Popover
              placement='top'
              content={() => (
                <>
                  {item.image ? (
                    <Image key={'img' + item._id} width={200} height={200} src={item.image} />
                  ) : (
                    <Empty description='Imagen no encontrada' />
                  )}
                </>
              )}>
              {item.image ? <Avatar key={'img' + item._id} src={item.image} /> : <Avatar icon={<UserOutlined />} />}
            </Popover>
          </Col>
        </Row>
      );
    },
  },
  {
    title: 'Nombre',
    dataIndex: 'name',
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
    ...getColumnSearchProps('name', columnsData),
  },
  {
    title: 'Profesión',
    dataIndex: 'profession',
    ellipsis: true,
    ...getColumnSearchProps('profession', columnsData),
  },
  {
    title: 'Visible',
    dataIndex: 'published',
    ellipsis: true,
    width: '80px',
    render(val, item) {
      const [publish, setPublish] = useState(item.published);
      const update = async (checked) => {
        item.published = checked;
        try {
          const res = await SpeakersApi.editOne(item, item._id, item.event_id);
          if (res) {
            setPublish(res.published);
            DispatchMessageService({
              type: 'success',
              msj: 'Se actualizó la publicación!',
              action: 'show',
            });
          }
        } catch (err) {
          DispatchMessageService({
            type: 'error',
            msj: 'Ha ocurrido un problema actualizando la publicación!',
            action: 'show',
          });
        }
      };
      return (
        <Switch
          checkedChildren='Sí'
          unCheckedChildren='No'
          onChange={update}
          checked={publish}
          id={`editSwitch${item.index}`}
        />
      );
    },
  },
  {
    title: 'Opciones',
    dataIndex: 'options',
    fixed: 'rigth',
    width: 110,
    render(val, item) {
      return (
        /*
         * Para las acciones, se implemento que fueran iconos pequeños y sin texto, nada más del que se presenta en el tooltip, para darle un toque minimalista, de tal manera de que no cargue demasiado la tabla y pantalla
         */
        <Row wrap gutter={[8, 8]}>
          <Col>
            <Tooltip placement='topLeft' title='Editar'>
              <Link key='edit' to={{ pathname: `${columnsData.data.matchUrl}/speaker`, state: { edit: item._id } }}>
                <Button icon={<EditOutlined />} type='primary' size='small' id={`editarTest${item.index}`} />
              </Link>
            </Tooltip>
          </Col>
          <Col>
            <Tooltip placement='topLeft' title='Eliminar'>
              <Button
                key='delete'
                id={`remove${item.index}`}
                onClick={() => {
                  columnsData.remove(item);
                }}
                icon={<DeleteOutlined />}
                type='danger'
                size='small'
              />
            </Tooltip>
          </Col>
        </Row>
      );
    },
  },
];
