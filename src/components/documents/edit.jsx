import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content';
import { Link, Redirect, withRouter } from 'react-router-dom';
import firebase from 'firebase';
import EvenTable from '../events/shared/table';
import { DocumentsApi, RolAttApi, UsersApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import Select from 'react-select';

class upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      file: '',
      uploadTask: '',
      title: '',
      name: '',
      category: '',
      data: [],
      format: '',
      fileName: '',
      document: '',
      disabled: true,
      files: [],
      infoRol: [],
      nameFile: '',
      users: [],
      infoUsers: [],
      setEmails: [],
      unvisibleUsers: [],
      setRol: [],
      nameFolder: '',
      matchUrl: '',
    };
    this.destroy = this.destroy.bind(this);
  }

  async componentDidMount() {
    this.setState({
      matchUrl: this.props.matchUrl,
    });

    this.getDocuments();

    if (this.props.location.state.edit) {
      const { data } = await DocumentsApi.getFiles(this.props.event._id, this.props.location.state.edit);
      if (data[0]) {
        this.setState({ rol: data[0].permissionRol, unvisibleUsers: data[0].permissionUser, data });
      }
    }

    const folderName = await DocumentsApi.getOne(this.props.event._id, this.props.location.state.edit);
    this.setState({
      nameFolder: folderName.title,
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

  async getDocuments() {
    if (this.props.location.state.edit) {
      const { data } = await DocumentsApi.getFiles(this.props.event._id, this.props.location.state.edit);
      if (data[0]) {
        this.setState({ rol: data[0].permissionRol, unvisibleUsers: data[0].permissionUser, data });
      }
    }
  }

  optionsRol = () => {
    var getRol = this.state.infoRol;
    var setRol = [];
    for (var i = 0; i < getRol.length; i += 1) {
      setRol.push({ value: getRol[i].name, label: getRol[i].name });
    }
    this.setState({ setRol });
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
  changeInput = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };

  //Funcion para retroceder
  goBack = () => this.setState({ redirect: true });

  submit = async () => {
    if (this.state.file) {
      toast.success('Información Guardada');
      this.getDocuments();
    } else {
      this.saveNameFolder();
      toast.success('Información Guardada');
      this.getDocuments();
    }
  };

  saveDocument = async () => {
    //Se abre la conexion y se trae el documento
    let { uploadTask } = this.state;
    const ref = firebase.storage().ref();
    const files = document.getElementById('file').files[0];

    //Se extrae la extencion del archivo por necesidad del aplicativo
    const fileName = document.getElementById('file').value;
    const extension = fileName.split('.').pop();
    this.setState({ format: extension });

    this.setState({ disabled: false });

    //Se crea el nombre con base a la fecha y nombre del archivo
    const name = (await +new Date()) + '-' + files.name;
    this.setState({
      title: name,
    });

    this.setState({ fileName: name });
    uploadTask = ref.child(`documents/${this.props.event._id}/${name}`).put(files);

    //Se envia al estado la consulta completa
    this.setState({ uploadTask });

    //Se envia a firebase y se pasa la validacion para poder saber el estado del documento
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, this.stateUploadFile, this.Wrong, this.succesUploadFile);
    this.getDocuments();
  };

  saveNameFolder = async () => {
    //revisar esta función, no está haciendo nada
  };

  succesUploadFile = async () => {
    //Si el documento esta o existe se manda a firebase se extrae la url de descarga y se manda al estado
    let { file, uploadTask } = this.state;
    await uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      file = downloadURL;
    });
    this.setState({ file });
    toast.success('Documento Guardado');
    this.submit();
    this.getDocuments();
  };
  stateUploadFile = (snapshot) => {
    //
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        break;
      case firebase.storage.TaskState.RUNNING:
        break;
    }
  };

  WrongUpdateFiles = (error) => {
    //Si hay algun error se valida si fue cancelada la carga, si no tiene acceso o si hay un error al guardar
    switch (error.code) {
      case 'storage/unauthorized':
        break;

      case 'storage/canceled':
        break;

      case 'storage/unknown':
        break;
    }
  };

  selectMultiple = (unvisibleUsers) => {
    this.setState({ unvisibleUsers });
  };
  selectRol = (rol) => {
    this.setState({ rol });
    //
  };

  async destroy(name, id, event) {
    try {
      const ref = firebase.storage().ref(`documents/${event}/`);
      var desertRef = ref.child(`${name}`);
      //
      // Delete the file
      desertRef
        .delete()
        .then(function() {
          //El dato se elimina aqui
        })
        .catch(function() {
          //Si no muestra el error
        });
      toast.success('Información Eliminada');
      this.getDocuments();
    } catch (e) {
      e;
    }
  }

  render() {
    const { matchUrl } = this.props;
    const { nameFolder, file, data, setRol, setEmails } = this.state;

    if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
    return (
      <Fragment>
        <EventContent title='Carpeta' closeAction={this.goBack}>
          <div className='column is-12'>
            <label className='label'>Nombre de la carpeta</label>
            <div className='column is-7' style={{ display: 'inline-block' }}>
              <input
                className='input is-primary'
                defaultValue={nameFolder}
                name='nameFolder'
                onChange={this.changeInput}
                type='text'
              />
            </div>

            <div className='column is-5' style={{ float: 'right', display: 'inline' }}>
              <button className='button is-primary float is-pulled-right' onClick={this.submit}>
                Guardar
              </button>
            </div>

            <div className='column'>
              <label className='label'>Permisos</label>
              <br />
              <h4>Roles que tendrán acceso a esta carpeta</h4>
              <Select
                id='rol'
                value={this.state.rol}
                isMulti
                name='colors'
                options={setRol}
                onChange={this.selectRol}
              />
            </div>
            <div className='column'>
              <h4>Usuarios que tendrán acceso a esta carpeta</h4>
              <Select
                id='selectMultiple'
                value={this.state.unvisibleUsers}
                isMulti
                name='colors'
                options={setEmails}
                onChange={this.selectMultiple}
              />
            </div>

            <div style={{ float: 'right' }}>
              <div className='file has-name'>
                <label className='label file-label'>
                  <input className='file-input' type='file' id='file' name='file' onChange={this.saveDocument} />
                  <span className='file-cta'>
                    <span className='file-icon'>
                      <i className='fas fa-upload'></i>
                    </span>
                    <span className='file-label'>Subir Archivo</span>
                  </span>
                  <span className='file-name'>{file}</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <EvenTable head={['Nombre', '']}>
              {data.map((document, key) => (
                <tr key={key}>
                  <td>
                    {
                      <Link to={{ pathname: `${this.props.matchUrl}/permission`, state: { edit: document._id } }}>
                        {document.title ? document.title : document.name}
                      </Link>
                    }
                  </td>
                  <td>
                    <a style={{ marginLeft: '2%' }} href={document.file}>
                      Descargar
                    </a>
                    <button
                      onClick={() => {
                        this.destroy(document.name, document._id, this.props.event._id);
                      }}>
                      <span className='icon'>
                        <i className='fas fa-trash-alt' />
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </EvenTable>
          </div>
        </EventContent>
      </Fragment>
    );
  }
}

export default withRouter(upload);
