import React, { useState, useEffect } from 'react';
import { Actions, NewsFeed } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { toolbarEditor } from '../../helpers/constants';
import { Col, Row, Input, Form, DatePicker, Modal, Card, message } from 'antd';
import ReactQuill from 'react-quill';
import ImageInput from '../shared/imageInput';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import Header from '../../antdComponents/Header';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const NewCE = (props) => {
  const history = useHistory();
  const locationState = props.location.state;
  const [notice, setNotice] = useState({
    title: '',
    description_short: '',
    description_complete: '',
    image: '',
    picture: '',
    linkYoutube: '',
    time: moment()
  });

  useEffect(() => {
    if (locationState.edit) {
      getNew();
    }
  }, []);

  const getNew = async () => {
    const data = await NewsFeed.getOne(props.eventId, locationState.edit);
    setNotice({...data, time:moment(data.time)})
  }

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setNotice({
      ...notice,
      [name] : value
    })
  };

  const changeDescription = (e, name) => {
    setNotice({
      ...notice,
      [name]: e
    })
  };

  const changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      setNotice({
        ...notice,
        image: file
      })

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
        setNotice({
          ...notice,
          image: null,
          picture: path[0]
        })

        message.open({
          type: 'success',
          content: <> <FormattedMessage id='toast.img' defaultMessage='Ok!' /></>,
        });
      });
    } else {
      message.open({
        type: 'error',
        content: handleRequestError(e).message,
      });
    }
  };

  const onChangeDate = (date, dateString) => {
    console.log(date, dateString);
    setNotice({...notice, time:date});
  }

  const onSubmit = async () => {
    console.log(notice);
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se guarda la información..</>,
    });

    try {
      if(locationState.edit) {
        await NewsFeed.editOne(notice, locationState.edit, props.eventId);
      } else {
        await NewsFeed.create(notice, props.eventId);
      }     
    
      message.destroy(loading.key);
      message.open({
        type: 'success',
        content: <> Información guardada correctamente!</>,
      });
      history.push(`${props.match.url}`);
    } catch (e) {
      message.destroy(loading.key);
      message.open({
        type: 'error',
        content: handleRequestError(e).message,
      });
    }
  }

  const remove = () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    if(locationState.edit) {
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
              await NewsFeed.deleteOne(locationState.edit, props.eventId);
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              history.push(`${props.match.url}`);
            } catch (e) {
              message.destroy(loading.key);
              message.open({
                type: 'error',
                content: handleRequestError(e).message,
              });
            }
          }
          onHandlerRemove();
        }
      });
    }
  }

  return (
    <Form
      onFinish={onSubmit}
      {...formLayout}
    >
      <Header 
        title={'Noticia'}
        back
        save
        form
        edit={locationState.edit}
        remove={remove}
      />

      <Row justify='center' wrap gutter={12}>
        <Col span={16}>
          <Form.Item label={'Título'} >
            <Input 
              name={'title'}
              value={notice.title}
              placeholder={'Título de la noticia'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>

          <Form.Item label={'Subtítulo'}>
            <ReactQuill 
              name={'description_short'}
              value={notice.description_short}
              modules={toolbarEditor}
              onChange={(e) => changeDescription(e, 'description_short')} 
            />
          </Form.Item>

          <Form.Item label={'Noticia'}>
            <ReactQuill
              name={'description_complete'}
              value={notice.description_complete} 
              modules={toolbarEditor} 
              onChange={(e) => changeDescription(e, 'description_complete')} 
            />
          </Form.Item>

          <Form.Item label={'Imagen'}>
            <Card style={{'textAlign': 'center'}}>
              <Form.Item noStyle>
                <ImageInput
                  picture={notice.picture}
                  imageFile={notice.image}
                  divClass={'drop-img'}
                  content={<img src={notice.picture} alt={'Imagen Perfil'} />}
                  classDrop={'dropzone'}
                  contentDrop={
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={`button is-primary is-inverted is-outlined ${notice.image ? 'is-loading' : ''}`}>
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
                  /* errImg={errImg} */
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
            </Card>
          </Form.Item>

          <Form.Item label='Link del video'>
            <Input
              name={'linkYoutube'}
              value={notice.linkYoutube}
              type='url'
              placeholder={'www.video.com'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>

          <Form.Item label={'Fecha'} >
            <DatePicker 
              name={'time'}
              format='YYYY-DD-MM'
              value={moment(notice.time)} 
              onChange={onChangeDate}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

export default NewCE;
