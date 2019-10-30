import React, {Component} from "react";
import {Link, Redirect, withRouter} from "react-router-dom";
import ReactQuill from "react-quill";
import {FaChevronLeft} from "react-icons/fa";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import ImageInput from "../shared/imageInput";
import {toolbarEditor} from "../../helpers/constants";
import {SpeakersApi} from "../../helpers/request";
import Dropzone from "react-dropzone";

class Speaker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            name:"",
            bio:"",
            description:"",
            image:"",
            networks:[]
        }
    }

    async componentDidMount() {
        const { event, location:{state} } = this.props;
        if(state.edit){
            const info = await SpeakersApi.getOne(state.edit, event._id);
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
        if(file){
            this.setState({image:URL.createObjectURL(file)});
        }else{
            this.setState({errImg:'Only images files allowed. Please try again :)'});
        }
    };
    chgTxt= content => this.setState({description:content});

    render() {
        const {matchUrl} = this.props;
        const {loading,name,bio,description,image} = this.state;
        if(!this.props.location.state) return <Redirect to={matchUrl}/>;
        return (
            <EventContent title={<span><Link to={matchUrl}><FaChevronLeft/></Link>Conferencista</span>}>
                {loading ? <Loading/> :
                    <div className="columns">
                        <div className="column is-8">
                            <div className="field">
                                <label className="label">Nombre</label>
                                <div className="control">
                                    <input className="input" type="text" name={"name"} value={name} onChange={this.handleChange}
                                           placeholder="Nombre de la actividad"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Bio</label>
                                <div className="control">
                                    <input className="input" type="text" name={"bio"} value={bio} onChange={this.handleChange}
                                           placeholder="Nombre de la actividad"/>
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
                                <button className="button is-text" onClick={this.modalEvent}>x Eliminar conferencista
                                </button>
                                <button onClick={this.submit}
                                        className={`${this.state.loading ? 'is-loading' : ''}button is-primary`}>Guardar
                                </button>
                            </div>
                            <div className="section-gray">
                                <label className="label has-text-grey-light">Imagen</label>
                                <div className="columns">
                                    <div className="column">
                                        {
                                            image ? <img src={image} alt={`speaker_${name}`} className="author-image"/>:
                                            <p>IMG</p>
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
