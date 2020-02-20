import React, { Component, Fragment } from 'react'
import EventContent from '../events/shared/content';
import { Redirect, withRouter } from "react-router-dom";
import firebase from 'firebase';
import { DocumentsApi } from '../../helpers/request';
import { toast } from 'react-toastify';

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
            fileName:'',
            document:'',
            disabled: true,
            data: []
        }
    }

    //Funcion para tomar todos los datos de los inputs y enviarlos al estado
    changeInput = (e) => {
        const { name } = e.target;
        const { value } = e.target;
        this.setState({ [name]: value });
    };

    //Funcion para retroceder 
    goBack = () => this.setState({ redirect: true });

    async componentDidMount() {
        const { data } = await DocumentsApi.getOne(this.props.event._id, this.props.location.state.edit)
        if(this.props.location.state.edit){
            this.setState({
                title: data[0].title,
                category: data[0].category,
                file: data[0].file,
                files: data[0].file,
            })

            this.setState({
                document: data[0].name
            })
        }
        

        console.log(this.state)
    }

    submit = async () => {
        if (this.props.location.state.edit) {
            console.log("editando")
            
            const ref = firebase.storage().ref();
            var desertRef = ref.child(`documents/${this.props.event._id}/${this.state.document}`);
            console.log(desertRef)
            // //Delete the file
            await desertRef.delete().then(function () {
                toast.success("Information Deleted")
            }).catch(function (error) {
                //Si no muestra el error por consola
                console.log(error)
            });

            const data = {
                title: this.state.title,
                format: this.state.format,
                file: this.state.file,
                category: this.state.category,
                name: this.state.fileName
            }

            const documento = await DocumentsApi.editOne(this.props.event._id, data, this.props.location.state.edit)
            console.log(documento);

            window.location.href = this.props.matchUrl
        } else {

            const data = {
                title: this.state.title,
                format: this.state.format,
                file: this.state.file,
                category: this.state.category,
                name: this.state.fileName
            }

            await DocumentsApi.create(this.props.event._id, data)
            console.log("documento creado")
            window.location.href = this.props.matchUrl
        }
    }

    saveImage = async () => {
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
        const name = (+new Date()) + '-' + files.name;
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
        //Si hay algun error se valida si fu cancelada la carga, si no tiene acceso o si hay un error al guardar
        switch (error.code) {
            case 'storage/unauthorized':
                break;

            case 'storage/canceled':
                break;

            case 'storage/unknown':

                break;
        }
    }

    render() {
        const { matchUrl } = this.props;
        const { title, category, file } = this.state;
        if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
        return (
            <Fragment>
                <EventContent title="Documentos" closeAction={this.goBack}>
                    <h3>EL boton se habilitara en cuanto cargue un archivo</h3>

                    <div className="column is-4">
                        <label>Nombre del documento</label>
                        <input className="input is-primary" value={title} name="title" onChange={this.changeInput} type="text" />
                    </div>

                    <div className="column is-4">
                        <label>Categoria del documento</label>
                        <input className="input is-primary" value={category} name="category" onChange={this.changeInput} type="text" />
                    </div>

                    <div className="column is-4">
                        <div className="file has-name">
                            <label className="file-label">
                                <input className="file-input" type="file" id="file" name="file" onChange={this.saveImage} />
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

                    <div>
                        <button className="button is-primary" disabled={this.state.disabled} onClick={this.submit}>Guardar</button>
                    </div>
                </EventContent>
            </Fragment>
        )
    }

}

export default withRouter(upload) 