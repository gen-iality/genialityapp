import React, { Component } from 'react';
import { Table, Tooltip, Space, Button, Image, Modal, message, Typography, Row, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusCircleOutlined, DragOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { EventsApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import { withRouter } from 'react-router';
import { product } from 'ramda';

const { Column } = Table;
const { confirm } = Modal;
const { Title, Paragraph } = Typography;
const  DragHandle = sortableHandle(() => <DragOutlined  style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />)


class Product extends Component {
   constructor(props) {
      super(props);
      this.state = {
         list: [],
         loading: true,
         loadingPosition:false         
      };
   }
   //DRAG TABLE
   DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        disableAutoscroll
        helperClass="row-dragging"
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
    DraggableBodyRow = ({ className, style, ...restProps }) => {
      const { list } = this.state;
      // function findIndex base on Table rowKey props and should always be a right array index
      const index = list.findIndex(x => x.index === restProps['data-row-key']);
      return <SortableItem index={index} {...restProps} />;
    };

    onSortEnd = ({ oldIndex, newIndex }) => {
      const { list } = this.state;
      //list[newIndex].index=oldIndex;
      //list[oldIndex].index=newIndex;
      if (oldIndex !== newIndex) {
       let newData = arrayMove([].concat(list), oldIndex, newIndex).filter(el => !!el);
        console.log('Sorted items: ', newData);
        //asignar nueva posicion
        if(newData){
          newData= newData.map((product,key)=>{
            return {...product,index:key};
           })
           console.log("AGREGADA LAS POSCIONES")
        }
        this.setState({list: newData });
      }
    };
  

   componentDidMount() {
      this.fetchItem();
   }

   fetchItem = async () => {
      const data = await EventsApi.getProducts(this.props.eventId);
     
      let listproduct=[];
      if(data.data){
        listproduct= data.data.map((product,index)=>{
           return {...product,index:product.position==index?product.position:index}
         })
         console.log("DATALIST==>",listproduct)
         listproduct=listproduct.sort((a,b)=>a.index-b.index)
         this.setState({ list: listproduct, loading: false });         
      }    
   };

   savePosition=async()=>{
      //alert("A GUARDAR")     
      const loadingSave = message.open({
         key: 'loading',
         type: 'loading',
         content: <> Por favor espere miestras se guarda la configuración..</>,
       });
    //console.log("NEW LIST==>",this.state.list)
    if(this.state.list){
      await Promise.all(this.state.list.map(async(product,index)=>{
          let productChange={...product,position:product.index}
          await EventsApi.editProduct(productChange,this.props.eventId,product._id)
         console.log("ACTUALIZADO..",index)
       }))
    }
    message.destroy(loadingSave.key);
    message.open({
      type: 'success',
      content: <> Configuración guardada correctamente!</>,
    });
   }

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

   configuration= () => {
      this.props.history.push(`/event/${this.props.eventId}/product/configuration`);
   };

   goBack = () => this.props.history.goBack();

   render() {
      return (
         <div>
            <Title level={4}>{'Producto'}</Title>

            <Row justify='end' style={{ marginBottom: '10px' }}>
               <Button onClick={this.newProduct} type='primary' style={{marginRight:'20px'}} icon={<PlusCircleOutlined />}>
                  {'Crear producto'}
               </Button>
               <Button onClick={this.configuration} type='primary' style={{marginRight:'20px'}} icon={<PlusCircleOutlined />}>
                  {'Configuración'}
               </Button>
               <Button onClick={this.savePosition} type='primary'  icon={<PlusCircleOutlined />}>
                  {'Guardar posición'}
               </Button>
            </Row>

            {this.state.loading ? (
               <Loading />
            ) : (
               <Table
                  size='small'
                  rowKey='index'
                  dataSource={this.state.list}
                  pagination={false } //pageSize: 6, position: ['bottomCenter'] }}
                  scroll={{ x: 1300 }}
                  components={{
                     body: {
                       wrapper: this.DraggableContainer,
                       row: this.DraggableBodyRow,
                     }}}
                  >
               <Column
                  title=''
                  dataIndex='move'
                  width='50px'
                  render={ () => <DragHandle />}
                  />
                  <Column
                  title='Posición'
                  dataIndex='index'
                  width='100px'
                  render={ (data,index) => <div>{data+1}</div>}
                  />
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
                  <Column key='_id' title='Valor' dataIndex='start_price' align='center' render={(data,prod)=>(<div>{prod?.currency || "" +" $ "+(prod?.start_price|| prod?.price)}</div>)} />
                  <Column
                     key='_id'
                     title='Imagenes del producto'
                     align='center'
                     render={(data, index) => (
                        <Space key={index} size='small'>
                           {data.image && Array.isArray(data.image) &&
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
                           <Tooltip key={index} placement='topLeft' title='Ofertas'>
                              <Button
                                 key={index}
                                 onClick={() => this.props.history.push(`/event/${this.props.eventId}/product/${data._id}/oferts`) }
                                 color={'#1890ff'}
                                 icon={<ShoppingCartOutlined style={{ fontSize: 25 }} />}
                              />
                           </Tooltip>
                        </Space>
                     )}
                  />                
               </Table>)}
         </div>
      );
   }
}

export default withRouter(Product);
