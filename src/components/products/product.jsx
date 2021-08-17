import React, { Component } from 'react';
import { Table, Tooltip, Space, Button, Image, Modal, message, Typography, Row } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { EventsApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import { withRouter } from 'react-router';

const { Column } = Table;
const { confirm } = Modal;
const { Title, Paragraph } = Typography;

class Product extends Component {
   constructor(props) {
      super(props);
      this.state = {
         list: [],
         loading: true,
      };
   }

   componentDidMount() {
      this.fetchItem();
   }

   fetchItem = async () => {
      const data = await EventsApi.getProducts(this.props.eventId);
      this.setState({ list: data.data, loading: false });
   };

   editProduct = (cert) => {
      this.props.history.push(`/event/${this.props.eventId}/product/addproduct/${cert._id}`);
   };

   removeProduct = (data) => {
      let self = this;
      confirm({
         icon: <ExclamationCircleOutlined />,
         content: 'Está seguro de borrar este producto?',
         onOk() {
            return new Promise((resolve, reject) => {
               EventsApi.deleteProduct(data.event_id, data._id).then((res) => {
                  self.fetchItem();
                  if (res === 1) {
                     message.success('Producto eliminado correctamente');
                     resolve(true);
                  } else {
                     message.error('Lo sentimos el producto no pudo ser eliminado intente nuevamente');
                     reject(false);
                  }
               });
            }).catch(() => message.error('Lo sentimos no hay respuesta del servidor'));
         },
         onCancel() {},
      });
   };

   newProduct = () => {
      this.props.history.push(`/event/${this.props.eventId}/product/addproduct`);
   };

   goBack = () => this.props.history.goBack();

   render() {
      return (
         <div>
            <Title level={4}>{'Producto'}</Title>

            <Row justify='end' style={{ marginBottom: '10px' }}>
               <Button onClick={this.newProduct} type='primary' icon={<PlusCircleOutlined />}>
                  {'Crear producto'}
               </Button>
            </Row>

            {this.state.loading ? (
               <Loading />
            ) : (
               <Table
                  size='small'
                  rowKey='index'
                  dataSource={this.state.list}
                  pagination={{ pageSize: 6, position: ['bottomCenter'] }}
                  scroll={{ x: 1300 }}>
                  <Column
                     key='_id'
                     title='Nombre'
                     align='center'
                     render={(data) => (
                        <Paragraph
                           ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: <span style={{ color: '#2D7FD6', fontSize: '14px' }}>Ver mas</span>,
                           }}>
                           {data.name}
                        </Paragraph>
                     )}
                  />
                  <Column key='_id' title='Por' align='center' dataIndex='by' />
                  <Column key='_id' title='Valor' dataIndex='price' align='center' />
                  <Column
                     key='_id'
                     title='Imagenes del producto'
                     align='center'
                     render={(data, index) => (
                        <Space key={index} size='small'>
                           {data.image &&
                              data.image.map((images, index) => {
                                 return <Image key={index} width={70} src={images} />;
                              })}
                        </Space>
                     )}
                  />
                  <Column
                     title='Herramientas'
                     key='_id'
                     align='center'
                     fixed='right'
                     render={(data, index) => (
                        <Space key={index} size='small'>
                           <Tooltip key={index} placement='topLeft' title='Editar'>
                              <Button
                                 key={index}
                                 onClick={() => this.editProduct(data)}
                                 type='primary'
                                 icon={<EditOutlined style={{ fontSize: 25 }} />}
                              />
                           </Tooltip>
                           <Tooltip key={index} placement='topLeft' title='Eliminar'>
                              <Button
                                 key={index}
                                 onClick={() => this.removeProduct(data)}
                                 type='danger'
                                 icon={<DeleteOutlined style={{ fontSize: 25 }} />}
                              />
                           </Tooltip>
                        </Space>
                     )}
                  />
               </Table>
            )}
         </div>
      );
   }
}

export default withRouter(Product);
