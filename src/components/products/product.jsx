import React, { Component } from 'react';
import { Table, Tooltip, Space, Button, Image, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { EventsApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import EventContent from '../events/shared/content';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import axios from 'axios/index';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import htmlParser from 'html-react-parser';
import { reject } from 'ramda';

const { Column } = Table;
const { confirm } = Modal;

class Product extends Component {
   constructor(props) {
      super(props);
      this.state = {
         event: this.props.event,
         list: [],
         data: {},
         deleteID: '',
         isLoading: false,
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
      confirm({
         title: 'Hola',
         icon: <ExclamationCircleOutlined />,
         content: 'Está seguro de borrar este producto?',
         onOk() {
            return new Promise((resolve, reject) => {
               EventsApi.deleteProduct(data.event_id, data._id).then((res) => {
                  // this.fetchItem();
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
         <React.Fragment>
            <div className='column is-12 is-desktop'>
               <EventContent
                  title='Producto'
                  closeAction={this.goBack}
                  description={'Agregue o edite los productos que se muestran en la aplicación'}
                  addAction={this.newProduct}
                  addTitle={'Nuevo producto'}>
                  {this.state.loading ? (
                     <Loading />
                  ) : (
                     <Table
                        size='small'
                        bordered
                        dataSource={this.state.list}
                        pagination={{ pageSize: 6, position: ['bottomCenter'] }}
                        scroll={{ x: 1300 }}>
                        <Column key='id' title='Nombre' dataIndex='name' align='center' />
                        <Column
                           key='id'
                           title='Descripción'
                           // dataIndex='description'
                           align='center'
                           render={(data, index) => (
                              <Space key={index} size='small'>
                                 {htmlParser(data.description)}
                              </Space>
                           )}
                        />

                        <Column key='id' title='Valor' dataIndex='price' align='center' />

                        <Column
                           key='id'
                           title='Imagenes del producto'
                           align='center'
                           render={(data, index) => (
                              <Space key={index} size='small'>
                                 <Tooltip key={index} placement='topLeft' title='Vista previa'>
                                    {data.image.map((images, index) => {
                                       return <Image key={index} width={100} src={images} />;
                                    })}
                                 </Tooltip>
                              </Space>
                           )}
                        />

                        <Column
                           title='Herramientas'
                           key='action'
                           align='center'
                           fixed='right'
                           render={(data, index) => (
                              <Space key={index} size='large'>
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
               </EventContent>
            </div>
         </React.Fragment>
      );
   }
}

export default withRouter(Product);
