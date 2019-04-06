import React, {Component} from 'react';
import Moment from "moment"
import ImageInput from "../shared/imageInput";
import {Actions, CategoriesApi, EventsApi, OrganizationApi, TypesApi} from "../../helpers/request";
import FormEvent from "../shared/formEvent";
import {BaseUrl,typeInputs} from "../../helpers/constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/lib/scss/react-widgets.scss'
import ErrorServe from "../modal/serverError";
import Dialog from "../modal/twoAction";
import {FormattedMessage} from "react-intl";
import CreatableSelect from 'react-select/lib/Creatable';
import LogOut from "../shared/logOut";
import axios from "axios/index"
Moment.locale('es');

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : this.props.event,
            optionForm: [],
            selectedOption: [],
            selectedOrganizer: {},
            selectedType: {},
            error: {},
            fields:[],
            path:[],
            inputValue: '',
            listValue: '',
            option: [],
            minDate: new Date(),
            valid: !this.props.event._id,
            groups: [],
            errorData: {},
            toggleFields: true,
            serverError: false
        };
        this.submit = this.submit.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async componentDidMount(){
        console.log(this.props);
        try{
            const {event} = this.state;
            event.picture = (typeof event.picture === 'object') ? event.picture[0] : event.picture;
            const categories = await CategoriesApi.getAll();
            const types = await TypesApi.getAll();
            let organizers = await OrganizationApi.mine();
            organizers = organizers.map(item=>{
                return {value:item.id,label:item.name}
            });
            const {fields,groups} = parseProperties(event);
            const {selectedCategories,selectedOrganizer,selectedType} = handleFields(organizers,types,categories,event);
            this.setState({categories,organizers,types,selectedCategories,selectedOrganizer,selectedType,fields,groups})
        }
        catch (error) {
            // Error
            if (error.response) {
                console.log(error.response);
                const {status} = error.response;
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false})
            } else {
                console.log('Error', error.message);
                if(error.request) console.log(error.request);
                this.setState({serverError:true,loader:false})
            }
            console.log(error.config);
        }
    }

    //*********** FUNCIONES DEL FORMULARIO
    //Cambio en los input
    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({event:{...this.state.event,[name]:value}},this.valid)
    };
    changeDescription = (raw) => {
        this.setState({event:{...this.state.event,description:raw}},this.valid)
    };
    //Validación
    valid = () => {
        const error = {};
        const {event, selectedOrganizer, selectedType, selectedCategories} = this.state,
            valid = (event.name.length>0 && (typeof event.description === 'object') && !!event.location.PlaceId && !!selectedOrganizer && !!selectedType && selectedCategories.length>0);
        if(!event.location.FormattedAddress && !event.location.PlaceId){
            error.location = 'Fill a correct address'
        }
        this.setState({valid:!valid,error})
    };
    //Funciones para manejar el cambio en listas desplegables
    selectCategory = (selectedCategories) => {
        this.setState({ selectedCategories }, this.valid);
    };
    selectOrganizer = (selectedOrganizer) => {
        if(!selectedOrganizer.value) selectedOrganizer = undefined;
        this.setState({ selectedOrganizer }, this.valid);
    };
    selectType = (selectedType) => {
        if(!selectedType.value) selectedType = undefined;
        this.setState({ selectedType }, this.valid);
    };
    //Cambio en los input de fechas
    changeDate=(value,name)=>{
        let {event:{date_end}} = this.state;
        if(name === 'date_start') {
            const diff = Moment(value).diff(Moment(date_end),'days');
            if(diff >= 0) date_end = Moment(date_end).add(diff, 'days').toDate();
            this.setState({minDate:value,event:{...this.state.event,date_end:date_end,date_start:value}});
        }else this.setState({event:{...this.state.event,[name]:value}})
    };
    //Cambio en el input de imagen
    changeImg = (files) => {
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', path = [], self = this;
        if(file){
            this.setState({imageFile: file,
                event:{...this.state.event, picture: null}});
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file',file);
                return Actions.post(url,data).then((image) => {
                    console.log(image);
                    if(image) path.push(image);
                });
            });
            axios.all(uploaders).then((data) => {
                console.log(path);
                console.log('SUCCESSFULL DONE');
                self.setState({event: {
                        ...self.state.event,
                        picture: path[0]
                    },fileMsg:'Imagen subida con exito',imageFile:null,path});
                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
            });
            /*this.setState({imageFile: file,
                event:{...this.state.event, picture: null}});
            let data = new FormData();
            const url = '/api/files/upload',
                self = this;
            data.append('file',this.state.imageFile);
            Actions.post(url, data)
                .then((image) => {
                    self.setState({
                        event: {
                            ...self.state.event,
                            picture: image
                        },fileMsg:'Imagen subida con exito',imageFile:null
                    });
                    toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!"/>);
                })
                .catch(error => {
                    toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
                    if (error.response) {
                        console.log(error.response);
                        const {status,data} = error.response;
                        console.log('STATUS',status,status === 401);
                        if(status === 401) this.setState({timeout:true,loader:false});
                        else this.setState({serverError:true,loader:false,errorData:data})
                    } else {
                        let errorData = error.message;
                        console.log('Error', error.message);
                        if(error.request) {
                            console.log(error.request);
                            errorData = error.request
                        };
                        errorData.status = 708;
                        this.setState({serverError:true,loader:false,errorData})
                    }
                    console.log(error.config);
                });*/
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    };
    //Funciones para manejo del campo de direcciones
    onSuggestSelect = (suggest) => {
        if(suggest){
            const place = suggest.gmaps;
            const location = place.geometry && place.geometry.location ? {
                Latitude: place.geometry.location.lat(),
                Longitude: place.geometry.location.lng()
            } : {};
            const componentForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'short_name'
            };
            const mapping = {
                street_number: 'number',
                route: 'street',
                locality: 'city',
                administrative_area_level_1: 'state'
            };
            for (let i = 0; i < place.address_components.length; i++) {
                const addressType = place.address_components[i].types[0];
                if (componentForm[addressType]) {
                    const val = place.address_components[i][componentForm[addressType]];
                    location[mapping[addressType]] = val;
                }
            }
            location.FormattedAddress = place.formatted_address;
            location.PlaceId = place.place_id;
            this.setState({event:{...this.state.event,location}},this.valid)
        }else{
            this.setState({event:{...this.state.event,location:{}}},this.valid)
        }
    };
    changeSuggest = () => {
        const error = {};
        const {event:{location}} = this.state;
        if(!location.FormattedAddress && !location.PlaceId){
            error.location = 'Fill a correct address'
        }
        this.setState({error})
    };
    //*********** FIN FUNCIONES DEL FORMULARIO

    //*********** CAMPOS EVENTO
    //Agregar nuevo campo
    addField = () => {
        const {fields} = this.state;
        this.setState({fields: [...fields, {name:'',unique:false,mandatory:false,edit:true,label:'',description:''}],newField:true})
    };
    //Guardar campo en el evento o lista
    saveField = (index,key) => {
        const {fields,groups} = this.state;
        if(key || key === 0){
            const obj = groups[key].fields[index];
            obj['edit'] = !obj['edit'];
            this.setState({groups})
        }
        else{
            fields[index].edit = !fields[index].edit;
            this.setState({fields,newField:false})
        }
    };
    //Editar campo en el evento o lista
    editField = (index,key) => {
        const {fields,groups} = this.state;
        if(key || key === 0){
            const obj = groups[key].fields[index];
            obj['edit'] = !obj['edit'];
            this.setState({groups})
        }
        else{
            fields[index].edit = !fields[index].edit;
            this.setState({fields,newField:true});
        }
    };
    //Borrar campo en el evento o lista
    removeField = (index,key) => {
        const {groups,fields} = this.state;
        if(key || key === 0){
            groups[key].fields.splice(index, 1);
            this.setState({groups});
        }
        else {
            fields.splice(index, 1);
            this.setState({fields, newField: false})
        }
    };
    //Cambiar input del campo del evento o lista
    handleChangeField = (e,index,key) => {
        let {name, value} = e.target;
        let label = '';
        const {fields,groups} = this.state;
        if(name === 'label')label = toCapitalizeLower(value);
        if (key || key === 0) {
            let {fields} = groups[key];
            if(label.length > 0) fields[index].name = label;
            fields[index][name] = value;
            this.setState({groups})
        } else {
            if(label.length > 0) fields[index].name = label;
            fields[index][name] = value;
            this.setState({fields})
        }
    };
    //Cambiar mandatory del campo del evento o lista
    changeFieldCheck = (e,index,key) => {
        const {fields,groups} = this.state;
        const {name} = e.target;
        if (key || key === 0) {
            let {fields} = groups[key];
            fields[index][name] = !fields[index][name];
            this.setState({groups})
        } else {
            fields[index][name] = !fields[index][name];
            this.setState({fields})
        }
    };
    //Funciones para lista de opciones del campo
    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };
    handleListChange = (listValue) => {
        this.setState({ listValue });
    };
    changeOption = (index, key, option) => {
        const { fields, groups } = this.state;
        const field =  (key || key === 0) ? groups[key].fields[index] : fields[index];
        field.options = option;
        this.setState({ fields,groups });
    };
    handleKeyDown = (event,index,key) => {
        const { inputValue, listValue, fields, groups } = this.state;
        const field = (key || key === 0) ? groups[key].fields[index] : fields[index];
        field.options = field.options ? field.options : [];
        const value = (key || key === 0) ? listValue : inputValue;
        if (!value) return;
        switch (event.keyCode) {
            case 9:
            case 13:
                field.options = [...field.options,createOption(value,index)];
                this.setState({inputValue: '',listValue:'', fields});
                event.preventDefault();
                break;
            default: {}
        }
    };
    //Mostar campos de evento
    toggleFields = () => {
        this.setState((prevState)=>{return {toggleFields:!prevState.toggleFields}})
    };
    //Agregar nuevo grupo de campos
    addGroup = () => {
        const {groups} = this.state;
        const item = {group_id:'',fields:[],show:false};
        this.setState({groups:[...groups,item]});
    };
    removeGroup = (key) => {
        const {groups} = this.state;
        groups.splice(key,1);
        this.setState({groups})
    };
    //Cambiar nombre del grupo de campos
    changeNameGroup = (e,key) => {
        const {groups} = this.state;
        let {name, value} = e.target;
        groups[key][name] = value;
        this.setState({groups})
    };
    //Agregar campo al grupo de campos
    addFieldtoGroup = (key) => {
        const {groups} = this.state;
        groups[key]['fields'] = [...groups[key]['fields'], {name:'',unique:false,mandatory:false,edit:true,label:'',description:''}];
        this.setState({groups})
    };
    //Mostrar grupo de campos
    showList = (key) => {
        const {groups} = this.state;
        groups[key].show = !groups[key].show;
        this.setState({groups})
    };
    //*********** FIN CAMPOS EVENTO

    //Envío de datos
    async submit(e) {
        e.preventDefault();
        e.stopPropagation();
        const { event,groups,fields,path } = this.state;
        const self = this;
        const {properties_group,user_properties} = handleProperties(event,fields,groups);
        //this.setState({loading:true});
        const hour_start = Moment(event.hour_start).format('HH:mm');
        const date_start = Moment(event.date_start).format('YYYY-MM-DD');
        const hour_end = Moment(event.hour_end).format('HH:mm');
        const date_end = Moment(event.date_end).format('YYYY-MM-DD');
        const datetime_from = Moment(date_start+' '+hour_start, 'YYYY-MM-DD HH:mm');
        const datetime_to = Moment(date_end+' '+hour_end, 'YYYY-MM-DD HH:mm');
        const categories = this.state.selectedCategories.map(item=>{
            return item.value
        });
        const data = {
            name: event.name,
            datetime_from : datetime_from.format('YYYY-MM-DD HH:mm:ss'),
            datetime_to : datetime_to.format('YYYY-MM-DD HH:mm:ss'),
            picture: path.length > 1 ? path : event.picture,
            location: event.location,
            visibility: event.visibility?event.visibility:'PUBLIC',
            description: event.description,
            category_ids: categories,
            organizer_id: this.state.selectedOrganizer.value,
            event_type_id : this.state.selectedType.value,
            user_properties : [...this.state.fields, ...user_properties],
            properties_group
        };
        console.log(data);
        try {
            if(event._id){
                const result = await EventsApi.editOne(data, event._id);
                console.log(result);
                this.props.updateEvent(data);
                self.setState({loading:false});
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!"/>)
            }
            else{
                /*let extraFields = [{name:"email",mandatory:true,unique:true,type:"email"},{name:"Nombres",mandatory:false,unique:true,type:"text"}];
                data.user_properties = [...extraFields,...data.user_properties];*/
                const result = await Actions.create('/api/events', data);
                console.log(result);
                this.setState({loading:false});
                if(result._id){
                    window.location.replace(`${BaseUrl}/event/${result._id}`);
                }else{
                    toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk"/>);
                    this.setState({msg:'Cant Create',create:false})
                }
            }
        }
        catch(error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
            if (error.response) {
                console.log(error.response);
                const {status,data} = error.response;
                console.log('STATUS',status,status === 401);
                if(status === 401) this.setState({timeout:true,loader:false});
                else this.setState({serverError:true,loader:false,errorData:data})
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                if(error.request) {
                    console.log(error.request);
                    errorData = error.request
                };
                errorData.status = 708;
                this.setState({serverError:true,loader:false,errorData})
            }
            console.log(error.config);
        }
    }
    //Delete event
    async deleteEvent() {
        this.setState({isLoading:'Cargando....'});
        try {
            const result = await EventsApi.deleteOne(this.state.event._id);
            console.log(result);
            this.setState({message:{...this.state.message,class:'msg_success',content:'Evento borrado'},isLoading:false});
            setTimeout(()=>{
                this.setState({message:{},modal:false});
                window.location.replace(`${BaseUrl}/`);
            },500)
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                this.setState({message:{...this.state.message,class:'msg_error',content:'Algo salió mal. Intentalo de nuevo'},isLoading:false})
            }
            else if (error.request) {
                console.log(error.request);
                this.setState({serverError:true,errorData:{message:error.request,status:708}});
            }
            else {
                console.log('Error', error.message);
                this.setState({serverError:true,errorData:{message:error.message,status:708}});
            }
        }
    }
    closeModal = () => {
        this.setState({modal:false,message:{}})
    };
    modalEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({modal:true});
    };

    render() {
        const { event, categories, organizers, types,
            selectedCategories, selectedOrganizer, selectedType,
            fields, inputValue, newField, groups, listValue,
            valid, timeout, error , errorData, serverError} = this.state;
        return (
            <React.Fragment>
                <div className="event-general">
                    <FormEvent event={event} categories={categories} organizers={organizers} types={types} error={error} changeSuggest={this.changeSuggest}
                               selectedCategories={selectedCategories} selectedOrganizer={selectedOrganizer} selectedType={selectedType}
                               imgComp={
                                   <div className="field picture">
                                       <label className="label has-text-grey-light">Foto</label>
                                       <div className="control">
                                           <ImageInput picture={event.picture} imageFile={this.state.imageFile}
                                                       divClass={'drop-img'} content={<img src={event.picture} alt={'Imagen Perfil'}/>}
                                                       classDrop={'dropzone'} contentDrop={<button onClick={(e)=>{e.preventDefault()}} className={`button is-primary is-inverted is-outlined ${this.state.imageFile?'is-loading':''}`}>Cambiar foto</button>}
                                                       contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br/><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                                       changeImg={this.changeImg} errImg={this.state.errImg}
                                                       style={{cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10}}/>
                                       </div>
                                       {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                                   </div>
                               }
                               handleChange={this.handleChange} minDate={this.state.minDate} changeDescription={this.changeDescription}
                               selectCategory={this.selectCategory} selectOrganizer={this.selectOrganizer} selectType={this.selectType}
                               changeDate={this.changeDate} onSuggestSelect={this.onSuggestSelect}/>
                    <section className="accordions">
                        <article className={`accordion ${this.state.toggleFields ? 'is-active':''}`}>
                            <div className="accordion-header">
                                <div className="level">
                                    <div className="level-left">
                                        <div className="level-item">
                                            <p className="subtitle is-5"><strong>Campos de Evento</strong></p>
                                        </div>
                                        <div className="level-item">
                                            <button className="button" onClick={this.addField} disabled={newField}>Agregar Campo</button>
                                        </div>
                                    </div>
                                    <div className="level-right">
                                        <div className="level-item">
                                            <button className="toggle" aria-label="toggle" onClick={this.toggleFields}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-body">
                                {
                                    !event._id &&
                                    <React.Fragment>
                                        <div className="card">
                                            <article className="media" style={{padding: "0.75rem"}}>
                                                <div className="media-content">
                                                    <p>Campo Predeterminado por Defecto</p>
                                                    <div className="columns">
                                                        <div className="column">
                                                            <p className="has-text-grey-dark has-text-weight-bold">Email</p>
                                                        </div>
                                                        <div className="column">
                                                            <p className="has-text-grey-dark has-text-weight-bold">Email</p>
                                                        </div>
                                                        <div className="column field">
                                                            <input className="is-checkradio is-primary" disabled={true}
                                                                   type="checkbox" name={`mailndatory`} checked={true}/>
                                                            <label htmlFor={`mailndatory`}>Obligatorio</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                        <div className="card">
                                            <article className="media" style={{padding: "0.75rem"}}>
                                                <div className="media-content">
                                                    <p>Campo Predeterminado por Defecto</p>
                                                    <div className="columns">
                                                        <div className="column">
                                                            <p className="has-text-grey-dark has-text-weight-bold">Nombres</p>
                                                        </div>
                                                        <div className="column">
                                                            <p className="has-text-grey-dark has-text-weight-bold">Nombres y Apellidos</p>
                                                        </div>
                                                        <div className="column field">
                                                            <input className="is-checkradio is-primary" disabled={true}
                                                                   type="checkbox" name={`mailndatory`} checked={false}/>
                                                            <label htmlFor={`mailndatory`}>Obligatorio</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </article>
                                        </div>
                                    </React.Fragment>
                                }
                                {
                                    fields.map((field,key)=>{
                                        return <div className="card" key={key}>
                                            <article className="media" style={{padding: "0.75rem"}}>
                                                <div className="media-content">
                                                    <div className="columns">
                                                        <div className="field column">
                                                            <label className="label required has-text-grey-light">Label</label>
                                                            <div className="control">
                                                                <input className="input" name={"label"} type="text" disabled={!field.edit}
                                                                       placeholder="Nombre del campo" value={field.label}
                                                                       onChange={(e)=>{this.handleChangeField(e,key)}}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="field column">
                                                            <div className="control">
                                                                <label className="label required">Tipo</label>
                                                                <div className="control">
                                                                    <div className="select">
                                                                        <select onChange={(e)=>{this.handleChangeField(e,key)}} name={'type'} value={field.type} disabled={!field.edit}>
                                                                            <option value={''}>Seleccione...</option>
                                                                            {
                                                                                typeInputs.map((type,key)=>{
                                                                                    return <option key={key} value={type.value}>{type.label}</option>
                                                                                })
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                field.type === 'list' && (
                                                                    <div className="control">
                                                                        <CreatableSelect
                                                                            components={{DropdownIndicator: null,}}
                                                                            inputValue={inputValue}
                                                                            isDisabled={!field.edit}
                                                                            isClearable
                                                                            isMulti
                                                                            menuIsOpen={false}
                                                                            onChange={this.changeOption.bind(this, key, undefined)}
                                                                            onInputChange={this.handleInputChange}
                                                                            onKeyDown={(e)=>{this.handleKeyDown(e,key)}}
                                                                            placeholder="Escribe la opción y presiona Enter o Tab..."
                                                                            value={field.options}
                                                                        />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                        <div className="column field">
                                                            <input className="is-checkradio is-primary" id={`mandatory${key}`}
                                                                   type="checkbox" name={`mandatory`} checked={field.mandatory}
                                                                   onChange={(e)=>{this.changeFieldCheck(e,key)}} disabled={!field.edit}/>
                                                            <label htmlFor={`mandatory${key}`}>Obligatorio</label>
                                                        </div>
                                                    </div>
                                                    <div className="field">
                                                        <label className="label required has-text-grey-light">Descripción</label>
                                                        <textarea className="textarea" placeholder="e.g. Hello world" name={'description'}
                                                                  value={field.description} onChange={(e)=>{this.handleChangeField(e,key)}}></textarea>
                                                    </div>
                                                    <div className="field column">
                                                        <label className="label required has-text-grey-light">Nombre</label>
                                                        <div className="control">
                                                            <input className="input is-small" name={"name"} type="text" disabled={!field.edit}
                                                                   placeholder="Nombre del campo" value={field.name}
                                                                   onChange={(e)=>{this.handleChangeField(e,key)}}
                                                            />
                                                        </div>
                                                    </div>
                                                    {
                                                        field.name !== "email" &&
                                                        <div className="columns">
                                                            <div className="column is-1">
                                                                <nav className="level is-mobile">
                                                                    <div className="level-left">
                                                                        {
                                                                            field.edit &&
                                                                            <a className="level-item" onClick={(e)=>{this.saveField(key)}}>
                                                                                <span className="icon has-text-info"><i className="fas fa-save"></i></span>
                                                                            </a>
                                                                        }
                                                                        {
                                                                            !field.edit &&
                                                                            <a className="level-item" onClick={(e)=>{this.editField(key)}}>
                                                                                <span className="icon has-text-black"><i className="fas fa-edit"></i></span>
                                                                            </a>
                                                                        }
                                                                        <a className="level-item" onClick={(e)=>{this.removeField(key)}}>
                                                                            <span className="icon has-text-danger"><i className="fas fa-trash"></i></span>
                                                                        </a>
                                                                    </div>
                                                                </nav>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </article>
                                        </div>
                                    })
                                }
                            </div>
                        </article>
                        <button className="button is-text" onClick={this.addGroup}>Agregar grupo de campos</button>
                        {groups.map((list,key)=>{
                            return <article className={`accordion ${list.show ? 'is-active':''}`} key={key}>
                                <div className="accordion-header">
                                    <div className="level">
                                        <div className="level-left">
                                            <div className="level-item">
                                                <div className="field">
                                                    <div className="control">
                                                        <input className="input subtitle is-5" name={"group_id"} type="text"
                                                               placeholder="Nombre del grupo" value={list.group_id}
                                                               onChange={(e)=>{this.changeNameGroup(e,key)}}/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="level-item">
                                                <button className="button" onClick={(e)=>{this.addFieldtoGroup(key)}}>Agregar Campo</button>
                                            </div>
                                            <a className="level-item" onClick={(e)=>{this.removeGroup(key)}}>
                                                <span className="icon has-text-danger"><i className="fas fa-trash"></i></span>
                                            </a>
                                        </div>
                                        <div className="level-right">
                                            <div className="level-item">
                                                <button className="toggle" aria-label="toggle" onClick={(e)=>{this.showList(key)}}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-body">
                                    {
                                        list.fields.map((field,index)=>{
                                            return <div className="card" key={index}>
                                                <article className="media" style={{padding: "0.75rem"}}>
                                                    <div className="media-content">
                                                        <div className="columns">
                                                            <div className="field column">
                                                                <label className="label required has-text-grey-light">Label</label>
                                                                <div className="control">
                                                                    <input className="input" name={"label"} type="text" disabled={!field.edit}
                                                                           placeholder="Nombre del campo" value={field.label}
                                                                           onChange={(e)=>{this.handleChangeField(e,index,key)}}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="field column">
                                                                <div className="control">
                                                                    <label className="label required">Tipo</label>
                                                                    <div className="control">
                                                                        <div className="select">
                                                                            <select onChange={(e)=>{this.handleChangeField(e,index,key)}} name={'type'} value={field.type} disabled={!field.edit}>
                                                                                <option value={''}>Seleccione...</option>
                                                                                <option value={'title'}>Título</option>
                                                                                {
                                                                                    typeInputs.map((type,key)=>{
                                                                                        return <option key={key} value={type.value}>{type.label}</option>
                                                                                    })
                                                                                }
                                                                            </select>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {
                                                                    field.type === 'list' && (
                                                                        <div className="control">
                                                                            <CreatableSelect
                                                                                components={{DropdownIndicator: null,}}
                                                                                inputValue={listValue}
                                                                                isDisabled={!field.edit}
                                                                                isClearable
                                                                                isMulti
                                                                                menuIsOpen={false}
                                                                                onChange={this.changeOption.bind(this, index, key)}
                                                                                onInputChange={this.handleListChange}
                                                                                onKeyDown={(e)=>{this.handleKeyDown(e,index,key)}}
                                                                                placeholder="Escribe la opción y presiona Enter o Tab..."
                                                                                value={field.options}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="column field">
                                                                <input className="is-checkradio is-primary" id={`mandatory${index}`}
                                                                       type="checkbox" name={`mandatory`} checked={field.mandatory}
                                                                       onChange={(e)=>{this.changeFieldCheck(e,index,key)}} disabled={!field.edit}/>
                                                                <label htmlFor={`mandatory${index}`}>Obligatorio</label>
                                                            </div>
                                                        </div>
                                                        <div className="field">
                                                            <label className="label required has-text-grey-light">Descripción</label>
                                                            <textarea className="textarea" placeholder="e.g. Hello world" name={'description'}
                                                                      value={field.description} onChange={(e)=>{this.handleChangeField(e,index,key)}}></textarea>
                                                        </div>
                                                        <div className="field">
                                                            <label className="label required has-text-grey-light">Nombre Campo</label>
                                                            <div className="control">
                                                                <input className="input is-small" name={"name"} type="text" disabled={!field.edit}
                                                                       placeholder="Nombre del campo" value={field.name}
                                                                       onChange={(e)=>{this.handleChangeField(e,index,key)}}
                                                                />
                                                            </div>
                                                        </div>
                                                        {
                                                            field.name !== "email" &&
                                                            <div className="columns">
                                                                <div className="column is-1">
                                                                    <nav className="level is-mobile">
                                                                        <div className="level-left">
                                                                            {
                                                                                field.edit &&
                                                                                <a className="level-item" onClick={(e)=>{this.saveField(index,key)}}>
                                                                                    <span className="icon has-text-info"><i className="fas fa-save"></i></span>
                                                                                </a>
                                                                            }
                                                                            {
                                                                                !field.edit &&
                                                                                <a className="level-item" onClick={(e)=>{this.editField(index,key)}}>
                                                                                    <span className="icon has-text-black"><i className="fas fa-edit"></i></span>
                                                                                </a>
                                                                            }
                                                                            <a className="level-item" onClick={(e)=>{this.removeField(index,key)}}>
                                                                                <span className="icon has-text-danger"><i className="fas fa-trash"></i></span>
                                                                            </a>
                                                                        </div>
                                                                    </nav>
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </article>
                                            </div>
                                        })
                                    }
                                </div>
                            </article>
                        })}
                    </section>
                </div>
                <div className="buttons is-left">
                    {
                        this.state.loading? <p>Guardando...</p>
                            :<button onClick={this.submit} className={`button is-primary`} disabled={valid}>Guardar Evento</button>
                    }
                    {
                        event._id && <button className="button is-outlined is-danger" onClick={this.modalEvent}>
                            Eliminar evento
                        </button>
                    }
                </div>
                {timeout&&(<LogOut/>)}
                {serverError&&(<ErrorServe errorData={errorData}/>)}
                <Dialog modal={this.state.modal} title={'Borrar Evento'}
                        content={<p>¿Estas seguro de eliminar este evento?</p>}
                        first={{title:'Borrar',class:'is-dark has-text-danger',action:this.deleteEvent}}
                        message={this.state.message} isLoading={this.state.isLoading}
                        second={{title:'Cancelar',class:'',action:this.closeModal}}/>
            </React.Fragment>
        );
    }
}

//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
function handleFields(organizers,types,categories,event){
    let selectedCategories = [];
    let selectedType = {};
    const {category_ids,organizer_id,event_type_id} = event;
    if(category_ids){
        categories.map(item=>{
            let pos = category_ids.indexOf(item.value);
            return (pos>=0)?selectedCategories.push(item):''
        });
    }
    const pos = organizers.map((e) => { return e.value; }).indexOf(organizer_id);
    const selectedOrganizer = organizers[pos];
    if(event_type_id){
        const pos = types.map((e) => { return e.value; }).indexOf(event_type_id);
        selectedType = types[pos];
    }else selectedType = undefined;
    return {selectedOrganizer,selectedCategories,selectedType}
}

//Función para mostrar los campos y grupos por separado
function parseProperties(event){
    let groups = [];
    const {user_properties,properties_group} = event;
    let fields = user_properties.filter(item => !item.group_id);
    properties_group.map((group,key) => groups[key] = {group_id:group,fields:user_properties.filter(item => item.group_id === group)});
    return {fields,groups}
}

//Función para construir el campo user_properties y properties_group con los nuevos campos|grupos
function handleProperties(event,fields,groups){
    let properties_group = [];
    let user_properties = [];
    for(let i = 0;i < groups.length; i++){
        properties_group.push(groups[i].group_id);
        for(let j = 0;j < groups[i].fields.length; j++){
            const list = groups[i].fields[j];
            list.group_id = groups[i].group_id;
            user_properties.push(list);
        }
    }
    return {properties_group,user_properties}
}

const createOption = (label,key) => ({label, value: label, parent: key});

//Función para convertir una frase en camelCase: "Hello New World" → "helloNewWorld"
function toCapitalizeLower(str){
    const splitted = str.split(' ');
    const init = splitted[0].toLowerCase();
    const end = splitted.slice(1).map(item=>{
        item = item.toLowerCase();
        return item.charAt(0).toUpperCase() + item.substr(1);
    });
    return [init,...end].join('')
}

export default General;