import { useState, useEffect } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Row, Input, Form, Col, Modal, InputNumber } from 'antd';
import { withRouter } from 'react-router-dom';
import { EventsApi } from '../../helpers/request';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import EviusReactQuill from '../shared/eviusReactQuill';
import { handleRequestError } from '../../helpers/utils';
import { DispatchMessageService } from '../../context/MessageService';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import { removeObjectFromArray, renderTypeImage } from '@/Utilities/imgUtils';
import Loading from '../profile/loading';
// este código se va a usar para poder seleccionar si se quiere agregar un producto para subasta o Tienda
// import { Select } from 'antd';
// const { Option } = Select;

export const toolbarEditor = {
  toolbar: [
    [{ font: [] }],
    [{ header: [0, 1, 2, 3] }],
    [{ size: [] }],
    [{ align: [] }],
    [{ syntax: true }],
    ['bold', 'italic', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
  ],
};

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { confirm } = Modal;

function AddProduct(props) {
  const [product, setProduct] = useState();
  const [name, setName] = useState('');
  const [creator, setCreator] = useState('');
  //subasta o tienda
  // const [store, setStore] = useState('just-store');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [picture, setPicture] = useState(null);
  const [optionalPicture, setOptionalPicture] = useState(null);
  const [imageFile, setImgFile] = useState([]);
  const [imageFileOptional, setImgFileOptional] = useState(null);
  const [errImg, setErrImg] = useState();
  const [error, setError] = useState(null);
  const [idNew, setIdNew] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [discount, setDiscount] = useState(null);

  // subasta o tienda
  // const handleChange = (value) => {
  //   setStore(value);
  // };
  // console.log(store);
  const onChangeDiscount = (value) => {
    setDiscount(value === null ? null : value);
  };

  useEffect(() => {
    if (props.match.params.id) {
      setIdNew(props.match.params.id);
      EventsApi.getOneProduct(props.eventId, props.match.params.id).then((product) => {
        setProduct(product);
        setName(product.name);
        setCreator(product.by);
        // subasta o tienda
        // setStore(product.type)
        setDescription(product.description || '');
        setPicture(product.images && product.images[0] ? product.images[0] : null);
        setImgFile([
          { name: 'Imagen', file: product.images[0] },
          { name: 'img_optional', file: product.images[1] },
        ]);
        setOptionalPicture(product.images && product.images[1] ? product.images[1] : null);
        setPrice(product.price);
        setIsLoading(false);
      });
    }
  }, [props.match.params.id]);

  const goBack = () => props.history.goBack();

  const changeInput = (e, key) => {
    if (key === 'name') {
      setName(e.target.value);
    } else if (key === 'price') {
      setPrice(e.target.value);
    } else if (key === 'creator') {
      setCreator(e.target.value);
    }
  };
  const changeDescription = (e) => {
    if (description.length < 10000) {
      setDescription(e);
    } else {
      //alert('NO PUEDE ESCRIBIR MAS');
    }
  };

  const changeImg = (file, name) => {
    let temp = imageFile;
    let ImagenSearch = imageFile.filter((img) => img.name === name);
    if (ImagenSearch.length > 0) {
      let newtemp = imageFile.filter((img) => img.name !== name);
      temp = newtemp;
      temp.push({ name, file });
      setImgFile(temp);
      return;
    }

    if (file) {
      temp.push({ name, file });
      setImgFile(temp);
    } else {
      removeObjectFromArray(name, temp, setImgFile);
      temp.push({ name, file: '' });
    }
  };

  const saveProduct = async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se guarda la información...',
      action: 'show',
    });

    let validators = {};
    validators.price = false;
    validators.creator = false;

    if (name === '') {
      validators.name = true;
    } else {
      validators.name = false;
    }
    if (description === '') {
      validators.description = true;
    } else {
      validators.description = false;
    }
    // if (picture === null) {
    //   validators.picture = true;
    // } else {
    //   validators.picture = false;
    // }
    let ImagenFilled = imageFile.filter((img) => img.name === 'Imagen');
    if (ImagenFilled.length === 0) {
      validators.picture = true;
    } else {
      validators.picture = false;
    }

    setError(validators);
    if (
      validators &&
      validators.name === false &&
      validators.creator === false &&
      validators.description === false &&
      validators.picture === false &&
      validators.price === false
    ) {
      try {
        if (idNew !== undefined) {
          let resp = await EventsApi.editProduct(
            {
              name,
              by: creator,
              description,
              price,
              discount,
              images: [renderTypeImage('Imagen', imageFile), renderTypeImage('img_optional', imageFile)],
              // subasta o tienda
              // type: store,
              type: 'just-store',
            },
            props.eventId,
            product._id
          );
          if (resp) {
            props.history.push(`/eventadmin/${props.eventId}/product`);
          }
        } else {
          const newProduct = await EventsApi.createProducts(
            {
              name,
              by: creator,
              description,
              price,
              discount,
              images: [renderTypeImage('Imagen', imageFile), renderTypeImage('img_optional', imageFile)],
              // subasta o tienda
              // type: store,
              type: 'just-store',
            },
            props.eventId
          );
          if (newProduct) {
            props.history.push(`/eventadmin/${props.eventId}/product`);
          }
        }
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
      } catch (e) {
        // e;
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: e,
          action: 'show',
        });
      }
    } /* else {
      console.log('algo fallo', validators);
    } */
  };

  const remove = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (props.match.params.id) {
      confirm({
        title: `¿Está seguro de eliminar la información?`,
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await EventsApi.deleteProduct(props.match.params.id, props.eventId);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              goBack();
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e)?.message,
                action: 'show',
              });
            }
          };
          onHandlerRemove();
        },
      });
    }
  };

  return (
    <Form {...formLayout} onFinish={saveProduct}>
      <Header title={'Producto'} back save form edit={props.match.params.id} remove={remove} />
      <Row justify='center' wrap gutter={12}>
        {props.match.params.id && isLoading ? (
          <Loading />
        ) : (
          <Col span={16}>
            <Form.Item
              label={
                <label style={{ marginTop: '2%' }}>
                  Nombre del producto <label style={{ color: 'red' }}>*</label>
                </label>
              }
              rules={[{ required: true, message: 'Ingrese el nombre de la producto' }]}>
              <Input
                value={name}
                placeholder='Nombre del producto'
                name={'name'}
                onChange={(e) => changeInput(e, 'name')}
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
                onChange={(e) => changeInput(e, 'creator')}
              />
              {error != null && error.creator && <small style={{ color: 'red' }}>Este campo es requerido</small>}
            </Form.Item>
            {/*   // subasta o tienda
            <Form.Item label={<label style={{ marginTop: '2%' }}>Tipo</label>} rules={[{ required: false }]}>
              <Select value={store} style={{ width: 120 }} onChange={handleChange}>
                <Option value='just-store'>Tienda</Option>
                <Option value='Prueba'>Subasta</Option>
              </Select>
              {error != null && error.store && <small style={{ color: 'red' }}>Este campo es requerido</small>}
            </Form.Item> */}
            <Form.Item label={<label style={{ marginTop: '2%' }}>Descuento</label>} rules={[{ required: false }]}>
              <InputNumber
                defaultValue={null}
                min={1}
                max={100}
                formatter={(value) => (value === null ? '' : `${value}%`)}
                parser={(value) => (value ? value.replace('%', '') : null)}
                onChange={onChangeDiscount}
              />
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
            <Form.Item
              label={<label style={{ marginTop: '2%' }}>Valor</label>}
              rules={[{ required: false, message: 'Ingrese el valor del producto' }]}>
              <Input
                value={price}
                placeholder='Valor del producto'
                name={'price'}
                onChange={(e) => changeInput(e, 'price')}
              />
            </Form.Item>
            <label style={{ marginTop: '2%' }}>
              Imagen <label style={{ color: 'red' }}>*</label>
            </label>
            <ImageUploaderDragAndDrop
              imageDataCallBack={(file) => changeImg(file, 'Imagen')}
              imageUrl={picture}
              width='1080'
              height='1080'
            />

            {error != null && error.picture && <small style={{ color: 'red' }}>La imagen es requerida</small>}

            <label style={{ marginTop: '2%' }}>Imagen opcional</label>

            <ImageUploaderDragAndDrop
              imageDataCallBack={(file) => changeImg(file, 'img_optional')}
              imageUrl={optionalPicture}
              width='1080'
              height='1080'
            />
          </Col>
        )}
      </Row>
      <BackTop />
    </Form>
  );
}

export default withRouter(AddProduct);
