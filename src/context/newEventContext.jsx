import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import dayjs from 'dayjs';
import { DispatchMessageService } from '../context/MessageService';
import { Actions, AgendaApi, EventsApi, OrganizationApi } from '@helpers/request';
import { GetTokenUserFirebase } from '@helpers/HelperAuth';
import { configEventsTemplate } from '../helpers/constants';

export const cNewEventContext = createContext();
//INITIAL STATE
const initialState = {
  loading: false,
  organizations: [],
  selectOrganization: null,
  tab: 'list',
  visible: false,
  allow_register: true,
  visibility: 'PUBLIC',
  type: 0,
};
//REDUCERS
function reducer(state, action) {
  const organizationSelect = action.payload?.organization || null;
  const organizationIdURL = action.payload?.orgId || null;
  let organizationSelected;
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'COMPLETE':
      return { ...state, loading: false };
    case 'SELECT_ORGANIZATION':
      if (organizationIdURL)
        organizationSelected = state.organizations
          ? state.organizations.filter((org) => org.id == organizationIdURL)[0]
          : state.organizations[0];
      else if (organizationSelect) organizationSelected = organizationSelect;
      else organizationSelected = state.organizations[0];

      return { ...state, selectOrganization: organizationSelected };
    case 'ORGANIZATIONS':
      return { ...state, organizations: action.payload.organizationList };
    case 'SELECT_TAB':
      return { ...state, tab: action.payload.tab };
    case 'VISIBLE_MODAL':
      return { ...state, visible: action.payload.visible, tab: 'list' };
    case 'TYPE_EVENT':
      switch (action.payload.type) {
        case 0:
          return { ...state, type: action.payload.type, allow_register: true, visibility: 'PUBLIC' };
        case 1:
          return { ...state, type: action.payload.type, allow_register: false, visibility: 'PUBLIC' };
        case 2:
          return { ...state, type: action.payload.type, allow_register: false, visibility: 'PRIVATE' };
      }
      break;
    case 'TYPE_AUTHENTICATION':
      return { ...state, type: 0, allow_register: true, visibility: 'ANONYMOUS' };
    default:
      throw new Error();
  }
}

export const NewEventProvider = ({ children }) => {
  const [addDescription, setAddDescription] = useState(false);
  const [typeTransmission, setTypeTransmission] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const currentDate = new Date();
  const calculatedStartDate = new Date(new Date().setMinutes(currentDate.getMinutes() + 30));
  const calculatedEndDate = new Date(new Date().setMinutes(currentDate.getMinutes() + 90));
  const [selectedHours, setSelectedHours] = useState({ from: calculatedStartDate, at: calculatedEndDate });
  const [dateEvent, setDateEvent] = useState();
  const [selectedDateEvent, setSelectedDateEvent] = useState();
  const [valueInputs, setValueInputs] = useState({});
  const [errorInputs, setErrorInputs] = useState([]);
  const [imageEvents, setImageEvents] = useState({});
  const [optTransmitir, setOptTransmitir] = useState(false);
  const [organization, setOrganization] = useState(false);
  const [selectOrganization, setSelectOrganization] = useState();
  const [isbyOrganization, setIsbyOrganization] = useState(false);
  const [loadingOrganization, setLoadingOrganization] = useState(false);
  const [createOrganizationF, setCreateOrganization] = useState(false);
  const [templateId, setTemplateId] = useState();
  const [state, dispatch] = useReducer(reducer, initialState);

  async function OrganizationsList() {
    dispatch({ type: 'LOADING' });
    const organizations = await OrganizationApi.mine();
    const organizationsFilter = organizations.filter((orgData) => orgData.id);
    dispatch({ type: 'ORGANIZATIONS', payload: { organizationList: organizationsFilter } });
    dispatch({ type: 'COMPLETE' });
    return organizationsFilter;
  }

  const createOrganization = async (data) => {
    //CREAR ORGANIZACION------------------------------
    let create = await OrganizationApi.createOrganization(data);
    if (create) {
      return create;
    }
    return null;
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const visibilityDescription = (value) => {
    setAddDescription(value);
    setValueInputs({ ...valueInputs, ['description']: '' });
  };

  const saveImageEvent = (image, index) => {
    setImageEvents({ ...imageEvents, [index]: image });
  };

  const newOrganization = (value) => {
    setCreateOrganization(value);
  };

  const eventByOrganization = (value) => {
    setIsbyOrganization(value);
  };
  const isLoadingOrganization = (value) => {
    setLoadingOrganization(value);
  };

  const changeSelectDay = (day) => {
    setSelectedDay(day);
  };
  const changeSelectHours = (hour) => {
    setSelectedHours(hour);
  };

  const changetypeTransmision = (type) => {
    setTypeTransmission(type);
  };
  const handleOk = (organization) => {
    /* let title = [];
    if (selectedDay <= new Date())
    title.push('La fecha no puede ser menor a la fecha actual');
    
    if (selectedHours.from > selectedHours.at)
    title.push('La hora de inicio no puede ser mayor a la hora fin');
    
    if ((selectedHours.from > new Date()) && (selectedDay <= new Date()))
    title.push('La hora no puede ser menor a la hora actual'); 
    
    if (title.length > 0) {
      title.map((item) => {
        message.warning(item);
      });
    } else {*/
    setIsModalVisible(false);
    setSelectedDateEvent({
      from: dayjs(selectedDay).format('YYYY-MM-DD') + ' ' + dayjs(selectedHours.from).format('HH:mm'),
      at: dayjs(selectedDay).format('YYYY-MM-DD') + ' ' + dayjs(selectedHours.at).format('HH:mm'),
    });
    //};
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const changeTransmision = (value) => {
    setOptTransmitir(value);
  };
  const changeOrganization = (value) => {
    setOrganization(value);
  };

  const selectedOrganization = (value) => {
    setSelectOrganization(value);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };
  const handleInput = (event, name) => {
    let listerrors = errorInputs.filter((err) => err.name !== name);
    setValueInputs({ ...valueInputs, [name]: event.target.value });
    if (name == 'name') {
      if (event.target.value.length >= 4) {
        listerrors.push({ name: 'name', value: false });
      } else if (event.target.value.length <= 3) {
        listerrors.push({ name: 'name', value: true });
      }
    }
    if (name == 'description' && addDescription) {
      if (event.target.value.length >= 10) {
        listerrors.push({ name: 'description', value: false });
      } else if (event.target.value.length <= 9) {
        listerrors.push({ name: 'description', value: true });
      }
    }
    setErrorInputs(listerrors);
  };

  const containsError = (field) => {
    let errorField = errorInputs.filter((error) => error.name == field);
    if (errorField.length > 0 && errorField[0].value) {
      return true;
    }
    return false;
  };

  const validateField = (validatorsInput) => {
    let listerrors = [];

    validatorsInput.map((validator) => {
      if (validator) {
        if (
          (valueInputs.length == 0 && validator.required) ||
          (!valueInputs[validator.name] && validator.required) ||
          (valueInputs[validator.name]?.length < validator.length && validator.required)
        ) {
          listerrors.push({ name: validator.name, value: true });
        }
      }
    });
    setErrorInputs(listerrors);
    if (listerrors.length > 0) {
      return true;
    }
    return false;
  };
  const onChangeCheck = (check) => {
    setValueInputs({ ...valueInputs, ['temaDark']: check });
  };
  const selectTemplate = useCallback((idTemplate) => {
    setTemplateId(idTemplate);
  }, []);

  useEffect(() => {
    if (!selectedDay || !selectedHours) return;
    setSelectedDateEvent({
      from: dayjs(selectedDay).format('YYYY-MM-DD') + ' ' + dayjs(selectedHours.from).format('HH:mm'),
      at: dayjs(selectedDay).format('YYYY-MM-DD') + ' ' + dayjs(selectedHours.at).format('HH:mm'),
    });
  }, [selectedDay, selectedHours]);
  const saveEvent = async () => {
    dispatch({ type: 'LOADING' });
    if (state.selectOrganization) {
      const data = {
        name: valueInputs.name,
        address: '',
        type_event: 'onlineEvent',
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
      };
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
      };
      console.log('DATA A VERIFICAR===>', state.selectOrganization?.itemsMenu, templateId, data);
      //CREAR CURSO
      try {
        let token = await GetTokenUserFirebase();

        const result = await Actions.create(`/api/events?token=${token}`, data);
        result._id = result._id ? result._id : result.data?._id;
        if (result._id) {
          //console.log('SECCIONES ACA==>', eventNewContext.selectOrganization?.itemsMenu, newMenu);
          let sectionsDefault = state.selectOrganization?.itemsMenu
            ? { itemsMenu: state.selectOrganization?.itemsMenu }
            : newMenu;
          //HABILTAR SECCIONES POR DEFECTO
          const sections = await Actions.put(`api/events/${result._id}?token=${token}`, sectionsDefault);
          sections._id = sections._id ? sections._id : sections.data?._id;
          if (sections?._id) {
            //CREAR LECCIÓN CON EL MISMO NOMBRE DEL CURSO
            const activity = {
              name: valueInputs.name,
              subtitle: null,
              image: null,
              description: null,
              capacity: 100,
              event_id: result._id,
              datetime_end: selectedDateEvent?.at + ':00',
              datetime_start: selectedDateEvent?.from + ':00',
            };
            const agenda = await AgendaApi.create(result._id, activity);
            //console.log("RESPUESTA AGENDA==>",agenda)
            if (agenda._id) {
              //CREAR TEMPLATE PARA EL CURSO
              let template = !templateId && true;
              if (templateId) {
                template = await EventsApi.createTemplateEvent(result._id, templateId);
              }
              if (template) {
                // console.log("RESPUESTA TEMPLATE==>",template)
                DispatchMessageService({
                  type: 'success',
                  msj: 'Curso creado correctamente...',
                  action: 'show',
                });
                window.location.replace(`${window.location.origin}/eventadmin/${result._id}`);
              } else {
                DispatchMessageService({
                  type: 'error',
                  msj: 'Error al crear curso con su template',
                  action: 'show',
                });
              }
            }
          } else {
            //console.log('RESP API==>', result);
            DispatchMessageService({
              type: 'error',
              msj: 'Error al crear el curso',
              action: 'show',
            });
            dispatch({ type: 'COMPLETE' });
          }
        } else {
          //console.log('RESP API==>', result);
          DispatchMessageService({
            type: 'error',
            msj: 'Error al crear el curso',
            action: 'show',
          });
          dispatch({ type: 'COMPLETE' });
        }
      } catch (error) {
        console.log('CATCH==>', error);
        DispatchMessageService({
          type: 'error',
          msj: 'Error al crear el curso catch',
          action: 'show',
        });
        dispatch({ type: 'COMPLETE' });
      }
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Seleccione una organización',
        action: 'show',
      });
    }
  };

  useEffect(() => {
    if (selectedDateEvent) {
      setDateEvent(selectedDateEvent.from + '     -     ' + selectedDateEvent.at);
    }
  }, [selectedDateEvent]);
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
        loadingOrganization,
        isLoadingOrganization,
        createOrganizationF,
        newOrganization,
        templateId,
        selectTemplate,
        state,
        OrganizationsList,
        dispatch,
        createOrganization,
        saveEvent,
      }}>
      {children}
    </cNewEventContext.Provider>
  );
};

export const useContextNewEvent = () => {
  let context = useContext(cNewEventContext);
  if (!context) {
    throw new Error('useContextNewEvent debe estar dentro del proveedor');
  }
  return context;
};
export default cNewEventContext;
