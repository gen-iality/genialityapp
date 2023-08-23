import { FunctionComponent, useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'
import { setVirtualConference } from '../../../redux/virtualconference/actions'
import { setSpaceNetworking } from '../../../redux/networking/actions'
import { useHelper } from '@context/helperContext/hooks/useHelper'
import { setSectionPermissions } from '../../../redux/sectionPermissions/actions'
import { useParams } from 'react-router-dom'
import { useUserEvent } from '@context/eventUserContext'
import { checkinAttendeeInEvent } from '@helpers/HelperAuth'
import loadable from '@loadable/component'
import initUserPresence from '../../../containers/userPresenceInEvent'
import initBroadcastViewers from '@containers/broadcastViewers'
import withContext, { WithEviusContextProps } from '@context/withContext'
import { useCurrentUser } from '@context/userContext'
import { activityContentValues } from '@context/activityType/constants/ui'
import { fireRealtime } from '@helpers/firebase'
import Logger from '@Utilities/logger'
import Presence from '@components/presence/Presence'

const { LOG, ERROR } = Logger('studentlanding')

//Code spliting
const DocumentsForm = loadable(() => import('../../documents/front/documentsLanding'))
const SpeakersForm = loadable(() => import('../speakers'))
const SurveyForm = loadable(() => import('../surveys'))
const FaqsForm = loadable(() => import('../../faqsLanding'))
const Partners = loadable(() => import('../Partners'))
const AgendaLandingSection = loadable(() => import('../AgendaLandingSection'))
const EventHome = loadable(() => import('../eventHome'))
const CertificateLandingPage = loadable(() => import('../CertificateLandingPage'))
const WallForm = loadable(() => import('../../wall/index'))
const Ferias = loadable(() => import('../ferias/index'))
// const VirtualConferenceBig = loadable(() => import('../virtualConferenceBig'))
const CertificadoLanding = loadable(() => import('../../certificates/cerLanding'))
const MyAgendaIndepend = loadable(() => import('../../networking/myAgendaIndepend'))
const NetworkingForm = loadable(() => import('../../networking'))
const InformativeSection2 = loadable(
  () => import('../informativeSections/informativeSection2'),
)
const InformativeSection = loadable(
  () => import('../informativeSections/informativeSection'),
)
const Noticias = loadable(() => import('../noticias'))
const Productos = loadable(() => import('../producto/index'))
const MessageRegister = loadable(() => import('../registrationForm/messageRegister'))
const ListVideoCard = loadable(() => import('../../shared/listVideoCard'))
const Videos = loadable(() => import('../videos'))
const InfoEvent = loadable(() => import('../../shared/InfoEvent'))
const ResponsePayu = loadable(() => import('../../shared/InfoEvent'))
const ActivityDisplayerPage = loadable(
  () => import('../activities/ActivityDisplayerPage'),
)
const MySection = loadable(() => import('../newSection'))
const ThisRouteCanBeDisplayed = loadable(
  () => import('./helpers/thisRouteCanBeDisplayed'),
)

type MapStateToProps = {
  viewVirtualconference: any
  viewSocialZoneNetworking: any
  sectionPermissions: any
}

const mapDispatchToProps = {
  setVirtualConference,
  setSpaceNetworking,
  setSectionPermissions,
}

type MapDispatchToProps = typeof mapDispatchToProps

interface IEventSectionRoutesProps extends MapStateToProps, MapDispatchToProps {
  generalTabs: { [key: string]: boolean }
  currentActivity: any
  eventProgressPercent: number
}

const EventSectionRoutes: FunctionComponent<
  WithEviusContextProps<IEventSectionRoutesProps>
> = (props) => {
  const { event_id, event_name } = useParams<{ event_id?: string; event_name?: string }>()
  const { GetPermissionsEvent } = useHelper()
  const cEventUser = useUserEvent()
  const cUser = useCurrentUser()

  const location = useLocation()

  const obtenerFirstSection = () => {
    if (props.cEvent.value == null) return
    const firstroute = Object.keys(props.cEvent.value.itemsMenu).filter(
      (item) => item !== 'tickets',
    )
    const firstrouteValues = Object.values(props.cEvent.value.itemsMenu as any[]).filter(
      (item: any) => item.section !== 'tickets',
    )

    let index = -1
    if (firstroute && firstrouteValues) {
      if (firstroute.length > 0 && firstrouteValues.length > 0) {
        for (let i = 0; i < firstrouteValues.length; i++) {
          if (firstrouteValues[i]?.position == '1') {
            index = i
            break
          }
        }
        if (index > -1) {
          return firstroute[index]
        } else {
          return firstroute[0]
        }
      }
    }
  }

  useEffect(() => {
    //presencia de usuario
    if (props.cEvent.value && cUser.value) {
      initUserPresence(props.cEvent.value)
    }
  }, [props.cEvent.value, cUser.value])

  useEffect(() => {
    // seperar la url en un arrary

    if (props.cEvent.value && props.currentActivity) {
      if (
        location.pathname !==
        `/landing/${props.cEvent.value._id}/activity/${props.currentActivity._id}`
      ) {
        initBroadcastViewers(
          props.cEvent.value._id,
          props.currentActivity._id,
          props.currentActivity.name,
          cUser,
          true,
        )
      }
    }
  }, [location.pathname])

  useEffect(() => {
    //presencia de usuario en la
    if (props.cEvent.value && props.currentActivity) {
      if (
        location.pathname ===
        `/landing/${props.cEvent.value._id}/activity/${props.currentActivity._id}`
      ) {
        if (props.currentActivity.type) {
          if (
            (props.currentActivity.type.name === activityContentValues.youtube ||
              props.currentActivity.type.name === activityContentValues.meet ||
              props.currentActivity.type.name === activityContentValues.rtmp ||
              props.currentActivity.type.name === activityContentValues.vimeo) &&
            props.currentActivity.habilitar_ingreso === 'open_meeting_room'
          ) {
            initBroadcastViewers(
              props.cEvent.value._id,
              props.currentActivity._id,
              props.currentActivity.name,
              cUser,
            )
          }
        }
      }
    }
  }, [
    props.cEvent.value,
    props.currentActivity?._id,
    props.currentActivity?.habilitar_ingreso,
  ])

  useEffect(() => {
    //presencia de usuario en la
    if (props.cEvent.value && props.currentActivity) {
      if (
        location.pathname ===
        `/landing/${props.cEvent.value._id}/activity/${props.currentActivity._id}`
      ) {
        if (props.currentActivity.type) {
          if (
            props.currentActivity.type.name === 'video' ||
            props.currentActivity.type.name === activityContentValues.url ||
            props.currentActivity.type.name === activityContentValues.meeting ||
            props.currentActivity.type.name === activityContentValues.file
          ) {
            initBroadcastViewers(
              props.cEvent.value._id,
              props.currentActivity._id,
              props.currentActivity.name,
              cUser,
            )
          }
        }
      }
    }
  }, [props.cEvent.value, props.currentActivity?._id])

  useEffect(() => {
    GetPermissionsEvent()
  }, [])

  useEffect(() => {
    if (cEventUser.value && props.cEvent.value) {
      if (props.cEvent.value.type_event !== 'physicalEvent') {
        checkinAttendeeInEvent(cEventUser.value, props.cEvent.value._id)
      }
    }
  }, [cEventUser.status, props.cEvent.value])

  const validateTypeUrl = () => {
    let url
    if (event_name) {
      url = `/event/${event_name}/${obtenerFirstSection()}`
    } else {
      url = `/landing/${event_id}/${obtenerFirstSection()}`
    }

    return url
  }

  return (
    <>
      {cUser.value?._id && event_id && (
        <Presence
          global
          data={{ eventId: event_id }}
          debuglog={LOG}
          errorlog={ERROR}
          realtimeDB={fireRealtime}
          collectionId={cUser.value._id}
        />
      )}
      {props.viewVirtualconference && (
        <>
          {props.cEvent.value?.styles?.show_title &&
            (props.cEvent.value?.styles.show_title ||
              props.cEvent.value?.styles?.show_title === 'true') && <InfoEvent />}
          {props.cEvent.value?.styles?.show_video_widget &&
            (props.cEvent.value?.styles?.show_video_widget ||
              props.cEvent.value?.styles?.show_video_widget === 'true') && (
              <ListVideoCard idevent={props.cEvent.value} />
            )}
        </>
      )}

      <Routes>
        <Route
          path={`/`}
          element={
            props.cEvent.value?.itemsMenu && (
              <>
                <Navigate to={validateTypeUrl()} />
              </>
            )
          }
        />

        <Route
          element={
            <ThisRouteCanBeDisplayed>
              <Outlet />
            </ThisRouteCanBeDisplayed>
          }
        >
          <Route
            path={`/certificate`}
            element={<CertificateLandingPage key="certificate" />}
          />
          <Route path={`/documents`} element={<DocumentsForm key="documents" />} />
          <Route path={`/interviews`} element={<MyAgendaIndepend key="interviews" />} />
          <Route path={`/networking`} element={<NetworkingForm key="networking" />} />
          <Route
            path={`/informativeSection1`}
            element={<InformativeSection2 key="informativeSection1" />}
          />
          <Route
            path={`/informativeSection`}
            element={<InformativeSection key="informativeSection" />}
          />
          <Route path={`/my_section`} element={<MySection key="my_section" />} />
          {/* TODO: socialzonetabs is no used */}
          <Route
            path={`/activity/:activity_id`}
            element={
              <ActivityDisplayerPage
                socialzonetabs={{
                  ...props?.generalTabs,
                }}
                key="activity"
              />
            }
          />
          <Route path={`/speakers`} element={<SpeakersForm key="speakers" />} />
          <Route path={`/survey`} element={<SurveyForm key="survey" />} />
          <Route path={`/partners`} element={<Partners key="partners" />} />
          <Route path={`/faqs`} element={<FaqsForm key="faqs" />} />
          <Route path={`/evento`} element={<EventHome key="evento" />} />
          <Route path={`/wall`} element={<WallForm key="wall" />} />
          <Route path={`/videos`} element={<Videos key="videos" />} />
          <Route path={`/ferias`} element={<Ferias key="ferias" />} />
          <Route path={`/noticias`} element={<Noticias key="noticias" />} />
          {/* <Route path={`/certs`}>
            <CertificadoLanding key="certs" />
        </Route> */}
          <Route path={`/producto`} element={<Productos key="producto" />} />
          <Route
            path={`/agenda`}
            element={
              <AgendaLandingSection
                key="agenda"
                activity={props.currentActivity}
                generalTabs={props.generalTabs}
                setVirtualConference={props.setVirtualConference}
              />
            }
          />
        </Route>

        <Route path={`/success/:type?`} element={<MessageRegister />} />
        <Route path={`/responsePayu`} element={<ResponsePayu />} />
      </Routes>
    </>
  )
}

const mapStateToProps = (state: any) => ({
  viewVirtualconference: state.virtualConferenceReducer.view,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
  sectionPermissions: state.viewSectionPermissions.view,
})

const eventSectionsContext = withContext<IEventSectionRoutesProps>(EventSectionRoutes)
export default connect(mapStateToProps, mapDispatchToProps)(eventSectionsContext)
