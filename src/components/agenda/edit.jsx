import React, {Component} from 'react';
import {Redirect, withRouter, Link} from "react-router-dom";
import Moment from "moment";
import ReactQuill from "react-quill";
import {DateTimePicker} from "react-widgets";
import Select, {Creatable} from "react-select";
import {FaChevronLeft, FaWhmcs} from "react-icons/fa";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import ImageInput from "../shared/imageInput";
import {AgendaApi, CategoriesAgendaApi, SpacesApi, SpeakersApi, TypesAgendaApi} from "../../helpers/request";
import {toolbarEditor} from "../../helpers/constants";
import {fieldsSelect, handleSelect} from "../../helpers/utils";

class AgendaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            isLoading:{types:true,categories:true},
            name:"",
            description:"",
            hour_start:new Date(),
            hour_end:new Date(),
            date:Moment().format("DD/MM/YY"),
            image:"",
            capacity:0,
            space_id:"",
            host_ids:[],
            selectedCategories:[],
            selectedHosts:[],
            selectedType:"",
            days:[],
            spaces:[],
            categories:[],
            types:[],
            hosts:[],
        }
    }

    async componentDidMount() {
        const { event, location:{state} } = this.props;
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        for(let i = 0; i < diff+1; i++){
            days.push(Moment(init).add(i,'d').format("DD/MM/YY"))
        }
        let spaces = await SpacesApi.byEvent(this.props.event._id);
        let hosts = await SpeakersApi.byEvent(this.props.event._id);
        spaces = handleSelect(spaces);
        hosts = handleSelect(hosts);
        const categories = await CategoriesAgendaApi.byEvent(this.props.event._id);
        const types = await TypesAgendaApi.byEvent(this.props.event._id);
        if(state.edit){
            const info = await AgendaApi.getOne(state.edit, event._id);
            Object.keys(this.state).map(key=>info[key]?this.setState({[key]:info[key]}):"");
            const {date,hour_start,hour_end} = handleDate(info);
            this.setState({date,hour_start,hour_end,
                selectedType:fieldsSelect(info.type_id,types),selectedCategories:fieldsSelect(info.activity_categories,categories)})
        }
        const isLoading = {types:false,categories:false};
        this.setState({days,spaces,hosts,categories,types,loading:false,isLoading});
    }

    handleChange = (e) => {
        const {name} = e.target;
        const {value} = e.target;
        this.setState({[name]:value});
    };
    handleDate = (value,name) => {
        this.setState({[name]:value})
    };
    selectType = (value) => {
      this.setState({selectedType:value})
    };
    selectCategory = (selectedCategories) => {
        this.setState({ selectedCategories });
    };
    selectHost = (selectedHosts) => {
        this.setState({ selectedHosts });
    };
    handleCreate = async(value,name) => {
        this.setState({isLoading:{...this.isLoading,[name]:true}});
        const item = name === "types" ?
            await TypesAgendaApi.create(this.props.event._id,{name:value}):
            await CategoriesAgendaApi.create(this.props.event._id,{name:value});
        const newOption = {label:value,value:item._id,item};
        this.setState( prevState => ({
            isLoading: {...prevState.isLoading,[name]:false},
            [name]: [...prevState[name], newOption]
        }),()=>{
            if(name === "types") this.setState({selectedType: newOption});
            else this.setState(state => ({selectedCategories:[...state.selectedCategories, newOption]}))
        });
    };
    changeImg = (files) => {
        const file = files[0];
        if(file){
            this.setState({image:URL.createObjectURL(file)});
        }else{
            this.setState({errImg:'Only images files allowed. Please try again :)'});
        }
    };

    chgTxt= content => this.setState({description:content});

    render() {
        const {loading,name,date,hour_start,hour_end,image,capacity,space_id,selectedHosts,selectedType,selectedCategories} = this.state;
        const {hosts,spaces,categories,types,isLoading} = this.state;
        const {matchUrl} = this.props;
        if(!this.props.location.state) return <Redirect to={matchUrl}/>;
        return (
            <EventContent title={<span><Link to={matchUrl}><FaChevronLeft/></Link>Actividad</span>}>
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
                                <label className="label">Día</label>
                                <div className="control">
                                    {
                                        this.state.days.map((day, key) => {
                                            return <label key={key} className="radio">
                                                <input type="radio" name="date" checked={day===date} value={day} onChange={this.handleChange}/>
                                                {day}
                                            </label>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Hora Inicio</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={hour_start} dropUp step={15} date={false}
                                                onChange={value=>this.handleDate(value,"hour_start")}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Hora Fin</label>
                                        <DateTimePicker
                                            value={hour_end} dropUp step={15} date={false}
                                            onChange={value=>this.handleDate(value,"hour_end")}/>
                                    </div>
                                </div>
                            </div>
                            <label className="label">Conferencista</label>
                            <div className="columns">
                                <div className="column is-10">
                                    <Select isClearable isMulti styles={creatableStyles} onChange={this.selectHost}
                                        options={hosts} value={selectedHosts} />
                                </div>
                                <div className="column is-2">
                                    <Link to={matchUrl.replace("agenda", "speakers")}>
                                        <button className="button"><FaWhmcs/></button>
                                    </Link>
                                </div>
                            </div>
                            <label className="label">Espacio</label>
                            <div className="field has-addons">
                                <div className="control">
                                    <div className="select">
                                        <select name={"space_id"} value={space_id} onChange={this.handleChange}>
                                            <option>Seleccione un lugar/salón ...</option>
                                            {
                                                spaces.map(space => {
                                                    return <option key={space.value}
                                                                   value={space.value}>{space.label}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div className="control">
                                    <Link to={matchUrl.replace("agenda", "espacios")}>
                                        <button className="button"><FaWhmcs/></button>
                                    </Link>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Descripción (opcional)</label>
                                <div className="control">
                                    <ReactQuill value={this.state.description} modules={toolbarEditor}
                                                onChange={this.chgTxt}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4 general">
                            <div className="field is-grouped">
                                <button className="button is-text" onClick={this.modalEvent}>x Eliminar actividad
                                </button>
                                <button onClick={this.submit}
                                        className={`${this.state.loading ? 'is-loading' : ''}button is-primary`}>Guardar
                                </button>
                            </div>
                            <div className="section-gray">
                                <div className="field picture">
                                    <label className="label has-text-grey-light">Imagen</label>
                                    <div className="control">
                                        <ImageInput picture={image} imageFile={this.state.imageFile}
                                                    divClass={'drop-img'} content={<img src={image} alt={'Imagen Perfil'}/>}
                                                    classDrop={'dropzone'} contentDrop={<button onClick={(e)=>{e.preventDefault()}} className={`button is-primary is-inverted is-outlined ${this.state.imageFile?'is-loading':''}`}>Cambiar foto</button>}
                                                    contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br/><small>(Tamaño recomendado: 400px x 250px)</small></div>}
                                                    changeImg={this.changeImg} errImg={this.state.errImg}
                                                    style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10}}/>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className={`label`}>Capacidad</label>
                                    <div className="control">
                                        <input className="input" type="number" min={0} name={"capacity"} value={capacity} onChange={this.handleChange}
                                               placeholder="Cupo total"/>
                                    </div>
                                </div>
                                <label className={`label`}>Categorías</label>
                                <div className="columns">
                                    <div className="column is-10">
                                        <Creatable
                                            isClearable
                                            styles={creatableStyles}
                                            onChange={this.selectCategory}
                                            onCreateOption={value=>this.handleCreate(value,"categories")}
                                            isDisabled={isLoading.categories}
                                            isLoading={isLoading.categories}
                                            isMulti
                                            options={categories}
                                            placeholder={"Sin categoría...."}
                                            value={selectedCategories}
                                        />
                                    </div>
                                    <div className="column is-2">
                                        <Link to={`${matchUrl}/categorias`}>
                                            <button className="button"><FaWhmcs/></button>
                                        </Link>
                                    </div>
                                </div>
                                <label className="label">Tipo de actividad</label>
                                <div className="columns">
                                    <div className="control column is-10">
                                        <Creatable
                                            isClearable
                                            styles={creatableStyles}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            isDisabled={isLoading.types}
                                            isLoading={isLoading.types}
                                            onChange={this.selectType}
                                            onCreateOption={value=>this.handleCreate(value,"types")}
                                            options={types}
                                            value={selectedType}/>
                                    </div>
                                    <div className="column is-2">
                                        <Link to={`${matchUrl}/tipos`}>
                                            <button className="button"><FaWhmcs/></button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </EventContent>
        );
    }
}

function handleDate(info) {
    let date,hour_start,hour_end;
    hour_start = Moment(info.datetime_start,"YYYY-MM-DD HH:mm").toDate();
    hour_end = Moment(info.datetime_end,"YYYY-MM-DD HH:mm").toDate();
    date = Moment(info.datetime_end,"YYYY-MM-DD HH:mm").format("DD/MM/YY");
    return {date,hour_start,hour_end}
}

const creatableStyles = {
    menu:styles=>({ ...styles, maxHeight:"inherit"})
};

export default withRouter(AgendaEdit);
