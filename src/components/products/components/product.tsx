import { Component } from 'react';
import { Table, Tooltip, Space, Button, Image, Modal, Typography, Row, Col, Tag, Statistic } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  DragOutlined,
  ShoppingCartOutlined,
  SaveOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { HelperContext } from '@/context/helperContext/helperContext';
import { EventsApi } from '@/helpers/request';
import Loading from '@/components/loaders/loading';
import Header from '@/antdComponents/Header';
import { DispatchMessageService } from '@/context/MessageService';
import { ProductData, ProductProps, ProductState } from '../interface/productTypes';
import { withRouter } from 'react-router-dom';

const { Column } = Table;
const { confirm } = Modal;
const { Paragraph } = Typography;
const SortableItem = sortableElement((props: any) => <tr {...props} />);
const SortableContainer = sortableContainer((props: any) => <tbody {...props} />);

class Product extends Component<ProductProps, ProductState> {
  constructor(props: ProductProps) {
    super(props);
    this.state = {
      list: [],
      loading: true,
      loadingPosition: false,
    };
  }
  static contextType = HelperContext;
  //DRAG TABLE
  DraggableContainer = (props: any) => (
    <SortableContainer
      useDragHandle
      disableAutoscroll
      helperClass='row-dragging'
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );
  DraggableBodyRow = ({ className, style, ...restProps }: any) => {
    const { list } = this.state;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = list.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
    const { list } = this.state;
    if (oldIndex !== newIndex) {
      let newData = arrayMove([...list], oldIndex, newIndex).filter((el) => !!el);
      if (newData) {
        newData = newData.map((product: ProductData) => {
          const index = newData.indexOf(product);
          return { ...product, index };
        });
      }
      this.setState({ list: newData });
    }
  };

  componentDidMount() {
    this.fetchItem();
  }

  fetchItem = async () => {
    const data = await EventsApi.getProducts(this.props.eventId);

    let listproduct = [];
    if (data.data) {
      listproduct = data.data.sort((a: any, b: any) => (a.position && b.position ? a.position - b.position : true));
      listproduct = listproduct.map((product: any, index: number) => {
        return { ...product, index: product.position === index ? product.position : index };
      });
      listproduct = listproduct.sort((a: any, b: any) => a.index - b.index);
      this.setState({ list: listproduct, loading: false });
    }
  };

  savePosition = async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se guarda la configuración...',
      action: 'show',
    });
    try {
      if (this.state.list) {
        await Promise.all(
          this.state.list.map(async (product, index) => {
            let productChange = { ...product, position: product.index + 1 };
            await EventsApi.editProduct(productChange, this.props.eventId, product._id);
          })
        );
      }
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'success',
        msj: 'Configuración guardada correctamente!',
        action: 'show',
      });
    } catch (e) {
      DispatchMessageService({
        key: 'loading',
        action: 'destroy',
      });
      DispatchMessageService({
        type: 'error',
        msj: 'Ha ocurrido un error',
        action: 'show',
      });
    }
  };

  editProduct = (cert: any) => {
    this.props.history.push(`/eventadmin/${this.props.eventId}/product/addproduct/${cert._id}`);
  };
  removeProduct = (data: ProductData) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la configuración...',
      action: 'show',
    });

    const onHandlerRemove = async () => {
      try {
        await EventsApi.deleteProduct(data._id, data.event_id);
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Producto eliminado correctamente',
          action: 'show',
        });
        this.fetchItem();
      } catch (e) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: 'el producto no pudo ser eliminado intente nuevamente',
          action: 'show',
        });
      }
    };

    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Está seguro de borrar este producto?',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        return new Promise((resolve, reject) => {
          onHandlerRemove()
            .then(() => {
              resolve(true);
            })
            .catch(() => {
              DispatchMessageService({
                type: 'error',
                msj: 'Lo sentimos no hay respuesta del servidor',
                action: 'show',
              });
              reject(false);
            });
        });
      },
      onCancel() {},
    });
  };

  newProduct = () => {
    this.props.history.push(`/eventadmin/${this.props.eventId}/product/addproduct`);
  };

  configuration = () => {
    this.props.history.push(`/eventadmin/${this.props.eventId}/product/configuration`);
  };

  goBack = () => this.props.history.goBack();

  calculateDiscountedPrice = (product: any) => {
    if (product && product.price) {
      if (product.discount && product.discount > 0) {
        const discountedPrice = product.price - (product.price * product.discount) / 100;
        return discountedPrice;
      }
      return product.price;
    }
    return 0;
  };

  render() {
    const { eventIsActive } = this.context;
    return (
      <div>
        <Header
          title={'Producto'}
          titleTooltip={'Agregue o edite los Productos que se muestran en la aplicación'}
          addFn={this.newProduct}
          extra={
            <Row wrap gutter={[8, 8]}>
              <Col>
                <Button
                  onClick={this.savePosition}
                  type='primary'
                  icon={<SaveOutlined />}
                  disabled={!eventIsActive && window.location.toString().includes('eventadmin')}>
                  {'Guardar orden'}
                </Button>
              </Col>
              <Col>
                <Button type='primary' icon={<SettingOutlined />} onClick={this.configuration} id={'configuration'}>
                  {'Configuración'}
                </Button>
              </Col>
            </Row>
          }
        />

        {this.state.loading ? (
          <Loading />
        ) : (
          <Table
            size='small'
            rowKey='index'
            dataSource={this.state.list}
            pagination={false} //pageSize: 6, position: ['bottomCenter'] }}
            /* scroll={{ x: 1300 }} auto*/
            components={{
              body: {
                wrapper: this.DraggableContainer,
                row: this.DraggableBodyRow,
              },
            }}>
            <Table.Column
              title=''
              dataIndex='move'
              width='50px'
              align='center'
              render={(data: any, index: any) => {
                const DragHandle = sortableHandle(() => (
                  <DragOutlined
                    id={`drag${index.index}`}
                    style={{ cursor: 'grab', color: '#999', visibility: 'visible' }}
                  />
                ));
                return !eventIsActive && window.location.toString().includes('eventadmin') ? null : <DragHandle />;
              }}
            />
            <Table.Column
              title='Posición'
              align='center'
              dataIndex='index'
              width='80px'
              render={(data: any, index: any) => <div>{data + 1}</div>}
            />
            <Table.Column
              key='_id'
              title='Imagen'
              align='center'
              width='200px'
              render={(data: any, index: any) => (
                <Space key={index} size='small'>
                  {data.images &&
                    Array.isArray(data.images) &&
                    data.images.map((image: any, index: any) => {
                      return image && <Image key={index} width={70} height={70} src={image} />;
                    })}
                </Space>
              )}
            />
            <Table.Column
              key='_id'
              title='Nombre'
              /* align='center' */
              width='300px'
              sorter={(a: any, b: any) => a.name.localeCompare(b.name)}
              render={(data: any) => (
                <Paragraph
                  ellipsis={{
                    rows: 3,
                    expandable: true,
                    symbol: <span style={{ color: '#2D7FD6', fontSize: '14px' }}>Ver más</span>,
                  }}>
                  {data.name}
                </Paragraph>
              )}
            />
            <Table.Column
              key='_id'
              title='Valor'
              width='120px'
              dataIndex='price'
              render={(data: any, product: any) =>
                product.discount ? (
                  <Statistic
                    title={<Typography.Text delete>$ {new Intl.NumberFormat().format(product.price)}</Typography.Text>}
                    value={this.calculateDiscountedPrice(product)}
                    valueStyle={{ color: '#52c41a' }}
                    prefix='$'
                    suffix={
                      <Typography.Text>
                        <small>
                          <Tag color='red'>-{product.discount}%</Tag>
                        </small>
                      </Typography.Text>
                    }
                  />
                ) : (
                  <Statistic
                    title={<Typography.Text style={{ color: 'transparent' }}>Valor del producto</Typography.Text>}
                    value={product.price}
                    valueStyle={{ color: '#52c41a' }}
                    prefix='$'
                  />
                )
              }
              ellipsis={true}
            />
            {/*  <Table.Column
              key='_id'
              title='Descuento'
              // align='center'
              width='120px'
              render={(data: any, index: any) => (
                <Space key={index} size='small'>
                  {data.discount ? <Tag color='red'>{data.discount}%</Tag> : <Tag color='default'>Sin descuento</Tag>}
                </Space>
              )}
            /> */}
            {/* <Column key='_id' title='Valor' dataIndex='start_price' align='center' render={(data,prod)=>(<div>{prod?.currency || "" .concat((data || prod?.price)?" $ "+prod?.price:"").concat((prod?.start_price|| prod?.price||''))}</div>)} /> */}
            <Table.Column
              title='Opciones'
              key='_id'
              align='center'
              fixed='right'
              width={150}
              render={(data: any, index: any) => {
                return (
                  <Space key={index} size='small'>
                    <Tooltip key={index} placement='topLeft' title='Editar'>
                      <Button
                        key={index}
                        id={`editAction${index.index}`}
                        onClick={() => this.editProduct(data)}
                        type='primary'
                        icon={<EditOutlined /* style={{ fontSize: 25 }} */ />}
                        size='small'
                      />
                    </Tooltip>
                    <Tooltip key={index} placement='topLeft' title='Eliminar'>
                      <Button
                        key={index}
                        id={`removeAction${index.index}`}
                        onClick={() => this.removeProduct(data)}
                        danger
                        icon={<DeleteOutlined /* style={{ fontSize: 25 }} */ />}
                        size='small'
                        disabled={!eventIsActive && window.location.toString().includes('eventadmin')}
                      />
                    </Tooltip>
                    <Tooltip key={index} placement='topLeft' title='Ofertas'>
                      <Button
                        key={index}
                        id={`shoppingAction${index.index}`}
                        onClick={() =>
                          this.props.history.push(`/eventadmin/${this.props.eventId}/product/${data._id}/oferts`)
                        }
                        color={'#1890ff'}
                        icon={<ShoppingCartOutlined /* style={{ fontSize: 25 }} */ />}
                        size='small'
                      />
                    </Tooltip>
                  </Space>
                );
              }}
            />
          </Table>
        )}
      </div>
    );
  }
}

export default withRouter(Product);
