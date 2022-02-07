import React, { Component } from 'react';
import { UsersApi, eventTicketsApi } from '../../helpers/request';
import { Modal, Form, Input, Select, Checkbox, Button } from 'antd';

const { Option } = Select;

const formLayout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: {},
      user: {},
      emailError: false,
      valid: true,
      tickets: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    let user = {};

    const tickets = await eventTicketsApi.getAll(this.props.eventId);
    if (tickets.length > 0) this.setState({ tickets });

    this.props.extraFields.map((obj) => (user[obj.name] = ''));
    this.setState({ user, edit: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    const snap = {
      properties: this.state.user
    };

    let message = {};
    this.setState({ create: true });
    try {
      let resp = await UsersApi.createOne(snap, this.props.eventId);
      if (resp.message === 'OK') {
        /* this.props.addToList(resp.data); */
        message.class = resp.status === 'CREATED' ? 'msg_success' : 'msg_warning';
        message.content = 'USER ' + resp.status;
      } else {
        message.class = 'msg_danger';
        message.content = 'User can`t be created';
      }
      setTimeout(() => {
        message.class = message.content = '';
        this.closeModal();
      }, 1000);
    } catch (err) {
      message.class = 'msg_error';
      message.content = 'ERROR...TRYING LATER';
    }
    this.setState({ message, create: false });
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
        <Input
          {...props}
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
            <Form.Item label={name} htmlFor={name} style={{textTransform: 'capitalize'}}>
              <Checkbox
                name={name}
                id={name}
                checked={value}
                onChange={(e) => {
                  this.onChange(e, type);
                }}
              />
            </Form.Item>
          </React.Fragment>
        );
      }
      if (type === 'list') {
        input = m.options.map((o, key) => {
          return (
            <Option key={key} value={o.value}>
              {o.value}
            </Option>
          );
        });
        input = (
          <Select
            name={name}
            value={value}
            onChange={(e) => {
              this.onChange(e, type);
            }}>
              <Option value={''}>Seleccione...</Option>
            {input}
          </Select>
        );
      }
      return (
        <>
          {
            m.type !== 'boolean' && (
              <Form.Item label={name} htmlFor={key} key={'l' + key} style={{textTransform: 'capitalize'}}>
                {input}
              </Form.Item>
            )
          }
        </>
      );
    });
    return formUI;
  };

  onChange = (e, type, nameS) => {
    const { value } = type !== 'select' ? e.target : e;
    const { name } = type !== 'select' ? e.target : nameS;
    type === 'boolean'
      ? this.setState((prevState) => {
          return { user: { ...this.state.user, [name]: !prevState.user[name] } };
        }, this.validForm)
      : this.setState({ user: { ...this.state.user, [name]: value } }, this.validForm);
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

  closeModal = () => {
    this.setState({ user: {}, valid: true }, this.props.handleModal());
  };

  selectChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({ [name]: value });
  };

  render() {
    const { tickets } = this.state;
    return (
      <>
        <Modal 
          title={'Agregar invitado'}
          onCancel={this.props.handleModal}
          visible={this.props.modal}
          footer={[
            <>
              {this.state.create ? (
                <div>Creando...</div>
              ) : (
                <Button type='primary' onClick={this.handleSubmit} /* disabled={this.state.valid} */>
                  {this.state.edit ? 'Guardar' : 'Crear'}
                </Button>
              )}
              <div className={'msg'}>
                <p className={`help ${this.state.message.class}`}>{this.state.message.content}</p>
              </div>
            </>
          ]}
        >
          <Form {...formLayout}>
            {Object.keys(this.state.user).length > 0 && this.renderForm()}
            {tickets.length > 0 && (
              <Form.Item label={'Tiquete'}>
                <Select onChange={(e) => this.onChange(e, 'select', 'ticketid')} name={'ticketid'} defaultValue={''}>
                  <Option value={''}>..Seleccione</Option>
                  {tickets.map((item, key) => {
                    return (
                      <Option key={key} value={item._id}>
                        {item.title}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            )}
          </Form>
        </Modal>
      </>
    );
  }
}

export default AddUser;
