/** React's libraries */
import { FunctionComponent, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import Moment from 'moment-timezone'
import dayjs from 'dayjs'

/** export Excel */

/** Antd imports */
import { Button, Col, Row } from 'antd'
import {
  ArrowLeftOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'

/** Helpers and utils */
import { imageUtils } from '../../../Utilities/ImageUtils'

/** Context */
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useEventContext } from '@context/eventContext'

import AgendaContext from '@context/AgendaContext'

interface IHeaderColumnsProps {
  isVisible?: boolean
  activityState?: any
}

const HeaderColumns: FunctionComponent<IHeaderColumnsProps> = (props) => {
  const { currentActivity } = useHelper()
  const cEvent = useEventContext()

  const { setRefActivity, setActivityEdit, typeActivity } = useContext(AgendaContext)

  // Se ejecuta cuando tiene una lección para establecer la referencia y obtener los request
  useEffect(() => {
    if (currentActivity) {
      // Se setea el currentactivity para detectar si la transmision es por eviusmeet u otro
      setActivityEdit(currentActivity._id)

      console.log('1. SE EJECUTA ESTO')
    }
    if (!currentActivity || typeActivity !== 'eviusMeet') return
    const refActivity = `request/${cEvent.value?._id}/activities/${currentActivity?._id}`
    setRefActivity(refActivity)
    return () => {
      setActivityEdit(null)
    }
  }, [currentActivity, typeActivity])

  const roomStatus =
    props.activityState?.habilitar_ingreso ?? props.activityState?.roomState

  const intl = useIntl()
  return (
    <Row align="middle">
      <Link
        to={
          cEvent && !cEvent?.isByname
            ? `/landing/${cEvent.value._id}/evento`
            : `/event/${cEvent.nameEvent}/agenda`
        }
      >
        <Button type="primary" shape="round" icon={<ArrowLeftOutlined />} size="small">
          {intl.formatMessage({ id: 'button.back.agenda' })}
        </Button>
      </Link>

      <Col
        xs={{ order: 2, span: 4 }}
        sm={{ order: 2, span: 4 }}
        md={{ order: 1, span: 2 }}
        lg={{ order: 1, span: 2 }}
        xl={{ order: 1, span: 2 }}
        style={{ padding: '4px' }}
      >
        <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Col>
            {roomStatus === 'open_meeting_room' || roomStatus === 'game' ? (
              <img
                style={{ height: '4vh', width: '4vh' }}
                src={imageUtils.EnVivo}
                alt="React logo"
              />
            ) : roomStatus === 'ended_meeting_room' &&
              currentActivity !== null &&
              currentActivity.video ? (
              <CaretRightOutlined style={{ fontSize: '30px' }} />
            ) : roomStatus === 'ended_meeting_room' && currentActivity !== null ? (
              <CheckCircleOutlined style={{ fontSize: '30px' }} />
            ) : (roomStatus === '' || roomStatus == null) &&
              currentActivity?.type?.name !== ('url' || 'video') ? (
              <ClockCircleOutlined style={{ fontSize: '30px' }} />
            ) : roomStatus === 'closed_meeting_room' ? (
              <LoadingOutlined style={{ fontSize: '30px' }} />
            ) : (
              ''
            )}
          </Col>
        </Row>
        <Row
          style={{
            // height: '2vh',
            fontSize: 11,
            fontWeight: 'normal',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {roomStatus === 'open_meeting_room' || roomStatus === 'game'
            ? 'En vivo'
            : roomStatus === 'ended_meeting_room' &&
              currentActivity !== null &&
              currentActivity.video
            ? 'Grabado'
            : roomStatus === 'ended_meeting_room' && currentActivity !== null
            ? 'Terminada'
            : roomStatus === 'closed_meeting_room'
            ? 'Por iniciar'
            : ''}
        </Row>
      </Col>

      <Col
        xs={{ order: 3, span: 20 }}
        sm={{ order: 3, span: 20 }}
        md={{ order: 2, span: 18 }}
        lg={{ order: 2, span: 16 }}
        xl={{ order: 2, span: 18 }}
        style={{ display: 'flex' }}
      >
        <div style={{ padding: '8px' }}>
          <Row style={{ textAlign: 'left', fontWeight: 'bolder' }}>
            {currentActivity && currentActivity?.name}
          </Row>
          <Row
            style={{
              height: '2.5vh',
              fontSize: 10,
              fontWeight: 'normal',
            }}
          >
            <div
              xs={{ order: 1, span: 24 }}
              sm={{ order: 1, span: 24 }}
              md={{ order: 1, span: 24 }}
              lg={{ order: 3, span: 6 }}
              xl={{ order: 3, span: 4 }}
            >
              {props.isVisible && (
                <div>
                  {currentActivity?.type?.name === ('url' || 'video') ? (
                    <>
                      {intl.formatMessage({
                        id: 'label.posted.date',
                        defaultMessage: 'Publicado ',
                      })}{' '}
                      {dayjs(currentActivity?.datetime_start).fromNow()}
                    </>
                  ) : (
                    <>
                      {Moment.tz(
                        currentActivity !== null && currentActivity?.datetime_start,
                        'YYYY-MM-DD h:mm',
                        'America/Bogota',
                      )
                        .tz(Moment.tz.guess())
                        .format('DD MMM YYYY')}{' '}
                      {Moment.tz(
                        currentActivity !== null && currentActivity?.datetime_start,
                        'YYYY-MM-DD h:mm',
                        'America/Bogota',
                      )
                        .tz(Moment.tz.guess())
                        .format('h:mm a z')}{' '}
                      -{' '}
                      {Moment.tz(
                        currentActivity !== null && currentActivity?.datetime_end,
                        'YYYY-MM-DD h:mm',
                        'America/Bogota',
                      )
                        .tz(Moment.tz.guess())
                        .format('h:mm a z')}
                    </>
                  )}
                </div>
              )}
            </div>

            {currentActivity !== null &&
              currentActivity?.space &&
              currentActivity?.space?.name}
          </Row>
        </div>
      </Col>
    </Row>
  )
}

export default HeaderColumns
