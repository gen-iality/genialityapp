import { useEffect, useState, FunctionComponent } from 'react'
import {
  Card,
  Col,
  Input,
  Row,
  Space,
  Typography,
  Modal,
  Button,
  Select,
  TimePicker,
  DatePicker,
  Form,
  Divider,
} from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import 'react-day-picker/lib/style.css'
import { useContextNewEvent } from '@context/newEventContext'
import { PlansApi } from '@helpers/request'
import ModalOrgListCreate from './ModalOrgListCreate'
/**
 * This solution is distributed as is:
 * https://github.com/react-component/picker/issues/123#issuecomment-728755491
 */
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)


const { Text, Title, Paragraph } = Typography

export interface InitialNewEventFormSectionProps {
  currentUser?: any,
  orgId?: string,
}

const InitialNewEventFormSection: FunctionComponent<InitialNewEventFormSectionProps> = (props) => {
  const {
    showModal,
    isModalVisible,
    handleCancel,
    handleOk,
    changeSelectHours,
    changeSelectDay,
    selectedDay,
    selectedHours,
    dateEvent,
    handleInput,
    valueInputs,
    containsError,
    selectTemplate,
    templateId,
    dispatch,
    state,
  } = useContextNewEvent()

  const cUser = props.currentUser

  const [userConsumption, setUserConsumption] = useState<any>({})

  const handleChange = (value: any) => {
    selectTemplate(value)
  }

  useEffect(() => {
    if (!cUser?._id) return
    PlansApi.getCurrentConsumptionPlanByUsers(cUser?._id)
      .then(setUserConsumption)
  }, [cUser])

  useEffect(() => {
    if (state.selectOrganization) {
      selectTemplate(
        state.selectOrganization.template_properties
          ? state.selectOrganization?.template_properties[0]._id['$oid']
          : undefined
      )
    }
  }, [state.selectOrganization, selectTemplate])

  return (
    <div className="step-information">
      <Space direction="vertical" size="middle" style={{ marginBottom: '30px' }}>
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
              <small className="text-color">Ingrese un nombre correcto para el curso</small>
            </Col>
          )}
        </div>
        <div>
          <Text>
            Fecha del curso <span className="text-color">*</span>
          </Text>
          <Input
            value={dateEvent || ''}
            onClick={showModal}
            suffix={<CalendarOutlined onClick={showModal} />}
            placeholder="Clic para agregar fecha"
          />
        </div>
        <Space direction="vertical">
          {state.organizations.length > 0 && (
            <div>
              <p>
                Este curso pertenecerá a la organización | <b>{state?.selectOrganization?.name}</b>
              </p>
              <Button block onClick={() => dispatch({ type: 'VISIBLE_MODAL', payload: { visible: true } })}>
                Cambiar de organización
              </Button>
            </div>
          )}
          <ModalOrgListCreate modalListOrgIsVisible={false} orgId={props.orgId} />
        </Space>

        {state.selectOrganization?.template_properties && (
          <Space direction="vertical">
            <Text>Template </Text>
            <Select
              style={{ minWidth: '400px' }}
              value={templateId}
              onChange={handleChange}
              options={state.selectOrganization.template_properties.map((template: any) => ({
                value: template._id['$oid'],
                label: template.name,
              }))}
            />
          </Space>
        )}
      </Space>

      {/* Modal de fecha */}
      <Modal
        centered
        className="modal-calendar"
        visible={isModalVisible}
        okText="Aceptar"
        onOk={handleOk}
        cancelText="Cancelar"
        onCancel={handleCancel}
        width={600}
      >
        <Row gutter={[16, 16]} justify="center" align="top">
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Title level={4} type="secondary">
              Asignar fecha
            </Title>

            <DatePicker
              inputReadOnly
              style={{ width: '100%', marginTop: '20px' }}
              /* popupStyle={{ height: '50px !important', backgroundColor: 'blue' }} */
              allowClear={false}
              value={dayjs(selectedDay) as unknown as any}
              format="DD/MM/YYYY"
              onChange={(value) => value && changeSelectDay(value.toDate())}
            />

            <Divider />

            {userConsumption?.end_date && (
              <Typography.Text strong type="secondary">
                <small>Su plan finaliza el dia {userConsumption?.end_date}</small>
              </Typography.Text>
            )}

            <Title level={4} type="secondary">
              Asignar hora
            </Title>
            <Card>
              <Space direction="vertical">
                <Space>
                  <div className="modal-horas">
                    <span>de:</span>
                  </div>
                  <TimePicker
                    inputReadOnly
                    showNow={false}
                    allowClear={false}
                    use12Hours
                    value={dayjs(selectedHours.from) as unknown as any}
                    onChange={(hours) => changeSelectHours({ ...selectedHours, from: hours, at: hours })}
                  />
                </Space>
                
                <Space>
                  <div className="modal-horas">
                    <span>a:</span>
                  </div>
                  <TimePicker
                    inputReadOnly
                    showNow={false}
                    allowClear={false}
                    use12Hours
                    value={dayjs(selectedHours.at) as unknown as any}
                    onChange={(hours) => changeSelectHours({ ...selectedHours, at: hours })}
                  />
                </Space>
              </Space>
            </Card>
            <Paragraph type="secondary" style={{ marginTop: '10px' }}>
              Podrás ajustar las fechas en la sección <strong>Datos del curso</strong> una vez lo hayas creado.
            </Paragraph>
          </Col>
        </Row>
      </Modal>
    </div>
  )
}

export default InitialNewEventFormSection
