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
  const { show, onHidden, allActivities, user: watchedUser, event } = props

  const [dataLoaded, setDataLoaded] = useState(false)
  const [viewedActivities, setViewedActivities] = useState<any[]>([])
  const [isSending, setIsSending] = useState(false)

  const requestAllData = async () => {
    const existentActivities = await allActivities.map(async (activity) => {
      const activity_attendee = await firestore
        .collection(`${activity._id}_event_attendees`)
        .doc(watchedUser._id)
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
    // const emailEncoded = encodeURIComponent(watchedUser.email)
    // const redirect = `${window.location.origin}/landing/${event._id}/certificate`
    // const url = `${window.location.origin}/direct-login?email=${emailEncoded}&redirect=${redirect}`
    const url = `${window.location.origin}/certificate-generator/${watchedUser.account_id}/${event._id}/no-activities`

    try {
      // Before it was generalMagicLink, but now the mail is sent directly
      await EventsApi.sendGenericMail(
        watchedUser.email,
        url,
        '<p>La Asociación Colombiana de Neurologia - ACN, agradece du asistencia y participación en el Simposio Nacional de Movimientos Anormales, realizado el 26 - 27 de mayo en Barranquilla, Colombia.</p><p>Nota: Para efectuar la descarga introduzca su número de cédula\nRecuerde consultar la agenda académica y programación de eventos en www.ACNWEB.org 🧠</p>',
        'Descargar certificado',
      )
      StateMessage.show(
        null,
        'success',
        `Se ha enviado el mensaje a ${watchedUser.email}`,
      )
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
    if (!watchedUser) return
    if (allActivities.length == 0) return

    requestAllData()
      .catch((err) => {
        console.error(err)
        StateMessage.show(null, 'error', 'No se ha podido cargar los datos')
      })
      .finally(() => setDataLoaded(true))

    // if (!show) setLoaded(false)
    return () => setDataLoaded(false)
  }, [allActivities, watchedUser, show])

  if (!watchedUser) return null

  return (
    <Modal centered footer={null} visible={show} closable onCancel={onHidden}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {dataLoaded ? (
          <List
            size="small"
            header={
              <Row justify="space-between">
                <Typography.Text strong>
                  Lecciones vistas por {watchedUser.names}
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
                      await checkinAttendeeInActivity(watchedUser, item._id)
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
            subTitle={`Cargando datos de ${watchedUser.names}...`}
          />
        )}
      </Space>
    </Modal>
  )
}

export default LessonsInfoModal
