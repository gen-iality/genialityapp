import { Component, createRef } from 'react';
import { app, firestore } from '../../helpers/firebase';
import { Activity, AttendeeApi, eventTicketsApi, OrganizationApi, TicketsApi, UsersApi } from '../../helpers/request';
import { injectIntl } from 'react-intl';
import QRCode from 'qrcode.react';
import { icon } from '../../helpers/constants';
import { Redirect } from 'react-router-dom';
import { Actions } from '../../helpers/request';
import Moment from 'moment';
import FormComponent from '../events/registrationForm/form';
import { Modal } from 'antd';
import withContext from '../../context/withContext';
import { ComponentCollection } from 'survey-react';
import { saveImageStorage } from '../../helpers/helperSaveImage';
import { DeleteOutlined, ExclamationCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { FaBullseye } from 'react-icons/fa';
import { GetTokenUserFirebase } from '../../helpers/HelperAuth';
import { DispatchMessageService } from '../../context/MessageService';
import FormEnrollAttendeeToEvent from '../forms/FormEnrollAttendeeToEvent';
import { handleRequestError } from '@/helpers/utils';
import printBagdeUser from '../badge/utils/printBagdeUser';
const { confirm } = Modal;

class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statesList: [],
      rolesList: [],
      message: {},
      user: null,
      state: '',
      rol: '',
      prevState: '',
      userId: 'mocionsoft',
      emailError: false,
      confirmCheck: true,
      valid: true,
      checked_in: false,
      tickets: [],
      loadingregister: false,
    };
    this.ifrmPrint = createRef();
  }

  async componentDidMount() {
    const self = this;
    const { rolesList } = this.props;
    self.setState({ rolesList, rol: rolesList.length > 0 ? rolesList[0]._id : '' });
    const tickets = await eventTicketsApi.getAll(this.props.cEvent?.value?._id || '5ea23acbd74d5c4b360ddde2');
    if (tickets.length > 0) this.setState({ tickets });
    let user = {};
    if (this.props.edit) {
      const { value } = this.props;
      if (value?.properties) {
        Object.keys(value.properties).map((obj) => {
          return (user[obj] = value.properties[obj]);
        });
        let checked_in = value.checkedin_at ? true : false;
        user = { ...user, _id: value._id };
        this.setState({
          user,
          ticket_id: value.ticket_id,
          edit: true,
          rol: value.rol_id,
          confirmCheck: checked_in,
          userId: value._id,
          prevState: value.state_id,
          valid: false,
        });
      } else if (value) {
        Object.keys(value).map((obj) => {
          return (user[obj] = value[obj]);
        });
        let checked_in = value.checkedin_at ? true : false;
        this.setState({
          user,
          ticket_id: value.ticket_id,
          edit: true,
          rol: value.rol,
          confirmCheck: checked_in,
          userId: value._id,
          prevState: value.state_id,
          valid: false,
        });
      }
    } else {
      this.props.extraFields.map((obj) => {
        user[obj.name] = obj.type === 'boolean' ? false : obj.type === 'number' ? 0 : '';
        return user;
      });
      this.setState({ found: 1, user, edit: false, ticket_id: this.props.ticket });
    }
    //console.log('EXTRAFIELDS===>', this.props.extraFields);
  }

  componentWillUnmount() {
    this.setState({ user: {}, edit: false });
  }
  options = [
    {
      type: 'danger',
      text: 'Eliminar/Borrar',
      icon: <DeleteOutlined />,
      action: () => this.deleteUser(this.state.user),
    },
  ];

  deleteUser = async (user) => {
    const activityId = this.props.activityId;

    let messages = {};
    const self = this;

    confirm({
      title: `¿Está seguro de eliminar la información?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Una vez eliminado, no lo podrá recuperar',
      okText: 'Borrar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk() {
        DispatchMessageService({
          type: 'loading',
          key: 'loading',
          msj: ' Por favor espere mientras se borra la información...',
          action: 'show',
        });
        self.setState({ loadingregister: true });

        const onHandlerRemove = async () => {
          try {
            const selectedEventUserId = user._id;

            if (activityId) await UsersApi.deleteAttendeeInActivity(activityId, selectedEventUserId);
            if (!activityId) await AttendeeApi.delete(self.props.cEvent.value?._id, selectedEventUserId);

            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'success',
              msj: 'Se eliminó la información correctamente!',
              action: 'show',
            });

            setTimeout(() => {
              messages.class = messages.content = '';
              self.setState({ loadingregister: false });
              self.closeModal();
            }, 500);
          } catch (e) {
            self.setState({ loadingregister: false });
            DispatchMessageService({
              key: 'loading',
              action: 'destroy',
            });
            DispatchMessageService({
              type: 'error',
              msj: 'Error eliminando el usuario',
              action: 'show',
            });
          }
        };
        onHandlerRemove();
      },
    });
  };

  closeModal = () => {
    let message = { class: '', content: '' };
    this.setState({ user: {}, valid: true, modal: false, uncheck: false, message }, this.props.handleModal());
  };

  saveUser = async (values) => {
    const activityId = this.props.activityId;
    const eventId = this.props.cEvent?.value?._id || this.props.cEvent?.value?.idEvent;
    this.setState({ loadingregister: true });
    //console.log('callback=>', values);
    let resp;
    let respActivity = true;
    let active = true
    if (values) {
      /* console.log("ACA VALUES==>",values) */
      const snap = { rol_id: values.rol_id, properties: values, active };
      if (this.props.organizationId && !this.props.edit) {
        resp = await OrganizationApi.saveUser(this.props.organizationId, snap);
        /* console.log("10. resp ", resp) */
      } else {
        if (!this.props.edit) {
          try {
            if (activityId) {
              respActivity = await UsersApi.createUserInEventAndAssignToActivity(snap.properties, activityId);
            } else {
              resp = await UsersApi.createOne(snap, eventId);
            }
          } catch (error) {
            if (handleRequestError(error).message === 'users limit exceeded') {
              DispatchMessageService({
                type: 'error',
                msj: 'Ha exedido el límite de usuarios en el plan',
                action: 'show',
              });
            } else {
              DispatchMessageService({
                type: 'error',
                msj: 'Usuario ya registrado en el evento',
                action: 'show',
              });
            }

            respActivity = false;
          }
        } else {
          resp = await UsersApi.editEventUser(snap, eventId, this.props.value._id);
        }
      }

      if (this.props.updateView) {
        await this.props.updateView();
      }
    }

    if (resp || respActivity) {
      DispatchMessageService({
        type: 'success',
        msj: this.props?.edit ? 'Usuario editado correctamente' : 'Usuario agregado correctamente',
        action: 'show',
      });
      this.props.handleModal();
    } else {
      DispatchMessageService({
        type: 'error',
        msj: 'Error al guardar el usuario',
        action: 'show',
      });
    }

    this.setState({ loadingregister: false });
  };

  printUser = () => {
    const resp = this.props.badgeEvent;
    if (resp._id) {
      let badges = resp.BadgeFields;
      if (this.props.value && !this.props.value.checked_in && this.props.edit) this.props.checkIn(this.state.userId);
      printBagdeUser(this.ifrmPrint, badges, this.state.user);
    } else this.setState({ noBadge: true });
  };

  render() {
    const { user, checked_in, ticket_id, rol, rolesList, userId, tickets } = this.state;
    const { modal, badgeEvent, componentKey } = this.props;
    let qrSize = badgeEvent?.BadgeFields?.find((bagde) => bagde.qr === true);
    if (this.state.redirect) return <Redirect to={{ pathname: this.state.url_redirect }} />;
    return (
      <Modal closable footer={false} onCancel={() => this.props.handleModal()} visible={true}>
        <div
          // className='asistente-list'
          style={{
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            marginTop: '30px',
          }}>
          {componentKey === 'event-checkin' || componentKey == 'activity-checkin' ? (
            <FormEnrollAttendeeToEvent
              fields={this.props.extraFields}
              conditionalFields={this.props.cEvent?.value?.fields_conditions}
              attendee={this.props.value}
              options={this.options}
              saveAttendee={this.saveUser}
              printUser={this.printUser}
              loaderWhenSavingUpdatingOrDelete={this.state.loadingregister}
              visibleInCms
              eventType={this.props.cEvent?.value?.type_event}
              badgeEvent={this.props.badgeEvent}
              activityId={this.props.activityId}
            />
          ) : (
            <FormComponent
              conditionalsOther={this.props.cEvent?.value?.fields_conditions || []}
              initialOtherValue={this.props.value || {}}
              eventUserOther={user || {}}
              fields={this.props.extraFields}
              organization={true}
              options={this.options}
              callback={this.saveUser}
              loadingregister={this.state.loadingregister}
              usedInCms={true}
            />
          )}
        </div>
        <div style={{ opacity: 0, display: 'none' }}>
          {user && badgeEvent && badgeEvent.BadgeFields && <QRCode value={userId} size={qrSize ? qrSize?.size : 64} />}
        </div>
        <iframe title={'Print User'} ref={this.ifrmPrint} style={{ opacity: 0, display: 'none' }} />
      </Modal>
    );
  }
}

export default injectIntl(withContext(UserModal));
