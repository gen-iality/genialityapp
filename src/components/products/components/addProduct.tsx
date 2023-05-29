import React, { ChangeEvent } from 'react';
import { Row, Input, Form, Col, InputNumber, Switch, Tabs, Typography, Spin, Card } from 'antd';
import { withRouter } from 'react-router-dom';
import { AddProductProps } from '../interface/productTypes';
import BackTop from '@/antdComponents/BackTop';
import EviusReactQuill from '@/components/shared/eviusReactQuill';
import ImageUploaderDragAndDrop from '@/components/imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import Header from '@/antdComponents/Header';
import { FormattedMessage } from 'react-intl';
import useAddProductHook from '../hooks/useAddProductHook';
// este código se va a usar para poder seleccionar si se quiere agregar un producto para subasta o Tienda
// import { Select } from 'antd';
// const { Option } = Select;

const AddProduct: React.FC<AddProductProps> = (props) => {
  const {
    name,
    price,
    discount,
    picture,
    optionalPicture,
    error,
    creator,
    description,
    isLoading,
    discountEnabled,
    formLayout,
    remove,
    saveProduct,
    handleDiscountEnabledChange,
    onChangeDiscount,
    changeInput,
    changeDescription,
    changeImg,
  } = useAddProductHook(props);

  return (
    <Form {...formLayout} onFinish={saveProduct}>
      <Header title={'Producto'} back save form edit={props.match.params?.id} remove={remove} />
      {props.match.params.id && isLoading ? (
        <Row justify='center' align='middle'>
          <Col>
            <Spin
              size='large'
              tip={
                <Typography.Text strong>
                  <FormattedMessage id='loading' defaultMessage={'Cargando...'} />
                </Typography.Text>
              }
            />
          </Col>
        </Row>
      ) : (
        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab={<Typography.Text>General</Typography.Text>} key='1'>
            <Row gutter={[16, 16]} wrap>
              <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
                <Card hoverable style={{ borderRadius: 20 }}>
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Nombre del producto <label style={{ color: 'red' }}>*</label>
                      </label>
                    }
                    rules={[{ required: true, message: 'Ingrese el nombre de la producto' }]}>
                    <Input
                      value={name as string}
                      placeholder='Nombre del producto'
                      name={'name'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => changeInput(e, 'name')}
                    />
                    {error != null && error.name && (
                      <small style={{ color: 'red' }}>El nombre del producto es requerido</small>
                    )}
                  </Form.Item>
                  <Form.Item label={<label style={{ marginTop: '2%' }}>Vendedor</label>} rules={[{ required: false }]}>
                    <Input
                      value={creator}
                      placeholder='Nombre del autor, creador o descripción corta'
                      name={'creator'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => changeInput(e, 'creator')}
                    />
                    {error != null && error.creator && <small style={{ color: 'red' }}>Este campo es requerido</small>}
                  </Form.Item>
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Descripción <label style={{ color: 'red' }}>*</label>
                      </label>
                    }>
                    <EviusReactQuill data={description} id={'descriptionProduct'} handleChange={changeDescription} />
                    {error != null && error.description && (
                      <small style={{ color: 'red' }}>La descripción del producto es requerida</small>
                    )}
                  </Form.Item>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                <Card hoverable style={{ borderRadius: 20 }}>
                  <Form.Item
                    label={<label style={{ marginTop: '2%' }}>Valor</label>}
                    rules={[{ required: false, message: 'Ingrese el valor del producto' }]}>
                    <Input
                      value={price}
                      placeholder='Valor del producto'
                      name={'price'}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => changeInput(e, 'price')}
                    />
                  </Form.Item>
                  <Form.Item>
                    <label style={{ marginTop: '2%', marginRight: '5px' }}>Habilitar descuento</label>
                    <Switch checked={discountEnabled} onChange={handleDiscountEnabledChange} />
                  </Form.Item>
                  {discountEnabled && (
                    <Form.Item
                      label={<label style={{ marginTop: '2%' }}>Descuento</label>}
                      rules={[{ required: false }]}>
                      <InputNumber
                        defaultValue={discount ? discount : 100}
                        min={1}
                        max={100}
                        formatter={(value: number | undefined) => (value === null ? '' : `${value}%`)}
                        parser={(value: any) => (value ? value.replace('%', '') : undefined)}
                        onChange={onChangeDiscount}
                      />
                    </Form.Item>
                  )}
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<Typography.Text>Carga de imagenes</Typography.Text>} key='2'>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card hoverable style={{ borderRadius: 20 }}>
                  <label style={{ marginTop: '2%' }}>
                    Imagen <label style={{ color: 'red' }}>*</label>
                  </label>
                  <ImageUploaderDragAndDrop
                    imageDataCallBack={(file: any) => changeImg(file, 'Imagen')}
                    imageUrl={picture !== null ? (picture as string) : ''}
                    width='1080'
                    height='1080'
                  />
                  {error != null && error.picture && <small style={{ color: 'red' }}>La imagen es requerida</small>}
                </Card>
              </Col>
              <Col span={12}>
                <Card hoverable style={{ borderRadius: 20 }}>
                  <label style={{ marginTop: '2%' }}>Imagen opcional</label>
                  <ImageUploaderDragAndDrop
                    imageDataCallBack={(file: any) => changeImg(file, 'img_optional')}
                    imageUrl={optionalPicture}
                    width='1080'
                    height='1080'
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      )}
      <BackTop />
    </Form>
  );
};

export default withRouter(AddProduct);
