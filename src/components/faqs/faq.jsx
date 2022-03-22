import { useEffect, useState } from 'react';
import { FaqsApi } from '../../helpers/request';
import { useHistory } from 'react-router-dom';
import { toolbarEditor } from '../../helpers/constants';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';
import ReactQuill from 'react-quill';
import { DispatchMessageService } from '../../context/MessageService';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Faq = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [faq, setFaq] = useState({});

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, [locationState.edit]);

  const getOne = async () => {
    const response = await FaqsApi.getOne(locationState.edit, eventID);
    let data = response.data.find((faqs) => faqs._id === locationState.edit);

    setFaq(data);
    setFaq(data); //este esta repedito para poder cargar el titulo en caso de que tenga contenido, con uno solo no se porque no vuelve a cargar
    // if (data.content === '<p><br></p>') {
    //   setFaq({ content: '', title: data.title });
    // }
  };

  const onSubmit = async () => {
    if(faq.content && faq.title) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: ' Por favor espere miestras se guarda la información...',
        action: 'show',
      });

      try {
        if (locationState.edit) {
          await FaqsApi.editOne(faq, locationState.edit, eventID);
        } else {
          await FaqsApi.create(faq, eventID);
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
        history.push(`${props.matchUrl}/faqs`);
      } catch (e) {
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'error',
          msj: handleRequestError(e).message,
          action: 'show',
        });
      }
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'El título y contenido son requeridos',
        action: 'show',
      });
    }
  };

  const handleChange = (e) => {
    setFaq({ ...faq, title: e.target.value });
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere miestras se borra la información...',
      action: 'show',
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
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              history.push(`${props.matchUrl}/faqs`);
            } catch (e) {
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'error',
                msj: handleRequestError(e).message,
                action: 'show',
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
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Título <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El título es requerido' }]}>
            <Input
              value={faq && faq.title}
              name={'title'}
              placeholder={'Título de la pregunta frecuente'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Contenido <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El contenido es requerido' }]}>
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
