import { Fragment, useState, useEffect } from 'react'
import { Avatar, Row, Col, Tooltip, Typography } from 'antd'
import { AgendaApi } from '@helpers/request'

import Moment from 'moment-timezone'
import { FieldTimeOutlined } from '@ant-design/icons'
import { FormattedMessage } from 'react-intl'
import { useEventContext } from '@context/eventContext'
import { Link } from 'react-router-dom'
import { truncate } from 'lodash-es'
import { imageUtils } from '../../Utilities/ImageUtils'
import { FB } from '@helpers/firestore-request'
const { Text } = Typography

const VirtualConference = () => {
  const cEvent = useEventContext()
  const urlactivity = `/landing/${cEvent.value._id}/activity/`
  const urlAgenda = `/landing/${cEvent.value._id}/agenda/`

  const [infoAgendaArr, setInfoAgenda] = useState([])
  const [agendageneral, setAgendageneral] = useState(null)
  const [bandera, setBandera] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const response = await AgendaApi.byEvent(cEvent.value._id)
      setAgendageneral(response.data)

      setBandera(!bandera)
    }
    fetchData()
  }, [])

  useEffect(() => {
    agendageneral &&
      FB.Events.ref(cEvent.value._id)
        .collection('activities')
        .onSnapshot((infoActivity) => {
          const arratem = []

          infoActivity.docs.map((doc) => {
            agendageneral.map((item) => {
              if (item._id == doc.id) {
                let activity
                const { habilitar_ingreso, isPublished, meeting_id, platform, vimeo_id } =
                  doc.data()
                if (
                  habilitar_ingreso != 'ended_meeting_room' &&
                  isPublished &&
                  habilitar_ingreso != '' &&
                  (meeting_id != null || vimeo_id != null)
                ) {
                  activity = {
                    ...item,
                    habilitar_ingreso,
                    isPublished,
                    meeting_id,
                    platform,
                  }
                  arratem.push(activity)
                }
              }
            })
          })

          //ordenar
          const activitiesorder = arratem.sort((a, b) => a.updated_at - b.updated_at)
          const orderactivities = []
          orderactivities.push(activitiesorder[0])

          setInfoAgenda(orderactivities)
        })
  }, [agendageneral])

  return (
    <Fragment>
      {infoAgendaArr.length > 0 &&
        infoAgendaArr
          .filter((item) => {
            return (
              item?.habilitar_ingreso &&
              (item?.habilitar_ingreso == 'open_meeting_room' ||
                item?.habilitar_ingreso == 'closed_meeting_room') &&
              (item?.isPublished || item?.isPublished === 'true')
            )
          })

          .map((item, key) => (
            <>
              <div
                key={key}
                hoverable
                className="animate__animated animate__slideInRight"
              >
                <Link
                  to={
                    item.habilitar_ingreso == 'open_meeting_room'
                      ? `${urlactivity}${item._id}`
                      : `${urlAgenda}`
                  }
                >
                  <Row justify="center" align="middle" gutter={[8, 8]}>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                      <div
                        className="animate__animated animate__pulse animate__infinite animate__slow"
                        style={{
                          justifyContent: 'center',
                          alignContent: 'center',
                          display: 'grid',
                        }}
                      >
                        {item.habilitar_ingreso == 'open_meeting_room' ? (
                          <>
                            <img src={imageUtils.EnVivo} style={{ height: '30px' }} />
                            <span
                              className="ultrasmall-mobile"
                              style={{ textAlign: 'center' }}
                            >
                              {<FormattedMessage id="live" defaultMessage="En vivo" />}
                            </span>
                          </>
                        ) : item.habilitar_ingreso == 'closed_meeting_room' ? (
                          <>
                            <FieldTimeOutlined
                              style={{ fontSize: '30px', color: '#FAAD14' }}
                            />
                            <span
                              className="ultrasmall-mobile"
                              style={{ textAlign: 'center' }}
                            >
                              {
                                <FormattedMessage
                                  id="live.closed"
                                  defaultMessage="Iniciará pronto"
                                />
                              }
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </Col>

                    <Col xs={18} sm={18} md={12} lg={12} xl={12} xxl={12}>
                      <div
                        style={{
                          alignContent: 'center',
                          display: 'grid',
                          height: '100%',
                          alignItems: 'center',
                        }}
                      >
                        <Text strong={truncate} ellipsis={{ rows: 1, expandable: true }}>
                          <a>{item.name}</a>
                        </Text>
                        <Text>
                          {Moment(item.datetime_start).format('LL')}
                          <span>&nbsp;&nbsp;&nbsp;</span>
                          {Moment.tz(
                            item.datetime_start,
                            'YYYY-MM-DD h:mm',
                            'America/Bogota',
                          )
                            .tz(Moment.tz.guess())
                            .format('h:mm A')}
                          {' - '}
                          {Moment.tz(
                            item.datetime_end,
                            'YYYY-MM-DD h:mm',
                            'America/Bogota',
                          )
                            .tz(Moment.tz.guess())
                            .format('h:mm A')}
                          <span className="ultrasmall-mobile">
                            {Moment.tz(
                              item.datetime_end,
                              'YYYY-MM-DD HH:mm',
                              'America/Bogota',
                            )
                              .tz(Moment.tz.guess())
                              .format(' (Z)')}
                          </span>
                          <a>
                            {item.habilitar_ingreso == 'open_meeting_room'
                              ? ' Ingresar'
                              : ' Ver'}
                          </a>
                        </Text>
                      </div>
                    </Col>
                    <Col xs={0} sm={0} md={6} lg={6} xl={6} xxl={6}>
                      <div
                        style={{
                          justifyContent: 'center',
                          alignContent: 'center',
                          display: 'grid',
                        }}
                      >
                        {item.hosts && (
                          <div className="Virtual-Conferences">
                            <Avatar.Group
                              maxCount={2}
                              size={{ xs: 18, sm: 18, md: 35, lg: 50, xl: 50, xxl: 50 }}
                              maxStyle={{ backgroundColor: '#50D3C9', fontSize: '3vw' }}
                            >
                              {item.hosts.length < 3
                                ? item.hosts.map((host, key) => {
                                    return (
                                      <Tooltip title={host.name} key={key}>
                                        <Avatar
                                          src={host.image}
                                          size={{
                                            xs: 40,
                                            sm: 40,
                                            md: 40,
                                            lg: 55,
                                            xl: 55,
                                            xxl: 55,
                                          }}
                                        />
                                      </Tooltip>
                                    )
                                  })
                                : item.hosts.map((host, key) => {
                                    return (
                                      <Tooltip title={host.name} key={key}>
                                        <Avatar
                                          key={key}
                                          src={host.image}
                                          size={{
                                            xs: 18,
                                            sm: 18,
                                            md: 35,
                                            lg: 50,
                                            xl: 50,
                                            xxl: 50,
                                          }}
                                        />
                                      </Tooltip>
                                    )
                                  })}
                            </Avatar.Group>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Link>
              </div>
            </>
          ))}
    </Fragment>
  )
}

export default VirtualConference
