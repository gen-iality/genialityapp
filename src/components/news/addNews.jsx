import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Col, Row } from 'antd';
import React, { Component } from 'react';
import { useState } from 'react';
import { withRouter } from 'react-router';
import { Input, Form,DatePicker } from 'antd';
import ReactQuill from 'react-quill';
import ImageInput from '../shared/imageInput';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { Actions, NewsFeed } from '../../helpers/request';
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

function AddNews(props) {
  const [noticia, setNoticia] = useState();
  const [descriptionShort, setDescriptionShort] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [imageFile, setImgFile] = useState(null);
  const [errImg, setErrImg] = useState();
  const [fileMsg, setFileMsg] = useState();
  const [error, setError] = useState(null);
  const [idNew, setIdNew] = useState();
  const [fecha, setFecha] = useState(moment());

  useEffect(()=>{
  if(props.match.params.id){
   setIdNew(props.match.params.id)
   NewsFeed.getOne(props.eventId,props.match.params.id).then((notice)=>{
    setPicture(notice.image)
    setDescriptionShort(notice.description_short)
    setDescription(notice.description_complete)
    setFecha(moment(notice.created_at))
    setNoticia(notice)
   })
  }
  },[])

  const changeInput = (e, key) => {
    setNoticia({ ...noticia, [key]: e.target.value });
  };

  const changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      setImgFile(file);

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
        setPicture(path[0]);
        setImgFile(null);

        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
      });
    } else {
      setErrImg('Solo se permiten imágenes. Intentalo de nuevo');
    }
  };

  function onChangeDate(date, dateString) {
        setFecha(date)
  }

  const changeDescriptionShort = (e) => {   
      setDescriptionShort(e);   
  };

  const changeDescription = (e) => {   
      setDescription(e);   
  };
  const isUrl = string => {
    try { return Boolean(new URL(string)); }
    catch(e){ return false; } 
}

  const saveNew = async () => {
    let validators = {};
   
    if (description === '') {
      validators.description = true;
    } else {
      validators.description = false;
    }
    if (descriptionShort === '') {
      validators.descriptionShort = true;
    } else {
      validators.descriptionShort = false;
    }
    if (picture === null) {
      validators.picture = true;
    } else {
      validators.picture = false;
    }
   
    if (fecha === null && fecha!=="" && !fecha) {
        validators.fecha = true;
      } else {
        validators.fecha = false;
        
      }
 if(noticia){
    if(noticia.video!='' && noticia.video!==null && !isUrl(noticia.video)){
        validators.video = false;
    }
 }
    
    setError(validators);
    if(validators && validators.video==false &&   validators.picture == false && validators.descriptionShort == false && validators.description == false ){
        try {
            if (idNew!==undefined) {
             
            let resp= await NewsFeed.editOne(
                {
                  title: noticia.title,
                  description_complete: description,
                  description_short: descriptionShort,
                  linkYoutube: noticia.linkYoutube || null,
                  image: picture!==null?[picture]:null,
                  time: fecha.format("YYYY-DD-MM"),
                },
                noticia._id,
                props.eventId
              );
              if(resp){                
                  props.history.push(`/event/${props.eventId}/news`)                   
              }
              
            } else {
               // alert("A GUARDAR")
              const newRole = await NewsFeed.create(
                {
                  title: noticia.title,
                  description_complete: description,
                  description_short: descriptionShort,
                  linkYoutube: noticia.linkYoutube || null,
                  image: picture!==null?[picture]:null,
                  time: fecha.format("YYYY-DD-MM"),
                },
                props.eventId
              ); 
              if(newRole){
                  props.history.push(`/event/${props.eventId}/news`)
              }          
            }
          } catch (e) {
            e;
          }
    }
  };
  return (
    <div>
      <Row>
        <ArrowLeftOutlined /> <span style={{ marginLeft: 30 }}>Agregar Noticias</span>
      </Row>
      <Card style={{ width: 950, margin: 'auto', marginTop: 30 }}>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} onFinish={saveNew}>
          <Form.Item
            //name={'title'}
            label={
              <Col span={4}>
                <label style={{ marginTop: '2%' }} className='label'>
                  Título de la noticia: *
                </label>
              </Col>
            }
            rules={[{ required: true, message: 'Ingrese el título de la noticia' }]}>
            <Input
              value={noticia && noticia.title}
              placeholder='Título de la noticia'
              name={'survey'}
              onChange={(e) => changeInput(e, 'title')}
            />
          </Form.Item>
          <Form.Item 
                      
            label={'Subtítulo *'}>
            <ReactQuill value={descriptionShort} modules={toolbarEditor} onChange={changeDescriptionShort} />
            {error!=null && error.descriptionShort && <small style={{color:'red'}}>El subtítulo es requerido</small>}
          </Form.Item>
          <Form.Item label={'Noticia: *'} 
           >        
              <ReactQuill value={description} modules={toolbarEditor} onChange={changeDescription} /> 
              {error!=null && error.description && <small style={{color:'red'}}>La noticia es requerido</small>}           
            </Form.Item>
            <Form.Item label={'Imagen: *'} >           
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
                changeImg={changeImg}
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
               {error!=null && error.picture && <small style={{color:'red'}}>La imagen es requerida</small>}
              {fileMsg && <p className='help is-success'>{fileMsg}</p>}
           
            </Form.Item>
          <Form.Item label='Link del video:'
            >        
            <Input
              value={noticia && noticia.linkYoutube}
              type='url'
              placeholder='www.video.com'
              name={'noticia'}
              onChange={(e) => changeInput(e, 'linkYoutube')}
            />
            {error!=null && error.video && <small style={{color:'red'}}>Link de video no válido</small>}
          </Form.Item>
          <Form.Item label='Fecha:'
            name={'fechaNoticia'}>        
            <DatePicker  value={fecha} onChange={onChangeDate} />
            {error!=null && error.fecha && <small style={{color:'red'}}>Fecha no válida</small>}
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

export default withRouter(AddNews);
