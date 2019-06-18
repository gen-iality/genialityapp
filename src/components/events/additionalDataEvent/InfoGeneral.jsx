/*global google*/
import React, {Component} from "react";
import axios from "axios";
import Moment from "moment";
import Geosuggest from "react-geosuggest";
import {toast} from "react-toastify";
import {FormattedMessage} from "react-intl";
import MediumEditor from "medium-editor";
import {DateTimePicker} from "react-widgets";
import ImageInput from "../../shared/imageInput";
import SelectInput from "../../shared/selectInput";
import {Actions, CategoriesApi, OrganizationApi, TypesApi} from "../../../helpers/request";
import Loading from "../../loaders/loading";

class InfoGeneral extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event:{},
            error:{},
            loading:true,
            valid:true,
            path:[],
            selectedCategories: [],
            selectedOrganizer: {},
            selectedType: {},
        };
        this.editorRef = React.createRef();
    }

    async componentDidMount(){
        try{
            const event = this.props.data;
            const categories = await CategoriesApi.getAll();
            const types = await TypesApi.getAll();
            let organizers = await OrganizationApi.mine();
            organizers = organizers.map(item=>{
                return {value:item.id,label:item.name}
            });
            const {selectedCategories,selectedOrganizer,selectedType} = handleFields(organizers,types,categories,event);
            this.setState({newEvent:true,loading:false,event,categories,organizers,types,selectedCategories,selectedOrganizer,selectedType},()=>{
                this.editor = new MediumEditor(this.editorRef.current,{toolbar:{buttons:['bold','italic','underline','anchor']}});
                this.valid()
            })
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

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({event:{...this.state.event,[name]:value}},this.valid)
    };
    //Validación
    valid = () => {
        const error = {};
        const {event, selectedOrganizer, selectedType, selectedCategories} = this.state,
            valid = (event.name.length>0 && event.venue.length>0 && !!selectedOrganizer && !!selectedType && selectedCategories.length>0);
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

    //Envío de datos
    submit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { event,path } = this.state;
        const categories = this.state.selectedCategories.map(item=>{
            return item.value
        });
        const data = {
            name: event.name,
            hour_start:event.hour_start,
            date_start:event.date_start,
            hour_end:event.hour_end,
            date_end:event.date_end,
            picture: path.length > 1 ? path : event.picture,
            venue: event.venue,
            location: event.location,
            visibility: event.visibility?event.visibility:'PUBLIC',
            description: this.editor.getContent(),
            category_ids: categories,
            organizer_id: this.state.selectedOrganizer.value,
            event_type_id : this.state.selectedType.value
        };
        this.props.nextStep('info',data)
    }

    render() {
        if(this.state.loading) return <Loading/>;
        const { event, categories, organizers, types, selectedCategories, selectedOrganizer, selectedType, error, valid} = this.state;
        return (
            <React.Fragment>
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
                        <div className="field">
                            <label className="label required has-text-grey-light">Lugar</label>
                            <div className="control">
                                <input className="input" name={"venue"} type="text"
                                       placeholder="Lugar del evento" value={event.venue}
                                       onChange={this.handleChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label required has-text-grey-light">Dirección</label>
                            <div className="control">
                                <Geosuggest
                                    placeholder={'Ubicación del evento'}
                                    onKeyDown={this.changeSuggest}
                                    onSuggestSelect={this.onSuggestSelect}
                                    initialValue={event.location.FormattedAddress}
                                    location={new google.maps.LatLng(event.location.Latitude, event.location.Longitude)}
                                    radius="20"/>
                            </div>
                            {error.location && <p className="help is-danger">{error.location}</p>}
                        </div>
                        <div className="field">
                            <div className="columns is-mobile">
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label required has-text-grey-light">Fecha
                                            Inicio</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.date_start}
                                                format={'DD/MM/YYYY'}
                                                time={false}
                                                onChange={value => this.changeDate(value, "date_start")}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-line"></div>
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label required has-text-grey-light">Hora
                                            Inicio</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.hour_start}
                                                step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value, "hour_start")}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="columns is-mobile">
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label required has-text-grey-light">Fecha Fin</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.date_end}
                                                min={this.minDate}
                                                format={'DD/MM/YYYY'}
                                                time={false}
                                                onChange={value => this.changeDate(value, "date_end")}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="vertical-line"></div>
                                <div className="column inner-column">
                                    <div className="field">
                                        <label className="label required has-text-grey-light">Hora Fin</label>
                                        <div className="control">
                                            <DateTimePicker
                                                value={event.hour_end}
                                                step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value, "hour_end")}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label required has-text-grey-light">Descripción</label>
                            <div className="control">
                                <div ref={this.editorRef}></div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field picture">
                            <label className="label has-text-grey-light">Foto</label>
                            <div className="control">
                                <ImageInput picture={event.picture} imageFile={this.state.imageFile}
                                            divClass={'drop-img'}
                                            content={<img src={event.picture} alt={'Imagen Perfil'}/>}
                                            classDrop={'dropzone'} contentDrop={<button onClick={(e) => {
                                    e.preventDefault()
                                }}
                                                                                        className={`button is-primary is-inverted is-outlined ${this.state.imageFile ? 'is-loading' : ''}`}>Cambiar
                                    foto</button>}
                                            contentZone={<div
                                                className="has-text-grey has-text-weight-bold has-text-centered">
                                                <span>Subir foto</span><br/>
                                                <small>(Tamaño recomendado: 1280px x 960px)</small>
                                            </div>}
                                            changeImg={this.changeImg} errImg={this.state.errImg}
                                            style={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                position: 'relative',
                                                height: 250,
                                                width: '100%',
                                                borderWidth: 2,
                                                borderColor: '#b5b5b5',
                                                borderStyle: 'dashed',
                                                borderRadius: 10
                                            }}/>
                            </div>
                            {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                        </div>
                        <div className="field">
                            <div className="control">
                                <div className="select">
                                    <select value={event.visibility} onChange={this.handleChange}
                                            name={'visibility'}>
                                        <option value={'PUBLIC'}>Crear un evento público</option>
                                        <option value={'ORGANIZATION'}>Crear un evento privado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <SelectInput name={'Organizado por:'} isMulti={false}
                                     selectedOptions={selectedOrganizer} selectOption={this.selectOrganizer}
                                     options={organizers} required={true}/>
                        <SelectInput name={'Tipo'} isMulti={false} selectedOptions={selectedType}
                                     selectOption={this.selectType} options={types} required={true}/>
                        <SelectInput name={'Categorías:'} isMulti={true} selectedOptions={selectedCategories}
                                     selectOption={this.selectCategory} options={categories} required={true}/>
                    </div>
                </div>
                <div className="buttons is-left">
                    <button onClick={this.submit} className={`button is-primary`} disabled={valid}>Siguiente</button>
                </div>
            </React.Fragment>
        )
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

export default InfoGeneral
