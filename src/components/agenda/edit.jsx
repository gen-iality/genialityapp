import React, {Component} from 'react';
import {Redirect, withRouter, Link} from "react-router-dom";
import Moment from "moment";
import ReactQuill from "react-quill";
import {DateTimePicker} from "react-widgets";
import Select, {Creatable} from "react-select";
import {FaChevronLeft, FaWhmcs} from "react-icons/fa";
import EventContent from "../events/shared/content";
import Loading from "../loaders/loading";
import {AgendaApi, CategoriesAgendaApi, SpacesApi, SpeakersApi, TypesAgendaApi} from "../../helpers/request";
import {imageBox, toolbarEditor} from "../../helpers/constants";
import {fieldsSelect, handleRequestError, handleSelect, loadImage, sweetAlert} from "../../helpers/utils";
import Dropzone from "react-dropzone";

class AgendaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            redirect:false,
            isLoading:{types:true,categories:true},
            name:"",
            description:"",
            hour_start:new Date(),
            hour_end:new Date(),
            date:Moment().format("YYYY-MM-DD"),
            image:"",
            capacity:0,
            space_id:"",
            selectedCategories:[],
            selectedHosts:[],
            selectedType:"",
            days:[],
            spaces:[],
            categories:[],
            types:[],
            hosts:[]
        }
    }

    async componentDidMount() {
        const { event, location:{state} } = this.props;
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        for(let i = 0; i < diff+1; i++){
            days.push(Moment(init).add(i,'d').format("YYYY-MM-DD"))
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
            this.setState({date,hour_start,hour_end, selectedHosts:fieldsSelect(info.host_ids, hosts),
                selectedType:fieldsSelect(info.type_id,types),selectedCategories:fieldsSelect(info.activity_categories_ids,categories)})
        }else{
            this.setState({date:days[0]})
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
        if(file)
            loadImage(file, image=> this.setState({image}));
        else{
            this.setState({errImg:'Only images files allowed. Please try again :)'});
        }
    };

    chgTxt= content => this.setState({description:content});

    submit = async() => {
        if(this.validForm()) {
            try {
                const info = this.buildInfo();
                sweetAlert.showLoading("Espera (:", "Guardando...");
                const {event, location: {state}} = this.props;
                this.setState({isLoading: true});
                if (state.edit) await AgendaApi.editOne(info, state.edit, event._id);
                else await AgendaApi.create(event._id, info);
                sweetAlert.hideLoading();
                sweetAlert.showSuccess("Información guardada")
            } catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        }
    };

    buildInfo = () => {
        const {name, hour_start, hour_end, date, space_id, capacity, selectedCategories, selectedHosts, selectedType, description, image} = this.state;
        const datetime_start = date + " " + Moment(hour_start).format("HH:mm");
        const datetime_end = date + " " + Moment(hour_end).format("HH:mm");
        const activity_categories_ids = selectedCategories.length > 0 ? selectedCategories.map(({value}) => value) : [];
        const host_ids = selectedHosts.length > 0 ? selectedHosts.map(({value}) => value) : [];
        const type_id = selectedType.value;
        return {
            name,
            datetime_start,
            datetime_end,
            space_id,
            image,
            description,
            capacity: parseInt(capacity, 10),
            activity_categories_ids,
            host_ids,
            type_id
        }
    };

    remove = () => {
        const { event, location:{state} } = this.props;
        if(state.edit){
            sweetAlert.twoButton(`Está seguro de borrar esta actividad`, "warning", true, "Borrar", async (result)=>{
                try{
                    if(result.value){
                        sweetAlert.showLoading("Espera (:", "Borrando...");
                        await AgendaApi.deleteOne(state.edit, event._id);
                        this.setState({redirect:true});
                        sweetAlert.hideLoading();
                    }
                }catch (e) {
                    sweetAlert.showError(handleRequestError(e))
                }
            })
        }else this.setState({redirect:true});
    };

    validForm = () => {
        let title="";
        if(this.state.name.length<=0)
            title = "El Nombre es requerido";
        else if(this.state.space_id<=0)
            title = "Selecciona un Espacio";
        else if(this.state.selectedCategories.length<=0)
            title = "Selecciona una Categoría";
        if(title.length>0){
            sweetAlert.twoButton(title,"warning",false,"OK", ()=>{});
            return false
        }else return true;
    };

    goSection = (path) => {
        this.props.history.push(path)
    };

    render() {
        const {loading,name,date,hour_start,hour_end,image,capacity,space_id,selectedHosts,selectedType,selectedCategories} = this.state;
        const {hosts,spaces,categories,types,isLoading} = this.state;
        const {matchUrl} = this.props;
        if(!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl}/>;
        return (
            <EventContent title={<span><Link to={matchUrl}><FaChevronLeft/></Link>Actividad</span>}>
                {loading ? <Loading/> :
                    <div className="columns">
                        <div className="column is-8">
                            <div className="field">
                                <label className="label required">Nombre</label>
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
                                    <button onClick={()=>this.goSection(matchUrl.replace("agenda", "speakers"))} className="button"><FaWhmcs/></button>
                                </div>
                            </div>
                            <label className="label required">Espacio</label>
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
                                <label className="label">Lugar específico</label>
                                <div className="control">
                                    <input className="input" type="text" name={"name"} value={name} onChange={this.handleChange}
                                           placeholder="Ej: Salón 1, Zona Norte, Área de juegos"/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Descripción</label>
                                <div className="control">
                                    <ReactQuill value={this.state.description} modules={toolbarEditor}
                                                onChange={this.chgTxt}/>
                                </div>
                            </div>
                        </div>
                        <div className="column is-4 general">
                            <div className="field is-grouped">
                                <button className="button is-text" onClick={this.remove}>x Eliminar actividad</button>
                                <button onClick={this.submit}
                                        className="button is-primary">Guardar
                                </button>
                            </div>
                            <div className="section-gray">
                                <div className="field picture">
                                    <label className="label has-text-grey-light">Imagen</label>
                                    <div className="columns">
                                        <div className="column">
                                            {
                                                image ? <img src={image} alt={`activity_${name}`}/>:
                                                    <div dangerouslySetInnerHTML={{__html:imageBox}}/>
                                            }
                                        </div>
                                        <div className="column is-9">
                                            <div className="has-text-left">
                                                <p>Dimensiones: 400px x 250px</p>
                                                <Dropzone onDrop={this.changeImg} accept="image/*" className="zone">
                                                    <button className="button is-text">{image?"Cambiar imagen":"Subir imagen"}</button>
                                                </Dropzone>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="field">
                                    <label className={`label`}>Capacidad</label>
                                    <div className="control">
                                        <input className="input" type="number" min={0} name={"capacity"} value={capacity} onChange={this.handleChange}
                                               placeholder="Cupo total"/>
                                    </div>
                                </div>
                                <label className="label required">Categorías</label>
                                <div className="columns">
                                    <div className="column is-10">
                                        <Creatable
                                            isClearable
                                            styles={catStyles}
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
                                        <button onClick={()=>this.goSection(`${matchUrl}/categorias`)} className="button"><FaWhmcs/></button>
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
    date = Moment(info.datetime_end,"YYYY-MM-DD HH:mm").format("YYYY-MM-DD");
    return {date,hour_start,hour_end}
}

const creatableStyles = {
    menu:styles=>({ ...styles, maxHeight:"inherit"})
};

const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
    ':before': {
        backgroundColor: color,
        content: '" "',
        display: 'block',
        margin: 8,
        height: 10,
        width: 10,
    },
});

const catStyles = {
    menu: styles => ({...styles, maxHeight: "inherit"}),
    multiValue: (styles, {data}) => ({...styles, ...dot(data.item.color)})
};

export default withRouter(AgendaEdit);
