/*global google*/
import { useState, useEffect } from 'react';
import { OrganizationApi, TypesApi } from '../../helpers/request';
import { Form, Input, Row, Col, Select } from 'antd';
import Header from '../../antdComponents/Header';
import { DispatchMessageService } from '../../context/MessageService';

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
      DispatchMessageService({
        type: 'success',
        msj: 'Información actualizada correctamente',
        action: 'show',
      });
    } catch (error) {
      DispatchMessageService({
        type: 'error',
        msj: 'No se pudo actualizar la información',
        action: 'show',
      });
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
