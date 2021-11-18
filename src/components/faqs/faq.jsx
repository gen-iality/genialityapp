import React, { useEffect, useState } from 'react';
import { FaqsApi } from '../../helpers/request';
import { useHistory } from 'react-router-dom';
import { toolbarEditor } from '../../helpers/constants';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import ReactQuill from 'react-quill';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Faq = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [faq, setFaq] = useState();

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, [locationState.edit]);

  const getOne = async () => {
    const response = await FaqsApi.getOne(locationState.edit, eventID);
    let data = response.data.find((faqs) => faqs._id === locationState.edit);

    setFaq(data);
    setFaq(data);//este esta repedito para poder cargar el titulo en caso de que tenga contenido, con uno solo no se porque no vuelve a cargar
    // if (data.content === '<p><br></p>') {
    //   setFaq({ content: '', title: data.title });
    // }
  };

  const onSubmit = async () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se guarda la información..</>,
    });

    try {
      if (locationState.edit) {
        await FaqsApi.editOne(faq, locationState.edit, eventID);
      } else {
        await FaqsApi.create(faq, eventID);
      }

      message.destroy(loading.key);
      message.open({
        type: 'success',
        content: <> Información guardada correctamente!</>,
      });
      history.push(`${props.matchUrl}/faqs`);
    } catch (e) {
      message.destroy(loading.key);
      message.open({
        type: 'error',
        content: handleRequestError(e).message,
      });
    }
  };

  const handleChange = (e) => {
    setFaq({ ...faq, title: e.target.value });
  };

  const onRemoveId = () => {
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
              await FaqsApi.deleteOne(locationState.edit, eventID);
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              history.push(`${props.matchUrl}/faqs`);
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

  const HandleQuillEditorChange = (contents) => {
    let content = contents;
    if (content === '<p><br></p>') {
      content = '';
    }
    if (faq) {
      setFaq({ ...faq, content: content });
    }
  };

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header title={'Pregunta Frecuente'} back save form remove={onRemoveId} edit={locationState.edit} />

      <Row justify='center' wrap gutter={12}>
        <Col>
          <Form.Item label={'Título'}>
            <Input
              value={faq && faq.title}
              name={'title'}
              placeholder={'Título de la pregunta frecuente'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          <Form.Item label={'Contenido'}>
            <ReactQuill
              id='faqContent'
              value={(faq && faq.content) || ''}
              name={'content'}
              onChange={HandleQuillEditorChange}
              modules={toolbarEditor}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Faq;
