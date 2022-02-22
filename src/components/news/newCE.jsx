import React, { useState, useEffect } from 'react';
import { Actions, NewsFeed } from '../../helpers/request';
import { handleRequestError } from '../../helpers/utils';
import { toolbarEditor } from '../../helpers/constants';
import { Col, Row, Input, Form, DatePicker, Modal, Card, message, Button } from 'antd';
import ReactQuill from 'react-quill';
import ImageInput from '../shared/imageInput';
import Axios from 'axios';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { useHistory } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import EviusReactQuill from '../shared/eviusReactQuill';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const NewCE = (props) => {
  const history = useHistory();
  const locationState = props.location.state;
  const [notice, setNotice] = useState({});

  useEffect(() => {
    if (locationState.edit) {
      getNew();
    }
  }, []);

  const getNew = async () => {
    const data = await NewsFeed.getOne(props.eventId, locationState.edit);
    setNotice(data);
    setNotice(data);
  };

  const handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setNotice({
      ...notice,
      [name]: value,
    });
  };

  const changeDescription = (e, name) => {
    if (notice) {
      setNotice({
        ...notice,
        [name]: e,
      });
    }
  };

  const changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      setNotice({
        ...notice,
        image: file,
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
      Axios.all(uploaders).then(() => {
        setNotice({
          ...notice,
          image: null,
          picture: path[0],
        });

        message.open({
          type: 'success',
          content: <> Se anexo la imagen correctamente</>,
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
    setNotice({ ...notice, time: date });
  };

  const onSubmit = async () => {
    let values = {};
    if (notice.title === '' || !notice.title) {
      message.error('El título es requerido');
      values.title = false;
    } else {
      values.title = true;
    }
    if (notice.description_complete === '' || notice.description_complete === '<p><br></p>' || !notice.description_complete) {
      message.error('La noticia es requerida');
      values.description_complete = false;
    } else {
      values.description_complete = true;
    }
    if (notice.description_short === '' || notice.description_short === '<p><br></p>' || !notice.description_short) {
      message.error('El subtítulo es requerido');
      values.description_short = false;
    } else {
      values.description_short = true;
    }
    if (notice.picture === null || !notice.picture) {
      message.error('La imagen es requerida');
      values.picture = false;
    } else {
      values.picture = true;
    }
    if (notice.fecha === null && notice.fecha !== '' && !notice.fecha) {
      message.error('La fecha es requerida');
      values.fecha = false;
    } else {
      values.fecha = true;
    }

    if(values && values.title &&
      values.description_complete &&
      values.description_short &&
      values.picture &&
      values.fecha) {
      const loading = message.open({
        key: 'loading',
        type: 'loading',
        content: <> Por favor espere miestras se guarda la información..</>,
      });

      try {
        if (locationState.edit) {
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
  };

  const remove = () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
    });
    if (locationState.edit) {
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
          };
          onHandlerRemove();
        },
      });
    }
  };

  return (
    <Form onFinish={onSubmit} {...formLayout} initialValues={notice}>
      <Header title={'Noticia'} back save form edit={locationState?.edit} remove={remove} />

      <Row justify='center' wrap gutter={12}>
        <Col span={16}>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} >
                Título <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El título es requerido' }]}>
            <Input
              name={'title'}
              value={notice && notice.title}
              placeholder={'Título de la noticia'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>

          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} >
                Subtítulo <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El subtítulo es requerido' }]}>
            <EviusReactQuill
              id='description_short'
              name={'description_short'}
              data={notice && notice.description_short ? notice.description_short : ''}
              handleChange={(e) => changeDescription(e, 'description_short')}
            />
          </Form.Item>

          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} >
                Noticia <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'La noticia es requerida' }]}>
            <EviusReactQuill
              id='description_complete'
              name={'description_complete'}
              data={(notice && notice.description_complete) || ''}
              //modules={toolbarEditor}
              handleChange={(e) => changeDescription(e, 'description_complete')}
            />
          </Form.Item>

          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} >
                Imagen <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'La imagen es requerida' }]}>
            <Card style={{ textAlign: 'center' }}>
              <Form.Item noStyle>
                <ImageInput
                  picture={notice && notice.picture}
                  imageFile={notice && notice.image}
                  divClass={'drop-img'}
                  content={<img src={notice && notice?.picture} alt={'Imagen Perfil'} />}
                  classDrop={'dropzone'}
                  contentDrop={
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      type='primary'
                      /* loading={notice && notice.image} */
                    >
                      Cambiar foto
                    </Button>
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
              value={notice && notice.linkYoutube}
              type='url'
              placeholder={'www.video.com'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>

          <Form.Item label={'Fecha'}>
            <DatePicker
              name={'time'}
              format='YYYY-DD-MM'
              value={notice && moment(notice.time)}
              onChange={onChangeDate}
            />
          </Form.Item>
        </Col>
      </Row>
      <BackTop />
    </Form>
  );
};

export default NewCE;
