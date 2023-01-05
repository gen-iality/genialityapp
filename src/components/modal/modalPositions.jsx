import { useState, useEffect } from 'react';
import { OrganizationApi, ToolsApi, PositionsApi } from '@helpers/request';
import FormComponent from '../events/registrationForm/form';
import { Modal, Row, Col, Form, Input } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@context/MessageService';
import Header from '@antdComponents/Header';
import { handleRequestError } from '@helpers/utils';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function ModalPositions(props) {
  const organizationId = props.organizationId;
  console.log('300. props.value', props.value);
  const positionValue = props.value; //si viene null es porque se va a agregar un nuevo position

  const [position, setPosition] = useState({});

  console.log('300. ModalPositions', props);

  useEffect(() => {
    if (positionValue) {
      getOne();
    }
  }, []);

  /* const getOne = async () => {
    const response = await PositionsApi.getOne(positionValue, organizationId);
    const data = response.data.find((positions) => positions._id === positionValue);
    setPosition(data);
  }; */

  const getOne = async () => {
    const response = await PositionsApi.Organizations.getOne(organizationId, positionValue._id);

    const data = response;
    setPosition(data);
    console.log('Aqui se obtiene el position');
  };

  const onSubmit = async () => {
    console.log('300. position', position);
    if (position.position_name) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });

      try {
        if (positionValue) {
          console.log('Aquí se guardó el nombre de la posición cuando se aplica onSubmit');
          await PositionsApi.update(positionValue._id, position.position_name);
        } else {
          await PositionsApi.Organizations.create(organizationId, position.position_name);
        }
        props.closeOrOpenModalPositions();
        DispatchMessageService({
          key: 'loading',
          action: 'destroy',
        });
        DispatchMessageService({
          type: 'success',
          msj: 'Información guardada correctamente!',
          action: 'show',
        });
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
    setPosition({ ...position, position_name: e.target.value });
  };

  const onRemoveId = () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se borra la información...',
      action: 'show',
    });
    if (positionValue) {
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
              await PositionsApi.delete(positionValue._id);
              props.closeOrOpenModalPositions();
              DispatchMessageService({
                key: 'loading',
                action: 'destroy',
              });
              DispatchMessageService({
                type: 'success',
                msj: 'Se eliminó la información correctamente!',
                action: 'show',
              });
              //history.push(`${props.matchUrl}/positions`);
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
    <Modal closable footer={false} visible={true} onCancel={() => props.closeOrOpenModalPositions()}>
      <div
        style={{
          paddingLeft: '0px',
          paddingRight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '30px',
        }}
      >
        <Form onFinish={onSubmit} {...formLayout}>
          <Header title={'Cargo'} back save form remove={onRemoveId} edit={positionValue} />

          <Row justify='center' wrap gutter={12}>
            <Col span={12}>
              <Form.Item
                label={
                  <label style={{ marginTop: '2%' }} className='label'>
                    Nombre del cargo <label style={{ color: 'red' }}>*</label>
                  </label>
                }
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input
                  value={position.position_name}
                  name={'name'}
                  placeholder={'Nombre del cargo'}
                  onChange={(e) => handleChange(e)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}

export default ModalPositions;
