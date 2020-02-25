import React, { Component, Fragment } from 'react'
import EventContent from '../events/shared/content';
import { Redirect, withRouter } from "react-router-dom";
import firebase from 'firebase';
import { DocumentsApi, RolAttApi, UsersApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import Select, { Creatable } from "react-select";
import Files from 'react-files'

class upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            file: "",
            uploadTask: '',
            title: '',
            category: '',
            format: '',
            fileName: '',
            document: '',
            disabled: true,
            data: [],
            infoRol: [],
            nameFile: "",
            users: [],
            infoUsers: [],
            setEmails: [],
            unvisibleUsers: [],
            setRol: []
        }
    }

    async componentDidMount() {
        const { data } = await DocumentsApi.getOne(this.props.event._id, this.props.location.state.edit)
        if (this.props.location.state.edit) {
            this.setState({
                title: data[0].title,
                category: data[0].category,
                file: data[0].file,
                files: data[0].file,
                rol: data[0].rol,
                unvisibleUsers: data[0].users
            })

            this.setState({
                document: data[0].name
            })
        }

        const infoRol = await RolAttApi.byEvent(this.props.event._id)
        this.setState({ infoRol })
        console.log(this.state.infoRol)

        const users = await UsersApi.getAll(this.props.event._id, "?pageSize=10000")
        this.setState({
            users: [
                ...users.data
            ]
        })
        console.log(this.state.setEmails)
        this.options()
        this.optionsRol()
    }

    onFilesChange = (files) => {
        console.log(files)
    }

    onFilesError = (error) => {
        console.log('error code ' + error.code + ': ' + error.message)
    }

    optionsRol = () => {
        var getRol = this.state.infoRol;
        var setRol = [];
        for (var i = 0; i < getRol.length; i += 1) {
            setRol.push({ value: getRol[i].name, label: getRol[i].name })
        }
        this.setState({ setRol })
        console.log(this.state.setRol)
    }

    options = () => {
        var getEmail = this.state.users;
        var setEmails = [];
        for (var i = 0; i < getEmail.length; i += 1) {
            setEmails.push({ value: getEmail[i].email, label: getEmail[i].email })
        }
        this.setState({ setEmails });
    }

    //Funcion para tomar todos los datos de los inputs y enviarlos al estado
    changeInput = (e) => {
        const { name } = e.target;
        const { value } = e.target;
        this.setState({ [name]: value });
    };

    selectRol = (rol) => {
        this.setState({ rol })
        console.log(rol);
    };

    //Funcion para retroceder 
    goBack = () => this.setState({ redirect: true });

    submit = async () => {
        if (this.props.location.state.edit) {
            console.log("editando")

            const ref = firebase.storage().ref();
            var desertRef = ref.child(`documents/${this.props.event._id}/${this.state.document}`);
            console.log(desertRef)
            // //Delete the file
            await desertRef.delete().then(function () {
                console.log("Documento Actualizado")
            }).catch(function (error) {
                //Si no muestra el error por consola
                console.log(error)
            });

            const data = {
                title: this.state.title,
                format: this.state.format,
                file: this.state.file,
                category: this.state.category,
                name: this.state.fileName,
                rol: this.state.rol,
                users: this.state.unvisibleUsers
            }

            console.log(data)

            const documento = await DocumentsApi.editOne(this.props.event._id, data, this.props.location.state.edit)
            console.log(documento)

            window.location.href = this.props.matchUrl
        } else {

            const data = {
                title: this.state.title,
                format: this.state.format,
                file: this.state.file,
                category: this.state.category,
                name: this.state.fileName,
                rol: this.state.rol,
                users: this.state.unvisibleUsers
            }

            console.log(data)

            await DocumentsApi.create(this.props.event._id, data)
            console.log("Información creada")
            window.location.href = this.props.matchUrl
        }
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
        await uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            file = downloadURL
        })
        this.setState({ file })
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

    uploadManyFiles(event) {
        let files = document.getElementById("files").files
        console.log(files)
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

    selectMultiple = (unvisibleUsers) => {
        this.setState({ unvisibleUsers });
        console.log(`Option selected:`, unvisibleUsers);
    }
    selectRol = (rol) => {
        // const rol = document.getElementById("rol").value
        // this.setState({ rol });
        // console.log(`Option selected:`, rol);
        this.setState({ rol });
        console.log(`Option selected:`, rol);
    };


    render() {
        const { matchUrl } = this.props;
        const { title, file, infoRol, setRol, rol, setEmails } = this.state;

        if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
        return (
            <Fragment>
                <EventContent title="Documentos" closeAction={this.goBack}>
                    <h3>EL boton se habilitara en cuanto cargue un archivo</h3>

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

                    <div className="column is-4">
                        <label className="label">Nombre del documento</label>
                        <input className="input is-primary" value={title} name="title" onChange={this.changeInput} type="text" />
                    </div>

                    <div className="column">
                        <label className="label">Visible para roles en especifico</label><br />
                        <Select id="rol"
                            value={this.state.rol}
                            isMulti
                            name="colors"
                            options={setRol}
                            onChange={this.selectRol} />
                    </div>
                    <div className="column">
                        <label className="label">Documentos Visibles para usuarios </label>
                        <Select
                            id="selectMultiple"
                            value={this.state.unvisibleUsers}
                            isMulti
                            name="colors"
                            options={setEmails}
                            onChange={this.selectMultiple}
                        />
                    </div>
                    <div>
                        <button className="button is-primary float is-pulled-right" onClick={this.submit}>Guardar</button>
                    </div>
                </EventContent>
            </Fragment>
        )
    }
}

export default withRouter(upload) 