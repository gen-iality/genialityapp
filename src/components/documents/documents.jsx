import React, { Component, Fragment } from "react";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import { DocumentsApi } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import firebase from "firebase";
import { Modal, Button } from 'antd';

class documents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      redirect: false,
      list: [],
      file: "",
      disabledButton: true,
      folder: "",
      id: "",
      fileKey: new Date(),
    };
    this.getDocuments()
  }

  async componentDidMount() {
    this.getDocuments()
  }
  async getDocuments() {
    const { data } = await DocumentsApi.getAll(this.props.event._id);
    this.setState({ list: data });
  }

  saveDocument = async () => {
    //Se abre la conexion y se trae el documento
    let { uploadTask } = this.state;
    const ref = firebase.storage().ref();
    const files = document.getElementById("file").files[0];

    //Se extrae la extencion del archivo por necesidad del aplicativo
    const fileName = document.getElementById("file").value;
    const extension = fileName.split(".").pop();
    this.setState({ format: extension });

    this.setState({ disabled: false });

    //Se crea el nombre con base a la fecha y nombre del archivo
    const name = (await +new Date()) + "-" + files.name;
    this.setState({
      title: name
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
    await uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
      file = downloadURL;
    });
    this.setState({ file });

    const data = {
      name: this.state.fileName,
      title: this.state.fileName,
      file: this.state.file,
      type: "file",
      format: this.state.format
    };

    //console.log(uploadTask)
    //console.log(data)

    const savedData = await DocumentsApi.create(this.props.event._id, data);
    //console.log(savedData)
    toast.success("Documento Guardado");
    this.setState({ file: "", fileKey: new Date() });
    this.getDocuments();
  };

  stateUploadFile = snapshot => {
    //Se valida el estado del archivo si esta en pausa y esta subiendo
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED:
        console.log("Upload is paused");
        break;
      case firebase.storage.TaskState.RUNNING:
        console.log("Upload is running");
        break;
    }
  };

  WrongUpdateFiles = error => {
    //Si hay algun error se valida si fue cancelada la carga, si no tiene acceso o si hay un error al guardar
    switch (error.code) {
      case "storage/unauthorized":
        break;

      case "storage/canceled":
        break;

      case "storage/unknown":
        break;
    }
  };

  destroy = async (name, id, event) => {
    //console.log(name, id, event)
    let information = await DocumentsApi.deleteOne(event, id);
    console.log(information);

    const ref = firebase.storage().ref(`documents/${event}/`);
    var desertRef = ref.child(`${name}`);
    console.log(desertRef);
    // // //Delete the file
    desertRef
      .delete()
      .then(function () {
        //     //El dato se elimina aqui
      })
      .catch(function (error) {
        //     //Si no muestra el error
        console.log(error);
      });

    toast.success("Information Deleted");
    this.getDocuments();
  };

  destroyFolder = async (event, id_folder) => {
    console.log(event, id_folder);

    const files = await DocumentsApi.getFiles(this.props.event._id, id_folder);
    console.log(files);

    files.data.forEach(element => {
      console.log(element.name);

      const ref = firebase.storage().ref(`documents/${event}/`);
      var desertRef = ref.child(`${element.name}`);
      console.log(desertRef);
      //Delete the file
      desertRef
        .delete()
        .then(function () {
          //El dato se elimina aqui
        })
        .catch(function (error) {
          //Si no muestra el error
          console.log(error);
        });
    });

    let information = await DocumentsApi.deleteOne(this.props.event._id, id_folder);
    //console.log(information);

    toast.success("Information Deleted");
    this.getDocuments();
  };

  createFolder = async () => {
    let value = document.getElementById("folderName").value;

    const data = {
      type: "folder",
      title: value
    };
    const savedData = await DocumentsApi.create(this.props.event._id, data);
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

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  enableButton = async () => {
    let value = document.getElementById("folderName").value;

    if (value) {
      this.setState({
        disabledButton: false
      });
    } else {
      this.setState({
        disabledButton: true
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
          <EventContent title={"Documentos"} classes={"documents-list"}>
            <div className="column is-12">
              <div key={this.state.fileKey} style={{ float: "right", display: "inline-block" }} className="file has-name">
                <label className="label" className="file-label">
                  <input className="file-input" type="file" id="file" name="file" onChange={this.saveDocument} />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">Subir Archivo</span>
                  </span>
                  <span className="file-name">{file}</span>
                </label>
              </div>

              <div style={{ display: "inline", marginLeft: "66%" }} className="column is-12">
                <button
                  className="button is-primary modal-button"
                  onClick={this.showModal}>
                  Carpeta Nueva
                </button>
                <Modal
                  title="Basic Modal"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <div className="column is-12">
                    <label className="label">Nombre de la carpeta</label>
                    <input className="input is-primary" onChange={this.enableButton} type="text" id="folderName" />
                    <div className="column is-4">
                      <button
                        className="button is-primary"
                        disabled={this.state.disabledButton}
                        onClick={this.createFolder}>
                        Crear Carpeta
                          </button>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
            <EvenTable head={["Nombre", ""]}>
              {list.map((documents, key) => (
                <tr key={key}>
                  <td>
                    {documents.type === "file" ? (
                      <Link to={{ pathname: `${this.props.matchUrl}/permission`, state: { edit: documents._id } }}>
                        <i style={{ marginRight: "1%" }} className="far fa-file"></i>
                        {documents.title}
                      </Link>
                    ) : (
                        <Link to={{ pathname: `${this.props.matchUrl}/upload`, state: { edit: documents._id } }}>
                          <i style={{ marginRight: "1%" }} className="far fa-folder"></i>
                          {documents.title}
                        </Link>
                      )}
                  </td>
                  <td>
                    {documents.type === "folder" ? (
                      <div>
                        <button
                          style={{ marginLeft: "19%" }}
                          onClick={this.destroyFolder.bind(documents.type, this.props.event._id, documents._id)}>
                          <span className="icon">
                            <i className="fas fa-trash-alt" />
                          </span>
                        </button>
                      </div>
                    ) : (
                        <div>
                          <a href={documents.file}>Descargar</a>
                          <button
                            onClick={this.destroy.bind(
                              documents.type,
                              documents.name,
                              documents._id,
                              this.props.event._id
                            )}>
                            <span className="icon">
                              <i className="fas fa-trash-alt" />
                            </span>
                          </button>
                        </div>
                      )}
                  </td>
                </tr>
              ))}
            </EvenTable>
          </EventContent>
        </div>
      </Fragment>
    );
  }
}

export default documents;
