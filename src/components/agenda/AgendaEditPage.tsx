/**
 * This module define the component `AgendaEditPage`, and some internal interfaces.
 */

import * as React from 'react'

import {
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react'

import {
  Form,
  Tabs,
  Col,
  Row,
  Switch,
  Modal,
  BackTop,
} from 'antd'

import Header from '@antdComponents/Header'
import { RouterPrompt } from '@antdComponents/RoutePrompt'
import { DispatchMessageService } from '@context/MessageService'
import Loading from '../profile/loading'

import { Redirect, useHistory, useLocation } from 'react-router'

import AgendaContext from '@context/AgendaContext'
import { AgendaApi, DocumentsApi } from '@helpers/request'
import AgendaType from '@Utilities/types/AgendaType'
import AgendaForm, { FormValues } from './components/AgendaForm'
import dayjs from 'dayjs'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import useDeleteActivity from './hooks/useDeleteActivity'
import AgendaDocumentForm from './components/AgendaDocumentForm'
import ActivityContentSelector from './activityType/ActivityContentSelector'

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

interface LocationStateType {
  edit?: string,
}

interface IAgendaEditPageProps {
  event: any,
  matchUrl: string,
}

/**
 * Create a page component that enable create/edit an activity.
 * 
 * This component needs to check the location state for the prop `edit` to know
 * if it is needed edit an activity. If this location prop is empty, then the
 * page will config itself to create a new activity.
 * 
 * @param props the props.
 * @returns A React component that enable to edit stuffs of an activity.
 */
const AgendaEditPage: React.FunctionComponent<IAgendaEditPageProps> = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [currentTab, setCurrentTab] = useState('1')
  const [isNeededConfirmRedirection, setIsNeededConfirmRedirection] = useState(false)

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  const [currentAgenda, setCurrentAgenda] = useState<AgendaType | undefined>()

  const [savedForm, setSavedForm] = useState<any>({})

  const [form] = Form.useForm<FormValues>()

  const history = useHistory()
  const location = useLocation<LocationStateType>()

  const deleteActivity = useDeleteActivity()

  const cAgenda = useContext(AgendaContext)

  /**
   * Take the form data and submit to Back-End.
   * 
   * Note: Some vars should be preprocessed before to submit.
   * 
   * @param values Data from the form.
   * @param changePathWithoutSaving If the path should be changed.
   */
  const onFinish = useCallback(async (values: FormValues, changePathWithoutSaving: boolean) => {
    if (currentTab !== '1') {
      setCurrentTab('1')
      setTimeout(() => form.submit(), 2000)
      return
    }
    console.log('form submiting:', { values })
    // Fix the datetime values
    values.datetime_start = values.date + ' ' + dayjs(values.hour_start).format('HH:mm')
    values.datetime_end = values.date + ' ' + dayjs(values.hour_end).format('HH:mm')
    values.selected_document = selectedDocuments

    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    })

    let _agenda: AgendaType | undefined = undefined
    if (location.state?.edit || currentAgenda?._id) {
      const activityId = location.state?.edit || currentAgenda?._id
      await AgendaApi.editOne(values, activityId, props.event._id)
      console.log('agenda edited')
      
      const payloadForDocument = {
        activity_id: location.state?.edit || currentAgenda?._id,
      }
      console.log('will save', selectedDocuments.length, 'selectedDocuments:', values.selected_document)
      await Promise.all(
        selectedDocuments.map((selected) => DocumentsApi.editOne(payloadForDocument, selected, props.event._id)),
      );
    } else {
      _agenda = await AgendaApi.create(props.event._id, values)
      setCurrentAgenda(_agenda)
      console.log('agenda created')
    }

    console.debug('changePathWithoutSaving:', changePathWithoutSaving)
    if (changePathWithoutSaving) {
      setIsNeededConfirmRedirection(false)
    }

    DispatchMessageService({ action: 'destroy', type: 'loading', key: 'loading', msj: '' })

    if (_agenda?._id) {
      console.log('agenda created (2)')
      setIsEditing(true)
      cAgenda.setIsPublished(true)
    } else if (changePathWithoutSaving) {
      console.log('go to', props.matchUrl)
      history.push(`${props.matchUrl}`)
    }

    DispatchMessageService({ msj: 'Información guardada correctamente!', type: 'success', action: 'show' })
  }, [selectedDocuments])

  /**
   * Load the activity data from the location prop `edit` if this contains an ID.
   */
  const loadActivity = useCallback(async () => {
    if (location.state?.edit) {
      const activityId = location.state.edit
      const eventId = props.event._id

      // Update the context
      cAgenda.setActivityEdit(activityId)
      if (cAgenda.activityEdit !== activityId) {
      }

      // Get the agenda document from current activity_id
      const agenda: AgendaType = await AgendaApi.getOne(activityId, eventId)
      setSelectedDocuments(agenda.selected_document || [])

      // Take the vimeo_id and save in info.
      const vimeo_id = props.event.vimeo_id ? props.event.vimeo_id : ''
      agenda.vimeo_id = vimeo_id

      setCurrentAgenda(agenda)

      const fields = agenda as unknown as FormValues
      fields.selected_document = fields.selected_document || []
      form.setFieldsValue({ ...fields })
      setSavedForm(form.getFieldsValue())
      console.log('agendaInfo', agenda)

      // Save the activity name
      cAgenda.setActivityName(agenda.name)
      if (cAgenda.activityName !== agenda.name) {
      }

      setIsEditing(true)
      console.log('this agenda data is from editing status')
    }
  }, [location, cAgenda, setSelectedDocuments, setCurrentAgenda, form, setSavedForm, setIsEditing])

  /**
   * Handle the removing of an activity.
   * 
   * This function will show a modal dialog to confirm if the user wants to
   * remove the current activity.
   */
  const onRemove = useCallback(async () => {
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras borra la información...',
      action: 'show',
    })
    if (currentAgenda) {
      Modal.confirm({
        title: '¿Está seguro de eliminar la información?',
        icon: <ExclamationCircleOutlined />,
        content: 'Una vez eliminado, no lo podrá recuperar',
        okText: 'Borrar',
        okType: 'danger',
        cancelText: 'Cancelar',
        onOk() {
          deleteActivity(props.event._id, currentAgenda._id!, currentAgenda.name).then(() => {
            setShouldRedirect(true)
            history.push(`${props.matchUrl}`)
          })
        },
      })
    }
  }, [currentAgenda, setShouldRedirect])

  useEffect(() => {
    loadActivity().finally(() => setIsLoading(false))

    // This function is running when the component will unmount
    return () => {
      cAgenda.setActivityEdit(null)
    }
  }, [props.event, cAgenda])

  useEffect(() => {
    cAgenda.saveConfig()
  }, [cAgenda.isPublished])

  if (!location.state || shouldRedirect) return <Redirect to={props.matchUrl} />

  return (
    <Form
      form={form}
      onFinish={(values) => onFinish(values, true)}
      onValuesChange={(changedValue, values) => {
        if (Object.keys({}).length === 0) {
          setSavedForm(values) // First updating
          setIsNeededConfirmRedirection(true)
        } if (values !== savedForm) {
          setIsNeededConfirmRedirection(true)
        }
      }}
      onLoad={() => {
        setSavedForm(form.getFieldsValue())
      }}
      { ...formLayout }
    >
      <RouterPrompt
        save
        form={false}
        when={isNeededConfirmRedirection}
        title="Tienes cambios sin guardar."
        description="¿Qué deseas hacer?"
        okText="No guardar"
        okSaveText="Guardar"
        cancelText="Cancelar"
        onOK={() => true}
        onOKSave={() => {
          // We need simulate the submit, BUT with the second value as false
          onFinish(form.getFieldsValue(), false)
        }}
        onCancel={() => false}
      />

      <Header
        back
        save
        form
        saveNameIcon
        remove={onRemove}
        customBack={props.matchUrl}
        title={cAgenda.activityName ? `Actividad - ${cAgenda.activityName}` : 'Actividad'}
        saveName={location.state.edit || cAgenda.activityEdit || isEditing ? '' : 'Crear'}
        edit={location.state.edit || cAgenda.activityEdit || isEditing}
        extra={
          isEditing && (
            <Form.Item label="Publicar" labelCol={{ span: 14 }}>
              <Switch
                checkedChildren="Sí"
                unCheckedChildren="No"
                checked={cAgenda.isPublished}
                onChange={(value) => {
                  cAgenda.setIsPublished(value)
                }}
              />
            </Form.Item>
          )
        }
      />

      {isLoading ? (
          <Loading />
      ) : (
        <Tabs activeKey={currentTab} onChange={(key) => setCurrentTab(key)}>
          <Tabs.TabPane tab="Agenda" key="1">
            <AgendaForm
              form={form}
              activityId={cAgenda.activityEdit}
              event={props.event}
              agenda={currentAgenda}
              matchUrl={props.matchUrl}
            />
          </Tabs.TabPane>
          {isEditing && (
            <>
              <Tabs.TabPane tab="Contenido" key="2">
                <Row wrap gutter={12}>
                  <Col span={24}>
                    {currentAgenda?._id && (
                      <ActivityContentSelector
                        activityId={currentAgenda?._id}
                        activityName={currentAgenda.name}
                        eventId={props.event._id}
                        shouldLoad={currentTab === '2'}
                        matchUrl={props.matchUrl}
                      />
                    )}
                    <BackTop />
                  </Col>
                </Row>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Documentos" key="5">
                <Row justify="center" wrap gutter={12}>
                  <Col span={20}>
                    <Form.Item>
                      <AgendaDocumentForm
                        eventId={props.event._id}
                        selectedDocuments={selectedDocuments}
                        onSelectedDocuments={(changed) => {
                          console.log('document update:', changed)
                          setSelectedDocuments(changed)
                        }}
                        matchUrl={props.matchUrl}
                      />
                    </Form.Item>
                    <BackTop />
                  </Col>
                </Row>
              </Tabs.TabPane>
            </>
          )}
        </Tabs>
      )}
    </Form>
  )
}

export default AgendaEditPage
