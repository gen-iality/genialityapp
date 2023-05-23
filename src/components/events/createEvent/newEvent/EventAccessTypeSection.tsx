import { FunctionComponent, Dispatch } from 'react'
import { CheckCircleFilled } from '@ant-design/icons'
import { Badge, Card, Col, Divider, Row, Space, Typography, Checkbox } from 'antd'
import {
  useNewEventContext,
  NewEventActionEnum,
  NewEventAccessTypeEnum,
  NewEventAction,
  NewEventState,
} from '@context/newEventContext'

const EventAccessTypeSection: FunctionComponent = () => {
  /**
   * accessType === 0 -> Publico con registro obligatorio
   * accessType === 1 -> Publico sin registro obligatorio
   * accessType === 2 -> Privado por invitacion
   */
  const {
    dispatch,
    state,
  }: { dispatch: Dispatch<NewEventAction>; state: NewEventState } = useNewEventContext()

  return (
    <Row
      style={{ marginTop: '50px', marginBottom: '50px' }}
      gutter={[16, 16]}
      justify="center"
      align="stretch"
    >
      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
        <Badge
          count={
            state.type === 0 ? (
              <CheckCircleFilled style={{ fontSize: '25px', color: '#f7981d' }} />
            ) : (
              ''
            )
          }
        >
          <Card
            style={{
              border: '1px solid #D3D3D3',
              borderRadius: '5px',
              padding: '10px',
              cursor: 'pointer',
              minHeight: '235px',
            }}
            onClick={() =>
              dispatch({
                type: NewEventActionEnum.EVENT_ACCESS,
                payload: { accessType: NewEventAccessTypeEnum.PUBLIC },
              })
            }
          >
            <Space direction="vertical">
              <div onClick={() => this.changetypeEvent(0)}>
                <Typography.Text strong>
                  Curso público con registro obligatorio
                </Typography.Text>
                <Divider />
                <Typography.Text type="secondary">
                  <ul>
                    <li>Tiene registro para todos.</li>
                    <li>Tiene inicio de sesión para todos.</li>
                  </ul>
                </Typography.Text>
              </div>
              {state.type === 0 && (
                <>
                  <Divider />
                  <Checkbox
                    onChange={() =>
                      dispatch({ type: NewEventActionEnum.TYPE_AUTHENTICATION })
                    }
                  >
                    Registros sin autenticación de usuario (Beta)
                  </Checkbox>
                </>
              )}
            </Space>
          </Card>
        </Badge>
      </Col>
      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
        <Badge
          count={
            state.type === 1 ? (
              <CheckCircleFilled style={{ fontSize: '25px', color: '#f7981d' }} />
            ) : (
              ''
            )
          }
        >
          <Card
            style={{
              border: '1px solid #D3D3D3',
              borderRadius: '5px',
              padding: '10px',
              cursor: 'pointer',
              minHeight: '235px',
            }}
            onClick={() =>
              dispatch({
                type: NewEventActionEnum.EVENT_ACCESS,
                payload: { accessType: NewEventAccessTypeEnum.ANONYMOUS },
              })
            }
          >
            <Space direction="vertical">
              <Typography.Text strong>
                Cursos público sin registro obligatorio
              </Typography.Text>
              <Divider />
              <Typography.Text type="secondary">
                {/* Solo se mostrará el inicio de sesión. Quedará como anónimo */}
                <ul>
                  <li>Quedará como anónimo.</li>
                  <li>No tendrá inicio de sesión ni registro.</li>
                </ul>
              </Typography.Text>
            </Space>
          </Card>
        </Badge>
      </Col>

      <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
        <Badge
          count={
            state.type === 2 ? (
              <CheckCircleFilled style={{ fontSize: '25px', color: '#f7981d' }} />
            ) : (
              ''
            )
          }
        >
          <Card
            style={{
              border: '1px solid #D3D3D3',
              borderRadius: '5px',
              padding: '10px',
              cursor: 'pointer',
              minHeight: '235px',
            }}
            onClick={() =>
              dispatch({
                type: NewEventActionEnum.EVENT_ACCESS,
                payload: { accessType: NewEventAccessTypeEnum.PRIVATE },
              })
            }
          >
            <Space direction="vertical">
              <Typography.Text strong>Cursos privado por invitación</Typography.Text>
              <Divider />
              <Typography.Text type="secondary">
                {/* Solo se podra acceder por invitación. No tendra inicio de sesión ni registro */}
                <ul>
                  <li>Sólo se podrá acceder por invitación.</li>
                  <li>Sólo se mostrará el inicio de sesión.</li>
                </ul>
              </Typography.Text>
            </Space>
          </Card>
        </Badge>
      </Col>
    </Row>
  )
}

export default EventAccessTypeSection