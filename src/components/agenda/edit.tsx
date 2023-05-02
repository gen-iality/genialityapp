import { useState, useContext, useEffect } from 'react'
import { Redirect, useLocation, useHistory } from 'react-router-dom'

import { Tabs, Row, Col, Form, Switch, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import AgendaContext from '@context/AgendaContext'
import Header from '@antdComponents/Header'
import BackTop from '@antdComponents/BackTop'
import { RouterPrompt } from '@antdComponents/RoutePrompt'
import { DispatchMessageService } from '@context/MessageService'

import { handleRequestError } from '@helpers/utils'
import { AgendaApi, DocumentsApi } from '@helpers/request'
import { firestore } from '@helpers/firebase'

import Loading from '../profile/loading'
import RoomController from './roomManager/RoomController'
import Service from './roomManager/service'

import TipeOfActivity from './typeActivity'
import SurveyManager from './surveyManager'
import MainAgendaForm, { FormDataType } from './components/MainAgendaForm'
import usePrepareRoomInfoData from './hooks/usePrepareRoomInfoData'
import useBuildInfo from './hooks/useBuildInfo'
import useValidForm from './hooks/useValidAgendaForm'
import useDeleteActivity from './hooks/useDeleteActivity'
import EventType from './types/EventType'
import AgendaType from '@Utilities/types/AgendaType'
import AgendaDocumentForm from './components/AgendaDocumentForm'

import ActivityContentSelector from './activityType/ActivityContentSelector'

import { hourWithAdditionalMinutes } from './hooks/useHourWithAdditionalMinutes'

const { TabPane } = Tabs
const { confirm } = Modal

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

interface LocationStateType {
  edit: string | null
}

export interface AgendaEditProps {
  event: EventType
  matchUrl: string
}

const initialInfoState: AgendaType = {
  name: '',
  module_id: undefined,
  subtitle: '',
  bigmaker_meeting_id: null,
  datetime_start: null,
  datetime_end: null,
  space_id: '',
  image: '',
  description: '',
  registration_message: '',
  capacity: 0,
  activity_categories_ids: [],
  access_restriction_type: 'OPEN',
  access_restriction_rol_ids: [],
  has_date: false,
  timeConference: 0,
  selected_document: [],
  meeting_id: '',
  vimeo_id: '',
  selectedTicket: [],
  platform: null,
  start_url: null,
  join_url: null,
  name_host: null,
  key: '',
  requires_registration: false,
  host_ids: [],
  tool_ids: [],
  length: '',
  latitude: '',
}

const initialFormDataState = {
  name: '',
  module_id: undefined,
  // date: Moment(new Date()).format('YYYY-MM-DD')??new Date().,
  date: `${new Date().getFullYear()}-${
    new Date().getMonth() + 1
  }-${new Date().getDate()}`,
  space_id: '',
  hour_end: hourWithAdditionalMinutes(5),
  hour_start: hourWithAdditionalMinutes(1),
  isPhysical: false,
  length: '',
  latitude: '',
  description: '',
  image: '',
  selectedRol: [],
  selectedHosts: [],
  selectedTools: [],
  selectedTickets: [],
  selectedDocuments: [],
  selectedCategories: [],
} as FormDataType

function AgendaEdit(props: AgendaEditProps) {
  const [currentActivityID, setCurrentActivityID] = useState<string | null>(null)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [currentTab, setCurrentTab] = useState('1')
  const [isLoading, setIsLoading] = useState(true)
  const [showPendingChangesModal, setShowPendingChangesModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  // const [avalibleGames, setAvalibleGames] = useState<any[]>([]); // Used in Games
  const [service] = useState(new Service(firestore))

  const [loadedAgenda, setLoadedAgenda] = useState<AgendaType | null>(null)
  const [formdata, setFormData] = useState<FormDataType>(initialFormDataState)
  const [savedFormData, setSavedFormData] = useState<FormDataType>({} as FormDataType)

  /**
   * This states are used as config, I think...
   */
  // const [chat, setChat] = useState<boolean>(false);
  // const [surveys, setSurveys] = useState<boolean>(false);
  // const [games, setGames] = useState<boolean>(false);
  // const [attendees, setAttendees] = useState<boolean>(false);

  const agendaContext = useContext(AgendaContext)

  const location = useLocation<LocationStateType>()
  const history = useHistory()

  const buildInfo = useBuildInfo(formdata, loadedAgenda, initialInfoState)
  const deleteActivity = useDeleteActivity()
  const validForm = useValidForm(formdata)

  useEffect(() => {
    /**
     * This method will load data from API and will save in formdata, and info.
     *
     * It is needed save in formdata to show the info in the page.
     */
    const loading = async () => {
      // Check if the previous page passed an activity_id via route state.
      if (location.state?.edit) {
        setIsEditing(true) // We are editing
        // Update the activityEdit of agendaContext from passed activity_id
        agendaContext.setActivityEdit(location.state.edit)

        // Get the agenda document from current activity_id
        const agendaInfo: AgendaType = await AgendaApi.getOne(
          location.state.edit,
          props.event._id,
        )
        console.log('agendaInfo', agendaInfo)

        // Take the vimeo_id and save in info.
        const vimeo_id = props.event.vimeo_id ? props.event.vimeo_id : ''
        setLoadedAgenda({
          ...agendaInfo,
          vimeo_id,
          space_id: agendaInfo.space_id || '',
          requires_registration: agendaInfo.requires_registration || false,
        })

        // Save the activity name
        agendaContext.setActivityName(agendaInfo.name)

        // Object.keys(this.state).map((key) => (agendaInfo[key] ? this.setState({ [key]: agendaInfo[key] }) : ''));
        // Edit the current activity ID from passed activity ID via route
        setCurrentActivityID(location.state.edit)
      }

      await validateRoom()
      setIsLoading(false)
    }

    loading().then()

    // This function is running when the component will unmount
    return () => {
      agendaContext.setActivityEdit(null)
    }
  }, [props.event])

  // This exists to enable to call saveConfig (who reads from AgendaContext),
  // when the AgendaContext data are written.
  // NOTE: AgendaContext has a method called saveConfig, but the old edit.jsx
  //       had its own implementation of saveConfig. So confusing!
  useEffect(() => {
    saveConfig()
  }, [agendaContext.isPublished])

  const validateRoom = async () => {
    const activityId = agendaContext.activityEdit
    const hasVideoconference = await service.validateHasVideoconference(
      props.event._id,
      activityId,
    )

    if (hasVideoconference) {
      const configuration = await service.getConfiguration(props.event._id, activityId)
      setFormData((previous) => ({
        ...previous,
        platform: configuration.platform || null,
        meeting_id: configuration.meeting_id || null,
        host_id: configuration.host_id || null,
      }))

      if (loadedAgenda !== null) {
        setLoadedAgenda(loadedAgenda)
      }

      // setAvalibleGames(configuration.avalibleGames || []);
      // setChat(configuration.tabs && configuration.tabs.chat ? configuration.tabs.chat : false);
      // setSurveys(configuration.tabs && configuration.tabs.surveys ? configuration.tabs.surveys : false);
      // setGames(configuration.tabs && configuration.tabs.games ? configuration.tabs.games : false);
      // setAttendees(configuration.tabs && configuration.tabs.attendees ? configuration.tabs.attendees : false);
    }
  }

  const submit = async (changePathWithoutSaving: boolean) => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    })

    if (validForm()) {
      // Save the activity name
      agendaContext.setActivityName(formdata.name)
      try {
        const builtInfo = buildInfo()
        console.debug('builtInfo final:', builtInfo)
        // setIsLoading(true);
        let agenda: AgendaType | null = null
        if (location.state.edit || currentActivityID) {
          const data = {
            activity_id: location.state.edit || currentActivityID,
          }
          const edit = location.state.edit || currentActivityID
          await AgendaApi.editOne(builtInfo, edit, props.event._id)

          await Promise.all(
            builtInfo.selected_document.map((selected) =>
              DocumentsApi.editOne(data, selected, props.event._id),
            ),
          )
        } else {
          agenda = await AgendaApi.create(props.event._id, builtInfo)
          setLoadedAgenda(agenda)
        }
        if (changePathWithoutSaving) setShowPendingChangesModal(false)

        DispatchMessageService({
          action: 'destroy',
          type: 'loading',
          key: 'loading',
          msj: '',
        })

        if (agenda?._id) {
          /** Si es un evento recien creado se envia a la misma ruta con el
           * estado edit el cual tiene el id de la actividad para poder editar
           * */
          console.debug('created agenda is used from origin')
          agendaContext.setActivityEdit(agenda._id)
          setCurrentActivityID(agenda._id)
          setIsEditing(true)

          agendaContext.setIsPublished(true)

          setLoadedAgenda(agenda)
          await saveConfig()
        } else if (changePathWithoutSaving) {
          history.push(`${props.matchUrl}`)
        }
        DispatchMessageService({
          msj: 'Información guardada correctamente!',
          type: 'success',
          action: 'show',
        })
      } catch (e) {
        DispatchMessageService({
          action: 'destroy',
          type: 'loading',
          key: 'loading',
          msj: '',
        })
        DispatchMessageService({
          msj: handleRequestError(e).message,
          type: 'error',
          action: 'show',
        })
      }
    }
  }

  const remove = async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras borra la información...',
      action: 'show',
    })
    if (currentActivityID && loadedAgenda) {
      confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          deleteActivity(props.event._id, currentActivityID, loadedAgenda.name).then(
            () => {
              setShouldRedirect(true)
              history.push(`${props.matchUrl}`)
            },
          )
        },
      })
    }
  }

  const handleDocumentChange = (value: any) => {
    setFormData((previous) => ({ ...previous, selectedDocuments: value || [] }))
  }

  // Método para guarda la información de la configuración
  const saveConfig = async () => {
    const { roomInfo, tabs } = usePrepareRoomInfoData(agendaContext)
    const activity_id = agendaContext.activityEdit || currentActivityID
    try {
      const result = await service.createOrUpdateActivity(
        props.event._id,
        activity_id,
        roomInfo,
        tabs,
      )
      if (result) {
        DispatchMessageService({ msj: result.message, type: 'success', action: 'show' })
      }
      return result
    } catch (err) {
      DispatchMessageService({
        msj: 'Error en la configuración!',
        type: 'error',
        action: 'show',
      })
    }
  }

  if (!location.state || shouldRedirect) return <Redirect to={props.matchUrl} />

  return (
    <>
      <Form onFinish={() => submit(true)} {...formLayout}>
        <RouterPrompt
          save
          form={false}
          when={showPendingChangesModal}
          title="Tienes cambios sin guardar."
          description="¿Qué deseas hacer?"
          okText="No guardar"
          okSaveText="Guardar"
          cancelText="Cancelar"
          onOK={() => true}
          onOKSave={submit}
          onCancel={() => false}
        />

        <Header
          back
          save
          form
          saveNameIcon
          remove={remove}
          customBack={props.matchUrl}
          title={formdata.name ? `Actividad - ${formdata.name}` : 'Actividad'}
          saveName={location.state.edit || currentActivityID ? '' : 'Crear'}
          edit={location.state.edit || currentActivityID || undefined}
          extra={
            isEditing && (
              <Form.Item label="Publicar" labelCol={{ span: 14 }}>
                <Switch
                  checkedChildren="Sí"
                  unCheckedChildren="No"
                  checked={agendaContext.isPublished}
                  onChange={(value) => {
                    agendaContext.setIsPublished(value)
                    // saveConfig(); did by useEffect (isPublished)
                  }}
                />
              </Form.Item>
            )
          }
        />

        {/*
      This is hidden during loading
      */}

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
              <TabPane tab="Agenda" key="1">
                {/*
          This component will handle the formdata and save the data using
          the provided methods:
          */}
                <MainAgendaForm
                  event={props.event}
                  activityId={currentActivityID}
                  formdata={formdata}
                  agenda={loadedAgenda}
                  savedFormData={savedFormData}
                  setFormData={(a: FormDataType) => setFormData(a)}
                  previousFormData={formdata}
                  setShowPendingChangesModal={setShowPendingChangesModal}
                  agendaContext={agendaContext}
                  matchUrl={props.matchUrl}
                />
              </TabPane>

              {/*
        If the agenda is editing, this section gets be showed:
        */}

              {isEditing && (
                <>
                  <TabPane tab="Contenido" key="2">
                    <Row wrap gutter={12}>
                      <Col span={24}>
                        {currentActivityID && (
                          <ActivityContentSelector
                            activityId={currentActivityID}
                            activityName={formdata.name}
                            eventId={props.event._id}
                            shouldLoad={currentTab === '2'}
                            matchUrl={props.matchUrl}
                          />
                        )}
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Juegos" key="3">
                    <Row justify="center" wrap gutter={12}>
                      <Col span={20}>
                        <RoomController />
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Encuestas" key="4">
                    <Row justify="center" wrap gutter={12}>
                      <Col span={20}>
                        <SurveyManager
                          event_id={props.event._id}
                          activity_id={currentActivityID}
                          canSendComunications={props.event?.sms_notification}
                        />
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="Documentos" key="5">
                    <Row justify="center" wrap gutter={12}>
                      <Col span={20}>
                        <Form.Item>
                          <AgendaDocumentForm
                            eventId={props.event._id}
                            selectedDocuments={formdata.selectedDocuments}
                            onSelectedDocuments={(changed) =>
                              handleDocumentChange(changed)
                            }
                            matchUrl={props.matchUrl}
                          />
                        </Form.Item>
                        <BackTop />
                      </Col>
                    </Row>
                  </TabPane>
                </>
              )}
            </Tabs>
          </>
        )}
      </Form>
    </>
  )
}

export default AgendaEdit
