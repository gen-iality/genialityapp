import React, { Component, Fragment } from 'react';
import { HelperApi, UsersApi } from '../../../helpers/request';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';

class StaffModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { Nombres: '', email: '', rol: '' },
      message: {},
      found: 0,
      create: false,
      formErrors: { email: '', name: '' },
      emailValid: false,
      nameValid: false,
      rolValid: false,
      formValid: false,
      errorData: {},
      serverError: false
    };
  }

  componentDidMount() {
    if (this.props.edit)
      this.setState({ user: this.props.user, formValid: true, rolValid: true, emailValid: true, nameValid: true });
    this.setState({ found: this.props.found });
  }

  onChange = (e) => {
    const { value, name } = e.target;
    if (name === 'email') this.setState({ found: 0 }, this.validateForm);
    this.setState({ user: { ...this.state.user, [name]: value } }, this.validateField(name, value));
  };
  validateField = (fieldName, value) => {
    let { formErrors, emailValid, nameValid, rolValid } = this.state;
    switch (fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && value.length > 5 && value.length < 61;
        formErrors.email = emailValid ? '' : 'Correo inválido';
        break;
      case 'Nombres':
        nameValid = value && value.length > 0 && value !== '';
        formErrors.name = nameValid ? '' : 'El nombre no puede estar vacio';
        break;
      case 'rol':
        rolValid = value !== '';
        break;
      default:
        break;
    }
    this.setState({ formErrors, emailValid, nameValid, rolValid }, this.validateForm);
  };
  validateForm = () => {
    this.setState({ formValid: this.state.emailValid && this.state.nameValid && this.state.rolValid });
  };
  searchByEmail = async () => {
    const {
      user: { email }
    } = this.state;
    try {
      const res = await UsersApi.findByEmail(email);
      const data = res.find((user) => user.name || user.names);
      if (data) {
        this.setState(
          {
            found: 1,
            user: {
              ...this.state.user,
              id: data._id,
              Nombres: data.names ? data.names : data.name,
              space: '',
              rol: ''
            },
            emailValid: true,
            nameValid: true,
            rolValid: false
          },
          this.validateForm
        );
      } else {
        this.setState(
          {
            found: 2,
            user: { ...this.state.user, rol: '', Nombres: '' },
            emailValid: true,
            nameValid: false,
            rolValid: false
          },
          this.validateForm
        );
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;

        if (error.request) {
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
    }
  };
  handleSubmit = async () => {
    const { user } = this.state;
    const { edit } = this.props;
    this.setState({ create: true });
    try {
      const eventID = this.props.eventID;
      if (edit) {
        await HelperApi.editHelper(eventID, user.id, { role_id: user.rol, space_id: user.space });
        toast.info(<FormattedMessage id='toast.user_edited' defaultMessage='Ok!' />);
        this.setState({
          message: { ...this.state.message, class: 'msg_warning', content: 'CONTRIBUTOR UPDATED' },
          isLoading: false
        });
      } else {
        const data = { role_id: user.rol, space_id: user.space };
        if (user.id) data.model_id = user.id;
        else data.properties = { email: user.email, Nombres: user.Nombres };
        await HelperApi.saveHelper(eventID, data);
        toast.success(<FormattedMessage id='toast.user_saved' defaultMessage='Ok!' />);
        this.setState({
          message: { ...this.state.message, class: 'msg_success', content: 'CONTRIBUTOR CREATED' },
          isLoading: false
        });
      }
      this.props.updateContributors();
      setTimeout(() => {
        this.setState({ message: {}, create: false });
        this.props.handleModal();
      }, 800);
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false });
      } else {
        if (error.request) this.setState({ serverError: true, loader: false });
      }
    }
  };

  render() {
    const {
      formErrors: { name, email },
      formValid,
      emailValid,
      user,
      found
    } = this.state;
    const { roles, edit } = this.props;
    return (
      <Fragment>
        <section className='modal-card-body'>
          {found === 1 && !edit ? (
            <div className='msg'>
              <p className='msg_info has-text-centered is-size-5'>ENCONTRADO !!</p>
            </div>
          ) : found === 2 && !edit ? (
            <div className='msg'>
              <p className='msg_warning has-text-centered is-size-5'>NO ENCONTRADO</p>
            </div>
          ) : (
            ''
          )}
          {edit ? (
            <div className='field'>
              <label className={`label has-text-grey-light is-capitalized required`}>Correo</label>
              <div className='control'>
                <input
                  className={`input ${email.length > 0 ? 'is-danger' : ''}`}
                  type='email'
                  name='email'
                  value={user.email}
                  disabled={found === 1 || edit}
                  onChange={this.onChange}
                />
              </div>
              {email.length > 0 && <p className='help is-danger'>{email}</p>}
            </div>
          ) : (
            <div className='field has-addons'>
              <div className='control'>
                <input
                  className={`input ${email.length > 0 ? 'is-danger' : ''}`}
                  type='email'
                  name='email'
                  value={user.email}
                  onChange={this.onChange}
                  placeholder='Correo'
                />
              </div>
              <div className='control'>
                <button
                  className='button is-info'
                  style={{ borderRadius: '0px' }}
                  disabled={!emailValid}
                  onClick={this.searchByEmail}>
                  Buscar
                </button>
              </div>
              {email.length > 0 && <p className='help is-danger'>{email}</p>}
            </div>
          )}
          {(found === 2 || edit) && (
            <div className='field'>
              <label className={`label has-text-grey-light is-capitalized required`}>Nombre</label>
              <div className='control'>
                <input
                  className={`input ${name.length > 0 ? 'is-danger' : ''}`}
                  type='text'
                  name='Nombres'
                  value={user.Nombres}
                  disabled={edit}
                  onChange={this.onChange}
                />
              </div>
              {name.length > 0 && <p className='help is-danger'>{name}</p>}
            </div>
          )}
          {(found === 2 || edit || found === 1) && (
            <Fragment>
              <div className='field'>
                <label className={`label has-text-grey-light is-capitalized required`}>Rol</label>
                <div className='control'>
                  <div className='select'>
                    <select value={user.rol} onChange={this.onChange} name={'rol'}>
                      <option value={''}>Seleccione...</option>
                      {roles.map((item, key) => {
                        return (
                          <option key={key} value={item.value}>
                            {item.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </section>
        {found > 0 && (
          <footer className='modal-card-foot'>
            {this.state.create ? (
              <div>Creando...</div>
            ) : (
              <button className='button is-primary' onClick={this.handleSubmit} disabled={!formValid}>
                {edit ? 'Guardar' : 'Crear'}
              </button>
            )}
            <div className={'msg'}>
              <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
            </div>
          </footer>
        )}
      </Fragment>
    );
  }
}

export default StaffModal;
