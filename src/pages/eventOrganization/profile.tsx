/**
 * NOTE: this module will be renamed to OrganizationInformation soom
 */
import { useState, useEffect, useMemo } from 'react'
import { OrganizationApi, TypesApi } from '@helpers/request'
import { Form, Input, Row, Col, Select, Tabs, Switch, InputNumber } from 'antd'
import Header from '@antdComponents/Header'
import { StateMessage } from '@context/MessageService'
import { CardSelector } from '@components/events/CardSelector'
import OrganizationAccessSettingsField from './OrganizationAccessSettingsField'

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

function OrganizationInformation(props: { org: any }) {
  const {
    name,
    description,
    _id: organizationId,
    type_event,
    visibility,
    allow_register,
    enable_notification_providers = [],
    access_settings,
    public_help_message,
  } = props.org

  const [typeEvents, setTypeEvents] = useState<any[]>([])
  const [typeOrgPermit, setTypeOrgPermit] = useState<number>(0)
  const [visibilityState, setVisibilityState] = useState<string>(visibility)
  const [allowRegister, setAllowRegister] = useState<boolean>(allow_register)

  useEffect(() => {
    if ((visibility === 'PUBLIC' || visibility === 'ANONYMOUS') && allow_register) {
      //Organización pública con Registro
      setTypeOrgPermit(0)
    } else if (visibility === 'PUBLIC' && !allow_register) {
      //Organización pública sin Registro
      setTypeOrgPermit(1)
    } else {
      //Organización privada con Invitación
      setTypeOrgPermit(2)
    }
  }, [visibility, allow_register])

  const changeTypeOrgPermit = (value: number) => {
    setTypeOrgPermit(value)
    if (value === 0) {
      //Organización pública con Registro
      setVisibilityState('PUBLIC')
      setAllowRegister(true)
    } else if (value === 1) {
      //Organización pública sin Registro
      setVisibilityState('PUBLIC')
      setAllowRegister(false)
    } else {
      //Organización privada con Invitación
      setVisibilityState('PRIVATE')
      setAllowRegister(false)
    }
  }

  async function updateOrganization(values: any) {
    const { organization } = values

    const organizationData = {
      ...organization,
      visibility: visibilityState,
      allow_register: allowRegister,
    }

    try {
      await OrganizationApi.editOne(organizationData, organizationId)
      StateMessage.show(null, 'success', 'Información actualizada correctamente')
    } catch (error) {
      StateMessage.show(null, 'error', 'No se pudo actualizar la información')
    }
  }

  // await OrganizationApi.editOne(organizationData, organizationId)

  useEffect(() => {
    // Get all the types
    TypesApi.getAll().then((data) => setTypeEvents(data))
  }, [])

  return (
    <div>
      <Form {...formLayout} name="nest-messages" onFinish={updateOrganization}>
        <Header title="Información" back save form />

        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="General" key="1">
            <Row justify="center" gutter={[8, 8]} wrap>
              <Col span={12}>
                <Form.Item
                  name={['organization', 'name']}
                  label="Nombre"
                  initialValue={name}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={['organization', 'description']}
                  label="Descripción"
                  initialValue={description}
                >
                  <Input.TextArea />
                </Form.Item>
                <Form.Item
                  label="Tipo de cursos"
                  initialValue={type_event || 'Corporativo'}
                  name={['organization', 'type_event']}
                >
                  <Select
                    options={typeEvents.map((type) => ({
                      value: type.label,
                      label: type.label,
                    }))}
                  />
                </Form.Item>
                {/* Set the notification systems */}
                <Form.Item
                  label="Proveedor de sistema de notificación de caducidad de certificaciones (optional)"
                  name={['organization', 'enable_notification_providers']}
                  initialValue={enable_notification_providers}
                >
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Seleccione las opciones que desea"
                    options={[
                      { label: 'Email', value: 'email' },
                      { label: 'SMS', value: 'sms' },
                      { label: 'WhatsApp', value: 'whatsapp', disabled: true },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Configuración de acceso"
                  name={['organization', 'access_settings']}
                  initialValue={access_settings}
                >
                  <OrganizationAccessSettingsField />
                </Form.Item>
                <Form.Item
                  label="Mensaje público de ayuda (opcional)"
                  name={['organization', 'public_help_message']}
                  initialValue={public_help_message}
                >
                  <Input placeholder="Mensaje de contacto" />
                </Form.Item>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Tipos de acceso" key="2">
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
                      setVisibilityState(checked ? 'ANONYMOUS' : 'PUBLIC')
                      setAllowRegister(true)
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
  )
}

export default OrganizationInformation
