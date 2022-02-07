import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content_old';
import { Redirect, withRouter } from 'react-router-dom';
import { DocumentsApi, RolAttApi, UsersApi } from '../../helpers/request';
import Select from 'react-select';

class filePermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      infoRol: [],
      infoUsers: [],
      permissionRol: [],
      permissionUser: [],
      setEmails: [],
      setRol: [],
      title: '',
      name: '',
      file: '',
      type: '',
      format: '',
      event_id: '',
      state: '',
    };
  }

  async componentDidMount() {
    const data = await DocumentsApi.getOne(this.props.event._id, this.props.location.state.edit);
    //
    this.setState({
      name: data.name,
      file: data.file,
      type: data.type,
      format: data.format,
      event_id: data.event_id,
      title: data.title,
      state: data.state,
      permissionRol: data.permissionRol,
      permissionUser: data.permissionUser,
    });

    const infoRol = await RolAttApi.byEvent(this.props.event._id);
    this.setState({ infoRol });

    const users = await UsersApi.getAll(this.props.event._id, '?pageSize=10000');
    this.setState({
      users: [...users.data],
    });
    this.options();
    this.optionsRol();
  }

  optionsRol = () => {
    var getRol = this.state.infoRol;
    var setRol = [];
    for (var i = 0; i < getRol.length; i += 1) {
      setRol.push({ value: getRol[i].name, label: getRol[i].name });
    }
    this.setState({ setRol });
    //
  };

  options = () => {
    var getEmail = this.state.users;
    var setEmails = [];
    for (var i = 0; i < getEmail.length; i += 1) {
      setEmails.push({ value: getEmail[i].email, label: getEmail[i].email });
    }
    this.setState({ setEmails });
  };

  //Funcion para tomar todos los datos de los inputs y enviarlos al estado
  changeInput = async (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
    
  };

  //Funcion para retroceder
  goBack = () => this.setState({ redirect: true });

  submit = async () => {
  };

  selectRol = (permissionRol) => {
    this.setState({ permissionRol });
    //
  };

  selectUser = (permissionUser) => {
    this.setState({ permissionUser });
    //
  };

  render() {
    const { matchUrl } = this.props;
    const { name, title, setRol, setEmails } = this.state;

    if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
    return (
      <Fragment>
        <EventContent title='Documentos' closeAction={this.goBack}>
          <div className='column is-4'>
            <label className='label'>Nombre del Documento</label>
            <input
              className='input is-primary'
              defaultValue={title ? title : name}
              name='title'
              onChange={this.changeInput}
              type='text'
            />
          </div>

          <div className='column'>
            <label className='label'>Visible para roles en especifico</label>
            <br />
            <Select
              id='rol'
              value={this.state.permissionRol}
              isMulti
              name='colors'
              options={setRol}
              onChange={this.selectRol}
            />
          </div>
          <div className='column'>
            <label className='label'>Documentos Visibles para usuarios </label>
            <Select
              id='selectMultiple'
              value={this.state.permissionUser}
              isMulti
              name='colors'
              options={setEmails}
              onChange={this.selectUser}
            />
          </div>
          <div>
            <button className='button is-primary float is-pulled-right' onClick={this.submit}>
              Guardar
            </button>
          </div>
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(filePermission);
