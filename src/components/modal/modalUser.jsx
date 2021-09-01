import React, { Component } from 'react';
import { app, firestore } from '../../helpers/firebase';
import { Activity, eventTicketsApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import Dialog from './twoAction';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import QRCode from 'qrcode.react';
import { icon } from '../../helpers/constants';
import { Redirect } from 'react-router-dom';
import { Actions } from '../../helpers/request';
import Moment from 'moment';

class UserModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statesList: [],
      rolesList: [],
      message: {},
      user: {},
      state: '',
      rol: '',
      prevState: '',
      userId: 'mocionsoft',
      emailError: false,
      confirmCheck: true,
      valid: true,
      checked_in: false,
      tickets: [],
    };
  }

  async componentDidMount() {
    const self = this;
    const { rolesList } = this.props;

    self.setState({ rolesList, rol: rolesList.length > 0 ? rolesList[0]._id : '' });
    const tickets = await eventTicketsApi.getAll(this.props.eventId);
    if (tickets.length > 0) this.setState({ tickets });

    let user = {};
    if (this.props.edit) {
      const { value } = this.props;
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

  handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const snap = { properties: this.state.user, rol_id: this.state.rol };

    let message = {};
    this.setState({ create: true });
    snap.ticket_id = this.state.ticket_id;

    try {
      if (!this.state.edit) {
        if (this.state.confirmCheck) {
          let checkedin_at = new Date();
          checkedin_at = Moment(checkedin_at)
            .add(5, 'hours')
            .format('YYYY-MM-D H:mm:ss');
          snap.checkedin_at = checkedin_at;
          snap.checked_in = true;
        } else {
          snap.checkedin_at = '';
          snap.checked_in = false;
        }

        let respAddEvento = await Actions.post(`/api/eventUsers/createUserAndAddtoEvent/${this.props.eventId}`, snap);
        console.log("RESPUESTA ADD EVENTO==>",respAddEvento)
        if(respAddEvento.data && respAddEvento.data.rol_id=='60e8a8b7f6817c280300dc23'){
          let updateRol=await Actions.put(
            `/api/events/${this.props.eventId}/eventusers/${respAddEvento.data._id}/updaterol`,
            {
              rol_id:this.state.rol
            }        
          );
        }
     
        if (this.props.byActivity && respAddEvento.data.user) {
          let respActivity = await Activity.Register(
            this.props.eventId,
            respAddEvento.data.user._id,
            this.props.activityId
          );
          await this.props.checkinActivity(respAddEvento.data._id, snap.checked_in, snap, false);

          await this.props.updateView();
          this.closeModal();
        }
        toast.success(<FormattedMessage id='toast.user_saved' defaultMessage='Ok!' />);
      } else {
        if (this.state.confirmCheck) {
          let checkedin_at = new Date();
          checkedin_at = Moment(checkedin_at)
            .add(5, 'hours')
            .format('YYYY-MM-D H:mm:ss');
          snap.checkedin_at = checkedin_at;
          snap.checked_in = true;
        } else {
          snap.checkedin_at = '';
          snap.checked_in = false;
        }

        let respAddEvento = await Actions.put(
          `/api/events/${this.props.eventId}/eventusers/${this.state.userId}`,
          snap
        );
        let updateRol=await Actions.put(
          `/api/events/${this.props.eventId}/eventusers/${this.state.userId}/updaterol`,
          {
            rol_id:this.state.rol
          }        
        );
        if(updateRol){
            console.log("updateRol",updateRol)
        }
        if (this.props.byActivity && respAddEvento.user) {
          await this.props.checkinActivity(this.state.userId, snap.checked_in, snap);
          this.closeModal();
        }
        toast.info(<FormattedMessage id='toast.user_edited' defaultMessage='Ok!' />);
        this.closeModal();
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      message.class = 'msg_danger';
      message.content = 'User can`t be updated';
    }

    this.setState({ message, create: false });
  };

  handleSubmitFireStore() {
    const { substractSyncQuantity } = this.props;
    const self = this;
    let message = {};
    const snap = { properties: this.state.user, rol_id: this.state.rol };

    const userRef = firestore.collection(`${this.props.eventId}_event_attendees`);
    if (!this.state.edit) {
      snap.updated_at = new Date();
      snap.created_at = new Date();
      if (this.state.confirmCheck) {
        snap.checkedin_at = new Date();
      }
      userRef
        .add(snap)
        .then((docRef) => {
          self.setState({ userId: docRef.id, edit: true });
          message.class = 'msg_success';
          message.content = 'USER CREATED';
          toast.success(<FormattedMessage id='toast.user_saved' defaultMessage='Ok!' />);

          //Ejecuta la funcion si se realiza la actualizacion en la base de datos correctamente
          substractSyncQuantity();
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
          message.class = 'msg_danger';
          message.content = 'User can`t be created';
        });
    } else {
      message.class = 'msg_warning';
      message.content = 'USER UPDATED';
      snap.updated_at = new Date();

      //Mejor hacer un map pero no se como
      if (snap.ticket_id === undefined || !snap.ticket_id || snap.ticket_id === 'undefined') {
        snap.ticket_id = null;
      }
      if (snap.rol_id === undefined || !snap.rol_id || snap.rol_id === 'undefined') {
        snap.rol_id = null;
      }

      userRef
        .doc(this.state.userId)
        .update(snap)
        .then(() => {
          message.class = 'msg_warning';
          message.content = 'USER UPDATED';
          toast.info(<FormattedMessage id='toast.user_edited' defaultMessage='Ok!' />);

          //Ejecuta la funcion si se realiza la actualizacion en la base de datos correctamente
          substractSyncQuantity();
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
          message.class = 'msg_danger';
          message.content = 'User can`t be updated';
        });
    }
    this.setState({ message, create: false });
  }

  printUser = () => {
    const resp = this.props.badgeEvent;
    const { user } = this.state;
    const canvas = document.getElementsByTagName('CANVAS')[0];
    let qr = canvas ? canvas.toDataURL() : '';
    if (resp._id) {
      if (this.props.value && !this.props.value.checked_in && this.props.edit) this.props.checkIn(this.state.userId);
      let oIframe = this.ifrmPrint;
      let badge = resp.BadgeFields;
      let oDoc = oIframe.contentWindow || oIframe.contentDocument;
      if (oDoc.document) {
        oDoc = oDoc.document;
      }
      // Head
      oDoc.write('<head><title>Escarapela</title>');
      // body
      oDoc.write('<body onload="window.print()"><div>');
      // Datos
      let i = 0;
      for (; i < badge.length; ) {
        if (badge[i].line) {
          if (badge[i].qr) oDoc.write(`<div><img src=${qr}></div>`);
          //se pone esta condición por un bug cuando se va a imprimir no se porque quedo en blanco
          else if (badge[i].id_properties)
            oDoc.write(
              `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${
                user[badge[i].id_properties.value]
                  ? user[badge[i].id_properties.value]
                  : user[badge[i].id_properties.label]
                  ? user[badge[i].id_properties.label]
                  : ''
              }</p>`
            );
          i++;
        } else {
          if (badge[i + 1] && !badge[i + 1].line) {
            oDoc.write(`<div style="display: flex">`);
            if (!badge[i].qr) {
              oDoc.write(`<div style="margin-right: 20px">`);
              oDoc.write(
                `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${
                  user[badge[i].id_properties.value]
                    ? user[badge[i].id_properties.value]
                    : user[badge[i].id_properties.label]
                    ? user[badge[i].id_properties.label]
                    : ''
                }</p>`
              );
              oDoc.write(`</div>`);
            } else {
              oDoc.write(`<div style="margin-right: 20px">`);
              oDoc.write(`<div><img src=${qr}></div>`);
              oDoc.write(`</div>`);
            }
            if (!badge[i + 1].qr) {
              oDoc.write(`<div style="margin-right: 20px">`);
              oDoc.write(
                `<p style="font-family: Lato, sans-serif;font-size: ${badge[i + 1].size}px;text-transform: uppercase">${
                  user[badge[i + 1].id_properties.value]
                    ? user[badge[i + 1].id_properties.value]
                    : user[badge[i + 1].id_properties.label]
                    ? user[badge[i + 1].id_properties.label]
                    : ''
                }</p>`
              );
              oDoc.write(`</div>`);
            } else {
              oDoc.write(`<div style="margin-right: 20px">`);
              oDoc.write(`<div><img src=${qr}></div>`);
              oDoc.write(`</div>`);
            }
            oDoc.write(`</div>`);
            i = i + 2;
          } else {
            oDoc.write(`<div style="display: flex">`);
            oDoc.write(`<div style="margin-right: 20px">`);
            if (!badge[i].qr) {
              oDoc.write(
                `<p style="font-family: Lato, sans-serif;font-size: ${badge[i].size}px;text-transform: uppercase">${
                  user[badge[i].id_properties.value]
                    ? user[badge[i].id_properties.value]
                    : user[badge[i].id_properties.label]
                    ? user[badge[i].id_properties.label]
                    : ''
                }</p>`
              );
            } else {
              oDoc.write(`<div><img src=${qr}></div>`);
            }
            oDoc.write(`</div>`);
            oDoc.write(`</div>`);
            i++;
          }
        }
      }
      oDoc.close();
    } else this.setState({ noBadge: true });
  };

  renderForm = () => {
    const { extraFields } = this.props;
    let formUI = extraFields.map((m, key) => {
      let type = m.type || 'text';
      let props = m.props || {};
      let name = m.name;
      let mandatory = m.mandatory;
      let target = name;
      let value = this.state.user[target];
      let input = (
        <input
          {...props}
          className='input'
          type={type}
          key={key}
          name={name}
          value={value}
          onChange={(e) => {
            this.onChange(e, type);
          }}
        />
      );
      if (type === 'boolean') {
        input = (
          <React.Fragment>
            <input
              name={name}
              id={name}
              className='is-checkradio is-primary is-rtl'
              type='checkbox'
              checked={value}
              onChange={(e) => {
                this.onChange(e, type);
              }}
            />
            <label className={`label has-text-grey-light is-capitalized ${mandatory ? 'required' : ''}`} htmlFor={name}>
              {name}
            </label>
          </React.Fragment>
        );
      }
      if (type === 'list') {
        input = m.options.map((o, key) => {
          return (
            <option key={key} value={o.value}>
              {o.value}
            </option>
          );
        });
        input = (
          <div className='select'>
            <select
              name={name}
              value={value}
              onChange={(e) => {
                this.onChange(e, type);
              }}>
              <option value={''}>Seleccione...</option>
              {input}
            </select>
          </div>
        );
      }
      return (
        <div key={'g' + key} className='field'>
          {m.type !== 'boolean' && (
            <label
              className={`label has-text-grey-light is-capitalized ${mandatory ? 'required' : ''}`}
              key={'l' + key}
              htmlFor={key}>
              {name}
            </label>
          )}
          <div className='control control-container'>{input}</div>
        </div>
      );
    });
    return formUI;
  };

  onChange = (e, type) => {
    const { value, name } = e.target;
    type === 'boolean'
      ? this.setState((prevState) => {
          return { user: { ...this.state.user, [name]: !prevState.user[name] } };
        }, this.validForm)
      : this.setState({ user: { ...this.state.user, [name]: value } }, this.validForm);
  };

  selectChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value }, this.validForm);
  };

  validForm = () => {
    const EMAIL_REGEX = new RegExp('[^@]+@[^@]+\\.[^@]+');
    const { extraFields } = this.props,
      { user } = this.state,
      mandatories = extraFields.filter((field) => field.mandatory),
      validations = [];
      let errors=0;
    mandatories.map((field, key) => {
      
      if (field.type === 'email')     
        valid =(user[field.name] && user[field.name].length > 5 && user[field.name].length < 61 && EMAIL_REGEX.test(user[field.name]))|| false;       
      if (field.type === 'text' || field.type === 'list'|| field.type=='country' || field.type=='city' || field.type === 'date' )
        valid = (user[field.name] && user[field.name].length > 0 && user[field.name] !== '' && user[field.name]!==null )|| false;        
      if (field.type === 'number') valid = (user[field.name] &&  user[field.name].length>6 && parseInt(user[field.name])>0)|| false;
      if (field.type === 'boolean') valid = typeof user[field.name] === 'boolean'|| false;
      //valid=valid?valid:false;
      return (validations[field.name] = valid);
    });   
    let valid = Object.values(validations).includes(false); 
    this.setState({ valid: valid });
  };

  deleteUser = async () => {
    const { substractSyncQuantity } = this.props;
    let message = {};
    // let resultado = null;
    const self = this;
    const userRef = firestore.collection(`${this.props.eventId}_event_attendees`);
    try {
      await Actions.delete(`/api/events/${this.props.eventId}/eventusers`, this.state.userId);
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
    this.setState({ user: {}, valid: true, modal: false, uncheck: false, message }, this.props.handleModal);
  };

  goBadge = () => {
    this.setState({ redirect: true, url_redirect: '/event/' + this.props.eventId + '/badge', noBadge: false });
  };
  closeNoBadge = () => {
    this.setState({ noBadge: false });
  };

  unCheck = () => {
    const { substractSyncQuantity } = this.props;

    const userRef = firestore.collection(`${this.props.eventId}_event_attendees`).doc(this.props.value._id);
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

  render() {
    const { user, checked_in, ticket_id, rol, rolesList, userId, tickets } = this.state;
    const { modal } = this.props;
    if (this.state.redirect) return <Redirect to={{ pathname: this.state.url_redirect }} />;
    return (
      <React.Fragment>
        <div className={`modal modal-add-user ${modal ? 'is-active' : ''}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <div className='modal-card-title'>
                <div className='icon-header' dangerouslySetInnerHTML={{ __html: icon }} />
              </div>
              <button className='delete is-large' aria-label='close' onClick={this.props.handleModal} />
            </header>
            <section className='modal-card-body'>
              <>
                <a> Manual | </a>
                <a> Pistola | </a> <a> Cámara </a>
              </>
              {this.renderForm()}
              {checked_in && (
                <div className='field'>
                  <label className='label'>Checked</label>
                  <div className='control columns control-container'>
                    <div className='column'>
                      <p>
                        <FormattedDate value={checked_in} /> - <FormattedTime value={checked_in} />
                      </p>
                    </div>
                    <div className='column'>
                      <input
                        className='is-checkradio is-primary is-small'
                        id={'unCheckUser'}
                        type='checkbox'
                        name={'unCheckUser'}
                        onChange={() => {
                          this.setState({ uncheck: true });
                        }}
                      />
                      <label htmlFor={'unCheckUser'}>UnCheck?</label>
                    </div>
                  </div>
                </div>
              )}
              {Object.keys(user).length > 0 && (
                <React.Fragment>
                  <div className='field is-grouped'>
                    <label className='label'>Rol</label>
                    <div className='control control-container'>
                      <div className='select'>
                        <select value={rol} onChange={this.selectChange} name={'rol'}>
                          {rolesList.map((item, key) => {
                            return (
                              <option key={key} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    {
                      <div className='control control-container'>
                        <input
                          className='is-checkradio is-primary is-small'
                          id={'confirmCheckIn'}
                          type='checkbox'
                          name={'confirmCheckIn'}
                          checked={this.state.confirmCheck}
                          onChange={() => {
                            this.setState((prevState) => {
                              return { confirmCheck: !prevState.confirmCheck };
                            });
                          }}
                        />
                        <label htmlFor={'confirmCheckIn'}>Chequear Usuario?</label>
                      </div>
                    }
                  </div>
                </React.Fragment>
              )}
              {tickets.length > 0 && (
                <div className='field'>
                  <div className='control control-container'>
                    <label className='label'>Tiquete</label>
                    <div className='select'>
                      <select value={ticket_id} onChange={this.selectChange} name={'ticket_id'}>
                        <option value={''}>..Seleccione</option>
                        {tickets.map((item, key) => {
                          return (
                            <option key={key} value={item._id}>
                              {item.title}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </section>
            {Object.keys(user).length > 0 && (
              <footer className='modal-card-foot'>
                {this.state.create ? (
                  <div>Creando...</div>
                ) : (
                  <div className='modal-buttons'>
                    <button className='button is-primary' onClick={this.handleSubmit} disabled={this.state.valid}>
                      Guardar
                    </button>
                    {this.state.edit && (
                      <React.Fragment>
                        <button className='button' onClick={this.printUser}>
                          Imprimir
                        </button>
                        <button
                          className='button'
                          onClick={() => {
                            this.setState({ modal: true });
                          }}>
                          Borrar
                        </button>
                      </React.Fragment>
                    )}
                    <button className='button' onClick={this.closeModal}>
                      Cancel
                    </button>
                  </div>
                )}
                <div className={'msg'}>
                  <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
                </div>
              </footer>
            )}
          </div>
          <div style={{ opacity: 0, display: 'none' }}>{userId && <QRCode value={userId} />}</div>
          <iframe title={'Print User'} ref={(el) => (this.ifrmPrint = el)} style={{ opacity: 0, display: 'none' }} />
        </div>

        <Dialog
          modal={this.state.modal}
          title={'Borrar Usuario'}
          content={<p>Seguro de borrar este usuario?</p>}
          first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.deleteUser }}
          message={this.state.message}
          second={{ title: 'Cancelar', class: '', action: this.closeModal }}
        />

        <Dialog
          modal={this.state.uncheck}
          title={'Borrar Check In'}
          content={<p>Seguro de borrar el checkIn de este usuario?</p>}
          first={{ title: 'Si', class: 'is-warning', action: this.unCheck }}
          message={this.state.message}
          second={{ title: 'Cancelar', class: '', action: this.closeUnCheck }}
        />
        <Dialog
          modal={this.state.noBadge}
          title={'Sin Escarapela'}
          content={<p>Aún no tienes creada una escarapela. Crea una o sigue editando el usuario</p>}
          first={{ title: 'Crear', class: 'is-info is-outlined', action: this.goBadge }}
          second={{ title: 'Cancelar', class: 'is-text', action: this.closeNoBadge }}
        />
      </React.Fragment>
    );
  }
}

export default UserModal;
