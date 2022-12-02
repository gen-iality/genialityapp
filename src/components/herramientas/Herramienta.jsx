import { useEffect, useState } from 'react';
import { ToolsApi } from '@helpers/request';
import { useHistory } from 'react-router-dom';
import { handleRequestError } from '@helpers/utils';
import { Row, Col, Form, Input, message, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '@antdComponents/Header';
import { DispatchMessageService } from '@context/MessageService';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Herramienta = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [herramienta, setHerramienta] = useState({});

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, []);

  const getOne = async () => {
    const response = await ToolsApi.getOne(locationState.edit, eventID);
    const data = response.data.find((herramientas) => herramientas._id === locationState.edit);
    setHerramienta(data);
  };

  const onSubmit = async () => {
    if (herramienta.name) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });

      try {
        if (locationState.edit) {
          await ToolsApi.editOne(herramienta, locationState.edit, eventID);
        } else {
          await ToolsApi.create(herramienta, eventID);
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
        history.push(`${props.matchUrl}/herramientas`);
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

  const handleChange = (e) => {
    setHerramienta({ ...herramienta, name: e.target.value });
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
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
              await ToolsApi.deleteOne(locationState.edit, eventID);
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              history.push(`${props.matchUrl}/herramientas`);
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
      <Header title={'Herramienta'} back save form remove={onRemoveId} edit={locationState.edit} />

      <Row justify='center' wrap gutter={12}>
        <Col span={12}>
          <Form.Item
            label={
              <label style={{ marginTop: '2%' }} className='label'>
                Nombre <label style={{ color: 'red' }}>*</label>
              </label>
            }
            rules={[{ required: true, message: 'El nombre es requerido' }]}
          >
            <Input
              value={herramienta.name}
              name={'name'}
              placeholder={'Nombre de la herramienta'}
              onChange={(e) => handleChange(e)}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default Herramienta;
