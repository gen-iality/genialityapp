import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { icon } from '../../helpers/constants';
import Dialog from './twoAction_old';

class UserOrg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statesList: [],
      message: {},
      user: {},
      state: '',
      userId: 'mocionsoft',
      emailError: false,
      valid: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    const { edit, extraFields } = this.props;
    if (edit) {
      const { value } = this.props;
      let user = {};
      Object.keys(value.properties).map((obj) => {
        return (user[obj] = value.properties[obj]);
      });
      this.setState({ user, edit: true, userId: value._id });
    } else {
      let user = {};
      extraFields.map((obj) => (user[obj.name] = obj.type === 'boolean' ? false : obj.type === 'number' ? 0 : ''));
      this.setState({ user, edit: false });
    }
  }

  componentWillUnmount() {
    this.setState({ user: {}, edit: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const self = this;
    let message = {};
    this.setState({ create: true });
    try {
      if (!this.state.edit) {
        message.class = 'msg_success';
        message.content = 'USER CREATED';
        toast.success(<FormattedMessage id='toast.user_saved' defaultMessage='Ok!' />);
      } else {
        message.class = 'msg_warning';
        message.content = 'USER UPDATED';

        message.class = 'msg_warning';
        message.content = 'USER UPDATED';
        toast.info(<FormattedMessage id='toast.user_edited' defaultMessage='Ok!' />);
      }
      if (this.state.edit) {
        setTimeout(() => {
          self.closeModal();
        }, 800);
      } else {
        this.setState({ edit: true });
      }
      this.setState({ message, create: false });
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
  }

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
          <div className='control'>{input}</div>
        </div>
      );
    });
    return formUI;
  };

  onChange = (e, type) => {
    const { value, name } = e.target;
    //
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
    mandatories.map((field, key) => {
      let valid;
      if (field.type === 'email')
        valid = user[field.name].length > 5 && user[field.name].length < 61 && EMAIL_REGEX.test(user[field.name]);
      if (field.type === 'text' || field.type === 'list')
        valid = user[field.name] && user[field.name].length > 0 && user[field.name] !== '';
      if (field.type === 'number') valid = user[field.name] && user[field.name] >= 0;
      if (field.type === 'boolean') valid = typeof user[field.name] === 'boolean';
      return (validations[key] = valid);
    });
    const valid = validations.reduce((sum, next) => sum && next, true);
    this.setState({ valid: !valid });
  };

  async deleteUser() {
    let message = {};
    const self = this;
    try {
      message.class = 'msg_warning';
      message.content = 'USER DELETED';
      toast.info(<FormattedMessage id='toast.user_deleted' defaultMessage='Ok!' />);
      this.setState({ message });
      setTimeout(() => {
        message.class = message.content = '';
        this.setState({ message });
        self.closeModal();
      }, 500);
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
  }

  closeModal = () => {
    let message = { class: '', content: '' };
    this.setState({ user: {}, valid: true, modal: false, uncheck: false, message }, this.props.handleModal(true));
  };

  render() {
    const { user } = this.state;
    return (
      <React.Fragment>
        <div className={`modal modal-add-user ${this.props.modal ? 'is-active' : ''}`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <div className='modal-card-title'>
                <div className='icon-header' dangerouslySetInnerHTML={{ __html: icon }} />
              </div>
              <button className='delete' aria-label='close' onClick={this.props.handleModal} />
            </header>
            <section className='modal-card-body'>
              {Object.keys(user).length > 0 && this.renderForm()}
              {/*<div className="field">
                                <div className="control">
                                    <label className="label">Estado</label>
                                    <div className="control">
                                        <div className="select">
                                            <select value={state} onChange={this.selectChange} name={'state'}>
                                                {
                                                    statesList.map((item,key)=>{
                                                        return <option key={key} value={item.value}>{item.label}</option>
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>*/}
            </section>
            <footer className='modal-card-foot'>
              {this.state.create ? (
                <div>Creando...</div>
              ) : (
                <div className='modal-buttons'>
                  <button className='button is-primary' onClick={this.handleSubmit} disabled={this.state.valid}>
                    Guardar
                  </button>
                  {this.state.edit && (
                    <button
                      className='button'
                      onClick={() => {
                        this.setState({ modal: true });
                      }}>
                      Borrar
                    </button>
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
          </div>
          <iframe title={'Print User'} ref={(el) => (this.ifrmPrint = el)} style={{ opacity: 0, display: 'none' }} />
          {/*<iframe title={'Print User'} ref="ifrmPrint" style={{backgroundColor:"aliceblue",width:"900px",height:"900px",zIndex:9}}/>*/}
        </div>
        <Dialog
          modal={this.state.modal}
          title={'Borrar Usuario'}
          content={<p>Seguro de borrar este usuario?</p>}
          first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.deleteUser }}
          message={this.state.message}
          second={{ title: 'Cancelar', class: '', action: this.closeModal }}
        />
      </React.Fragment>
    );
  }
}

export default UserOrg;
