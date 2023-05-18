import {
  Dispatch,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import dayjs from 'dayjs'
import { DispatchMessageService } from '@context/MessageService'
import { Actions, AgendaApi, EventsApi, OrganizationApi } from '@helpers/request'
import { GetTokenUserFirebase } from '@helpers/HelperAuth'
import { configEventsTemplate } from '@helpers/constants'
import { EventTypeType, EventVisibilityType } from '@Utilities/types/EventType'

export enum NewEventAccessTypeEnum {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  ANONYMOUS = 'ANONYMOUS',
}

export enum NewEventActionEnum {
  LOADING = 'LOADING',
  COMPLETE = 'COMPLETE',
  SELECT_ORGANIZATION = 'SELECT_ORGANIZATION',
  ORGANIZATIONS = 'ORGANIZATIONS',
  SELECT_TAB = 'SELECT_TAB',
  VISIBLE_MODAL = 'VISIBLE_MODAL',
  EVENT_ACCESS = 'EVENT_ACCESS',
  TYPE_AUTHENTICATION = 'TYPE_AUTHENTICATION',
  EVENT_TYPE = 'EVENT_TYPE',
}

export interface NewEventState {
  isLoading: boolean
  organizations: any[]
  selectOrganization: any
  tab: string
  visible: boolean
  allow_register: boolean
  visibility: EventVisibilityType
  type: number
  event_type: EventTypeType
}

export type NewEventAction =
  | { type: NewEventActionEnum.LOADING }
  | { type: NewEventActionEnum.COMPLETE }
  | {
      type: NewEventActionEnum.SELECT_ORGANIZATION
      payload: { organization?: any; orgId: any }
    }
  | { type: NewEventActionEnum.ORGANIZATIONS; payload: { organizationList: any[] } }
  | { type: NewEventActionEnum.SELECT_TAB; payload: { tab: any } }
  | { type: NewEventActionEnum.VISIBLE_MODAL; payload: { visible: boolean } }
  | {
      type: NewEventActionEnum.EVENT_ACCESS
      payload: { accessType: NewEventAccessTypeEnum }
    }
  | {
      type: NewEventActionEnum.TYPE_AUTHENTICATION
    }
  | { type: NewEventActionEnum.EVENT_TYPE; payload: { event_type: EventTypeType } }

export type NewEventContextType = {
  state: NewEventState
  dispatch: Dispatch<NewEventAction>
  // More stuffs
  addDescription: string | null
  typeTransmission: number
  isModalVisible: boolean
  selectedDay: any
  selectedHours: any
  dateEvent: any
  selectedDateEvent: any
  showModal: any
  handleOk: any
  handleCancel: any
  handleDayClick: any
  visibilityDescription: any
  changetypeTransmision: any
  changeSelectHours: any
  changeSelectDay: any
  handleInput: any
  valueInputs: any
  errorInputs: any
  containsError: any
  validateField: any
  imageEvents: any
  saveImageEvent: any
  onChangeCheck: any
  optTransmitir: any
  changeTransmision: any
  changeOrganization: any
  organization: any
  selectOrganization: any
  selectedOrganization: any
  eventByOrganization: any
  isbyOrganization: any
  isLoadingOrganization: any
  setIsLoadingOrganization: any
  createOrganizationF: any
  newOrganization: any
  templateId: any
  selectTemplate: any
  OrganizationsList: any
  createOrganization: any
  saveEvent: any
}

// Initial state
const initialState: NewEventState = {
  isLoading: false,
  organizations: [],
  selectOrganization: null,
  tab: 'list',
  visible: false,
  allow_register: true,
  visibility: 'PUBLIC',
  type: 0,
  event_type: 'onlineEvent',
}

export const cNewEventContext = createContext<NewEventContextType>(
  {} as NewEventContextType,
)

// Reducers
function reducer(state: NewEventState, action: NewEventAction): NewEventState {
  let organizationSelected

  switch (action.type) {
    case NewEventActionEnum.LOADING:
      return { ...state, isLoading: true }
    case NewEventActionEnum.COMPLETE:
      return { ...state, isLoading: false }
    case NewEventActionEnum.SELECT_ORGANIZATION:
      const organizationSelect = action.payload?.organization || null
      const organizationIdURL = action.payload?.orgId || null
      if (organizationIdURL)
        organizationSelected = state.organizations
          ? state.organizations.filter((org: any) => org.id == organizationIdURL)[0]
          : state.organizations[0]
      else if (organizationSelect) organizationSelected = organizationSelect
      else organizationSelected = state.organizations[0]

      return { ...state, selectOrganization: organizationSelected }
    case NewEventActionEnum.ORGANIZATIONS:
      return { ...state, organizations: action.payload.organizationList }
    case NewEventActionEnum.SELECT_TAB:
      return { ...state, tab: action.payload.tab }
    case NewEventActionEnum.VISIBLE_MODAL:
      return { ...state, visible: action.payload.visible, tab: 'list' }
    case NewEventActionEnum.EVENT_ACCESS:
      switch (action.payload.accessType) {
        case NewEventAccessTypeEnum.PUBLIC:
          return {
            ...state,
            type: 0,
            allow_register: true,
            visibility: 'PUBLIC',
          }
        case NewEventAccessTypeEnum.ANONYMOUS:
          return {
            ...state,
            type: 1,
            allow_register: false,
            visibility: 'PUBLIC',
          }
        case NewEventAccessTypeEnum.PRIVATE:
          return {
            ...state,
            type: 2,
            allow_register: false,
            visibility: 'PRIVATE',
          }
      }
      break
    case NewEventActionEnum.TYPE_AUTHENTICATION:
      // return { ...state, type: 0, allow_register: true, visibility: 'ANONYMOUS' }
      return { ...state, type: 0, allow_register: true, visibility: 'PRIVATE' }
    case NewEventActionEnum.EVENT_TYPE:
      // NOTE: Why TYPE_EVENT set the visibility?????????
      console.log({ action })
      return { ...state, event_type: action.payload?.event_type || 'onlineEvent' }
    default:
      throw new Error()
  }
}

export const NewEventProvider = ({ children }: any) => {
  const [addDescription, setAddDescription] = useState<string | null>(null)
  const [typeTransmission, setTypeTransmission] = useState(0)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedDay, setSelectedDay] = useState<any>(new Date())
  const currentDate = new Date()
  const calculatedStartDate = new Date(
    new Date().setMinutes(currentDate.getMinutes() + 30),
  )
  const calculatedEndDate = new Date(new Date().setMinutes(currentDate.getMinutes() + 90))
  const [selectedHours, setSelectedHours] = useState({
    from: calculatedStartDate,
    at: calculatedEndDate,
  })
  const [dateEvent, setDateEvent] = useState<any>()
  const [selectedDateEvent, setSelectedDateEvent] = useState<any>()
  const [valueInputs, setValueInputs] = useState<any>({})
  const [errorInputs, setErrorInputs] = useState<any[]>([])
  const [imageEvents, setImageEvents] = useState<any>({})
  const [optTransmitir, setOptTransmitir] = useState(false)
  const [organization, setOrganization] = useState(false)
  const [selectOrganization, setSelectOrganization] = useState<any>()
  const [isbyOrganization, setIsbyOrganization] = useState(false)
  const [isLoadingOrganization, setIsLoadingOrganization] = useState(false)
  const [createOrganizationF, setCreateOrganization] = useState(false)
  const [templateId, setTemplateId] = useState<any>()

  const [state, dispatch] = useReducer(reducer, initialState)

  async function OrganizationsList() {
    dispatch({ type: NewEventActionEnum.LOADING })
    const organizations = await OrganizationApi.mine()
    const organizationsFilter = organizations.filter((orgData: any) => orgData.id)
    dispatch({
      type: NewEventActionEnum.ORGANIZATIONS,
      payload: { organizationList: organizationsFilter },
    })
    dispatch({ type: NewEventActionEnum.COMPLETE })
    return organizationsFilter
  }

  const createOrganization = async (data: any) => {
    // Crear organizacion------------------------------
    const create = await OrganizationApi.createOrganization(data)
    if (create) {
      return create
    }
    return null
  }

  const showModal = () => {
    setIsModalVisible(true)
  }
  const visibilityDescription = (value?: string) => {
    setAddDescription(value || null)
    setValueInputs({ ...valueInputs, ['description']: '' })
  }

  const saveImageEvent = (image: any, index: number) => {
    setImageEvents({ ...imageEvents, [index]: image })
  }

  const newOrganization = (value: any) => {
    setCreateOrganization(value)
  }

  const eventByOrganization = (value: any) => {
    setIsbyOrganization(value)
  }

  const changeSelectDay = (day: any) => {
    setSelectedDay(day)
  }
  const changeSelectHours = (hour: any) => {
    setSelectedHours(hour)
  }

  const changetypeTransmision = (type: any) => {
    setTypeTransmission(type)
  }
  const handleOk = (organization: any) => {
    console.warn('organization is unused here:', { organization })
    setIsModalVisible(false)
    setSelectedDateEvent({
      from:
        dayjs(selectedDay).format('YYYY-MM-DD') +
        ' ' +
        dayjs(selectedHours.from).format('HH:mm'),
      at:
        dayjs(selectedDay).format('YYYY-MM-DD') +
        ' ' +
        dayjs(selectedHours.at).format('HH:mm'),
    })
    //};
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const changeTransmision = (value: boolean) => {
    setOptTransmitir(value)
  }
  const changeOrganization = (value: boolean) => {
    setOrganization(value)
  }

  const selectedOrganization = (value: any) => {
    setSelectOrganization(value)
  }

  const handleDayClick = (day: any) => {
    setSelectedDay(day)
  }
  const handleInput = (event: any, name: string) => {
    const listerrors = errorInputs.filter((err) => err.name !== name)
    setValueInputs({ ...valueInputs, [name]: event.target.value })
    if (name == 'name') {
      if (event.target.value.length >= 4) {
        listerrors.push({ name: 'name', value: false })
      } else if (event.target.value.length <= 3) {
        listerrors.push({ name: 'name', value: true })
      }
    }
    if (name == 'description' && addDescription) {
      if (event.target.value.length >= 10) {
        listerrors.push({ name: 'description', value: false })
      } else if (event.target.value.length <= 9) {
        listerrors.push({ name: 'description', value: true })
      }
    }
    setErrorInputs(listerrors)
  }

  const containsError = (field: any) => {
    const errorField = errorInputs.filter((error) => error.name == field)
    if (errorField.length > 0 && errorField[0].value) {
      return true
    }
    return false
  }

  const validateField = (validatorsInput: any[]) => {
    const listerrors: any[] = []

    validatorsInput.map((validator) => {
      if (validator) {
        if (
          (valueInputs.length == 0 && validator.required) ||
          (!valueInputs[validator.name] && validator.required) ||
          (valueInputs[validator.name]?.length < validator.length && validator.required)
        ) {
          listerrors.push({ name: validator.name, value: true })
        }
      }
    })
    setErrorInputs(listerrors)
    if (listerrors.length > 0) {
      return true
    }
    return false
  }
  const onChangeCheck = (check: any) => {
    setValueInputs({ ...valueInputs, ['temaDark']: check })
  }
  const selectTemplate = useCallback((idTemplate) => {
    setTemplateId(idTemplate)
  }, [])

  useEffect(() => {
    if (!selectedDay || !selectedHours) return
    setSelectedDateEvent({
      from:
        dayjs(selectedDay).format('YYYY-MM-DD') +
        ' ' +
        dayjs(selectedHours.from).format('HH:mm'),
      at:
        dayjs(selectedDay).format('YYYY-MM-DD') +
        ' ' +
        dayjs(selectedHours.at).format('HH:mm'),
    })
  }, [selectedDay, selectedHours])
  const saveEvent = async () => {
    dispatch({ type: NewEventActionEnum.LOADING })
    if (state.selectOrganization) {
      const data = {
        name: valueInputs.name,
        address: '',
        type_event: state.event_type || 'onlineEvent',
        datetime_from: selectedDateEvent?.from + ':00',
        datetime_to: selectedDateEvent?.at + ':00',
        picture: null,
        venue: '',
        location: '',
        visibility: state.visibility,
        description: '',
        category_ids: [],
        organizer_id: state.selectOrganization.id || state.selectOrganization._id,
        event_type_id: '5bf47203754e2317e4300b68',
        user_properties: [],
        allow_register: state.allow_register,
        styles: {
          buttonColor: '#FFF',
          banner_color: '#FFF',
          menu_color: '#FFF',
          event_image: configEventsTemplate.event_image,
          banner_image: configEventsTemplate.banner_image,
          menu_image: null,
          brandPrimary: '#FFFFFF',
          brandSuccess: '#FFFFFF',
          brandInfo: '#FFFFFF',
          brandDanger: '#FFFFFF',
          containerBgColor: '#ffffff',
          brandWarning: '#FFFFFF',
          toolbarDefaultBg: '#FFFFFF',
          brandDark: '#FFFFFF',
          brandLight: '#FFFFFF',
          textMenu: '#555352',
          activeText: '#FFFFFF',
          bgButtonsEvent: '#FFFFFF',
          banner_image_email: null,
          BackgroundImage: configEventsTemplate.BackgroundImage,
          FooterImage: null,
          banner_footer: configEventsTemplate.banner_footer,
          mobile_banner: null,
          banner_footer_email: null,
          show_banner: 'true',
          show_card_banner: false,
          show_inscription: false,
          hideDatesAgenda: true,
          hideDatesAgendaItem: false,
          hideHoursAgenda: false,
          hideBtnDetailAgenda: true,
          loader_page: 'no',
          data_loader_page: null,
          show_title: true,
        },
      }
      const newMenu = {
        itemsMenu: {
          evento: {
            name: 'curso', // TODO: check where this prop is used
            position: 1,
            section: 'evento',
            icon: 'CalendarOutlined',
            checked: true,
            permissions: 'public',
          },
          agenda: {
            name: 'Mi agenda',
            position: null,
            section: 'agenda',
            icon: 'ReadOutlined',
            checked: true,
            permissions: 'public',
          },
        },
      }
      // Crear curso
      try {
        const token = await GetTokenUserFirebase()

        const result = await Actions.create(`/api/events?token=${token}`, data)
        result._id = result._id ? result._id : result.data?._id
        if (result._id) {
          const sectionsDefault = state.selectOrganization?.itemsMenu
            ? { itemsMenu: state.selectOrganization?.itemsMenu }
            : newMenu
          // Habiltar secciones por defecto
          const sections = await Actions.put(
            `api/events/${result._id}?token=${token}`,
            sectionsDefault,
          )
          sections._id = sections._id ? sections._id : sections.data?._id
          if (sections?._id) {
            // Crear lección con el mismo nombre del curso
            const activity = {
              name: valueInputs.name,
              subtitle: null,
              image: null,
              description: null,
              capacity: 100,
              event_id: result._id,
              datetime_end: selectedDateEvent?.at + ':00',
              datetime_start: selectedDateEvent?.from + ':00',
            }
            const agenda = await AgendaApi.create(result._id, activity)
            if (agenda._id) {
              // Crear template para el curso
              let template = !templateId && true
              if (templateId) {
                template = await EventsApi.createTemplateEvent(result._id, templateId)
              }
              if (template) {
                DispatchMessageService({
                  type: 'success',
                  msj: 'Curso creado correctamente...',
                  action: 'show',
                })
                window.location.replace(
                  `${window.location.origin}/eventadmin/${result._id}`,
                )
              } else {
                DispatchMessageService({
                  type: 'error',
                  msj: 'Error al crear curso con su template',
                  action: 'show',
                })
              }
            }
          } else {
            DispatchMessageService({
              type: 'error',
              msj: 'Error al crear el curso',
              action: 'show',
            })
            dispatch({ type: NewEventActionEnum.COMPLETE })
          }
        } else {
          DispatchMessageService({
            type: 'error',
            msj: 'Error al crear el curso',
            action: 'show',
          })
          dispatch({ type: NewEventActionEnum.COMPLETE })
        }
      } catch (error) {
        DispatchMessageService({
          type: 'error',
          msj: 'Error al crear el curso catch',
          action: 'show',
        })
        dispatch({ type: NewEventActionEnum.COMPLETE })
      }
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Seleccione una organización',
        action: 'show',
      })
    }
  }

  useEffect(() => {
    if (selectedDateEvent) {
      setDateEvent(
        selectedDateEvent.from + '     -     ' + selectedDateEvent.at.toString(),
      )
    }
  }, [selectedDateEvent])
  return (
    <cNewEventContext.Provider
      value={{
        addDescription,
        typeTransmission,
        isModalVisible,
        selectedDay,
        selectedHours,
        dateEvent,
        selectedDateEvent,
        showModal,
        handleOk,
        handleCancel,
        handleDayClick,
        visibilityDescription,
        changetypeTransmision,
        changeSelectHours,
        changeSelectDay,
        handleInput,
        valueInputs,
        errorInputs,
        containsError,
        validateField,
        imageEvents,
        saveImageEvent,
        onChangeCheck,
        optTransmitir,
        changeTransmision,
        changeOrganization,
        organization,
        selectOrganization,
        selectedOrganization,
        eventByOrganization,
        isbyOrganization,
        isLoadingOrganization,
        setIsLoadingOrganization,
        createOrganizationF,
        newOrganization,
        templateId,
        selectTemplate,
        state,
        OrganizationsList,
        dispatch,
        createOrganization,
        saveEvent,
      }}
    >
      {children}
    </cNewEventContext.Provider>
  )
}

export const useNewEventContext = () => {
  const context = useContext(cNewEventContext)
  if (!context) {
    throw new Error('useNewEventContext debe estar dentro del proveedor')
  }
  return context
}
export default cNewEventContext
