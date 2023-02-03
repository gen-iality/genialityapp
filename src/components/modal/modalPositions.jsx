import { useState, useEffect } from 'react';
import { OrganizationApi, ToolsApi, PositionsApi } from '@helpers/request';
import { Modal, Row, Col, Form, Input, Select, Spin } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@context/MessageService';
import Header from '@antdComponents/Header';
import { handleRequestError } from '@helpers/utils';

import Loading from '@components/loaders/loading';

const { confirm } = Modal;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

function ModalPositions(props) {
  console.log('300. props.value', props.value);
  const organizationId = props.organizationId;
  const positionId = props.value?._id;
  const positionValue = props.value; //si viene null es porque se va a agregar un nuevo position

  const [position, setPosition] = useState({});
  const [possibleEvents, setPossibleEvents] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (positionValue) {
      setIsLoading(true)
      getOne().finally(() => setIsLoading(false))
    } else {
      form.setFieldsValue({ position_name: '', event_ids: [] });
    }

    OrganizationApi.events(organizationId).then((data) => {
      console.log('300. OrganizationApi.events', data.data);
      setPossibleEvents(data.data);
    });
  }, []);

  const getOne = async () => {
    const response = await PositionsApi.Organizations.getOne(organizationId, positionValue._id);
    const data = response;
    setPosition(data);
    form.setFieldsValue({ position_name: data.position_name, event_ids: data.event_ids });
  };

  const onSubmit = async (values) => {
    if (values.position_name) {
      DispatchMessageService({
        type: 'loading',
        key: 'loading',
        msj: 'Por favor espere mientras se guarda la información...',
        action: 'show',
      });

      try {
        if (positionValue) {
          await PositionsApi.update(positionValue._id, values.position_name);
          await PositionsApi.Organizations.editItsEvents(organizationId, positionId, values.event_ids);
        } else {
          const data = await PositionsApi.Organizations.create(organizationId, values.position_name);
          await PositionsApi.Organizations.editItsEvents(organizationId, data._id, values.event_ids);
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

  /* const handleChange = (e) => {
    setPosition({ ...position, position_name: e.target.value });
  }; */

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
        onOk: async () => {
          try {
            await PositionsApi.delete(positionValue._id);
            props.closeOrOpenModalPositions();
            DispatchMessageService({ key: 'loading', action: 'destroy' });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
          } catch (e) {
            DispatchMessageService({ key: 'loading', action: 'destroy' });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
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
        {isLoading ? (
          <>
            {/**
            I am finding for a Loading component, but I get be lazy to find the Loading that
            has a circle and it's turning 🔄
            */}
            <Loading />
          </>
        ) : (
        <Form onFinish={onSubmit} {...formLayout} form={form}>
          <Header title="Cargo" save form remove={onRemoveId} edit={positionValue} />

          <Row justify='center' wrap gutter={12}>
            <Col>
              <Form.Item
                initialValue={position.position_name}
                name="position_name"
                label="Nombre del cargo"
                rules={[{ required: true, message: 'El nombre es requerido' }]}
              >
                <Input placeholder="Nombre del cargo" />
              </Form.Item>

              <Form.Item
                initialValue={position.event_ids || []}
                name="event_ids"
                label="Cursos asignados"
              >
                <Select
                  mode='multiple'
                  placeholder='Asigna los cursos al cargo'
                  options={(possibleEvents || []).map((event) => ({
                    value: event._id,
                    label: event.name,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        )}
      </div>
    </Modal>
  );
}

export default ModalPositions;
