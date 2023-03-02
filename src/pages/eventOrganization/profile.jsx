/*global google*/
import { useState, useEffect } from 'react';
import { OrganizationApi, TypesApi } from '@helpers/request';
import { Form, Input, Row, Col, Select, Tabs } from 'antd';
import Header from '@antdComponents/Header';
import { DispatchMessageService } from '@context/MessageService';
import { CardSelector } from '@components/events/CardSelector';

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const { Option } = Select;
const { TextArea } = Input;

function OrganizationInformation(props) {
  console.log('props', props);
  const { name, description, _id: organizationId, type_event, visibility, allow_register } = props.org;
  const [typeEvents, setTypeEvents] = useState([]);
  const [typeOrgPermit, setTypeOrgPermit] = useState(0);
  const [visibilityState, setVisibilityState] = useState(visibility);
  const [allowRegister, setAllowRegister] = useState(allow_register);

  useEffect(() => {
    if ((visibility === 'PUBLIC' || visibility === 'ANONYMOUS') && allow_register) {
      //Organización pública con Registro
      setTypeOrgPermit(0);
    } else if (visibility === 'PUBLIC' && !allow_register) {
      //Organización pública sin Registro
      setTypeOrgPermit(1);
    } else {
      //Organización privada con Invitación
      setTypeOrgPermit(2);
    }
  }, [visibility, allow_register]);

  const changeTypeOrgPermit = (value) => {
    setTypeOrgPermit(value);
    if (value === 0) {
      //Organización pública con Registro
      setVisibilityState('PUBLIC');
      setAllowRegister(true);
    } else if (value === 1) {
      //Organización pública sin Registro
      setVisibilityState('PUBLIC');
      setAllowRegister(false);
    } else {
      //Organización privada con Invitación
      setVisibilityState('PRIVATE');
      setAllowRegister(false);
    }
  };

  async function updateOrganization(values) {
    const { name, description, type_event } = values.organization;
    const body = {
      name,
      description,
      type_event: type_event,
      visibility: visibilityState,
      allow_register: allowRegister,
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
    const resp = await TypesApi.getAll();
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
        <Header title="$1" save form />

        <Tabs defaultActiveKey='1'>
          <Tabs.TabPane tab='General' key='1'>
            <Row justify='center' gutter={[8, 8]} wrap>
              <Col span={12}>
                <Form.Item name={['organization', 'name']} label='Nombre' initialValue={name}>
                  <Input />
                </Form.Item>
                <Form.Item name={['organization', 'description']} label='Descripción' initialValue={description}>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label='Tipo de cursos'
                  initialValue={type_event || 'Corporativo'}
                  name={['organization', 'type_event']}
                >
                  <Select onChange={null}>
                    {typeEvents.map((type, index) => (
                      <Option key={index} value={type.label}>
                        {type.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab='Tipos de acceso' key='2'>
            <CardSelector
              selected={typeOrgPermit.toString()}
              options={[
                {
                  id: '0',
                  title: 'Organización Pública con Registro',
                  body: (
                    <ul>
                      <li>Tiene registro para todos.</li>
                      <br />
                      <li>Tiene inicio de sesión para todos.</li>
                    </ul>
                  ),
                  checkbox: {
                    text: 'Registro sin autenticación de usuario (Beta)',
                    onCheck: (checked) => {
                      setVisibilityState(checked ? 'ANONYMOUS' : 'PUBLIC');
                      setAllowRegister(true);
                    },
                    initialCheck: visibilityState === 'ANONYMOUS',
                  },
                },
                {
                  id: '1',
                  title: 'Organización Pública sin Registro',
                  body: (
                    <ul>
                      <li>Quedará como anónimo.</li>
                      <br />
                      <li>Sólo se mostrará el inicio de sesión.</li>
                    </ul>
                  ),
                },
                {
                  id: '2',
                  title: 'Organización privada por invitación',
                  body: (
                    <ul>
                      <li>Sólo se podrá acceder por invitación.</li>
                      <br />
                      <li>Tiene inicio de sesión para todos.</li>
                    </ul>
                  ),
                },
              ]}
              onSelected={(selected) => changeTypeOrgPermit(Number.parseInt(selected))}
            />
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </div>
  );
}

export default OrganizationInformation;
