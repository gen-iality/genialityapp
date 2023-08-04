/* eslint-disable no-console */
import { Component, Fragment } from 'react';
import Moment from 'moment';
import EviusReactQuill from '../shared/eviusReactQuill';
import { Actions, CategoriesApi, EventsApi, OrganizationApi, PlansApi, TypesApi } from '../../helpers/request';
import ErrorServe from '../modal/serverError';
import { injectIntl } from 'react-intl';
// import axios from 'axios/index';
import SelectInput from '../shared/selectInput';
import Loading from '../loaders/loading';
// import DateEvent from './dateEvent';
import { Switch, Card, Row, Col, Tabs, Input, Select, Modal, Form, Checkbox, Typography } from 'antd';
import { firestore } from '../../helpers/firebase';
import Header from '../../antdComponents/Header';
import BackTop from '../../antdComponents/BackTop';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { handleRequestError } from '../../helpers/utils';
import { DispatchMessageService } from '../../context/MessageService';
import ImageUploaderDragAndDrop from '../imageUploaderDragAndDrop/imageUploaderDragAndDrop';
import PreLandingSections from '../prelanding';
import { CurrentUserContext } from '@/context/userContext';
import DescriptionDynamic from './Description';
import TypeEvent from '../shared/typeEvent/TypeEvent';
import AccessTypeCard from '../shared/accessTypeCard/AccessTypeCard';
import { AccessTypeCardData } from '../shared/accessTypeCard/accesTypeCardData/accesTypeCardData';
import ActivityRedirectForm from '../shared/ActivityRedirectForm';
import CustomPasswordLabel from './CustomPasswordLabel';
import LandingRedirectForm from '../shared/LandingRedirectForm';
import CustomDateEvent from './multiples-fechas/CustomDateEvent';
import { ConfigAdvancePayment } from '../shared/accessTypeCard/components/ConfigAdvancePayment';
import { isValidUrl } from '@/hooks/useIsValidUrl';
import WithouHistoryEventPased from '../shared/WithouHistoryEventPased';

Moment.locale('es');
// const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;
// const { useBreakpoint } = Grid;
const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
class General extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: { ...this.props.event },
      optionForm: [],
      selectedOption: [],
      selectedOrganizer: {},
      selectedType: {},
      error: {},
      fields: [],
      path: [],
      inputValue: '',
      listValue: '',
      option: [],
      minDate: new Date(),
      valid: !this.props.event._id,
      groups: [],
      errorData: {},
      serverError: false,
      loading: true,
      info: {},
      specificDates: false,
      dates: [],
      data_loader_page: '',
      checked: false,
      has_payment: false,
      tabs: {
        publicChat: true,
        privateChat: true,
        attendees: true,
      },
      registrationMessage: props.event && props.event.registration_message ? props.event.registration_message : '',
      redirect_activity: null,
      show_event_date: false,
      hide_event_in_passed:false,
      // redirect_landing: null,
      itemsMenu: [],
      // Estado inicial de la seccion de formulario de registro
      registerForm: {
        name: 'Registro',
        position: 0,
        section: 'tickets',
        icon: 'CreditCardOutlined',
        checked: false,
        permissions: 'public',
      },
      image: this.props.event.picture,
      tabActive: '1',
      iMustBlockAFunctionality: false,
      iMustValidate: true,
      isCustomPasswordLabel: this.props.event?.is_custom_password_label || false,
      customPasswordLabel: this.props.event?.custom_password_label || '',
    };
    this.specificDates = this.specificDates.bind(this);
    this.submit = this.submit.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.getInitialPage = this.getInitialPage.bind(this);
  }
  static contextType = CurrentUserContext;

  changeTab = (tab) => {
    this.setState({
      tabActive: tab,
    });
  };

  getCurrentConsumptionPlanByUsers = async () => {
    const userContext = this.context;
    const cUser = userContext?.value;
    if (!cUser?._id) return;
    const consumption = await PlansApi.getCurrentConsumptionPlanByUsers(cUser?._id);
    this.setState({ consumption });
  };

  async componentDidMount() {
    console.log(this.props.event);
    this.getCurrentConsumptionPlanByUsers();
    //inicializacion del estado de menu
    if (this.state.event.itemsMenu) {
      const { itemsMenu } = this.state.event;
      const { registerForm } = this.state;

      let registerSection = registerForm;

      if (Object.keys(itemsMenu).length > 0) {
        Object.keys(itemsMenu).forEach((index) => {
          if (index === 'tickets') {
            registerSection.name = itemsMenu[index].name;
            registerSection.position = itemsMenu[index].position;
          }
        });
      }
      delete itemsMenu.tickets;
      this.setState({ itemsMenu, registerForm: registerSection });
    }

    const validate = await this.validateTabs();
    if (validate) {
      if (validate.tabs !== undefined) {
        this.setState({ tabs: { ...validate.tabs } });
      } else {
        await this.upsertTabs();
      }
    } else {
      await this.upsertTabs();
    }

    const info = this.props.event;
    this.setState({ info });
    this.setState({
      checked: info.initial_page ? true : false,
    });
    try {
      const { event } = this.props;
      // event.picture = (typeof event.picture === 'object') ? event.picture[0] : "";
      const categories = await CategoriesApi.getAll();
      const types = await TypesApi.getAll();
      let organizers = await OrganizationApi.mine();
      organizers = organizers.map((item) => {
        return { value: item.id, label: item.name };
      });
      const { selectedCategories, selectedOrganizer, selectedType } = handleFields(
        organizers,
        types,
        categories,
        event
      );
      this.setState({
        categories,
        organizers,
        types,
        selectedCategories,
        selectedOrganizer,
        selectedType,
        loading: false,
      });
      if (info.dates && info.dates.length > 0) {
        this.setState({ specificDates: true });
      } else {
        this.setState({ specificDates: false });
      }
    } catch (error) {
      // Error
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          DispatchMessageService({
            type: 'error',
            msj: `Error: ${data?.message || status}`,
            action: 'show',
          });
        } else this.setState({ serverError: true, loader: false });
      } else {
        this.setState({
          serverError: true,
          loader: false,
          errorData: { status: 400, message: JSON.stringify(error) },
        });
      }
    }

    //Esto es para la configuración de autenticación. Nuevo flujo de Login
    if (
      (this.state.event.visibility === 'PUBLIC' || this.state.event.visibility === 'ANONYMOUS') &&
      this.state.event.allow_register
    ) {
      //Evento Público con Registro
      this.setState({ accessSelected: 'PUBLIC_EVENT_WITH_REGISTRATION' });
      if (
        this.state.event.visibility === 'PUBLIC' &&
        this.state.event.allow_register &&
        this.state.event.payment?.active
      ) {
        this.setState({ accessSelected: 'PAYMENT_EVENT' });
      }
      //estado del check del evento público con registro sin contraseña
      if (this.state.event.visibility === 'ANONYMOUS' && this.state.event.allow_register) {
        this.setState({ extraState: true });
      }
    } else if (this.state.event.visibility === 'PUBLIC' && !this.state.event.allow_register) {
      //Evento Público sin Registro
      this.setState({ accessSelected: 'UN_REGISTERED_PUBLIC_EVENT' });
    } else {
      //Evento Privado con Invitación
      this.setState({ accessSelected: 'PRIVATE_EVENT' });
    }
  }

  //*********** FUNCIONES DEL FORMULARIO
  // isCustomPasswordLabel => boolean
  // customPasswordLabel => string
  handleChangeCustomPassword = (isCustomPasswordLabel, customPasswordLabel) => {
    // console.log(this.state)
    this.setState({ isCustomPasswordLabel, customPasswordLabel });
  };

  googleanlyticsid = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } });
  };

  googletagmanagerid = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } });
  };
  facebookpixelid = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } });
  };

  //Cambio en los input
  handleChange = (e, name) => {
    const valueData = e?.target?.value;

    const targetData = e?.target;

    if (targetData !== null || targetData !== undefined || targetData !== '') {
      let value = e;
      if (typeof valueData === 'string') {
        value = valueData;
      }

      if (name === 'visibility') {
        value = targetData.checked ? 'PUBLIC' : 'PRIVATE';
      } else if (name === 'allow_register' || name === 'has_payment') {
        value = targetData.checked;
      }

      this.setState({ event: { ...this.state.event, [name]: value } }, this.valid);
    }
    // if (targetData != null) {
    //   // value = targetData;
    //   if (valueData) {
    //     value = valueData;
    //   }
    // }
  };
  //Validación
  valid = () => {
    const error = {};
    const { event, selectedOrganizer } = this.state;
    const valid = event.name !== null && event.name !== '' && event.name.length > 0 && !!selectedOrganizer;
    /* 
      &&
      !!selectedType &&
      selectedCategories &&
      selectedCategories.length > 0 */
    if (valid) {
      this.setState({ valid: !valid, error });
    } else {
      DispatchMessageService({
        type: 'error',
        msj: this.props.intl.formatMessage({
          id: 'message.error.complete.requerid.data',
          defaultMessage: 'Hubo un error, por favor completa los datos obligatorios!',
        }),
        action: 'show',
      });
    }
  };
  //Cambio descripción
  chgTxt = (content) => {
    this.setState({ event: { ...this.state.event, description: content } });
  };
  //Funciones para manejar el cambio en listas desplegables
  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories }, this.valid);
  };

  selectOrganizer = (selectedOrganizer) => {
    if (!selectedOrganizer.value) selectedOrganizer = undefined;
    this.setState({ selectedOrganizer }, this.valid);
  };
  selectType = (selectedType) => {
    if (!selectedType.value) selectedType = undefined;
    this.setState({ selectedType }, this.valid);
  };
  //Cambio en los input de fechas
  changeDate = (value, name) => {
    let {
      event: { date_end },
    } = this.state;
    if (name === 'date_start') {
      const diff = Moment(value).diff(Moment(date_end), 'days');
      if (diff >= 0)
        date_end = Moment(date_end)
          .add(diff, 'days')
          .toDate();
      this.setState({
        minDate: value,
        event: { ...this.state.event, date_start: value, date_end: value },
      });
    } else if (name === 'hour_start') {
      this.setState({
        minDate: value,
        event: { ...this.state.event, hour_start: value, hour_end: value },
      });
    } else this.setState({ event: { ...this.state.event, [name]: value } });
  };

  /* ZONA SOCIAL */

  validateTabs = () => {
    const { event } = this.props;
    return new Promise(function(resolve, reject) {
      firestore
        .collection('events')
        .doc(event._id)
        .get()
        .then((result) => {
          if (result.exists) {
            const data = result.data();
            data ? resolve(data) : resolve(false);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  };

  upsertTabs = async () => {
    const { event, intl } = this.props;
    const { tabs } = this.state;
    let response = await this.validateTabs();

    return new Promise(function(resolve) {
      if (response) {
        let updateData = { ...response, tabs: { ...tabs } };

        firestore
          .collection('events')
          .doc(event._id)
          .update(updateData)
          .then(() => {
            const msg = intl.formatMessage({
              id: 'message.success.updated.tabs',
              defaultMessage: 'Tabs de la zona social actualizados!',
            });
            DispatchMessageService({
              type: 'success',
              msj: msg,
              action: 'show',
            });
            resolve({
              error: '',
              message: msg,
            });
          })
          .catch((err) => {
            console.error(err);
            DispatchMessageService({
              type: 'error',
              msj: intl.formatMessage({
                id: 'message.error.updated.tabs',
                defaultMessage: 'Ha ocurrido un error actualizando las tabs de la zona social',
              }),
              action: 'show',
            });
          });
      } else {
        firestore
          .collection('events')
          .doc(event._id)
          .set({ tabs: { ...tabs } })
          .then(() => {
            const msg = intl.formatMessage({
              id: 'message.success.initialized.tabs',
              defaultMessage: 'Tabs de la zona social inicializados',
            });
            DispatchMessageService({
              type: 'success',
              msj: msg,
              action: 'show',
            });
            resolve({
              error: '',
              message: msg,
            });
          })
          .catch((err) => {
            console.error(err);
            DispatchMessageService({
              type: 'error',
              msj: intl.formatMessage({
                id: 'message.error.updated.tabs',
                defaultMessage: 'Ha ocurrido un error actualizando las tabs de la zona social',
              }),
              action: 'show',
            });
          });
      }
    });
  };

  handleImage(imageUrl) {
    this.setState({ image: imageUrl });
  }

  handleFormDataOfEventType(values) {
    this.setState({ event: { ...this.state.event, ...values } });
  }

  validateUrlExtensionPayment (url = '', externalPayment = false) {
    if(url.length === 0 && externalPayment){
      DispatchMessageService({ action:'show', type:'error',msj:'Url no debe estar vacia'});
      return false;
    } 
    if(externalPayment){
      if(!isValidUrl(url)){
        DispatchMessageService({ action:'show', type:'error',msj:'Debe ingresar una url valida'});
        return false;
      }
    }
      return true
  }

  //Envío de datos
  async submit() {
    const { intl } = this.props;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: 'Por favor espere mientras se guarda la información...',
      action: 'show',
    });

    // creacion o actualizacion de estado en firebase de los tabs de la zona social
    await this.upsertTabs();
    // handleChange = (e) => {
    //   this.setState({ registrationMessage: e });
    // };

    const { event, image } = this.state;
    const self = this;
    //this.setState({loading:true});
    const hour_start = Moment(event.hour_start).format('HH:mm');
    const date_start = Moment(event.date_start).format('YYYY-MM-DD');
    const hour_end = Moment(event.hour_end).format('HH:mm');
    const date_end = Moment(event.date_end).format('YYYY-MM-DD');
    const datetime_from = Moment(date_start + ' ' + hour_start, 'YYYY-MM-DD HH:mm');
    const datetime_to = Moment(date_end + ' ' + hour_end, 'YYYY-MM-DD HH:mm');
    const categories = this.state.selectedCategories.map((item) => {
      return item.value;
    });
    const minValueEvent = 2000;
    const data = {
      name: event.name,
      datetime_from: datetime_from.format('YYYY-MM-DD HH:mm:ss'),
      datetime_to: datetime_to.format('YYYY-MM-DD HH:mm:ss'),
      payment: {
        active: event.payment?.active || false,
        price: event.payment?.price || minValueEvent,
        currency: event.payment?.currency || 'COP',
        externalPayment: event.payment?.externalPayment ?? false,
        urlExternalPayment: event.payment?.urlExternalPayment ?? ''
      },
      picture: image,
      video: event.video || null,
      video_position: event.video_position === 'true' || event.video_position === true ? 'true' : 'false',
      venue: event.venue,
      analytics: event.analytics,
      address: event.address,
      has_date: event.has_date === 'true' || event.has_date === true ? true : false,
      allow_register: event.allow_register,
      allow_detail_calendar:
        event.allow_detail_calendar === 'true' || event.allow_detail_calendar === true ? true : false,
      enable_language: event.enable_language === 'true' || event.enable_language === true ? true : false,
      homeSelectedScreen: event.homeSelectedScreen,
      visibility: event.visibility ? event.visibility : 'PRIVATE',
      description: event.description,
      category_ids: categories,
      organizer_id:
        this.state.selectedOrganizer && this.state.selectedOrganizer.value ? this.state.selectedOrganizer.value : null,
      event_type_id: this.state.selectedType?.value,
      app_configuration: this.state.info.app_configuration,
      banner_image_link: this.state.banner_image_link,
      adminContenido: event.adminContenido,
      type_event: event.type_event,
      event_platform: event.event_platform || 'zoom',
      loader_page: event.loader_page || 'no',
      initial_page: event.initial_page || '',
      data_loader_page: this.state.data_loader_page || '',
      show_banner: event.show_banner || true,
      show_banner_footer: event.show_banner_footer || false,
      has_payment: event.has_payment ? event.has_payment : false,
      language: event.language ? event.language : 'es',
      googleanlyticsid: event.googleanlyticsid || null,
      googletagmanagerid: event.googletagmanagerid || null,
      facebookpixelid: event.facebookpixelid || null,
      where_it_run: event.where_it_run || 'InternalEvent',
      url_external: event.url_external || '',
      success_message: event.success_message || '',
      is_custom_password_label: this.state.isCustomPasswordLabel || false,
      custom_password_label: this.state.customPasswordLabel || 'Contraseña',
      show_event_date: this.state.event.show_event_date,
      hide_event_in_passed:this.state.event.hide_event_in_passed ?? false
    };
    console.log('data',data)
    try {
      if (event._id) {
        const info = await EventsApi.editOne(data, event._id);
        await firestore
          .collection('events')
          .doc(event._id)
          .update(info);
        this.props.updateEvent(info);
        self.setState({ loading: false });
        DispatchMessageService({
          type: 'success',
          msj: intl.formatMessage({
            id: 'toast.success',
            defaultMessage: 'Ok!',
          }),
          action: 'show',
        });
      } else {
        const result = await Actions.create('/api/events', data);
        this.setState({ loading: false });
        if (result._id) {
          window.location.replace(`${window.location.origin}/event/${result._id}`);
        } else {
          DispatchMessageService({
            type: 'warning',
            msj: intl.formatMessage({
              id: 'toast.warning',
              defaultMessage: 'Idk',
            }),
            action: 'show',
          });
          this.setState({ msg: 'Cant Create', create: false });
        }
      }
    } catch (error) {
      DispatchMessageService({
        type: 'error',
        msj: intl.formatMessage({
          id: 'toast.error',
          defaultMessage: 'Sry :(',
        }),
        action: 'show',
      });
      if (error?.response) {
        const { status, data } = error.response;

        if (status === 401) {
          DispatchMessageService({
            type: 'error',
            msj: `Error : ${data?.message || status}`,
            action: 'show',
          });
        } else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        if (error.request) {
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
    }
  }
  //Delete event
  async deleteEvent() {
    const self = this;
    DispatchMessageService({
      type: 'loading',
      key: 'loading',
      msj: self.props.intl.formatMessage({ id: 'toast.success', defaultMessage: 'Ok!' }),
      action: 'show',
    });
    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        const onHandlerRemove = async () => {
          try {
            await EventsApi.deleteOne(self.state.event._id);
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });
            window.location.replace(`${window.location.origin}/myprofile`);
          } catch (e) {
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: handleRequestError(e).message,
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  }
  closeModal = () => {
    this.setState({ modal: false, message: {} });
  };
  modalEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ modal: true });
  };

  async specificDates(checked) {
    this.setState({ specificDates: checked });

    if (checked === false) {
      const properties = {
        dates: {},
      };

      await EventsApi.editOne(properties, this.props.eventId);
    }
  }

  getInitialPage(data) {
    this.setState({ event: { ...this.state.event, initial_page: data } });
  }

  handleChangeReactQuill = (e) => {
    this.setState({ description: e });
  };

  //Esto es para la configuración de autenticación. Nuevo flujo de Login, cambiar los campos internamente
  changeAccessTypeForEvent = (value) => {
    const minValueEvent = 2000;
    const DefatulExternalPaymentState = false
    this.setState({ accessSelected: value });
    switch (value) {
      case 'PAYMENT_EVENT':
      case 'PUBLIC_EVENT_WITH_REGISTRATION':
        this.setState({
          extraState: false,
          event: {
            ...this.state.event,
            visibility: 'PUBLIC',
            allow_register: true,
            payment: {
              active: value === 'PAYMENT_EVENT',
              price: minValueEvent,
              currency: 'COP',
              externalPayment: DefatulExternalPaymentState,
              urlExternalPayment:''
            },
          },
        });
        break;
      case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
        this.setState({
          accessSelected: 'PUBLIC_EVENT_WITH_REGISTRATION',
          extraState: true,
          event: {
            ...this.state.event,
            visibility: 'ANONYMOUS',
            allow_register: true,
            payment: {
              active: false,
              price: minValueEvent,
              currency: 'COP',
              externalPayment: DefatulExternalPaymentState,
              urlExternalPayment:''
            },
          },
        });
        break;
      case 'UN_REGISTERED_PUBLIC_EVENT':
        this.setState({
          extraState: false,
          event: {
            ...this.state.event,
            visibility: 'PUBLIC',
            allow_register: false,
            payment: {
              active: false,
              price: minValueEvent,
              currency: 'COP',
              externalPayment: DefatulExternalPaymentState,
              urlExternalPayment:''
            },
          },
        });
        break;
      case 'PRIVATE_EVENT':
        this.setState({
          extraState: false,
          event: {
            ...this.state.event,
            visibility: 'PRIVATE',
            allow_register: false,
            payment: {
              active: false,
              price: minValueEvent,
              currency: 'COP',
              externalPayment: DefatulExternalPaymentState,
              urlExternalPayment:''
            },
          },
        });
        break;

      default:
        break;
    }
  };

  onChangePrice =  (newPrice) => {
    this.setState({
      event: {
        ...this.state.event,
        payment: {
          ...this.state.event.payment,
          price: newPrice,
        },
      },
    });
  }

  onChangeCurrency = (newCurrency) => {
    this.setState({
      event: {
        ...this.state.event,
        payment: {
          ...this.state.event.payment,
          currency:newCurrency
        },
      },
    });
  }
  onChangeExternalPayment = (externalPayment) => {
    this.setState({
      event: {
        ...this.state.event,
        payment: {
          ...this.state.event.payment,
          externalPayment
        },
      },
    });
  }

  onChangeUrlExternalPayment = (urlExternalPayment) => {
    this.setState({
      event: {
        ...this.state.event,
        payment: {
          ...this.state.event.payment,
          urlExternalPayment
        },
      },
    });
  }
  /** RESTRICIONES */
  theEventIsActive = (state) => {
    this.setState({
      iMustBlockAFunctionality: state,
      iMustValidate: false,
    });
  };

  handleChangeRedirectForm = (value) => {
    this.setState({ event: { ...this.state.event, redirect_landing: value } });
  };
  onChangeCheckDate = (checked) => {
    this.setState({
      event: {
        ...this.state.event,
        show_event_date: checked,
      },
    });
  };

  onChangeHideEvents = (checked)=>{
    this.setState({
      event: {
        ...this.state.event,
        hide_event_in_passed: checked,
      },
    });
  }

  render() {
    console.log('this.props.event',this.state)

    const {
      event,
      categories,
      organizers,
      types,
      selectedCategories,
      selectedOrganizer,
      selectedType,
      errorData,
      serverError,
      image,
      loading,
      accessSelected,
      extraState,
    } = this.state;

    if (loading) return <Loading />;
    // const userContext = this.context;
    /** RESTRICIONES */
    // const cUser = userContext?.value;
    // const userPlan = userContext.value?.plan;
    // const streamingHours = userPlan?.availables?.streaming_hours;
    const isOnlineEventExternal =
      this.state.event.type_event === 'onlineEvent' && this.state.event.where_it_run !== 'InternalEvent';
    return (
      <Fragment>
        {/* RESTRICIONES */}
        {/* {iMustValidate && (
          <>
            <ValidateEventStart
              startDate={event.datetime_from}
              callBackTheEventIsActive={this.theEventIsActive}
              user={cUser}
            />
          </>
        )} */}
        <Form onFinish={this.submit} {...formLayout}>
          <Header title={'Datos del evento'} save form remove={this.deleteEvent} edit={this.state.event._id} />
          <Tabs activeKey={this.state.tabActive} onChange={(key) => this.setState({ tabActive: key })}>
            <Tabs.TabPane tab='General' key='1'>
              <Row justify='center' wrap gutter={[8, 8]}>
                <Col span={16}>
                  <Form.Item
                    label={
                      <label style={{ marginTop: '2%' }}>
                        Nombre <label style={{ color: 'red' }}>*</label>
                      </label>
                    }
                    rules={[{ required: true, message: 'El nombre es requerido' }]}>
                    <Input
                      autoFocus={true}
                      name={'name'}
                      placeholder={'Nombre del evento'}
                      value={event.name}
                      onChange={(e) => this.handleChange(e, 'name')}
                    />
                  </Form.Item>

                  {event.app_configuration && (
                    <Form.Item label={'¿Qué módulo desea observar en el inicio?'}>
                      <Select
                        name={'homeSelectedScreen'}
                        value={event.homeSelectedScreen}
                        onChange={(e) => this.handleChange(e, 'homeSelectedScreen')}>
                        <Option value={null}>Banner de inicio</Option>
                        <Option
                          value={
                            event.app_configuration.ProfileScreen ? event.app_configuration.ProfileScreen.name : ''
                          }>
                          {event.app_configuration.ProfileScreen
                            ? event.app_configuration.ProfileScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.CalendarScreen ? event.app_configuration.CalendarScreen.name : ''
                          }>
                          {event.app_configuration.CalendarScreen
                            ? event.app_configuration.CalendarScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.NewsScreen ? event.app_configuration.NewsScreen.name : ''}>
                          {event.app_configuration.NewsScreen
                            ? event.app_configuration.NewsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.EventPlaceScreen
                              ? event.app_configuration.EventPlaceScreen.name
                              : ''
                          }>
                          {event.app_configuration.EventPlaceScreen
                            ? event.app_configuration.EventPlaceScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.SpeakerScreen ? event.app_configuration.SpeakerScreen.name : ''
                          }>
                          {event.app_configuration.SpeakerScreen
                            ? event.app_configuration.SpeakerScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.SurveyScreen ? event.app_configuration.SurveyScreen.name : ''}>
                          {event.app_configuration.SurveyScreen
                            ? event.app_configuration.SurveyScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={
                            event.app_configuration.DocumentsScreen ? event.app_configuration.DocumentsScreen.name : ''
                          }>
                          {event.app_configuration.DocumentsScreen
                            ? event.app_configuration.DocumentsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.WallScreen ? event.app_configuration.WallScreen.name : ''}>
                          {event.app_configuration.WallScreen
                            ? event.app_configuration.WallScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option value={event.app_configuration.WebScreen ? event.app_configuration.WebScreen.name : ''}>
                          {event.app_configuration.WebScreen
                            ? event.app_configuration.WebScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                        <Option
                          value={event.app_configuration.FaqsScreen ? event.app_configuration.FaqsScreen.name : ''}>
                          {event.app_configuration.FaqsScreen
                            ? event.app_configuration.FaqsScreen.title
                            : 'Favor seleccionar items del menú para la '}
                        </Option>
                      </Select>
                    </Form.Item>
                  )}

                  <TypeEvent
                    loading={loading}
                    event={event}
                    handleFormDataOfEventType={(values) => this.handleFormDataOfEventType(values)}
                    isCms
                  />
                  <ActivityRedirectForm
                    eventId={this.props.event._id}
                    initialState={this.props.event?.redirect_activity}
                    disabled={isOnlineEventExternal}
                  />
                  <LandingRedirectForm
                    eventId={this.props.event._id}
                    initialState={this.state.event?.redirect_landing}
                    disabled={isOnlineEventExternal}
                    handleChangeRedirectForm={this.handleChangeRedirectForm}
                  />
                  <CustomPasswordLabel
                    isCustomPasswordLabel={this.state.isCustomPasswordLabel}
                    customPasswordLabel={this.state.customPasswordLabel}
                    handleChangeCustomPassword={this.handleChangeCustomPassword}
                  />

                  <Form.Item label={'Especificar fechas'}>
                    <CustomDateEvent eventId={this.props.event._id} updateEvent={this.props.updateEvent} />
                  </Form.Item>
                  <WithouHistoryEventPased
                    initialState={event?.hide_event_in_passed ?? false}
                    onChangeHideEvents={this.onChangeHideEvents}
                  />
                  <Form.Item label={'Ocultar fecha del evento'}>
                    <Checkbox onChange={(e) => this.onChangeCheckDate(e.target.checked)} checked={event.show_event_date}>
                      Seleccione esta opción si deseas que tu fecha no sea visible para tu evento
                    </Checkbox>
                  </Form.Item>
                  <Form.Item label={'Descripción'}>
                    <EviusReactQuill name={'description'} data={event.description} handleChange={this.chgTxt} />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Organizado por:'}
                      isMulti={false}
                      selectedOptions={selectedOrganizer}
                      selectOption={this.selectOrganizer}
                      options={organizers}
                      required={true}
                    />
                  </Form.Item>

                  <div>
                    <label style={{ marginTop: '2%' }}>Imagen General (para el listado)</label>
                    <Form.Item noStyle>
                      <ImageUploaderDragAndDrop
                        imageDataCallBack={(imageUrl) => this.handleImage(imageUrl)}
                        imageUrl={image}
                        width='1080'
                        height='1080'
                      />
                    </Form.Item>
                  </div>

                  <Form.Item label={'Vídeo'}>
                    <Input
                      name={'video'}
                      placeholder={'¿El evento tiene video promocional?'}
                      value={event.video}
                      onChange={(e) => this.handleChange(e, 'video')}
                    />
                  </Form.Item>

                  <Form.Item label={'Posición del video'}>
                    <Switch
                      name={'video_position'}
                      checked={event.video_position === true || event.video_position === 'true'}
                      checkedChildren='Arriba'
                      unCheckedChildren='Abajo'
                      onChange={(checked) =>
                        this.setState({
                          event: {
                            ...this.state.event,
                            video_position: checked ? 'true' : 'false',
                          },
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Categorías:'}
                      isMulti={true}
                      max_options={2}
                      selectedOptions={selectedCategories}
                      selectOption={this.selectCategory}
                      options={categories}
                      /* required={true} */
                    />
                  </Form.Item>

                  <Form.Item>
                    <SelectInput
                      name={'Tipo'}
                      isMulti={false}
                      selectedOptions={selectedType}
                      selectOption={this.selectType}
                      options={types}
                      /* required={true} */
                    />
                  </Form.Item>

                  <Form.Item label={'Id Google Analytics'}>
                    <Input
                      name={'googleanlyticsid'}
                      placeholder={'UA-XXXXXX-X | G-XXXXXX'}
                      value={event.googleanlyticsid}
                      onChange={this.googleanlyticsid}
                    />
                  </Form.Item>

                  <Form.Item label={'Id Google Tag Manager'}>
                    <Input
                      name={'googletagmanagerid'}
                      placeholder={'GTM-XXXXXX'}
                      value={event.googletagmanagerid}
                      onChange={this.googletagmanagerid}
                    />
                  </Form.Item>

                  <Form.Item label={'Id Facebook Pixel'}>
                    <Input
                      name={'facebookpixelid'}
                      placeholder='014180041516129'
                      value={event.facebookpixelid}
                      onChange={this.facebookpixelid}
                    />
                  </Form.Item>

                  <Card title='Zona Social'>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Chat General</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.publicChat}
                          onChange={(checked) =>
                            this.setState(
                              {
                                tabs: {
                                  ...this.state.tabs,
                                  publicChat: checked,
                                },
                              },
                              async () => await this.upsertTabs()
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Chat Privado</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.privateChat}
                          onChange={(checked) =>
                            this.setState(
                              {
                                tabs: {
                                  ...this.state.tabs,
                                  privateChat: checked,
                                },
                              },
                              async () => await this.upsertTabs()
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row style={{ padding: '8px 0px' }}>
                      <Col xs={18}>Asistentes</Col>
                      <Col xs={6}>
                        <Switch
                          checked={this.state?.tabs?.attendees}
                          onChange={(checked) =>
                            this.setState(
                              {
                                tabs: {
                                  ...this.state.tabs,
                                  attendees: checked,
                                },
                              },
                              async () => await this.upsertTabs()
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
              <BackTop />
            </Tabs.TabPane>
            <Tabs.TabPane tab='Tipos de acceso' key='2' style={{ paddingLeft: '32px', paddingRight: '32px' }}>
              <Row justify='start' wrap gutter={[16, 16]}>
                {AccessTypeCardData.map((item) => (
                  <Col key={item.id} xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
                    <AccessTypeCard
                      {...item}
                      callBackSelectedItem={this.changeAccessTypeForEvent}
                      itemSelected={accessSelected}
                      extraState={extraState}
                      changeValue={(price) =>
                        this.setState({
                          event: {
                            ...this.state.event,
                            payment: {
                              currency: this.state.event.payment?.currency,
                              active: this.state.event.payment?.active,
                              price,
                            },
                          },
                        })
                      }
                      valueInput={this.state.event.payment?.price}
                      payment={this.state.event.payment?.active}
                      currency={this.state.event.payment?.currency}
                      changeCurrency={(currency) => {
                        this.setState({
                          event: {
                            ...this.state.event,
                            payment: {
                              ...this.state.event.payment,
                              currency,
                            },
                          },
                        });
                      }}
                      isCms
                      redirect={this.props.matchUrl}
                    />
                  </Col>
                ))}
                {/* {console.log('accessSelected', this.state.event.payment)} */}
                {/* {accessSelected === 'PUBLIC_EVENT_WITH_REGISTRATION' && (
                  <Col span={24}>
                    <Card style={{ borderRadius: '8px' }}>
                      <Form.Item
                        tooltip={'Esta funcionalidad se encuentra en construcción. - Tecnología 🛠️'}
                        label={'Mensaje al finalizar el registro'}>
                        <Row justify='center' wrap gutter={[8, 8]}>
                          <Col span={18}>
                            <Form.Item>
                              <EviusReactQuill data={this.state.registrationMessage} handleChange={this.handleChange} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form.Item>
                    </Card>
                  </Col>
                )} */}
                {accessSelected === 'PAYMENT_EVENT' && (
                  <Col span={24}>
                    <Card style={{ borderRadius: '8px', boxShadow: '0px 2px 0px 2px #2593FC' }}>
                      <Typography.Title level={4}>Configuración avanzada</Typography.Title>
                      <ConfigAdvancePayment 
                        valueInput={this.state.event.payment?.price} 
                        changeValue={this.onChangePrice} 
                        payment = {accessSelected === 'PAYMENT_EVENT'} 
                        currency={this.state.event.payment.currency}  
                        changeCurrency = {this.onChangeCurrency}
                        onChangeUrlExternalPayment={this.onChangeUrlExternalPayment}
                        onChangeExternalPayment = {this.onChangeExternalPayment} 
                        valueUrlExternalPayment = {this.state.event.payment?.urlExternalPayment}
                        checkedExternalPayment={this.state.event.payment.externalPayment}
                      />
                    </Card>
                  </Col>
                )}
              </Row>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab='Landing informativa'
              key='3'
              style={{ paddingLeft: '25px', paddingRight: '25px', paddingBottom: '30px' }}>
              <PreLandingSections tabActive={this.state.tabActive} changeTab={this.changeTab} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab='Descripción'
              key='4'
              style={{ paddingLeft: '25px', paddingRight: '25px', paddingBottom: '30px' }}>
              <DescriptionDynamic />
            </Tabs.TabPane>
          </Tabs>
          {serverError && <ErrorServe errorData={errorData} />}
          {this.state.fileMsgBanner && <p className='help is-success'>{this.state.fileMsgBanner}</p>}
        </Form>
      </Fragment>
    );
  }
}

//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
function handleFields(organizers, types, categories, event) {
  let selectedCategories = [];
  let selectedType = {};
  const { category_ids, organizer_id, event_type_id } = event;
  if (category_ids) {
    categories.map((item) => {
      let pos = category_ids.indexOf(item.value);
      return pos >= 0 ? selectedCategories.push(item) : '';
    });
  }
  const pos = organizers
    .map((e) => {
      return e.value;
    })
    .indexOf(organizer_id);
  const selectedOrganizer = organizers[pos];
  if (event_type_id) {
    const pos = types
      .map((e) => {
        return e.value;
      })
      .indexOf(event_type_id);
    selectedType = types[pos];
  } else selectedType = undefined;
  return { selectedOrganizer, selectedCategories, selectedType };
}

export default injectIntl(General);
