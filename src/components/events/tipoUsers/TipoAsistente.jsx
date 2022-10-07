import { useEffect, useState } from 'react';
import { RolAttApi } from '@helpers/request';
import { useHistory } from 'react-router-dom';
import { handleRequestError } from '@helpers/utils';
import { Row, Col, Form, Input, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '@antdComponents/Header';
import { DispatchMessageService } from '../../../context/MessageService';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { confirm } = Modal;

const TipoAsistente = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [tipoAsistente, setTipoAsistente] = useState({ event_id: props.event._id });

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, [locationState.edit]);

  const getOne = async () => {
    const response = await RolAttApi.getOne(eventID, locationState.edit);
    let data = response.find((tipoAsistentes) => tipoAsistentes._id === locationState.edit);

    // setTipoAsistente({ event_id: '6219441bcac07f74232f5d60', name: 'nuevo hola', type: 'attendee' });
    setTipoAsistente(data);
  };

  const handleInputChange = (e) => {
    if (tipoAsistente) {
      setTipoAsistente({ ...tipoAsistente, name: e.target.value, type: 'attendee' });
    }
  };

  const onSubmit = async () => {
    if (tipoAsistente.name) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: ' Por favor espere mientras se guarda la información...',
        action: 'show',
      });
      try {
        if (locationState.edit) {
          /* const data = {
            name: tipoAsistente.name
          } */
          await RolAttApi.editOne(tipoAsistente, locationState.edit, eventID);
        } else {
          await RolAttApi.create(tipoAsistente, eventID);
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
        history.push(`${props.matchUrl}`);
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
        msj: 'El nombre es requerido',
        action: 'show',
      });
    }
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: ' Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (locationState.edit) {
      confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          const onHandlerRemove = async () => {
            try {
              await RolAttApi.deleteOne(locationState.edit, eventID);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              history.push(`${props.matchUrl}`);
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

  return (
    <Form onFinish={onSubmit} {...formLayout}>
      <Header title={'Tipo de Asistente'} back save form remove={onRemoveId} edit={locationState.edit} />

      <Row justify='center' wrap gutter={18}>
        <Col>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Nombre del rol <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El nombre es requerido' }]}>
            <Input
              name={'name'}
              placeholder={'Nombre del rol'}
              value={tipoAsistente?.name}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TipoAsistente;
