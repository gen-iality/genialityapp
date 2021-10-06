import React, { Component } from 'react';
import { app, firestore } from '../../helpers/firebase';
import { Activity, eventTicketsApi, TicketsApi, UsersApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import Dialog from './twoAction';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import QRCode from 'qrcode.react';
import { icon } from '../../helpers/constants';
import { Redirect } from 'react-router-dom';
import { Actions } from '../../helpers/request';
import Moment from 'moment';
import FormComponent from '../events/registrationForm/form';
import { message, Modal } from 'antd';
import withContext from '../../Context/withContext';
import { ComponentCollection } from 'survey-react';
import { saveImageStorage } from '../../helpers/helperSaveImage';
import { DeleteOutlined } from '@ant-design/icons';

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
      options: [
        {
          type: 'danger',
          text: 'Eliminar/Borrar',
          icon: <DeleteOutlined />,
          action: this.deleteUser,
        },
      ],
      loadingregister: false,
    };
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
      if (value.properties) {
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
      } else {
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
  }

  componentWillUnmount() {
    this.setState({ user: {}, edit: false });
  }

  deleteUser = async (user) => {
    const { substractSyncQuantity } = this.props;
    let messages = {};
    // let resultado = null;
    const self = this;
    const userRef = firestore.collection(`${this.props.cEvent.value?._id}_event_attendees`);
    try {
      await Actions.delete(`/api/events/${this.props.cEvent.value?._id}/eventusers`, user._id);
      // message = { class: 'msg_warning', content: 'USER DELETED' };
      toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
      message.success('Eliminado correctamente');
    } catch (e) {
      ///Esta condición se agrego porque algunas veces los datos no se sincronizan
      //bien de mongo a firebase y terminamos con asistentes que no existen
      if (e.response && e.response.status === 404) {
        userRef.doc(this.state.userId).delete();
        toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
      } else {
        messages = { class: 'msg_danger', content: e };
        toast.info(e);
      }
    } finally {
      setTimeout(() => {
        messages.class = message.content = '';
        //self.closeModal();
      }, 500);
    }

    //Borrado de usuario en Firebase
    userRef
      .doc(this.state.userId)
      .delete()
      .then(function() {
        message.class = 'msg_warning';
        message.content = 'USER DELETED';
        toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);

        //Ejecuta la funcion si se realiza la actualizacion en la base de datos correctamente
        substractSyncQuantity();
      });
    setTimeout(() => {
      message.class = message.content = '';
      self.closeModal();
    }, 500);
  };

  closeModal = () => {
    let message = { class: '', content: '' };
    this.setState({ user: {}, valid: true, modal: false, uncheck: false, message }, this.props.handleModal());
  };

  saveUser = async (values) => {
    this.setState({ loadingregister: true });
    console.log('callback=>', values);
    let resp;
    if(values){
      const snap = { properties: values };
      resp = await UsersApi.createOne(snap, this.props.cEvent?.value?._id);
      console.log("USERADD==>",resp)
    }
    if (this.props.byActivity) {     
       
    }
    if (resp) {
      message.success('Usuario agregado correctamente');
      this.props.handleModal();
    } else {
      message.error('Usuario agregado correctamente');
    }

    this.setState({ loadingregister: false });
  };

  render() {
    const { user, checked_in, ticket_id, rol, rolesList, userId, tickets } = this.state;
    const { modal } = this.props;
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
          <FormComponent
            conditionalsOther={this.props.cEvent?.value?.fields_conditions || []}
            initialOtherValue={this.props.value}
            eventUserOther={user || {}}
            fields={this.props.extraFields}
            organization={true}
            options={this.state.options}
            callback={this.saveUser}
            loadingregister={this.state.loadingregister}
          />
        </div>
      </Modal>
    );
  }
}

export default withContext(UserModal);
