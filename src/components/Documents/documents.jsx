import React, { Component, Fragment } from 'react';
import EventContent from '../events/shared/content';
import EvenTable from "../events/shared/table";
import { DocumentsApi } from "../../helpers/request";
import { Link, Redirect } from "react-router-dom";
import { sweetAlert } from "../../helpers/utils";
import { toast } from 'react-toastify';
import firebase from 'firebase';

class documents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            redirect: false,
            list: [],
            file: ""
        };
    }

    async componentDidMount() {
        const { data } = await DocumentsApi.getAll(this.props.event._id)
        this.setState({ list: data })
        console.log(data)
    }

    saveDocument = async () => {
        //Se abre la conexion y se trae el documento
        let { uploadTask } = this.state
        const ref = firebase.storage().ref();
        const files = document.getElementById("file").files[0]

        //Se extrae la extencion del archivo por necesidad del aplicativo
        const fileName = document.getElementById('file').value;
        const extension = fileName.split('.').pop();
        this.setState({ format: extension })

        this.setState({ disabled: false })

        //Se crea el nombre con base a la fecha y nombre del archivo
        const name = await files.name;
        this.setState({
            title: name
        })

        this.setState({ fileName: name })
        uploadTask = ref.child(`documents/${this.props.event._id}/${name}`).put(files)

        //Se envia al estado la consulta completa
        this.setState({ uploadTask })

        //Se envia a firebase y se pasa la validacion para poder saber el estado del documento
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, this.stateUploadFile, this.Wrong, this.succesUploadFile)
    }

    succesUploadFile = async () => {
        //Si el documento esta o existe se manda a firebase se extrae la url de descarga y se manda al estado
        let { file, uploadTask } = this.state
        // await uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        //     file = downloadURL
        // })
        // this.setState({ file })
        console.log(uploadTask)
        toast.success("Documento Guardado")
        console.log(await this.state.file)
    }

    stateUploadFile = (snapshot) => {
        //Se valida el estado del archivo si esta en pausa y esta subiendo
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
                console.log('Upload is paused');
                break;
            case firebase.storage.TaskState.RUNNING:
                console.log('Upload is running');
                break;
        }
    }

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
    }

    destroy(name, id, event) {
        let information = DocumentsApi.deleteOne(event, id);
        console.log(information);

        const ref = firebase.storage().ref();
        var desertRef = ref.child(`documents/${event}/${name}`);
        console.log(desertRef)
        // //Delete the file
        desertRef.delete().then(function () {
            //El dato se elimina aqui
        }).catch(function (error) {
            //Si no muestra el error
            console.log(error)
        });

        toast.success("Information Deleted")
        setTimeout(function () {
            window.location.reload()
        }, 4000);
    }

    redirect = () => this.setState({ redirect: true });

    render() {
        if (this.state.redirect) return <Redirect to={{ pathname: `${this.props.matchUrl}/upload`, state: { new: true } }} />;
        const { list, file } = this.state;
        return (
            <Fragment>
                <div>
                    <EventContent title={"Documentos"} classes={"documents-list"} addAction={this.redirect} addTitle={"Nuevo documento"}>
                        <div className="column is-4">
                            <div className="file has-name">
                                <label className="label" className="file-label">
                                    <input className="file-input" type="file" id="file" name="file" onChange={this.saveDocument} />
                                    <span className="file-cta">
                                        <span className="file-icon">
                                            <i className="fas fa-upload"></i>
                                        </span>
                                        <span className="file-label">
                                            Choose a file…
                                                </span>
                                    </span>
                                    <span className="file-name">
                                        {file}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <EvenTable head={["Nombre", "Formato", "Documento", ""]}>
                            {
                                list.map((trivia, key) => (
                                    <tr key={key}>
                                        <td>{trivia.title}</td>
                                        <td>{trivia.format}</td>
                                        <td><a href={trivia.file}>Descargar</a></td>
                                        <td>
                                            <Link to={{ pathname: `${this.props.matchUrl}/upload`, state: { edit: trivia._id } }}>
                                                <button><span className="icon"><i className="fas fa-2x fa-chevron-right" /></span></button>
                                            </Link>
                                        </td>
                                        <td>
                                            <button onClick={this.destroy.bind(trivia.publicada, trivia.name, trivia._id, this.props.event._id)}><span className="icon"><i className="fas fa-trash-alt" /></span></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </EvenTable>
                    </EventContent>
                </div>
            </Fragment>
        )
    }
}

export default documents