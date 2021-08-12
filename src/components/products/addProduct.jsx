import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row, Input, Form, message } from 'antd';
import React, { Component } from 'react';
import { useState } from 'react';
import { withRouter } from 'react-router';
import ReactQuill from 'react-quill';
import ImageInput from '../shared/imageInput';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { Actions, NewsFeed, EventsApi } from '../../helpers/request';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { useEffect } from 'react';

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

function AddProduct(props) {
   const [product, setProduct] = useState();
   const [name, setName] = useState('');
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
            console.log('10. product ', product);
            setProduct(product);
            setName(product.name);
            setDescription(product.description);
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
      } else {
         setPrice(e.target.value);
      }
   };

   const changeDescription = (e) => {
      console.log('10. description ', e);
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
      console.log('10. files ', files, option);
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
            option === 'Imagen' ? setPicture(path[0]) : setImgFileOptional(path[0]);
            option === 'Imagen' ? setImgFile(null) : setImgFileOptional(null);

            message.success('Imagen cargada correctamente');
         });
      } else {
         setErrImg('Solo se permiten imágenes. Intentalo de nuevo');
      }
   };

   const saveProduct = async () => {
      let validators = {};

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
      if (price === '') {
         validators.price = true;
      } else {
         validators.price = false;
      }
      setError(validators);
      if (validators && validators.picture == false && validators.description == false && validators.price == false) {
         try {
            if (idNew !== undefined) {
               console.log('10. a editar');
               let resp = await NewsFeed.editOne(
                  {
                     name: product.name,
                     description,
                     price,
                     image: [picture !== null ? [picture] : null, optionalPicture !== null ? [optionalPicture] : null],
                  },
                  product._id,
                  props.eventId
               );
               if (resp) {
                  props.history.push(`/event/${props.eventId}/news`);
               }
            } else {
               const newProduct = await EventsApi.createProducts(
                  {
                     name: name,
                     description,
                     price,
                     image: [picture, optionalPicture],
                  },
                  props.eventId
               );
               console.log('10. newProduct ', newProduct);
               if (newProduct) {
                  props.history.push(`/event/${props.eventId}/product`);
               }
            }
         } catch (e) {
            e;
            console.log("10. error ", e)
         }
      }
   };

   return (
      <div>
         <Row>
            <Button shape='circle' onClick={goBack} icon={<ArrowLeftOutlined />} />{' '}
            <span style={{ marginLeft: 30 }}>Agregar Producto</span>
         </Row>
         <Card style={{ width: 950, margin: 'auto', marginTop: 30 }}>
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} onFinish={saveProduct}>
               <Form.Item
                  label={
                     <Col span={4}>
                        <label style={{ marginTop: '2%' }} className='label'>
                           Nombre: *
                        </label>
                     </Col>
                  }
                  rules={[{ required: true, message: 'Ingrese el nombre de la product' }]}>
                  <Input
                     value={name}
                     placeholder='Nombre del producto'
                     name={'name'}
                     onChange={(e) => changeInput(e, 'name')}
                  />
                  {error != null && error.name && (
                     <small style={{ color: 'red' }}>La valor del producto es requerido</small>
                  )}
               </Form.Item>
               <Form.Item label={'Descripción *'}>
                  <ReactQuill value={description} modules={toolbarEditor} onChange={changeDescription} />
                  {error != null && error.description && (
                     <small style={{ color: 'red' }}>La product es requerido</small>
                  )}
               </Form.Item>
               <Form.Item
                  label={
                     <Col span={4}>
                        <label style={{ marginTop: '2%' }} className='label'>
                           Valor: *
                        </label>
                     </Col>
                  }
                  rules={[{ required: true, message: 'Ingrese el valor del producto' }]}>
                  <Input
                     value={price}
                     placeholder='Valor del producto'
                     name={'price'}
                     onChange={(e) => changeInput(e, 'price')}
                  />{' '}
                  {error != null && error.price && (
                     <small style={{ color: 'red' }}>La valor del producto es requerido</small>
                  )}
               </Form.Item>
               <Form.Item label={'Imagen: *'}>
                  <ImageInput
                     picture={picture}
                     imageFile={imageFile}
                     divClass={'drop-img'}
                     content={<img src={picture} alt={'Imagen Perfil'} />}
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
               </Form.Item>
               <Form.Item label={'Imagen opcional:'}>
                  <ImageInput
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
                           className={`button is-primary is-inverted is-outlined ${
                              imageFileOptional ? 'is-loading' : ''
                           }`}>
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
               </Form.Item>
               <Form.Item wrapperCol={{ offset: 5, span: 18 }}>
                  <Button type='primary' htmlType='submit'>
                     Guardar
                  </Button>
               </Form.Item>
            </Form>
         </Card>
      </div>
   );
}

export default withRouter(AddProduct);