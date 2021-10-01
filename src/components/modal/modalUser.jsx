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
import { Modal } from 'antd';
import withContext from '../../Context/withContext';
import { ComponentCollection } from 'survey-react';
import { saveImageStorage } from '../../helpers/helperSaveImage';

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
      options:[]
    };
  }

  async componentDidMount() {
    const self = this;
    const { rolesList } = this.props;
    self.setState({ rolesList, rol: rolesList.length > 0 ? rolesList[0]._id : '' });
    const tickets = await eventTicketsApi.getAll(this.props.cEvent?.value?._id || "5ea23acbd74d5c4b360ddde2");
    if (tickets.length > 0) this.setState({ tickets });
    let user = {};
    if (this.props.edit) {
      const { value } = this.props;
      console.log("VALUESEDIT==>",value)
      if (value.properties) {
        Object.keys(value.properties).map((obj) => {
          return (user[obj] = value.properties[obj]);
        });
        let checked_in = value.checkedin_at ? true : false;
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



  async handleSubmitFireStore(values,user) {
    
  
    const { substractSyncQuantity } = this.props;
    const self = this;
    let message = {};
    const snap = values;

    const userRef = firestore.collection(`${this.props.cEvent.value?._id}_event_attendees`);
   
      snap.updated_at = new Date();
      snap.created_at = new Date();
      if (values.checked_in) {
        snap.checked_in=true
        snap.checkedin_at = new Date();        
      }else{
        snap.checkedin_at = "";
        snap.checked_in=false
      }

       //Mejor hacer un map pero no se como
     /*  if (snap.ticket_id === undefined || !snap.ticket_id || snap.ticket_id === 'undefined') {
        snap.ticket_id = null;
      }
      if (snap.rol_id === undefined || !snap.rol_id || snap.rol_id === 'undefined') {
        snap.rol_id = null;
      }*/
      userRef.doc(user._id)
        .update(snap)
        .then((docRef) => {
         // self.setState({ userId: docRef.id, edit: true });
          message.class = 'msg_success';
          message.content = 'USER CREATED';
          toast.success(<FormattedMessage id='toast.user_saved' defaultMessage='Ok!' />);
          //this.props.handleModal();          
          //Ejecuta la funcion si se realiza la actualizacion en la base de datos correctamente
          substractSyncQuantity();
          this.setState({ message, create: false });
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
          message.class = 'msg_danger';
          message.content = 'User can`t be created';
        });   
    
  }


  deleteUser = async () => {
    const { substractSyncQuantity } = this.props;
    let message = {};
    // let resultado = null;
    const self = this;
    const userRef = firestore.collection(`${this.props.cEvent.value?._id}_event_attendees`);
    try {
      await Actions.delete(`/api/events/${this.props.cEvent.value?._id}/eventusers`, this.state.userId);
      message = { class: 'msg_warning', content: 'USER DELETED' };
      toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
    } catch (e) {
      ///Esta condición se agrego porque algunas veces los datos no se sincronizan
      //bien de mongo a firebase y terminamos con asistentes que no existen
      if (e.response && e.response.status === 404) {
        userRef.doc(this.state.userId).delete();
        toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
      } else {
        message = { class: 'msg_danger', content: e };
        toast.info(e);
      }
    } finally {
      setTimeout(() => {
        message.class = message.content = '';
        self.closeModal();
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

  goBadge = () => {
    this.setState({ redirect: true, url_redirect: '/event/' + this.props.cEvent.value?._id + '/badge', noBadge: false });
  };
  closeNoBadge = () => {
    this.setState({ noBadge: false });
  };

  unCheck = () => {
    const { substractSyncQuantity } = this.props;

    const userRef = firestore.collection(`${this.props.cEvent.value?._id}_event_attendees`).doc(this.props.value._id);
    userRef
      .update({ checked_in: false, checked_at: app.firestore.FieldValue.delete() })
      .then(() => {
        this.setState({ uncheck: false });
        this.closeModal();

        //Ejecuta la funcion si se realiza la actualizacion en la base de datos correctamente
        substractSyncQuantity();
      })
      .catch((error) => {
        console.error('Error updating document: ', error);
      });
  };

  closeUnCheck = () => {
    this.setState({ uncheck: false });
  };
  submitValues=async (values,image)=>{
   console.log("VALUES==>", values,image)
   let ruta="https://www.latercera.com/resizer/m0bOOb9drSJfRI-C8RtRL_B4EGE=/375x250/smart/arc-anglerfish-arc2-prod-copesa.s3.amazonaws.com/public/Z2NK6DYAPBHO3BVPUE25LQ22ZA.jpg";
   if (image) {
    if (image.fileList.length > 0) {
     ruta = await saveImageStorage(image.fileList[0].thumbUrl);
    }
    values.picture = ruta;
  }
   this.handleSubmit(values)
  }

  render() {
    const { user, checked_in, ticket_id, rol, rolesList, userId, tickets } = this.state;
    const { modal } = this.props;
    if (this.state.redirect) return <Redirect to={{ pathname: this.state.url_redirect }} />;
    return (
      <Modal closable footer={false} onCancel={() => this.props.handleModal()} visible={true}>
        <div
          // className='asistente-list'
          style={{
            height: '500px',
            overflowY: 'scroll',
            paddingLeft: '0px',
            paddingRight: '0px',
            paddingTop: '0px',
            paddingBottom: '0px',
            marginTop:'30px'
          }}>
          <FormComponent     
            conditionals={this.props.cEvent?.value?.fields_conditions || []}
            initialValues={this.props.value}
            eventUser={user|| {}}
            extraFieldsOriginal={this.props.extraFields}         
            organization={true}
            options={this.state.options}
            callback={()=>this.props.handleModal()}
          />
        </div>
      </Modal>
    );
  }
}

export default withContext(UserModal);
