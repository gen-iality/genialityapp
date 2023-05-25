import {
  CheckOutlined,
  LoadingOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { StateMessage } from '@context/MessageService'
import { checkinAttendeeInActivity } from '@helpers/HelperAuth'
import { firestore } from '@helpers/firebase'
import { EventsApi } from '@helpers/request'
import { Button, Checkbox, List, Result, Row, Space, Typography, Modal } from 'antd'
import { FunctionComponent, useEffect, useMemo, useState } from 'react'

interface ILessonsInfoModalProps {
  show: boolean
  onHidden: () => void
  allActivities: any[]
  user: any
  event: any
}

const LessonsInfoModal: FunctionComponent<ILessonsInfoModalProps> = (props) => {
  const { show, onHidden, allActivities, user, event } = props

  const [dataLoaded, setDataLoaded] = useState(false)
  const [viewedActivities, setViewedActivities] = useState<any[]>([])
  const [isSending, setIsSending] = useState(false)

  const requestAllData = async () => {
    const existentActivities = await allActivities.map(async (activity) => {
      const activity_attendee = await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(user._id)
        .get()
      if (activity_attendee.exists) {
        return activity
      }
      return null
    })
    // Filter non-null result that means that the user attendees them
    const viewedActivities = (await Promise.all(existentActivities)).filter(
      (item) => item !== null,
    )
    setViewedActivities(viewedActivities.map((activity) => activity.name))
  }

  const handleSendCertificate = async () => {
    setIsSending(true)
    const emailEncoded = encodeURIComponent(user.email)
    const redirect = `${window.location.origin}/landing/${event._id}/certificate`
    const url = `${window.location.origin}/direct-login?email=${emailEncoded}&redirect=${redirect}`

    try {
      await EventsApi.generalMagicLink(
        user.email,
        url,
        'Entra al ver el certificado en el siguiente link',
      )
      StateMessage.show(null, 'success', `Se ha enviado el mensaje a ${user.email}`)
    } catch (err) {
      console.error(err)
      Modal.error({
        title: 'Error en el envío',
        content: 'No se ha podido enviar el certificado por problemas de fondo',
      })
    }
    setIsSending(false)
  }

  const isDone = useMemo(
    () => allActivities.every((activity) => viewedActivities.includes(activity.name)),
    [allActivities, viewedActivities],
  )

  useEffect(() => {
    if (!user) return
    if (allActivities.length == 0) return

    requestAllData().finally(() => setDataLoaded(true))

    // if (!show) setLoaded(false)
    return () => setDataLoaded(false)
  }, [allActivities, user, show])

  if (!user) return null

  return (
    <Modal centered footer={null} visible={show} closable onCancel={onHidden}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {dataLoaded ? (
          <List
            size="small"
            header={
              <Row justify="space-between">
                <Typography.Text strong>
                  Lecciones vistas por {user.names}
                </Typography.Text>
                <Button
                  type="primary"
                  title={
                    isDone
                      ? 'Envía un correo con un enlace mágico'
                      : 'Se necesita pasar todos los cursos'
                  }
                  disabled={!isDone || isSending}
                  onClick={() => handleSendCertificate()}
                  icon={isSending ? <LoadingOutlined /> : <SafetyCertificateOutlined />}
                >
                  Enviar certificado
                </Button>
              </Row>
            }
            // bordered
            dataSource={allActivities}
            renderItem={(item) => (
              <List.Item>
                {viewedActivities.filter((activityName) => activityName == item.name)
                  .length ? (
                  <CheckOutlined />
                ) : (
                  <Checkbox
                    onChange={async () => {
                      await checkinAttendeeInActivity(user, item._id)
                      requestAllData()
                    }}
                  />
                )}{' '}
                {item.name}
              </List.Item>
            )}
          />
        ) : (
          <Result
            icon={<LoadingOutlined />}
            title="Cargando"
            status="info"
            subTitle={`Cargando datos de ${user.names}...`}
          />
        )}
      </Space>
    </Modal>
  )
}

export default LessonsInfoModal
