import { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import Moment from 'moment-timezone'
import { useIntl } from 'react-intl'
import { Card, Col, Button, Row } from 'antd'
import { setTopBanner } from '../../../redux/topBanner/actions'
import { AgendaApi } from '@helpers/request'
import { setVirtualConference } from '../../../redux/virtualconference/actions'
import { useHelper } from '@context/helperContext/hooks/useHelper'
// import { useSurveysContext } from '@context/surveysContext'
import { isMobile } from 'react-device-detect'
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
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

const { setHasOpenSurveys } = SurveyActions

const { LOG, ERROR } = Logger('studentlanding-activity')

interface IActivityDisplayerPageProps {}

const ActivityDisplayerPage = (props: IActivityDisplayerPageProps) => {
  const { chatAttendeChats, HandleOpenCloseMenuRigth, currentActivity, helperDispatch } =
    useHelper()
  const [orderedHost, setOrderedHost] = useState<any[]>([])
  // const [videoStyles, setVideoStyles] = useState<any>(null)
  // const [videoButtonStyles, setVideoButtonStyles] = useState<any>(null)
  // const [blockActivity, setBlockActivity] = useState(false)
  const [activity, setActivity] = useState<any>(null)
  const [nextActivityID, setNextActivityID] = useState<any>(null)
  const [previousActivityID, setPreviousctivityID] = useState<any>(null)

  const cUser = useCurrentUser()
  const cEventUser = useUserEvent()
  const cEvent = useEventContext()
  // const cSurveys = useSurveysContext()
  const history = useHistory()

  const params = useParams<any>()

  const intl = useIntl()
  {
    Moment.locale(window.navigator.language)
  }

  useEffect(() => {
    async function getActividad() {
      return await AgendaApi.getOne(params.activity_id, cEvent.value._id)
    }

    function orderHost(hosts: any[]) {
      hosts.sort(function (a, b) {
        return a.order - b.order
      })
      setOrderedHost(hosts)
    }

    getActividad().then((result) => {
      helperDispatch({ type: 'currentActivity', currentActivity: result })
      setActivity(result)
      orderHost(result.hosts)
      // cSurveys.set_current_activity(result)
    })

    props.setTopBanner(false)
    props.setVirtualConference(false)

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
      const currentActivityIndex = allEventActivities.indexOf(currentActivityObject)

      const nextActivityIndex = currentActivityIndex + 1
      const nextActivityObject = allEventActivities[nextActivityIndex]
      if (nextActivityObject) {
        setNextActivityID(nextActivityObject._id)
      }

      const previousActivityIndex = currentActivityIndex - 1
      const previousActivityObject = allEventActivities[previousActivityIndex]
      if (previousActivityObject) {
        setPreviousctivityID(previousActivityObject._id)
      }
    })

    return () => {
      props.setTopBanner(true)
      props.setVirtualConference(true)
      HandleOpenCloseMenuRigth(true)
      helperDispatch({ type: 'currentActivity', currentActivity: null })
      setActivity(null)
    }
  }, [params.activity_id])

  useEffect(() => {
    if (!currentActivity) return
    if (cEventUser.status == 'LOADED' && cEventUser.value != null) {
      // cSurveys.set_current_activity(currentActivity)
      console.log('cEvent.value.type_event', cEvent.value.type_event)
      // if (cEvent.value.type_event === 'onlineEvent') {
      //   console.log('Haciendo checking en la actividad');
      checkinAttendeeInActivity(cEventUser.value, params.activity_id)
      // }
    }
  }, [currentActivity, cEventUser.status])

  useEffect(() => {
    if (chatAttendeChats === '4') {
      // const sharedProperties = {
      //   position: 'fixed',
      //   right: '0',
      //   width: '170px',
      // }
      // const verticalVideo = isMobile ? { top: '5%' } : { bottom: '0' }
      // setVideoStyles({
      //   ...sharedProperties,
      //   ...verticalVideo,
      //   zIndex: '100',
      //   transition: '300ms',
      // })
      // const verticalVideoButton = isMobile ? { top: '9%' } : { bottom: '27px' }
      // setVideoButtonStyles({
      //   ...sharedProperties,
      //   ...verticalVideoButton,
      //   zIndex: '101',
      //   cursor: 'pointer',
      //   display: 'block',
      //   height: '96px',
      // })
    } else {
      // setVideoStyles({ width: '100%', height: '80vh', transition: '300ms' })
      // setVideoButtonStyles({ display: 'none' })
    }
  }, [chatAttendeChats, isMobile])

  // Validar lecciones por codigo
  useEffect(() => {
    if (cEvent.value && cUser.value) {
      // setBlockActivity(false)
    }
  }, [cEvent.value, cEventUser.value, cUser.value])

  const goToActivityIdPage = async (activityId: string) => {
    history.push(`/landing/${cEvent?.value._id}/activity/${activityId}`)
  }

  // {activity.type === undefined ? (<PreloaderApp />) : (<HCOActividad activity={activity}/>)}
  return (
    <div>
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
          ) : (
            <ActivityDisplayer activity={activity} />
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
                  {intl.formatMessage({
                    id: 'activity.button.previous',
                    defaultMessage: 'Anterior',
                  })}
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
                  {intl.formatMessage({
                    id: 'activity.button.next',
                    defaultMessage: 'Siguiente',
                  })}
                  <ArrowRightOutlined />
                </Button>
              </Col>
            )}
          </Row>

          <AditionalInformation orderedHost={orderedHost} />
        </Card>
      </div>
      {/* Drawer encuestas */}
      {/* <SurveyDrawer colorFondo={cEvent.value.styles.toolbarDefaultBg} colorTexto={cEvent.value.styles.textMenu} /> */}
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
  setTopBanner,
  setVirtualConference,
  setHasOpenSurveys,
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityDisplayerPage)
