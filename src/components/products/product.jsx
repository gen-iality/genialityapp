import React, { Component } from 'react';
import { Table, Tooltip, Space, Button, Image } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { NewsFeed, Actions, EventsApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import EventContent from '../events/shared/content';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import axios from 'axios/index';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';

const { Column } = Table;

class Product extends Component {
   constructor(props) {
      super(props);
      this.state = {
         event: this.props.event,
         list: [],
         data: {},
         id: '',
         deleteID: '',
         title: '',
         description_complete: '',
         linkYoutube: '',
         description_short: '',
         time: '',
         isLoading: false,
         loading: true,
      };
   }

   componentDidMount() {
      this.fetchItem();
   }

   changeImg = (files) => {
      const file = files[0];
      const url = '/api/files/upload',
         path = [],
         self = this;
      if (file) {
         this.setState({
            imageFile: file,
            event: { ...this.state.event, picture: null },
         });

         //envia el archivo de imagen como POST al API
         const uploaders = files.map((file) => {
            let data = new FormData();
            data.append('file', file);
            return Actions.post(url, data).then((image) => {
               if (image) path.push(image);
            });
         });

         //cuando todaslas promesas de envio de imagenes al servidor se completan
         axios.all(uploaders).then(() => {
            self.setState({
               event: {
                  ...self.state.event,
                  picture: path[0],
               },
               fileMsg: 'Imagen subida con exito',
               imageFile: null,
               path,
            });

            toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
         });
      } else {
         this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
      }
   };

   fetchItem = async () => {
      const data = await EventsApi.getProducts(this.props.eventId);
      this.setState({ list: data.data, loading: false });
   };

   editProduct = (cert) => {
      this.props.history.push(`/event/${this.props.eventId}/product/addproduct/${cert._id}`);
   };

   removeProduct = (id) => {
      sweetAlert.twoButton(`Está seguro de borrar este espacio`, 'warning', true, 'Borrar', async (result) => {
         try {
            if (result.value) {
               sweetAlert.showLoading('Espera (:', 'Borrando...');
               //  await EventsApi.deleteGallery(this.props.eventId)
               await NewsFeed.deleteOne(id, this.props.eventId);
               this.setState(() => ({
                  id: '',
                  title: '',
                  description_complete: '',
                  description_short: '',
                  linkYoutube: '',
                  picture: '',
                  time: '',
               }));
               this.fetchItem();
               sweetAlert.hideLoading();
            }
         } catch (e) {
            sweetAlert.showError(handleRequestError(e));
         }
      });
   };
   newProduct = () => {
      this.props.history.push(`/event/${this.props.eventId}/product/addproduct`);
   };

   goBack = () => this.props.history.goBack();

   render() {
      console.log('10. DATOSS FRESCOS ', this.state.list);

      return (
         <React.Fragment>
            <div className='column is-12 is-desktop'>
               <EventContent
                  title='Producto'
                  closeAction={this.goBack}
                  description_complete={'Agregue o edite los productos que se muestran en la aplicación'}
                  addAction={this.newProduct}
                  addTitle={'Nuevo producto'}>
                  {this.state.loading ? (
                     <Loading />
                  ) : (
                     <Table
                        size='small'
                        bordered
                        dataSource={this.state.list}
                        pagination={{ pageSize: 10, position: ['bottomCenter'] }}
                        scroll={{ x: 1300 }}>
                        <Column key='id' title='name' dataIndex='name' align='center' />
                        <Column key='id' title='description' dataIndex='description' align='center' />
                        <Column key='id' title='price' dataIndex='price' align='center' />

                        <Column
                           key='id'
                           title='Imagenes del producto'
                           align='center'
                           render={(data, index) => (
                              <Space key={index} size='small'>
                                 <Tooltip key={index} placement='topLeft' title='Vista previa'>
                                    {data.image.map((images, index) => {
                                       // console.log("10. imgages, index", images, index)
                                       return <Image key={index} width={100} src={images} />;
                                    })}
                                    {/* <Image key={index} width={100} src={data.image} /> */}
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
