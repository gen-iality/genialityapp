import { useState, useEffect, useMemo, type FunctionComponent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import Moment from 'moment-timezone'
import { FormattedMessage } from 'react-intl'
import { Card, Col, Button, Row, Result, Alert, Spin } from 'antd'
import { AgendaApi } from '@helpers/request'
import { setVirtualConference } from '../../../redux/virtualconference/actions'
import { useHelper } from '@context/helperContext/hooks/useHelper'

import * as SurveyActions from '../../../redux/survey/actions'
import ActivityDisplayer from './ActivityDisplayer'
import AditionalInformation from './AditionalInformation'
import { checkinAttendeeInActivity } from '@helpers/HelperAuth'
import { useUserEvent } from '@context/eventUserContext'
import { useEventContext } from '@context/eventContext'
import { useCurrentUser } from '@context/userContext'
import { PreloaderApp } from '@/PreloaderApp/PreloaderApp'
import Presence from '@components/presence/Presence'
import { fireRealtime } from '@helpers/firebase'
import Logger from '@Utilities/logger'
import { ArrowLeftOutlined, ArrowRightOutlined, LoadingOutlined } from '@ant-design/icons'
import { useEventProgress } from '@context/eventProgressContext'
import { StateMessage } from '@context/MessageService'
import { FB } from '@helpers/firestore-request'
import useIsDevOrStage from '@/hooks/useIsDevOrStage'
import { AvailableContentType } from '@components/agenda/activityType/ActivityContentSelector2'

const { setHasOpenSurveys } = SurveyActions

const { LOG, ERROR } = Logger('studentlanding-activity')

Moment.locale(window.navigator.language)

const ActivityDisplayerPage: FunctionComponent = (props) => {
  const { HandleOpenCloseMenuRigth, currentActivity, helperDispatch } = useHelper()
  const [orderedHost, setOrderedHost] = useState<any[]>([])
  // const [videoStyles, setVideoStyles] = useState<any>(null)
  // const [videoButtonStyles, setVideoButtonStyles] = useState<any>(null)
  // const [blockActivity, setBlockActivity] = useState(false)
  const [activity, setActivity] = useState<any>(null)
  const [nextActivityID, setNextActivityID] = useState<any>(null)
  const [previousActivityID, setPreviousctivityID] = useState<any>(null)

  const [wasNotifiedForProgress, setWasNotifiedForProgress] = useState(false)

  const cUser = useCurrentUser()
  const cEventUser = useUserEvent()
  const cEvent = useEventContext()
  // const cSurveys = useSurveysContext()
  const navigate = useNavigate()

  const params = useParams<any>()

  const cEventProgress = useEventProgress()

  const activityProgressCallback = (progress: any) => {
    const percentajeRequired =
      cEvent.value?.progress_settings?.lesson_percent_to_completed ?? 0

    console.debug('percentajeRequired:', percentajeRequired, 'current:', progress)

    if (progress >= percentajeRequired) {
      console.debug(
        'call activityProgressCallback with progress:',
        progress,
        'and percentajeRequired:',
        percentajeRequired,
      )
      checkinAttendeeInActivity(cEventUser.value, params?.activity_id).then((info) => {
        console.log('attendee creating/updating:', info)
        if (!wasNotifiedForProgress) {
          StateMessage.show(null, 'success', 'Actividad marcada como vista', 3)
        }
        setWasNotifiedForProgress(true)
      })
      // Request to update the attendees
      cEventProgress.updateRawAttendees()
      cEventProgress.addViewedActivity(currentActivity._id)
    }
  }

  useEffect(() => {
    if (!params.activity_id) return

    let unsubscribe: null | (() => void) = null

    FB.Activities.ref(cEvent.value._id, params.activity_id).onSnapshot((snapshot) => {
      setActivity((previous: any) => ({
        ...previous,
        isPublished: snapshot.data()?.isPublished,
        publishingStatusLoaded: true,
      }))
    })

    return () => {
      typeof unsubscribe === 'function' && unsubscribe()
    }
  }, [params.activity_id])

  useEffect(() => {
    AgendaApi.getOne(params.activity_id, cEvent.value._id).then((result) => {
      console.debug('AgendaApi.getOne:', result)
      helperDispatch({ type: 'currentActivity', currentActivity: result })
      setActivity((previous: any) => ({ ...previous, ...result }))
      setOrderedHost((result.hosts as any[]).sort((a, b) => a.order - b.order))
    })

    if (cEvent?.value?.is_socialzone_opened) {
      HandleOpenCloseMenuRigth(false)
    } else {
      HandleOpenCloseMenuRigth(true)
    }

    // Get the next activity ID to able creating the next activity link
    AgendaApi.byEvent(cEvent?.value._id).then(({ data: allEventActivities }) => {
      const currentActivityId = params.activity_id
      const currentActivityObject = (allEventActivities as any[]).find(
        (eventActivity) => eventActivity._id === currentActivityId,
      )
      const currentIndex = allEventActivities.indexOf(currentActivityObject)

      const nextIndex = currentIndex + 1
      const nextActivityObject = allEventActivities[nextIndex]
      if (nextActivityObject) {
        setNextActivityID(nextActivityObject._id)
      }

      const previousIndex = currentIndex - 1
      const previousActivityObject = allEventActivities[previousIndex]
      if (previousActivityObject) {
        setPreviousctivityID(previousActivityObject._id)
      }
    })

    return () => {
      props.setVirtualConference(true)
      HandleOpenCloseMenuRigth(true)
      helperDispatch({ type: 'currentActivity', currentActivity: null })
      setActivity(null)
    }
  }, [params.activity_id])

  useEffect(() => {
    if (!currentActivity) return
    if (cEventUser.status == 'LOADED' && cEventUser.value != null) {
      // ONLY the video type ones which are vimeo_url has the percent progressing system
      // (Maybe youtube_url too, BUT nobody did load a video from youtube and set a minimum percent yet)
      if (
        !['video'].includes(currentActivity.type?.name) &&
        (currentActivity.content?.type as AvailableContentType) !== 'vimeo_url'
      ) {
        console.debug(
          'auto-call to activityProgressCallback bc activity type:',
          currentActivity.type,
          { currentActivity },
        )
        activityProgressCallback(100)
      }
    }
  }, [currentActivity, cEventUser.status])

  useEffect(() => {
    console.debug('activity:', activity)
  }, [activity])

  const goToActivityIdPage = async (activityId: string) => {
    navigate(`/landing/${cEvent?.value._id}/activity/${activityId}`)
  }

  const thisActivityRequiresCompletion = useMemo(() => {
    if (!activity) return false
    if (cEventProgress.progressFilteredActivities === undefined) return false
    if (activity.require_completion === undefined) return false
    if (activity.require_completion === null) return false

    if (activity.require_completion >= cEventProgress.progressFilteredActivities)
      return true
    return false
  }, [activity, cEventProgress.progressFilteredActivities])

  const thisActivityRequiresAttendeeType = useMemo(() => {
    if (!activity) return false
    if (cEventUser.value?.properties?.tipoDeAsistente === 'live') return true
    else return false
  }, [activity])

  if (!!activity && !activity.isPublished) {
    if (cEventUser.value?.rol?.type !== 'admin') {
      if (!activity.publishingStatusLoaded) {
        return (
          <Result
            status="info"
            title="Cargando datos..."
            subTitle="Esto puede demorar según tu conexión a Internet"
            icon={<LoadingOutlined />}
          />
        )
      }

      return (
        <Result
          status="403"
          title="Actividad no disponible"
          subTitle="No puedes entrar a esta actividad por ningún medio"
        />
      )
    }
  }

  const { isNotProd } = useIsDevOrStage()

  return (
    <div>
      {isNotProd &&
        activity &&
        JSON.stringify({ content: activity.content, type: activity.type })}
      {!!activity && !activity.isPublished && cEventUser.value?.rol?.type === 'admin' && (
        <Alert
          type="warning"
          message="Esta actividad no está publicada para usuarios normales"
        />
      )}
      {cUser.value?._id && cEvent.value?._id && activity?._id && (
        <Presence
          data={{ eventId: cEvent.value._id, activityId: activity._id, type: 'activity' }}
          debuglog={LOG}
          errorlog={ERROR}
          realtimeDB={fireRealtime}
          collectionId={cUser.value._id}
        />
      )}
      <div className=" container_agenda-information container-calendar2">
        <Card style={{ padding: '1 !important' }} className="agenda_information">
          {activity?.type === undefined ? (
            <PreloaderApp />
          ) : thisActivityRequiresCompletion ? (
            <Result
              status="403"
              title="Esta sección está bloqueado"
              subTitle="Se requiere avanzar más en el curso para habilitar esta sección"
            />
          ) : thisActivityRequiresAttendeeType ? (
            <Result
              //status="403"
              title="No tienes acceso a esta actividad"
              subTitle="Comunicate con el administrador del curso"
            />
          ) : (
            <ActivityDisplayer
              activity={activity}
              onActivityProgress={activityProgressCallback}
            />
          )}
          <Row gutter={[8, 8]} justify="end">
            {previousActivityID && (
              <Col>
                <Button
                  style={{ marginTop: '1rem' }}
                  type="primary"
                  size="large"
                  onClick={() => goToActivityIdPage(previousActivityID)}
                >
                  <ArrowLeftOutlined />
                  <FormattedMessage
                    id="activity.button.previous"
                    defaultMessage="Anterior"
                  />
                </Button>
              </Col>
            )}
            {nextActivityID && (
              <Col>
                <Button
                  style={{ marginTop: '1rem' }}
                  type="primary"
                  size="large"
                  onClick={() => goToActivityIdPage(nextActivityID)}
                >
                  <FormattedMessage
                    id="activity.button.next"
                    defaultMessage="Siguiente"
                  />
                  <ArrowRightOutlined />
                </Button>
              </Col>
            )}
          </Row>

          <AditionalInformation orderedHost={orderedHost} />
        </Card>
      </div>
    </div>
  )
}

const mapStateToProps = (state: any) => ({
  mainStageContent: state.stage.data.mainStage,
  userInfo: state.user.data,
  currentActivity: state.stage.data.currentActivity,
  currentSurvey: state.survey.data.currentSurvey,
  hasOpenSurveys: state.survey.data.hasOpenSurveys,
  tabs: state.stage.data.tabs,
  generalTabs: state.tabs.generalTabs,
  permissions: state.permissions,
  isVisible: state.survey.data.surveyVisible,
  viewSocialZoneNetworking: state.spaceNetworkingReducer.view,
})

const mapDispatchToProps = {
  setVirtualConference,
  setHasOpenSurveys,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDisplayerPage)