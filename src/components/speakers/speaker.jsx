import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import Dropzone from "react-dropzone";
import ReactQuill from "react-quill";
import {FaChevronLeft, FaImage} from "react-icons/fa";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import {handleRequestError, loadImage, sweetAlert} from "../../helpers/utils";
import {toolbarEditor} from "../../helpers/constants";
import {SpeakersApi} from "../../helpers/request";

class Speaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            isLoading:false,
            name:"",
            profession:"",
            description:"",
            image:"",
            imageData:"",
            networks:[]
        }
    }

    async componentDidMount() {
        const { eventID, location:{state} } = this.props;
        if(state.edit){
            const info = await SpeakersApi.getOne(state.edit, eventID);
            Object.keys(this.state).map(key=>info[key]?this.setState({[key]:info[key]}):"");
        }
        this.setState({loading:false});
    }

    handleChange = (e) => {
        const {name} = e.target;
        const {value} = e.target;
        this.setState({[name]:value});
    };
    handleImage = (files) => {
        const file = files[0];
        if(file)
            loadImage(file, image=> this.setState({image}));
        else{
            this.setState({errImg:'Only images files allowed. Please try again :)'});
        }
    };
    chgTxt= content => this.setState({description:content});

    submit = async() => {
        try {
            sweetAlert.showLoading("Espera (:", "Guardando...");
            const { eventID, location:{state} } = this.props;
            this.setState({isLoading:true});
            const {name,profession,description,image} = this.state;
            const info = {name, image, description, profession};
            if(state.edit) await SpeakersApi.editOne(info, state.edit, eventID);
            else await SpeakersApi.create(eventID,info);
            sweetAlert.hideLoading();
            sweetAlert.showSuccess("Información guardada")
        }catch (e) {
            sweetAlert.showError(handleRequestError(e))
        }
    };

    remove = () => {
        const { eventID, location:{state} } = this.props;
        if(state.edit){
            sweetAlert.twoButton(`Está seguro de borrar a ${this.state.name}`, "warning", true, "Borrar", async (result)=>{
                try{
                    if(result.value){
                        sweetAlert.showLoading("Espera (:", "Borrando...");
                        await SpeakersApi.deleteOne(state.edit, eventID);
                        this.setState({redirect:true});
                        sweetAlert.hideLoading();
                    }
                }catch (e) {
                    sweetAlert.showError(handleRequestError(e))
                }
            })
        }else this.setState({redirect:true});
    }

    render() {
        const {matchUrl} = this.props;
        const {redirect,loading,name,profession,description,image} = this.state;
        if(!this.props.location.state || redirect) return <Redirect to={matchUrl}/>;
        return (
            <EventContent title={<span><Link to={matchUrl}><FaChevronLeft/></Link>Conferencista</span>}>
                {loading ? <Loading/> :
                    <div className="columns">
                        <div className="column is-8">
                            <div className="field">
                                <label className="label">Nombre</label>
                                <div className="control">
                                    <input className="input" type="text" name={"name"} value={name} onChange={this.handleChange}
                                           placeholder="Nombre conferencista"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Profesión</label>
                                <div className="control">
                                    <input className="input" type="text" name={"profession"} value={profession} onChange={this.handleChange}
                                           placeholder="Profesión"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Descripción (opcional)</label>
                                <div className="control">
                                    <ReactQuill value={description} modules={toolbarEditor}
                                                onChange={this.chgTxt}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4 general">
                            <div className="field is-grouped">
                                <button className="button is-text" onClick={this.remove}>x Eliminar conferencista
                                </button>
                                <button onClick={this.submit}
                                        className={`button is-primary`}>Guardar
                                </button>
                            </div>
                            <div className="section-gray">
                                <label className="label has-text-grey-light">Imagen</label>
                                <div className="columns">
                                    <div className="column">
                                        {
                                            image ? <img src={image} alt={`speaker_${name}`} className="author-image"/>:
                                            <FaImage/>
                                        }
                                    </div>
                                    <div className="column is-9">
                                        <div className="has-text-left">
                                            <p>Dimensiones: 400px x 250px</p>
                                            <Dropzone onDrop={this.handleImage} accept="image/*" className="zone">
                                                <button className="button is-text">{image?"Cambiar imagen":"Subir imagen"}</button>
                                            </Dropzone>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className="label has-text-grey-light">Redes sociales</label>
                                    <div className="control">
                                        <div style={{position:"relative"}}>
                                            <button className="button is-rounded">
                                                <span className="icon is-small">
                                                  <i className="fas fa-bold"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div style={{position:"relative"}}>
                                            <button className="button is-rounded">
                                                <span className="icon is-small">
                                                  <i className="fas fa-bold"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div style={{position:"relative"}}>
                                            <button className="button is-rounded">
                                                <span className="icon is-small">
                                                  <i className="fas fa-bold"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div style={{position:"relative"}}>
                                            <button className="button is-rounded">
                                                <span className="icon is-small">
                                                  <i className="fas fa-bold"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div style={{position:"relative"}}>
                                            <button className="button is-rounded">
                                                <span className="icon is-small">
                                                  <i className="fas fa-bold"></i>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </EventContent>
        )
    }
}

export default withRouter(Speaker)
