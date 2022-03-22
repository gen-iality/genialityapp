import { useEffect, useState } from 'react';
import { RolAttApi } from '../../../helpers/request';
import { useHistory } from 'react-router-dom';
import { handleRequestError } from '../../../helpers/utils';
import { Row, Col, Form, Input, message, Modal, Switch } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../../antdComponents/Header';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const { confirm } = Modal;

const TipoAsistente = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [tipoAsistente, setTipoAsistente] = useState({ ...tipoAsistente, event_id: props.event._id });

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, [locationState.edit]);

  const getOne = async () => {
    const response = await RolAttApi.getOne(eventID, locationState.edit);
    let data = response.find((tipoAsistentes) => tipoAsistentes._id === locationState.edit);

    setTipoAsistente(data);
  };

  const handleInputChange = (e) => {
    if (tipoAsistente) {
      setTipoAsistente({ ...tipoAsistente, name: e.target.value });
    }
  };

  const onSubmit = async () => {
    if (tipoAsistente.name) {
      const loading = message.open({
        key: 'loading',
        type: 'loading',
        content: <> Por favor espere miestras se guarda la información..</>,
      });
      try {
        if (locationState.edit) {
          /* const data = {
            name: tipoAsistente.name
          } */
          await RolAttApi.editOne(tipoAsistente, locationState.edit, eventID);
        } else {
          const data = {
            name: tipoAsistente.name,
            event_id: eventID,
          };
          await RolAttApi.create(data, eventID);
        }

        message.destroy(loading.key);
        message.open({
          type: 'success',
          content: <> Información guardada correctamente!</>,
        });
        history.push(`${props.matchUrl}`);
      } catch (e) {
        message.destroy(loading.key);
        message.open({
          type: 'error',
          content: handleRequestError(e).message,
        });
      }
    } else {
      message.error('El nombre es requerido');
    }
  };

  const onRemoveId = () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras borra la información..</>,
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
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              history.push(`${props.matchUrl}`);
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
              value={tipoAsistente.name}
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default TipoAsistente;
