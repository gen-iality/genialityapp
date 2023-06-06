import { useEffect, useMemo, useState } from 'react'
import { Redirect, Route, Switch, useLocation, useRouteMatch } from 'react-router-dom'
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
import withContext from '@context/withContext'
import { useCurrentUser } from '@context/userContext'
import { activityContentValues } from '@context/activityType/constants/ui'
import { fireRealtime, firestore } from '@helpers/firebase'
import Logger from '@Utilities/logger'
import Presence from '@components/presence/Presence'
import { ExtendedAgendaType } from '@Utilities/types/AgendaType'
import { AgendaApi } from '@helpers/request'

const { LOG, ERROR } = Logger('studentlanding')

//Code spliting
const DocumentsForm = loadable(() => import('../../documents/front/documentsLanding'))
const SpeakersForm = loadable(() => import('../speakers'))
const SurveyForm = loadable(() => import('../surveys'))
const FaqsForm = loadable(() => import('../../faqsLanding'))
const Partners = loadable(() => import('../Partners'))
const AgendaLanding = loadable(() => import('../agendaLanding'))
const EventHome = loadable(() => import('../eventHome'))
const Certificate = loadable(() => import('../certificate'))
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

const EventSectionRoutes = (props) => {
  const { path } = useRouteMatch()
  const { event_id, event_name } = useParams()
  const { GetPermissionsEvent } = useHelper()
  const cEventUser = useUserEvent()
  const cUser = useCurrentUser()

  const [activitiesAttendee, setActivitiesAttendee] = useState<any[]>([])
  const [allActivities, setAllActivities] = useState<any[]>([])

  const location = useLocation()

  const obtenerFirstSection = () => {
    if (props.cEvent.value == null) return
    const firstroute = Object.keys(props.cEvent.value.itemsMenu).filter(
      (item) => item !== 'tickets',
    )
    const firstrouteValues = Object.values(props.cEvent.value.itemsMenu).filter(
      (item) => item.section !== 'tickets',
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

  const activityFilter = (a: any) =>
    [activityContentValues.quizing, activityContentValues.survey].includes(a.type?.name)

  // This can be a context or well
  useEffect(() => {
    if (!props.cEvent.value) return

    setActivitiesAttendee([])
    const loadData = async () => {
      const { data }: { data: ExtendedAgendaType[] } = await AgendaApi.byEvent(
        props.cEvent.value._id,
      )
      const filteredData = data
        .filter(activityFilter)
        .filter((activity) => !activity.is_info_only)
      setAllActivities(filteredData)
      const existentActivities = filteredData.map(async (activity) => {
        const activityAttendee = await firestore
          .collection(`${activity._id}_event_attendees`)
          .doc(cEventUser.value._id)
          .get() //checkedin_at
        if (activityAttendee.exists) return activityAttendee.data() as any
        return null
      })
      // Filter existent activities and set the state
      setActivitiesAttendee(
        // Promises don't bite :)
        (await Promise.all(existentActivities)).filter((item) => !!item),
      )
    }
    loadData().then()
  }, [props.cEvent.value])

  const eventProgressPercent: number = useMemo(
    () =>
      Math.round(((activitiesAttendee.length || 0) / (allActivities.length || 0)) * 100),
    [activitiesAttendee, allActivities],
  )

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

      <Switch>
        <Route exact path={`${path}/`}>
          {props.cEvent.value?.itemsMenu && <Redirect to={validateTypeUrl()} />}
        </Route>

        <Route path={`${path}/certificate`}>
          <ThisRouteCanBeDisplayed>
            <Certificate key="certificate" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/documents`}>
          <ThisRouteCanBeDisplayed>
            <DocumentsForm key="documents" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/interviews`}>
          <ThisRouteCanBeDisplayed>
            <MyAgendaIndepend key="interviews" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/networking`}>
          <ThisRouteCanBeDisplayed>
            <NetworkingForm key="networking" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/informativeSection1`}>
          <ThisRouteCanBeDisplayed>
            <InformativeSection2 key="informativeSection1" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/informativeSection`}>
          <ThisRouteCanBeDisplayed>
            <InformativeSection key="informativeSection" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/my_section`}>
          <ThisRouteCanBeDisplayed>
            <MySection key="my_section" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/activity/:activity_id`}>
          <ThisRouteCanBeDisplayed>
            <ActivityDisplayerPage
              socialzonetabs={{
                ...props?.generaltabs,
              }}
              key="activity"
              eventProgressPercent={eventProgressPercent}
            />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/speakers`}>
          <ThisRouteCanBeDisplayed>
            <SpeakersForm key="speakers" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/survey`}>
          <ThisRouteCanBeDisplayed>
            <SurveyForm key="survey" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/partners`}>
          <ThisRouteCanBeDisplayed>
            <Partners key="partners" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/faqs`}>
          <ThisRouteCanBeDisplayed>
            <FaqsForm key="faqs" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/evento`}>
          <ThisRouteCanBeDisplayed>
            <EventHome key="evento" eventProgressPercent={eventProgressPercent} />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/wall`}>
          <ThisRouteCanBeDisplayed>
            <WallForm key="wall" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/videos`}>
          <ThisRouteCanBeDisplayed>
            <Videos key="videos" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/ferias`}>
          <ThisRouteCanBeDisplayed>
            <Ferias key="ferias" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/noticias`}>
          <ThisRouteCanBeDisplayed>
            <Noticias key="noticias" />
          </ThisRouteCanBeDisplayed>
        </Route>

        <Route path={`${path}/certs`}>
          <ThisRouteCanBeDisplayed>
            <CertificadoLanding key="certs" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/producto`}>
          <ThisRouteCanBeDisplayed>
            <Productos key="producto" />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/agenda`}>
          <ThisRouteCanBeDisplayed>
            <AgendaLanding
              key="agenda"
              activity={props.currentActivity}
              generalTabs={props.generalTabs}
              setVirtualConference={props.setVirtualConference}
              eventProgressPercent={eventProgressPercent}
            />
          </ThisRouteCanBeDisplayed>
        </Route>
        <Route path={`${path}/success/:type?`}>
          <MessageRegister />
        </Route>
        <Route path={`${path}/responsePayu`}>
          <ResponsePayu />
        </Route>
      </Switch>
    </>
  )
}

const mapStateToProps = (state) => ({
  viewVirtualconference: state.virtualConferenceReducer.view,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
  sectionPermissions: state.viewSectionPermissions.view,
})

const mapDispatchToProps = {
  setVirtualConference,
  setSpaceNetworking,
  setSectionPermissions,
}

const eventSectionsContext = withContext(EventSectionRoutes)
export default connect(mapStateToProps, mapDispatchToProps)(eventSectionsContext)
