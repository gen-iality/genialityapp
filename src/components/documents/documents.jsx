import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';
import { DocumentsApi } from '../../helpers/request';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase';
import { Modal, Space, Button, Tooltip, Spin, Row, message } from 'antd';
import { DownCircleOutlined, EditOutlined } from '@ant-design/icons';

class documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      redirect: false,
      list: [],
      file: '',
      disabledButton: true,
      folder: '',
      id: '',
      fileKey: new Date(),
      textaction: '',
      editfile: false,
      fileediting: null,
      nameediting: null,
    };
    this.getDocuments();
  }

  async componentDidMount() {
    this.getDocuments();
  }

  deletefile = async (file) => {
    this.setState({ loading: true, textaction: `Eliminando el documento ${file.name}` });
    const ref = firebase.storage().ref();
    var desertRef = ref.child(`/documents/${this.props.event._id}/${file.name}`);
    // Delete the file
    desertRef
      .delete()
      .then(async () => {
        await DocumentsApi.deleteOne(this.props.event._id, file._id);
        this.setState({ loading: false });
        this.getDocuments();
      })
      .catch(function(error) {
        message.error('no se pudo eliminar este documento');
      });
  };

  async getDocuments() {
    const { data } = await DocumentsApi.getAll(this.props.event._id);
    this.setState({ list: data });
  }

  saveDocument = async () => {
    //Se abre la conexion y se trae el documento
    this.setState({ loading: true, textaction: 'Creando el documento' });
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
  };

  succesUploadFile = async () => {
    //Si el documento esta o existe se manda a firebase se extrae la url de descarga y se manda al estado
    let { file, uploadTask } = this.state;
    await uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      file = downloadURL;
    });
    this.setState({ file });

    const data = {
      name: this.state.fileName,
      title: this.state.fileName,
      file: this.state.file,
      type: 'file',
      format: this.state.format,
    };

    await DocumentsApi.create(this.props.event._id, data);

    message.success('Documento Guardado');
    this.setState({ file: '', fileKey: new Date() });
    this.setState({ loading: false });
    this.getDocuments();
  };

  UpdateFile = async () => {
    const data = {
      title: this.state.nameediting,
      type: 'file',
    };
    await DocumentsApi.editOne(this.props.event._id, data, this.state.fileediting._id);
    message.success('documento editado');
    this.getDocuments();
    this.setState({ editfile: false });
  };

  stateUploadFile = (snapshot) => {
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        //
        break;
      case firebase.storage.TaskState.RUNNING:
        //
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

  destroyFolder = async (event, id_folder) => {
    const files = await DocumentsApi.getFiles(this.props.event._id, id_folder);

    files.data.forEach((element) => {
      const ref = firebase.storage().ref(`documents/${event}/`);
      var desertRef = ref.child(`${element.name}`);

      //Delete the file
      desertRef
        .delete()
        .then(function() {
          //El dato se elimina aqui
        })
        .catch(function() {
          //Si no muestra el error
        });
    });

    await DocumentsApi.deleteOne(this.props.event._id, id_folder);

    message.success('Information Deleted');
    this.getDocuments();
  };

  createFolder = async () => {
    let value = document.getElementById('folderName').value;

    const data = {
      type: 'folder',
      title: value,
    };
    await DocumentsApi.create(this.props.event._id, data);
    this.getDocuments();
    this.setState({
      visible: false,
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  enableButton = async () => {
    let value = document.getElementById('folderName').value;

    if (value) {
      this.setState({
        disabledButton: false,
      });
    } else {
      this.setState({
        disabledButton: true,
      });
    }
  };

  redirect = () => this.setState({ redirect: true });

  render() {
    if (this.state.redirect)
      return <Redirect to={{ pathname: `${this.props.matchUrl}/upload`, state: { new: true } }} />;
    const { list, file } = this.state;
    return (
      <Fragment>
        <div>
          <EventContent title={'Documentos'} classes={'documents-list'}>
            <div className='column is-12'>
              <div
                key={this.state.fileKey}
                style={{ float: 'right', display: 'inline-block' }}
                className='file has-name'>
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

              <div style={{ display: 'inline', marginLeft: '66%' }} className='column is-12'>
                <button className='button is-primary modal-button' onClick={this.showModal}>
                  Carpeta Nueva
                </button>
                <Modal
                  title='Basic Modal'
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}>
                  <div className='column is-12'>
                    <label className='label'>Nombre de la carpeta</label>
                    <input className='input is-primary' onChange={this.enableButton} type='text' id='folderName' />
                    <div className='column is-4'>
                      <button
                        className='button is-primary'
                        disabled={this.state.disabledButton}
                        onClick={this.createFolder}>
                        Crear Carpeta
                      </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            {list.length > 0 ? (
              <EvenTable head={['Nombre', 'Acciones']}>
                {list.map((documents, key) => (
                  <tr key={key}>
                    <td>{documents.type === 'file' ? <p>{documents.title}</p> : <p>{documents.title}</p>}</td>
                    <td>
                      {documents.type === 'folder' ? (
                        <div>
                          <button
                            style={{ marginLeft: '19%' }}
                            onClick={this.destroyFolder.bind(documents.type, this.props.event._id, documents._id)}>
                            <span className='icon'>
                              <i className='fas fa-trash-alt' />
                            </span>
                          </button>
                        </div>
                      ) : (
                        <Space>
                          <Button icon={<DownCircleOutlined />} type='primary'>
                            <a rel='noreferrer' target='_blank' style={{ color: 'white' }} href={documents.file}>
                              Descargar
                            </a>
                          </Button>

                          <Tooltip title='Eliminar documento'>
                            <Button type='danger' onClick={() => this.deletefile(documents)}>
                              <span className='icon'>
                                <i className='fas fa-trash-alt' />
                              </span>
                            </Button>
                          </Tooltip>

                          <Button
                            onClick={() =>
                              this.setState({ fileediting: documents, editfile: true, nameediting: documents.name })
                            }
                            icon={<EditOutlined />}
                            type='primary'>
                            Editar
                          </Button>
                        </Space>
                      )}
                    </td>
                  </tr>
                ))}
              </EvenTable>
            ) : (
              <h1>Aun no se agregan archivos a este evento</h1>
            )}
          </EventContent>
          <Row style={{ margin: 20 }} justify='center'>
            {this.state.loading && <Spin tip={this.state.textaction} />}
          </Row>
          <Modal
            title='Editar archivo'
            visible={this.state.editfile}
            onOk={this.UpdateFile}
            onCancel={() => this.setState({ editfile: false })}>
            <input
              style={{ width: '100%' }}
              onChange={(e) => this.setState({ nameediting: e.target.value })}
              className='form-control'
              value={this.state.nameediting}
            />
          </Modal>
        </div>
      </Fragment>
    );
  }
}

export default documents;
