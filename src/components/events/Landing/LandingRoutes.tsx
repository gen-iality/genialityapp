import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { useEventContext } from '@context/eventContext'
import { useCurrentUser } from '@context/userContext'
import { useUserEvent } from '@context/eventUserContext'
import { useLocation } from 'react-router-dom'

/** ant design */
import { Layout, Spin, notification, Button } from 'antd'

const { Content } = Layout

import { setUserAgenda } from '../../../redux/networking/actions'
import {
  DesktopOutlined,
  LoadingOutlined,
  IssuesCloseOutlined,
  NotificationOutlined,
} from '@ant-design/icons'

/** Google tag manager */
import { EnableGTMByEVENT } from './helpers/tagManagerHelper'
/** Google Analytics */
import { EnableAnalyticsByEVENT } from './helpers/analyticsHelper'
/** Facebook Pixel */
import { EnableFacebookPixelByEVENT } from './helpers/facebookPixelHelper'

import loadable from '@loadable/component'
import { StateMessage } from '@context/MessageService'
import WithEviusContext, { WithEviusContextProps } from '@context/withContext'
import { checkinAttendeeInEvent } from '@helpers/HelperAuth'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { AgendaApi } from '@helpers/request'

import CourseProgressBar from '@components/events/courseProgressBar/CourseProgressBar'
import { ExtendedAgendaType } from '@Utilities/types/AgendaType'

import { activityContentValues } from '@context/activityType/constants/ui'
import { FB } from '@helpers/firestore-request'
import { EventProgressProvider } from '@context/eventProgressContext'

const EviusFooter = loadable(() => import('./EviusFooter'))
const AppointmentModal = loadable(() => import('../../networking/appointmentModal'))
const ModalRegister = loadable(() => import('./modalRegister'))
const ModalLoginHelpers = loadable(() => import('../../authentication/ModalLoginHelpers'))
const ModalPermission = loadable(() => import('../../authentication/ModalPermission'))
const ModalFeedback = loadable(() => import('../../authentication/ModalFeedback'))

/** Components */
const TopBanner = loadable(() => import('./TopBanner'))
const EventSectionRoutes = loadable(() => import('./EventSectionsRoutes'))
const EventSectionsInnerMenu = loadable(() => import('./EventSectionsInnerMenu'))
const EventSectionMenuRigth = loadable(() => import('./EventSectionMenuRigth'))
const MenuTablets = loadable(() => import('./Menus/MenuTablets'))
const MenuTabletsSocialZone = loadable(() => import('./Menus/MenuTabletsSocialZone'))

const iniitalStateTabs = {
  attendees: false,
  privateChat: false,
  publicChat: false,
}

type MapStateToProps = {
  currentActivity: any
  tabs: any
  view: any
  userAgenda: any
}

const mapDispatchToProps = {
  setUserAgenda,
}

type ILandingRoutesProps = MapStateToProps & typeof mapDispatchToProps

const IconRender = (type: string) => {
  let iconRender
  switch (type) {
    case 'open':
      iconRender = <DesktopOutlined style={{ color: '#108ee9' }} />
      break

    case 'close':
      iconRender = <LoadingOutlined style={{ color: 'red' }} />
      break

    case 'ended':
      iconRender = <IssuesCloseOutlined />
      break

    case 'networking':
      iconRender = <NotificationOutlined />
      break
  }
  return iconRender
}

const ButtonRender = (status: string, eventId: string, activityId: string) => {
  return status == 'open' ? (
    <Button
      type="primary"
      size="small"
      onClick={() =>
        window.location.replace(
          `${window.location.origin}/landing/${eventId}/activity/${activityId}`,
        )
      }
    >
      Ir a la lección
    </Button>
  ) : null
}

const LandingRoutes: FunctionComponent<WithEviusContextProps<ILandingRoutesProps>> = (
  props,
) => {
  const cEventContext = useEventContext()
  const cUser = useCurrentUser()
  const cEventUser = useUserEvent()
  const {
    isNotification,
    ChangeActiveNotification,
    currentActivity,
    register,
    setRegister,
  } = useHelper()

  const [activityAttendees, setActivityAttendees] = useState<any[]>([])
  const [countableActivities, setCountableActivities] = useState<any[]>([])

  const [activities, setActivities] = useState<ExtendedAgendaType[]>([])
  const location = useLocation()

  const loadData = async () => {
    // Reset this
    setActivities([])

    const { data } = await AgendaApi.byEvent(cEventContext.value?._id)
    setActivities(data)
  }

  useEffect(() => {
    if (!cEventContext.value?._id) return
    if (!cEventUser.value?._id) return
    loadData()
    console.info('event is asked', cEventContext.value?._id)
  }, [cEventContext.value, cEventUser.value])

  useEffect(() => {
    StateMessage.show(
      null,
      'loading',
      '¡Estamos configurando la mejor experiencia para tí!',
    )

    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('register') !== null) {
      setRegister(urlParams.get('register'))
    }

    return () => {
      setActivities([])
    }
  }, [])

  useEffect(() => {
    if (isNotification.notify) {
      notificationHelper(cEventContext.value._id, isNotification)
    }
  }, [isNotification])

  // Para obtener parametro al loguearme
  const notificationHelper = (
    eventId: string,
    {
      message,
      type,
      activityId,
    }: {
      message: string
      type: string
      activityId: any
    },
  ) => {
    notification.open({
      message: 'Nueva notificación',
      description: message,
      icon: IconRender(type),
      onClose: () => {
        ChangeActiveNotification(false, 'none', 'none')
      },
      btn: ButtonRender(type, eventId, activityId),
      duration: type == 'ended' || type == 'open' ? 7 : 3,
    })
  }

  const [generalTabs, setGeneralTabs] = useState(iniitalStateTabs)
  // eslint-disable-next-line prefer-const
  let [totalNewMessages, setTotalNewMessages] = useState(0)

  // This can be a context or well

  const activityFilter = (a: any) =>
    ![activityContentValues.quizing, activityContentValues.survey].includes(a.type?.name)

  const loadActivityAttendeeData = async () => {
    const filteredData = activities
      .filter(activityFilter)
      .filter((activity) => !activity.is_info_only)
    setCountableActivities(filteredData)

    const existentActivityPromises = filteredData.map(async (activity) => {
      const activityAttendee = await FB.Attendees.get(activity._id!, cEventUser.value._id)
      if (activityAttendee) return activityAttendee
      return null
    })
    // Filter existent activities and set the state
    const existentActivities = await Promise.all(existentActivityPromises)
    setActivityAttendees(existentActivities.filter((item) => !!item))
  }

  useEffect(() => {
    if (!cEventUser.value._id) return

    loadActivityAttendeeData()
      .then(() => console.log('attendees updated successful'))
      .catch((err) => console.error('Cannot load activity attendees at routes', err))
  }, [activities, location.pathname, cEventUser.value])

  useEffect(() => {
    if (cEventContext.status === 'LOADED') {
      import('../../../helpers/firebase').then((fb) => {
        fb.firestore
          .collection('events')
          .doc(cEventContext.value?._id)
          .onSnapshot(function (eventSnapshot) {
            if (eventSnapshot.exists) {
              const eventData = eventSnapshot.data()
              if (eventData?.tabs !== undefined) {
                setGeneralTabs(eventData.tabs)
              }
            }
          })

        fb.firestore
          .collection(
            'eventchats/' +
              cEventContext.value._id +
              '/userchats/' +
              cUser.uid +
              '/' +
              'chats/',
          )
          .onSnapshot(function (querySnapshot) {
            let data
            querySnapshot.forEach((doc) => {
              data = doc.data()

              // NOTA: I don't know what the last developer did want to do here
              if (data.newMessages) {
                setTotalNewMessages(
                  (totalNewMessages += !isNaN(parseInt(data.newMessages.length))
                    ? parseInt(data.newMessages.length)
                    : 0),
                )
              }
            })
          })

        if (
          cEventUser.status == 'LOADED' &&
          cEventUser.value != null &&
          cEventContext.status == 'LOADED'
        ) {
          if (cEventContext.value.type_event !== 'onlineEvent') {
            checkinAttendeeInEvent(cEventUser.value, cEventContext.value._id)
          }
        }
      })
    }
  }, [cEventContext.status, cEventUser.status, cEventUser.value, location])

  const eventProgressPercent: number = useMemo(
    () =>
      Math.round(
        ((activityAttendees.length || 0) / (countableActivities.length || 0)) * 100,
      ),
    [activityAttendees, countableActivities],
  )

  if (cEventContext.status === 'LOADING') return <Spin />

  return (
    <EventProgressProvider>
      <ModalLoginHelpers />
      {cEventContext.value.visibility !== 'ANONYMOUS' && <ModalPermission />}
      <ModalFeedback />
      {/*update: modal de actualizar || register: modal de registro */}
      {register !== null && cEventContext.value.visibility !== 'ANONYMOUS' && (
        <ModalRegister
          register={register}
          setRegister={setRegister}
          event={cEventContext.value}
        />
      )}
      <Layout>
        <AppointmentModal
          targetEventUserId={props.userAgenda?.eventUserId}
          targetEventUser={props.userAgenda}
          cEventUser={cEventUser}
          cEvent={cEventContext}
          closeModal={() => {
            props.setUserAgenda(null)
          }}
        />
        <CourseProgressBar
          eventId={cEventContext.value._id}
          activities={activities}
          eventUser={cEventUser.value}
        />
        <EventSectionsInnerMenu />
        <MenuTablets />
        <Layout className="site-layout">
          <Content
            className="site-layout-background"
            style={{
              // paddingBottom: '15vh',
              backgroundSize: 'cover',
              background: `${
                cEventContext.value && cEventContext.value?.styles?.containerBgColor
              }`,
              backgroundImage: `url(${
                cEventContext.value && cEventContext.value?.styles?.BackgroundImage
              })`,
            }}
          >
            {props.view && <TopBanner currentActivity={currentActivity} />}
            <EventSectionRoutes
              generaltabs={generalTabs}
              currentActivity={currentActivity}
              eventProgressPercent={eventProgressPercent}
            />
            <EviusFooter />
          </Content>
        </Layout>
        <EventSectionMenuRigth
          generalTabs={generalTabs}
          currentActivity={currentActivity}
          totalNewMessages={totalNewMessages}
          tabs={props.tabs}
        />
        <MenuTabletsSocialZone
          totalNewMessages={totalNewMessages}
          currentActivity={currentActivity}
          generalTabs={generalTabs}
        />
        <EnableGTMByEVENT />
        <EnableAnalyticsByEVENT />
        <EnableFacebookPixelByEVENT />
      </Layout>
    </EventProgressProvider>
  )
}

const mapStateToProps = (state: any) => ({
  currentActivity: state.stage.data.currentActivity,
  tabs: state.stage.data.tabs,
  view: state.topBannerReducer.view,
  userAgenda: state.spaceNetworkingReducer.userAgenda,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WithEviusContext<ILandingRoutesProps>(LandingRoutes))
