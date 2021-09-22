import React, { useState } from 'react';
import { getColumnSearchProps } from './getColumnSearch';
import { Link } from 'react-router-dom';
import { SpeakersApi } from '../../helpers/request';
import { Button, Row, Col, Avatar, Tooltip, Popover, Image, Empty, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, UserOutlined, DragOutlined } from '@ant-design/icons';
import { sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <DragOutlined style={{ cursor: 'grab', color: '#999' }} />);

export const columns = (columnsData) => [
   {
      title: '',
      dataIndex: 'move',
      width: '50px',
      render(val, item) {
         //Este método se usa para saber cuando se realiza un movimiento
         columnsData.move();
         return <DragHandle />;
      },
   },
   {
      title: 'Orden',
      dataIndex: 'index',
      render(val, item) {
         return <div>{val + 1}</div>;
      },
   },
   {
      title: 'Imagen',
      dataIndex: 'image',
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
                     {item.image ? (
                        <Avatar key={'img' + item._id} src={item.image} />
                     ) : (
                        <Avatar icon={<UserOutlined />} />
                     )}
                  </Popover>
               </Col>
            </Row>
         );
      },
   },
   {
      title: 'Nombre',
      dataIndex: 'name',
      ...getColumnSearchProps('name', columnsData),
   },
   {
      title: 'Profesión',
      dataIndex: 'profession',
      ...getColumnSearchProps('profession', columnsData),
   },
   {
      title: 'Visible',
      dataIndex: 'published',
      render(val, item) {
         const [publish, setPublish] = useState(item.published);
         const update = async (checked) => {
            item.published = checked;
            const res = await SpeakersApi.editOne(item, item._id, item.event_id);
            if (res) setPublish(res.published);
         };
         return <Switch checkedChildren='Sí' unCheckedChildren='No' onChange={update} checked={publish} />;
      },
   },
   {
      title: 'Opciones',
      dataIndex: 'options',
      render(val, item) {
         return (
            /*
             * Para las acciones, se implemento que fueran iconos pequeños y sin texto, nada más del que se presenta en el tooltip, para darle un toque minimalista, de tal manera de que no cargue demasiado la tabla y pantalla
             */
            <Row wrap gutter={[8, 8]}>
               <Col >
                  <Tooltip placement='topLeft' title='Editar Conferencista'>
                     <Link
                        key='edit'
                        to={{ pathname: `${columnsData.data.matchUrl}/speaker`, state: { edit: item._id } }}>
                        <Button icon={<EditOutlined />} type='primary' size='small' />
                     </Link>
                  </Tooltip>
               </Col>
               <Col >
                  <Tooltip placement='topLeft' title='Eliminar Conferencista'>
                     <Button
                        key='delete'
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
