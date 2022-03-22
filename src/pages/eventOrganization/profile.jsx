/*global google*/
import { useState, useEffect } from 'react';
import { OrganizationApi, TypesApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import { Form, Input, Button, Row, Col, message, Select } from 'antd';
import Header from '../../antdComponents/Header';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;
const { TextArea } = Input;

function OrganizationInformation(props) {
  let { name, description, _id: organizationId, type_event } = props.org;
  const [typeEvents, setTypeEvents] = useState([]);

  async function updateOrganization(values) {
    const { name, description, type_event } = values.organization;
    const body = {
      name,
      description,
      type_event: type_event,
    };
    try {
      await OrganizationApi.editOne(body, organizationId);
      message.success('Información actualizada correctamente');
    } catch (error) {
      message.error('No se pudo actualizar la información');
    }
  }

  async function obtenerTypeEvents() {
    let resp = await TypesApi.getAll();
    if (resp) {
      setTypeEvents(resp);
    }
  }

  useEffect(() => {
    obtenerTypeEvents();
  }, []);
  return (
    <div>
      <Form {...formLayout} name='nest-messages' onFinish={updateOrganization}>
        <Header title={'Información'} save form />

        <Row justify='center' gutter={[8, 8]} wrap>
          <Col span={12}>
            <Form.Item name={['organization', 'name']} label='Nombre' initialValue={name}>
              <Input />
            </Form.Item>
            <Form.Item name={['organization', 'description']} label='Descripción' initialValue={description}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label='Tipo de eventos'
              initialValue={type_event || 'Corporativo'}
              name={['organization', 'type_event']}>
              <Select onChange={null}>
                {' '}
                {typeEvents.map((type) => (
                  <Option value={type.label}>{type.label}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default OrganizationInformation;
