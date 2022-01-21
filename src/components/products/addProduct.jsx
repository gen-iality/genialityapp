import React, { useState, useEffect } from 'react';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Card, Row, Input, Form, message, Col, Modal } from 'antd';
import { withRouter } from 'react-router';
import ImageInput from '../shared/imageInput';
import Axios from 'axios';
import { Actions, EventsApi } from '../../helpers/request';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import EviusReactQuill from '../shared/eviusReactQuill';
import { handleRequestError } from '../../helpers/utils';

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
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [picture, setPicture] = useState(null);
  const [optionalPicture, setOptionalPicture] = useState(null);
  const [imageFile, setImgFile] = useState(null);
  const [imageFileOptional, setImgFileOptional] = useState(null);
  const [errImg, setErrImg] = useState();
  const [error, setError] = useState(null);
  const [idNew, setIdNew] = useState();

  useEffect(() => {
    if (props.match.params.id) {
      setIdNew(props.match.params.id);
      EventsApi.getOneProduct(props.eventId, props.match.params.id).then((product) => {
        setProduct(product);
        setName(product.name);
        setCreator(product.by);
        setDescription(product.description || '');
        setPicture(product.image && product.image[0] ? product.image[0] : null);
        setOptionalPicture(product.image && product.image[1] ? product.image[1] : null);
        setPrice(product.price);
      });
    }
  }, []);

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

  const changeImg = (files, option) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      option === 'Imagen' ? setImgFile(file) : setImgFileOptional(file);
      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) path.push(image);
        });
      });

      //cuando todaslas promesas de envio de imagenes al servidor se completan
      Axios.all(uploaders).then(() => {
        /* console.log('PATH===>', path[0]); */
        option === 'Imagen' ? setPicture(path[0]) : setOptionalPicture(path[0]);
        option === 'Imagen' ? setImgFile(null) : setImgFileOptional(null);

        message.success('Imagen cargada correctamente');
      });
    } else {
      setErrImg('Solo se permiten imágenes. Intentalo de nuevo');
    }
  };

  const saveProduct = async () => {
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
    if (picture === null) {
      validators.picture = true;
    } else {
      validators.picture = false;
    }
    setError(validators);
    if (
      validators &&
      validators.name == false &&
      validators.creator == false &&
      validators.description == false &&
      validators.picture == false &&
      validators.price == false
    ) {
      try {
        if (idNew !== undefined) {
          let resp = await EventsApi.editProduct(
            {
              name,
              by: creator,
              description,
              price,
              image: [picture, optionalPicture],
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
              image: [picture, optionalPicture],
            },
            props.eventId
          );
          if (newProduct) {
            props.history.push(`/eventadmin/${props.eventId}/product`);
          }
        }
      } catch (e) {
        e;
        /* console.log('10. error ', e); */
      }
    }
  };

  const remove = () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
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
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              goBack();
            } catch (e) {
              message.destroy(loading.key);
              message.open({
                type: 'error',
                content: handleRequestError(e)?.message,
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
        <Col span={16}>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
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
            {error != null && error.name && <small style={{ color: 'red' }}>El nombre del producto es requerido</small>}
          </Form.Item>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Por
              </label>
            }
            rules={[{ required: false }]}>
            <Input
              value={creator}
              placeholder='Nombre del autor, creador o descripción corta'
              name={'creator'}
              onChange={(e) => changeInput(e, 'creator')}
            />
            {error != null && error.creator && <small style={{ color: 'red' }}>Este campo es requerido</small>}
          </Form.Item>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Descripción <label style={{ color: 'red' }}>*</label>
              </label>
            }>
            <EviusReactQuill data={description} id={'descriptionProduct'} handleChange={changeDescription} />
            {error != null && error.description && (
              <small style={{ color: 'red' }}>La descripción del producto es requerida</small>
            )}
          </Form.Item>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Valor
              </label>
            }
            rules={[{ required: false, message: 'Ingrese el valor del producto' }]}>
            <Input
              value={price}
              placeholder='Valor del producto'
              name={'price'}
              onChange={(e) => changeInput(e, 'price')}
            />{' '}
          </Form.Item>

          <label style={{ marginTop: '2%' }} className='label'>
            Imagen <label style={{ color: 'red' }}>*</label>
          </label>

          <ImageInput
            width={1080}
            height={1080}
            picture={picture}
            imageFile={imageFile}
            divClass={'drop-img'}
            content={<img src={picture} alt={'Imagen Producto'} />}
            classDrop={'dropzone'}
            contentDrop={
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={`button is-primary is-inverted is-outlined ${imageFile ? 'is-loading' : ''}`}>
                Cambiar foto
              </button>
            }
            contentZone={
              <div className='has-text-grey has-text-weight-bold has-text-centered'>
                <span>Subir foto</span>
                <br />
                <small>(Tamaño recomendado: 1280px x 960px)</small>
              </div>
            }
            changeImg={(file) => changeImg(file, 'Imagen')}
            errImg={errImg}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '200px',
              width: '100%',
              borderWidth: 2,
              borderColor: '#b5b5b5',
              borderStyle: 'dashed',
              borderRadius: 10,
            }}
          />
          {error != null && error.picture && <small style={{ color: 'red' }}>La imagen es requerida</small>}

          <label style={{ marginTop: '2%' }} className='label'>
            Imagen opcional
          </label>

          <ImageInput
            width={1080}
            height={1080}
            picture={optionalPicture}
            imageFile={imageFileOptional}
            divClass={'drop-img'}
            content={<img src={optionalPicture} alt={'Imagen Perfil'} />}
            classDrop={'dropzone'}
            contentDrop={
              <button
                onClick={(e) => {
                  e.preventDefault();
                }}
                className={`button is-primary is-inverted is-outlined ${imageFileOptional ? 'is-loading' : ''}`}>
                Cambiar foto
              </button>
            }
            contentZone={
              <div className='has-text-grey has-text-weight-bold has-text-centered'>
                <span>Subir foto</span>
                <br />
                <small>(Tamaño recomendado: 1280px x 960px)</small>
              </div>
            }
            changeImg={(file) => changeImg(file, 'Imagen opcional')}
            errImg={errImg}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              height: '200px',
              width: '100%',
              borderWidth: 2,
              borderColor: '#b5b5b5',
              borderStyle: 'dashed',
              borderRadius: 10,
            }}
          />
        </Col>
      </Row>
      <BackTop />
    </Form>
  );
}

export default withRouter(AddProduct);
