import React, { useEffect, useState } from 'react';
import { eventTicketsApi } from '../../helpers/request';
import { useHistory } from 'react-router-dom';
import { handleRequestError } from '../../helpers/utils';
import { Row, Col, Form, Input, message, Modal, Switch } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Header from '../../antdComponents/Header';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const Ticket = (props) => {
  const eventID = props.event._id;
  const locationState = props.location.state; //si viene new o edit en el state, si es edit es un id
  const history = useHistory();
  const [ticket, setTicket] = useState({...ticket, event_id: props.event._id});

  useEffect(() => {
    if (locationState.edit) {
      getOne();
    }
  }, [locationState.edit]);
  
  const getOne = async () => {
    const data = await eventTicketsApi.getOne(locationState.edit, eventID);

    setTicket(data);
  };

  const handleInputChange = (e) => {
    if (ticket) {
      setTicket({ ...ticket, title: e.target.value });
    }
  };

  const onSubmit = async () => {
    const loading = message.open({
      key: 'loading',
      type: 'loading',
      content: <> Por favor espere miestras se guarda la información..</>,
    });
    try {
      if (locationState.edit) {
        await eventTicketsApi.update(eventID, ticket, locationState.edit);
      } else {
        const data = {
          title: ticket.title,
          allowed_to_vote: ticket.allowed_to_vote,
          event_id: eventID,
          created_at: new Date()
        }
        await eventTicketsApi.create(eventID, data);
      }

      message.destroy(loading.key);
      message.open({
        type: 'success',
        content: <> Información guardada correctamente!</>,
      });
      history.push(`${props.matchUrl}/ticketsEvent`);
    } catch (e) {
      message.destroy(loading.key);
      message.open({
        type: 'error',
        content: handleRequestError(e).message,
      });
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
              await eventTicketsApi.deleteOne(locationState.edit, eventID);
              message.destroy(loading.key);
              message.open({
                type: 'success',
                content: <> Se eliminó la información correctamente!</>,
              });
              history.push(`${props.matchUrl}/ticketsEvent`);
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
      <Header title={'Ticket'} back save form remove={onRemoveId} edit={locationState.edit} />

      <Row justify='center' wrap gutter={18}>
        <Col>
          <Form.Item label={'Título'} >
            <Input 
              name={'title'} 
              placeholder={'Título del ticket'} 
              value={ticket.title} 
              onChange={(e) => handleInputChange(e)}
            />
          </Form.Item>
          <Form.Item label={'Permiso de Voto'} >
            <Switch
              name={'allowed_to_vote'} 
              checked={ticket.allowed_to_vote}
              checkedChildren='Sí'
              unCheckedChildren='No'
              onChange={(checked) => setTicket({...ticket, allowed_to_vote: checked})}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default Ticket
