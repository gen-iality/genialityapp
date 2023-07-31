import { useEffect, useState } from 'react'
import {
  Card,
  Col,
  Input,
  Row,
  Space,
  Tooltip,
  Typography,
  Form,
  Modal,
  List,
  Button,
  Spin,
  Select,
  TimePicker,
} from 'antd'
import { CalendarOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'
import { useNewEventContext } from '@context/newEventContext'
import { OrganizationApi } from '@helpers/request'
import { StateMessage } from '@context/MessageService'
import dayjs from 'dayjs'

const { Text, Link, Title, Paragraph } = Typography
const { Option } = Select

const Informacion = (props) => {
  const [organizations, setOrganizations] = useState([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const {
    addDescription,
    showModal,
    isModalVisible,
    handleCancel,
    handleOk,
    visibilityDescription,
    changeSelectHours,
    changeSelectDay,
    selectedDay,
    selectedHours,
    dateEvent,
    handleInput,
    valueInputs,
    containsError,
    changeOrganization,
    organization,
    selectOrganization,
    selectedOrganization,
    isbyOrganization,
    setLoadingOrganization,
    createOrganizationF,
    newOrganization,
    selectTemplate,
    templateId,
  } = useNewEventContext()

  useEffect(() => {
    if (props.currentUser) {
      obtainOrganizations()
    }
  }, [props.orgId, props.currentUser])
  async function obtainOrganizations() {
    setLoadingOrganization(true)
    const organizations = await OrganizationApi.mine()
    const organizationsFilter = organizations.filter((orgData) => orgData.id)

    if (organizationsFilter.length === 0) {
      const createOrganizations = await createOrganization()

      selectedOrganization(createOrganizations)
      setOrganizations([createOrganizations])
      setLoadingOrganization(false)
    } else {
      setOrganizations(organizationsFilter)
      selectedOrganization(organizationsFilter && organizationsFilter[0])
      setLoadingOrganization(false)
    }
  }
  const createNewOrganization = async (value) => {
    setLoadingAdd(true)
    const addOrganization = await createOrganization(value.name)
    if (addOrganization) {
      await obtainOrganizations()
      newOrganization(false)
      setLoadingAdd(false)
    }
  }
  const createOrganization = async (name) => {
    const newOrganization = {
      name: !name ? props.currentUser?.names || props.currentUser?.name : name,
    }
    // Crear organizacion------------------------------
    const create = await OrganizationApi.createOrganization(newOrganization)

    if (create) {
      return create
    }
    return null
  }

  const selectOrganizationOK = () => {
    if (!selectOrganization || selectOrganization == null) {
      StateMessage.show(null, 'error', 'Por favor seleccione una organización')
    } else {
      changeOrganization(false)
    }
  }
  const handleChange = (value) => {
    selectTemplate(value)
  }

  useEffect(() => {
    if (selectOrganization) {
      obtenerTemplates()
      selectTemplate(
        selectOrganization.template_properties
          ? selectOrganization?.template_properties[0]._id['$oid']
          : undefined,
      )
    }
    async function obtenerTemplates() {
      await obtainTemplates(selectOrganization?._id)
    }
  }, [selectOrganization])

  const obtainTemplates = async () => {
    await OrganizationApi.getTemplateOrganization(selectOrganization?._id)
  }

  return (
    <div className="step-information">
      <Space direction="vertical" size="middle">
        <div>
          <Text>
            Nombre del curso <span className="text-color">*</span>
          </Text>
          <Input
            name="name"
            value={valueInputs['name'] || ''}
            onChange={(e) => handleInput(e, 'name')}
            placeholder="Nombre del curso"
          />
          {containsError('name') && (
            <Col>
              {' '}
              <small className="text-color">
                Ingrese un nombre correcto para el curso
              </small>
            </Col>
          )}
        </div>
        <div>
          {addDescription ? (
            <div>
              <Text>
                Descripción{' '}
                <Link onClick={() => visibilityDescription(false)}>
                  |{' '}
                  <Tooltip title="Eliminar descripción">
                    <DeleteOutlined className="text-color" />{' '}
                    <small className="text-color">Eliminar descripción</small>
                  </Tooltip>
                </Link>
              </Text>
              <Input.TextArea
                id="description"
                value={valueInputs['description'] || ''}
                onChange={(e) => handleInput(e, 'description')}
              ></Input.TextArea>
              {containsError('description') && (
                <Col>
                  {' '}
                  <small className="text-color">Ingrese una descripción válida</small>
                </Col>
              )}
            </div>
          ) : (
            <Link onClick={() => visibilityDescription(true)}>
              <PlusCircleOutlined /> Agregar descripción
            </Link>
          )}
        </div>
        <div>
          <Text>
            Fecha del curso <span className="text-color">*</span>
          </Text>
          <Input
            value={dateEvent || ''}
            onClick={showModal}
            suffix={<CalendarOutlined />}
            placeholder="Clic para agregar fecha"
          />
        </div>
        <div>
          <Space direction="vertical">
            {organizations.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <p>
                  Este curso pertenecerá a la organización |{' '}
                  <b>{selectOrganization?.name}</b>
                </p>
                <Button
                  onClick={() => {
                    newOrganization(false)
                    changeOrganization(true)
                  }}
                  block
                >
                  Cambiar de organización
                </Button>
              </div>
            )}
            {organization && !isbyOrganization && (
              <Modal
                footer={
                  createOrganizationF
                    ? null
                    : [
                        <Button key="back" onClick={() => changeOrganization(false)}>
                          Cerrar
                        </Button>,
                        <Button
                          key="submit"
                          type="primary"
                          onClick={selectOrganizationOK}
                        >
                          Seleccionar
                        </Button>,
                      ]
                }
                onOk={selectOrganizationOK}
                okText="Seleccionar"
                cancelText="Cerrar"
                title="Organizaciónes"
                open={organization && !isbyOrganization}
                onCancel={() => changeOrganization(false)}
              >
                {!createOrganizationF && (
                  <Row style={{ marginBottom: 10 }} justify="end">
                    <Button onClick={() => newOrganization(true)}>
                      <PlusCircleOutlined /> Agregar
                    </Button>
                  </Row>
                )}
                {createOrganizationF && (
                  <Row style={{ marginBottom: 10 }} justify="end">
                    <Button onClick={() => newOrganization(false)}>
                      Ver organizaciones
                    </Button>
                  </Row>
                )}
                {!createOrganizationF && (
                  <List
                    style={{ height: 400, overflowY: 'auto' }}
                    size="small"
                    bordered
                    dataSource={organizations?.length > 0 && organizations}
                    renderItem={(item) => (
                      <List.Item
                        style={{
                          cursor: 'pointer',
                          color:
                            selectOrganization?.id == item.id
                              ? 'white'
                              : 'rgba(0, 0, 0, 0.85)',
                          background:
                            selectOrganization?.id == item.id ? '#40a9ff' : 'white',
                        }}
                        onClick={() => selectedOrganization(item)}
                      >
                        {item.name}
                      </List.Item>
                    )}
                  />
                )}
                {createOrganizationF && (
                  <div style={{ minHeight: 450 }}>
                    {' '}
                    <Form
                      name="basic"
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 16 }}
                      initialValues={{ remember: false }}
                      onFinish={createNewOrganization}
                      onFinishFailed={null}
                      autoComplete="off"
                    >
                      <Form.Item
                        label="Nombre"
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: 'Ingrese un nombre válido',
                          },
                        ]}
                      >
                        <Input></Input>
                      </Form.Item>
                      {!loadingAdd && (
                        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                          <Button type="primary" htmlType="submit">
                            Agregar
                          </Button>
                        </Form.Item>
                      )}
                      {loadingAdd && (
                        <Row justify="center">
                          <Spin />
                        </Row>
                      )}
                    </Form>
                  </div>
                )}
              </Modal>
            )}
          </Space>
        </div>
        {/* SELECT TEMPLATE BY ORGANIZATION */}
        {selectOrganization?.template_properties && (
          <Space direction="vertical">
            <Text>Template: </Text>
            <Select
              value={templateId}
              style={{ minWidth: '400px' }}
              onChange={handleChange}
            >
              {selectOrganization.template_properties.map((template) => (
                <Option key={template._id['$oid']} value={template._id['$oid']}>
                  {template.name}
                </Option>
              ))}
            </Select>
          </Space>
        )}
      </Space>

      {/* Modal de fecha */}
      <Modal
        className="modal-calendar"
        centered
        open={isModalVisible}
        okText="Aceptar"
        onOk={handleOk}
        cancelText="Cancelar"
        onCancel={handleCancel}
        width={600}
      >
        <Row gutter={[16, 16]} justify="center" align="top">
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <DayPicker
              onDayClick={changeSelectDay}
              selectedDays={selectedDay}
              value={selectedDay}
            />
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Title level={4} type="secondary">
              Asignar hora
            </Title>
            <Card>
              <Space direction="vertical">
                <div>
                  <Space>
                    <div className="modal-horas">
                      <span>de</span>
                    </div>
                    <TimePicker
                      allowClear={false}
                      use12Hours
                      value={dayjs(selectedHours.from)}
                      onChange={(hours) =>
                        changeSelectHours({ ...selectedHours, from: hours })
                      }
                    />
                  </Space>
                </div>
                <div>
                  <Space>
                    <div className="modal-horas">
                      <span>a</span>
                    </div>
                    <TimePicker
                      allowClear={false}
                      use12Hours
                      value={dayjs(selectedHours.at)}
                      onChange={(hours) =>
                        changeSelectHours({ ...selectedHours, at: hours })
                      }
                    />
                  </Space>
                </div>
              </Space>
            </Card>
            <Paragraph type="secondary" style={{ marginTop: '10px' }}>
              Si tu curso se extiende por más de un día podrás ajustar las fechas en la
              sección <strong>Datos del curso</strong> una vez lo hayas creado.
            </Paragraph>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default Informacion
