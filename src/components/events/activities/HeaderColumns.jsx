/** React's libraries */
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useIntl } from 'react-intl'
import Moment from 'moment-timezone'
import dayjs from 'dayjs'

/** export Excel */

/** Antd imports */
import { Button, Col, Modal, Row, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  CaretRightOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import HumanGreetingVariantIcon from '@2fd/ant-design-icons/lib/HumanGreetingVariant'
import CancelIcon from '@2fd/ant-design-icons/lib/Cancel'

/** Helpers and utils */
import { imageUtils } from '../../../Utilities/ImageUtils'
import { recordTypeForThisEvent } from '../Landing/helpers/thisRouteCanBeDisplayed'

/** Context */
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { useEventContext } from '@context/eventContext'
import WithEviusContext from '@context/withContext'
import AgendaContext from '@context/AgendaContext'
import { CurrentEventUserContext } from '@context/eventUserContext'
import { StateMessage } from '@context/MessageService'

const HeaderColumns = (props) => {
  const { currentActivity } = useHelper()
  const cEvent = useEventContext()
  const cEventUSer = useContext(CurrentEventUserContext)
  const [isLoading, setIsLoading] = useState(false)
  const {
    request,
    getRequestByActivity,
    addRequest,
    setRefActivity,
    refActivity,
    removeRequest,
    setActivityEdit,
    typeActivity,
  } = useContext(AgendaContext)

  function showPropsConfirm() {
    Modal.confirm({
      centered: true,
      title: 'Seguro que desea cambiar a la transmisión en vivo',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Aceptar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        setIsLoading(true)
        removeRequestTransmision()
        async function removeRequestTransmision() {
          await removeRequest(refActivity, cEventUSer.value?._id)
          setIsLoading(false)
        }
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

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
    getRequestByActivity(refActivity)
    return () => {
      setActivityEdit(null)
    }
  }, [currentActivity, typeActivity])

  const haveRequest = () => {
    if ((request && !request[cEventUSer.value?._id]) || !request) {
      return false
    }
    return true
  }

  const sendOrCancelRequest = async () => {
    setIsLoading(true)
    if (!haveRequest() && cEventUSer.value?._id) {
      await addRequest(refActivity + '/' + cEventUSer.value?._id, {
        id: cEventUSer.value?._id,
        name: cEventUSer.value?.user?.names,
        date: new Date().getTime(),
      })
    } else if (haveRequest() && cEventUSer.value?._id) {
      // Remover o cancelar request
      await removeRequest(refActivity, cEventUSer.value?._id)
    } else {
      StateMessage.show(null, 'error', 'Error al enviar solicitud')
    }
    setIsLoading(false)
  }

  const intl = useIntl()
  return (
    <Row align="middle">
      <Link
        to={
          cEvent && !cEvent?.isByname
            ? `/landing/${props.cEvent.value._id}/evento`
            : `/event/${cEvent?.nameEvent}/agenda`
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
            {props.activityState === 'open_meeting_room' ||
            props.activityState === 'game' ? (
              <img
                style={{ height: '4vh', width: '4vh' }}
                src={imageUtils.EnVivo}
                alt="React logo"
              />
            ) : props.activityState === 'ended_meeting_room' &&
              currentActivity !== null &&
              currentActivity.video ? (
              <CaretRightOutlined style={{ fontSize: '30px' }} />
            ) : props.activityState === 'ended_meeting_room' &&
              currentActivity !== null ? (
              <CheckCircleOutlined style={{ fontSize: '30px' }} />
            ) : (props.activityState === '' || props.activityState == null) &&
              currentActivity?.type?.name !== ('url' || 'video') ? (
              <ClockCircleOutlined style={{ fontSize: '30px' }} />
            ) : props.activityState === 'closed_meeting_room' ? (
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
          {props.activityState === 'open_meeting_room' || props.activityState === 'game'
            ? 'En vivo'
            : props.activityState === 'ended_meeting_room' &&
              currentActivity !== null &&
              currentActivity.video
            ? 'Grabado'
            : props.activityState === 'ended_meeting_room' && currentActivity !== null
            ? 'Terminada'
            : props.activityState === 'closed_meeting_room'
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
          <Col>
            {typeActivity == 'eviusMeet' &&
              !request[cEventUSer.value?._id]?.active &&
              cEventUSer.value?._id &&
              props.activityState === 'open_meeting_room' &&
              recordTypeForThisEvent(cEvent) !== 'UN_REGISTERED_PUBLIC_EVENT' && (
                <Button
                  style={{ transition: 'all 1s' }}
                  onClick={() => (!isLoading ? sendOrCancelRequest() : null)}
                  icon={
                    !haveRequest() && !isLoading ? (
                      <HumanGreetingVariantIcon style={{ fontSize: '16px' }} />
                    ) : haveRequest() && !isLoading ? (
                      <CancelIcon style={{ fontSize: '16px' }} />
                    ) : (
                      <Spin />
                    )
                  }
                  disabled={request && request[cEventUSer.value?._id]?.active}
                  type={!haveRequest() ? 'primary' : 'danger'}
                >
                  {!haveRequest() && !isLoading
                    ? 'Solicitar participar en la transmisión'
                    : !isLoading
                    ? 'Cancelar solicitud'
                    : 'Espere...'}
                </Button>
              )}
            {typeActivity == 'eviusMeet' &&
              request[cEventUSer.value?._id]?.active &&
              props.activityState === 'open_meeting_room' && (
                <Button
                  style={{ transition: 'all 1s' }}
                  onClick={() => showPropsConfirm()}
                  icon={
                    !haveRequest() ? (
                      <HumanGreetingVariantIcon style={{ fontSize: '16px' }} />
                    ) : (
                      <CancelIcon style={{ fontSize: '16px' }} />
                    )
                  }
                  type={!haveRequest() ? 'primary' : 'danger'}
                >
                  Cambiar a modo transmisión en vivo
                </Button>
              )}
          </Col>
        </div>
      </Col>
    </Row>
  )
}

const HeaderColumnswithContext = WithEviusContext(HeaderColumns)

export default HeaderColumnswithContext
