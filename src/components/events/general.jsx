import React, {Component} from 'react';
import Moment from "moment"
import ReactQuill from "react-quill";
import ImageInput from "../shared/imageInput";
import {Actions, CategoriesApi, EventsApi, OrganizationApi, TypesApi} from "../../helpers/request";
import {BaseUrl, toolbarEditor} from "../../helpers/constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/lib/scss/react-widgets.scss'
import ErrorServe from "../modal/serverError";
import Dialog from "../modal/twoAction";
import {FormattedMessage} from "react-intl";
import LogOut from "../shared/logOut";
import axios from "axios/index"
import {DateTimePicker} from "react-widgets";
import SelectInput from "../shared/selectInput";
import Loading from "../loaders/loading";
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
            serverError: false,
            loading: true
        };
        this.submit = this.submit.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async componentDidMount(){
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
            this.setState({categories,organizers,types,selectedCategories,selectedOrganizer,selectedType,loading:false})
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
                this.setState({serverError:true,loader:false,errorData:{status:400,message:JSON.stringify(error)}})
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
    //Validación
    valid = () => {
        const error = {};
        const {event, selectedOrganizer, selectedType, selectedCategories} = this.state;
        const valid = (event.name.length>0 && event.venue.length>0 && !!selectedOrganizer && !!selectedType && selectedCategories.length>0);
        this.setState({valid:!valid,error})
    };
    //Cambio en la descripción
    chgTxt= content => this.setState({event:{...this.state.event,description:content}});
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
        }
        else{
            this.setState({errImg:'Solo se permiten imágenes. Intentalo de nuevo'});
        }
    };
    //*********** FIN FUNCIONES DEL FORMULARIO

    //*********** CAMPOS EVENTO
    //Agregar nuevo campo
    addField = () => {
        this.setState({fieldModal:true,newField:true})
    };
    closeFieldModal = () => {
        this.setState({fieldModal:false,newField:false,fieldEdit:false})
    };
    //Guardar campo en el evento o lista
    saveField = (field) => {
        if(this.state.fieldEdit){
            const fields = [...this.state.fields];
            const pos = fields.map(f=>f.uuid).indexOf(field.uuid);
            fields[pos] = field;
            this.setState({fields,fieldModal:false,fieldEdit:false,newField:false})
        }else{
            const info = Object.assign({},field);
            info.uuid = uniqueID();
            this.setState({fields:[...this.state.fields,info],fieldModal:false,fieldEdit:false,newField:false})
        }
    };
    //Editar campo en el evento o lista
    editField = (field) => {
        this.setState({fieldModal:true,fieldInfo:field,fieldEdit:true})
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
    //Cambiar mandatory del campo del evento o lista
    changeFieldCheck = (id) => {
        console.log(id);
        const fields = [...this.state.fields];
        const pos = fields.map(f=>f.uuid).indexOf(id);
        fields[pos].mandatory = !fields[pos].mandatory;
        this.setState({fields})
    };
    //Mostar campos de evento
    toggleFields = () => {
        this.setState((prevState)=>{return {toggleFields:!prevState.toggleFields}})
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
            venue: event.venue,
            address: event.address,
            visibility: event.visibility?event.visibility:'PUBLIC',
            description: event.description,
            category_ids: categories,
            organizer_id: this.state.selectedOrganizer.value,
            event_type_id : this.state.selectedType.value,
            user_properties : [...this.state.fields, ...user_properties],
            properties_group
        };
        try {
            if(event._id){
                const info = await EventsApi.editOne(data, event._id);
                this.props.updateEvent(info);
                self.setState({loading:false});
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!"/>)
            }
            else{
                const result = await Actions.create('/api/events', data);
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
                this.setState({message:{...this.state.message,class:'msg_error',content:JSON.stringify(error.response)},isLoading:false})
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
        if(this.state.loading) return <Loading/>;
        const { event, categories, organizers, types,
            selectedCategories, selectedOrganizer, selectedType,
            fields, newField, valid, timeout, error , errorData, serverError} = this.state;
        return (
            <React.Fragment>
                <div className="event-general">
                    <div className="columns">
                        <div className="column">
                            <div className="field">
                                <label className="label required has-text-grey-light">Nombre</label>
                                <div className="control">
                                    <input className="input" name={"name"} type="text"
                                           placeholder="Nombre del evento" value={event.name}
                                           onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label has-text-grey-light">Dirección</label>
                            <div className="control">
                                <input className="input" name={"address"} type="text"
                                       placeholder="¿Cuál es la dirección del evento?" value={event.address}
                                       onChange={this.handleChange}/>
                            </div>
                            <div className="field">
                                <label className="label required has-text-grey-light">Dirección</label>
                                <div className="control">
                                    <input className="input" name={"address"} type="text"
                                           placeholder="¿Cuál es la dirección del evento" value={event.address}
                                           onChange={this.handleChange}/>
                                </div>
                                {error.location && <p className="help is-danger">{error.location}</p>}
                            </div>
                        </div>
                        <div className="field">
                            <div className="columns is-mobile">
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label has-text-grey-light">Fecha Inicio</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.date_start}
                                                format={'DD/MM/YYYY'}
                                                time={false}
                                                onChange={value => this.changeDate(value,"date_start")}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label has-text-grey-light">Hora Inicio</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.hour_start}
                                                step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value,"hour_start")}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="columns is-mobile">
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label has-text-grey-light">Fecha Fin</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.date_end}
                                                min={this.minDate}
                                                format={'DD/MM/YYYY'}
                                                time={false}
                                                onChange={value => this.changeDate(value,"date_end")}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label has-text-grey-light">Hora Fin</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.hour_end}
                                                step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value,"hour_end")}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label has-text-grey-light">Descripción</label>
                            <div className="control">
                                <ReactQuill value={event.description} modules={toolbarEditor} onChange={this.chgTxt}/>
                            </div>
                        </div>
                    </div>
                    <div className="column is-4">
                        <div className="field is-grouped">
                            {event._id && <button className="button is-text" onClick={this.modalEvent}>x Eliminar evento</button>}
                            <button onClick={this.submit} className={`${this.state.loading?'is-loading':''}button is-primary`} disabled={valid}>Guardar</button>
                        </div>
                        <div className="section-gray">
                            <div className="field">
                                <label className="label">Evento</label>
                                <div className="control toggle-switch has-text-centered">
                                    <input type="radio" id="choice1" name="visibility" checked={event.visibility==="PUBLIC"} value="PUBLIC" onChange={this.handleChange}/>
                                    <label htmlFor="choice1">Público</label>
                                    <input type="radio" id="choice2" name="visibility" checked={event.visibility==="ORGANIZATION"} value="ORGANIZATION" onChange={this.handleChange}/>
                                    <label htmlFor="choice2">Privado</label>
                                    <div id="flap"><span className="content">{event.visibility==="PUBLIC"?"Público":"Privado"}</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="column">
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
                            <SelectInput name={'Categorías:'} isMulti={true} max_options={2} selectedOptions={selectedCategories} selectOption={this.selectCategory} options={categories} required={true}/>
                            <SelectInput name={'Tipo'} isMulti={false} selectedOptions={selectedType} selectOption={this.selectType} options={types} required={true}/>
                            <SelectInput name={'Categorías:'} isMulti={true} selectedOptions={selectedCategories} selectOption={this.selectCategory} options={categories} required={true}/>
                        </div>
                    </div>
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
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Tipo de Campo</th>
                                        <th>Obligatorio</th>
                                        <th/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>Correo</td>
                                        <td>Email</td>
                                        <td>
                                            <input className="is-checkradio is-primary" type="checkbox" id={"mandEmail"} checked={true} disabled={true}/>
                                            <label className="checkbox" htmlFor={"mandEmail"}/>
                                        </td>
                                        <td/>
                                    </tr>
                                    <tr>
                                        <td>Nombres</td>
                                        <td>Texto</td>
                                        <td>
                                            <input className="is-checkradio is-primary" type="checkbox" id={"mandName"} checked={true} disabled={true}/>
                                            <label className="checkbox" htmlFor={"mandName"}/>
                                        </td>
                                        <td/>
                                    </tr>
                                    {fields.map((field,key)=>{
                                        return <tr key={key}>
                                            <td>{field.label}</td>
                                            <td>{field.type}</td>
                                            <td>
                                                <input className="is-checkradio is-primary" type="checkbox" name={`mandatory${field.uuid}`}
                                                       checked={field.mandatory} onChange={e=>this.changeFieldCheck(field.uuid)}/>
                                                <label className="checkbox" htmlFor={`mandatory${field.uuid}`}/>
                                            </td>
                                            <td>
                                                <button onClick={e=>this.editField(field)}><span className="icon"><i className="fas fa-edit"/></span></button>
                                                <button onClick={e=>this.removeField(key)}><span className="icon"><i className="fas fa-trash-alt"/></span></button>
                                            </td>
                                        </tr>
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </article>
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
    let fields = user_properties.filter(item => !item.group_id).filter(item=>item.name!=="names"&&item.name!=="email");
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

/**
 * CustomHtml
 * Creates a new instance of CustomHtml extension.
 *
 * Licensed under the MIT license.
 * Copyright (c) 2014 jillix
 *
 * @name CustomHtml
 * @function
 * @param {Object} options An object containing the extension configuration. The
 * following fields should be provided:
 *  - buttonText: the text of the button (default: `</>`)
 *  - htmlToInsert: the HTML code that should be inserted
 */
function CustomHtml (options) {
    this.button = document.createElement('button');
    this.button.className = 'medium-editor-action';
    this.button.innerText = options.buttonText || "</>";
    this.button.onclick = this.onClick.bind(this);
    this.options = options;
    this.insertHtmlAtCaret = function (html) {
        var sel, range;
        if (window.getSelection) {
            // IE9 and non-IE
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();

                // Range.createContextualFragment() would be useful here but is
                // only relatively recently standardized and is not supported in
                // some browsers (IE9, for one)
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);

                // Preserve the selection
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type !== "Control") {
            document.selection.createRange().pasteHTML(html);
        }
    }
}

/**
 * onClick
 * The click event handler that calls `insertHtmlAtCaret` method.
 *
 * @name onClick
 * @function
 */
CustomHtml.prototype.onClick = function() {
    this.insertHtmlAtCaret(this.options.htmlToInsert);
};

/**
 * getButton
 * This function is called by the Medium Editor and returns the button that is
 * added in the toolbar
 *
 * @name getButton
 * @function
 * @return {HTMLButtonElement} The button that is attached in the Medium Editor
 * toolbar
 */
CustomHtml.prototype.getButton = function() {
    return this.button;
};

export default General;
