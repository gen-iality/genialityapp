import React, { Component } from 'react';
import Moment from "moment"
import ReactQuill from "react-quill";
import ImageInput from "../shared/imageInput";
import { Actions, CategoriesApi, EventsApi, OrganizationApi, TypesApi } from "../../helpers/request";
import { BaseUrl, toolbarEditor } from "../../helpers/constants";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-widgets/lib/scss/react-widgets.scss'
import ErrorServe from "../modal/serverError";
import Dialog from "../modal/twoAction";
import { FormattedMessage } from "react-intl";
import LogOut from "../shared/logOut";
import axios from "axios/index"
import { DateTimePicker } from "react-widgets";
import SelectInput from "../shared/selectInput";
import Loading from "../loaders/loading";
Moment.locale('es');

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            optionForm: [],
            selectedOption: [],
            selectedOrganizer: {},
            selectedType: {},
            error: {},
            fields: [],
            path: [],
            inputValue: '',
            listValue: '',
            option: [],
            minDate: new Date(),
            valid: !this.props.event._id,
            groups: [],
            errorData: {},
            serverError: false,
            loading: true,
            info: {}
        };
        this.submit = this.submit.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
    }

    async componentDidMount() {
        const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
        this.setState({ info })
        console.log(this.state.info)
        try {
            const { event } = this.state;
            event.picture = (typeof event.picture === 'object') ? event.picture[0] : event.picture;
            const categories = await CategoriesApi.getAll();
            const types = await TypesApi.getAll();
            let organizers = await OrganizationApi.mine();
            organizers = organizers.map(item => {
                return { value: item.id, label: item.name }
            });
            const { selectedCategories, selectedOrganizer, selectedType } = handleFields(organizers, types, categories, event);
            this.setState({ categories, organizers, types, selectedCategories, selectedOrganizer, selectedType, loading: false })
        }
        catch (error) {
            // Error
            if (error.response) {
                console.log(error.response);
                const { status } = error.response;
                if (status === 401) this.setState({ timeout: true, loader: false });
                else this.setState({ serverError: true, loader: false })
            } else {
                console.log('Error', error.message);
                if (error.request) console.log(error.request);
                this.setState({ serverError: true, loader: false, errorData: { status: 400, message: JSON.stringify(error) } })
            }
            console.log(error.config);
        }
    }

    //*********** FUNCIONES DEL FORMULARIO
    //Cambio en los input
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ event: { ...this.state.event, [name]: value } }, this.valid)
    };
    //Validación
    valid = () => {
        const error = {};
        const { event, selectedOrganizer, selectedType, selectedCategories } = this.state;
        const valid = (event.name.length > 0 && event.venue.length > 0 && !!selectedOrganizer && !!selectedType && selectedCategories.length > 0);
        this.setState({ valid: !valid, error })
    };
    //Cambio en la descripción
    chgTxt = content => this.setState({ event: { ...this.state.event, description: content } });
    //Funciones para manejar el cambio en listas desplegables
    selectCategory = (selectedCategories) => {
        this.setState({ selectedCategories }, this.valid);
    };
    selectOrganizer = (selectedOrganizer) => {
        if (!selectedOrganizer.value) selectedOrganizer = undefined;
        this.setState({ selectedOrganizer }, this.valid);
    };
    selectType = (selectedType) => {
        if (!selectedType.value) selectedType = undefined;
        this.setState({ selectedType }, this.valid);
    };
    //Cambio en los input de fechas
    changeDate = (value, name) => {
        let { event: { date_end } } = this.state;
        if (name === 'date_start') {
            const diff = Moment(value).diff(Moment(date_end), 'days');
            if (diff >= 0) date_end = Moment(date_end).add(diff, 'days').toDate();
            this.setState({ minDate: value, event: { ...this.state.event, date_end: date_end, date_start: value } });
        } else this.setState({ event: { ...this.state.event, [name]: value } })
    };
    //Cambio en el input de imagen
    changeImg = (files) => {
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', path = [], self = this;
        if (file) {
            this.setState({
                imageFile: file,
                event: { ...this.state.event, picture: null }
            });

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file', file);
                return Actions.post(url, data).then((image) => {
                    console.log(image);
                    if (image) path.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(path);
                console.log('SUCCESSFULL DONE');
                self.setState({
                    event: {
                        ...self.state.event,
                        picture: path[0]
                    }, fileMsg: 'Imagen subida con exito', imageFile: null, path
                });

                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
            });
        }
        else {
            this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
        }
    };

    banner_image = (files) => {
        console.log(files);
        const file = files;
        const url = '/api/files/upload', banner_image = [], self = this;
        if (file) {
            this.setState({
                imageFileBannerImage: file,
                event: { ...this.state.event, bannerImage: null }
            });

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file', file);
                return Actions.post(url, data).then((image) => {
                    console.log(image);
                    if (image) banner_image.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(this.banner_image);
                console.log('SUCCESSFULL DONE');
                self.setState({
                    event: {
                        ...self.state.event,
                        bannerImage: banner_image
                    }, fileMsgBanner: 'Imagen subida con exito', imageFileBannerImage: null, banner_image
                });

                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
            });
        }
        else {
            this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
        }
    };
    //*********** FIN FUNCIONES DEL FORMULARIO

    //Envío de datos
    async submit(e) {
        e.preventDefault();
        e.stopPropagation();
        const { event, path } = this.state;
        const self = this;
        //this.setState({loading:true});
        const hour_start = Moment(event.hour_start).format('HH:mm');
        const date_start = Moment(event.date_start).format('YYYY-MM-DD');
        const hour_end = Moment(event.hour_end).format('HH:mm');
        const date_end = Moment(event.date_end).format('YYYY-MM-DD');
        const datetime_from = Moment(date_start + ' ' + hour_start, 'YYYY-MM-DD HH:mm');
        const datetime_to = Moment(date_end + ' ' + hour_end, 'YYYY-MM-DD HH:mm');
        const categories = this.state.selectedCategories.map(item => {
            return item.value
        });
        const data = {
            name: event.name,
            datetime_from: datetime_from.format('YYYY-MM-DD HH:mm:ss'),
            datetime_to: datetime_to.format('YYYY-MM-DD HH:mm:ss'),
            picture: path.length > 1 ? path : event.picture,
            venue: event.venue,
            address: event.address,
            has_date: event.has_date == "true" ? true : false,
            allow_register: event.allow_register == "true" ? true : false,
            allow_detail_calendar: event.allow_detail_calendar = "true" ? true: false,
            homeSelectedScreen: parseInt(event.homeSelectedScreen),
            visibility: event.visibility ? event.visibility : 'PUBLIC',
            description: event.description,
            category_ids: categories,
            organizer_id: this.state.selectedOrganizer.value,
            event_type_id: this.state.selectedType.value,
            app_configuration: this.state.info.app_configuration,
            banner_image: this.state.banner_image
        };

        try {
            console.log(data)
            if (event._id) {
                const info = await EventsApi.editOne(data, event._id);
                this.props.updateEvent(info);
                self.setState({ loading: false });
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
            }
            else {
                const result = await Actions.create('/api/events', data);
                this.setState({ loading: false });
                if (result._id) {
                    window.location.replace(`${BaseUrl}/event/${result._id}`);
                } else {
                    toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
                    this.setState({ msg: 'Cant Create', create: false })
                }
            }
        }
        catch (error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
            if (error.response) {
                console.log(error.response);
                const { status, data } = error.response;
                console.log('STATUS', status, status === 401);
                if (status === 401) this.setState({ timeout: true, loader: false });
                else this.setState({ serverError: true, loader: false, errorData: data })
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                if (error.request) {
                    console.log(error.request);
                    errorData = error.request
                };
                errorData.status = 708;
                this.setState({ serverError: true, loader: false, errorData })
            }
            console.log(error.config);
        }
    }
    //Delete event
    async deleteEvent() {
        this.setState({ isLoading: 'Cargando....' });
        try {
            const result = await EventsApi.deleteOne(this.state.event._id);
            console.log(result);
            this.setState({ message: { ...this.state.message, class: 'msg_success', content: 'Evento borrado' }, isLoading: false });
            setTimeout(() => {
                this.setState({ message: {}, modal: false });
                window.location.replace(`${BaseUrl}/`);
            }, 500)
        }
        catch (error) {
            if (error.response) {
                console.log(error.response);
                this.setState({ message: { ...this.state.message, class: 'msg_error', content: JSON.stringify(error.response) }, isLoading: false })
            }
            else if (error.request) {
                console.log(error.request);
                this.setState({ serverError: true, errorData: { message: error.request, status: 708 } });
            }
            else {
                console.log('Error', error.message);
                this.setState({ serverError: true, errorData: { message: error.message, status: 708 } });
            }
        }
    }
    closeModal = () => {
        this.setState({ modal: false, message: {} })
    };
    modalEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ modal: true });
    };

    render() {
        if (this.state.loading) return <Loading />;
        const { event, categories, organizers, types,
            selectedCategories, selectedOrganizer, selectedType,
            valid, timeout, errorData, serverError } = this.state;
        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-8">
                        <h2 className="title-section">Datos del evento</h2>
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
                            <label className="label required">Desea mantener activa las fechas en la aplicacion?</label>
                            <div class="select is-primary">
                                <select name="has_date" value={event.has_date} defaultValue={{ label: 'Si', value: 'Si' }} onChange={this.handleChange}>
                                    <option>Seleccionar...</option>
                                    <option value={true}>Si</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label required">Desea Tener Registro en la aplicación?</label>
                            <div class="select is-primary">
                                <select name="allow_register" value={event.allow_register} defaultValue={{ label: 'Si', value: 'Si' }} onChange={this.handleChange}>
                                    <option>Seleccionar...</option>
                                    <option value={true}>Si</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label required">Desea observar el detalle de la agenda en la aplicación?</label>
                            <div class="select is-primary">
                                <select name="allow_detail_calendar" value={event.allow_detail_calendar} defaultValue={{ label: 'Si', value: 'Si' }} onChange={this.handleChange}>
                                    <option>Seleccionar...</option>
                                    <option value={true}>Si</option>
                                    <option value={false}>No</option>
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label">Que modulo desea observar en el inicio</label>
                            <div class="select is-primary">
                                <select name="homeSelectedScreen" value={event.homeSelectedScreen} onChange={this.handleChange}>                       
                                <option value={''}>Banner de inicio</option>
                                    <option value={event.app_configuration.ProfileScreen? event.app_configuration.ProfileScreen.key:''}>{event.app_configuration.ProfileScreen ? event.app_configuration.ProfileScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.CalendarScreen? event.app_configuration.CalendarScreen.key:''}>{event.app_configuration.CalendarScreen ? event.app_configuration.CalendarScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.NewsScreen? event.app_configuration.NewsScreen.key:''}>{event.app_configuration.NewsScreen ? event.app_configuration.NewsScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.EventPlaceScreen? event.app_configuration.EventPlaceScreen.key:''}>{event.app_configuration.EventPlaceScreen ? event.app_configuration.EventPlaceScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.SpeakerScreen? event.app_configuration.SpeakerScreen.key:''}>{event.app_configuration.SpeakerScreen ? event.app_configuration.SpeakerScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.SurveyScreen? event.app_configuration.SurveyScreen.key:''}>{event.app_configuration.SurveyScreen ? event.app_configuration.SurveyScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.DocumentsScreen? event.app_configuration.DocumentsScreen.key:''}>{event.app_configuration.DocumentsScreen ? event.app_configuration.DocumentsScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.WallScreen? event.app_configuration.WallScreen.key:''}>{event.app_configuration.WallScreen ? event.app_configuration.WallScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.WebScreen? event.app_configuration.WebScreen.key:''}>{event.app_configuration.WebScreen ? event.app_configuration.WebScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                    <option value={event.app_configuration.FaqsScreen? event.app_configuration.FaqsScreen.key:''}>{event.app_configuration.FaqsScreen ? event.app_configuration.FaqsScreen.title:'Favor Seleccionar items del menu para la aplicación'}</option>
                                </select>
                            </div>
                        </div>

                        <div className="field">
                            <label className="label has-text-grey-light">Dirección</label>
                            <div className="control">
                                <input className="input" name={"address"} type="text"
                                    placeholder="¿Cuál es la dirección del evento?" value={event.address}
                                    onChange={this.handleChange} />
                            </div>
                        </div>

                        <div className="field">
                            <label className="label required has-text-grey-light">Lugar</label>
                            <div className="control">
                                <input className="input" name={"venue"} type="text"
                                    placeholder="Nombre del lugar del evento" value={event.venue}
                                    onChange={this.handleChange} />
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
                                                onChange={value => this.changeDate(value, "date_start")} />
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
                                                onChange={value => this.changeDate(value, "hour_start")} />
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
                                                onChange={value => this.changeDate(value, "date_end")} />
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
                                                onChange={value => this.changeDate(value, "hour_end")} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label has-text-grey-light">Descripción</label>
                            <div className="control">
                                <ReactQuill value={event.description} modules={toolbarEditor} onChange={this.chgTxt} />
                            </div>
                        </div>
                    </div>
                    <div className="column is-4">
                        <div className="field is-grouped">
                            {event._id && <button className="button is-text" onClick={this.modalEvent}>x Eliminar evento</button>}
                            <button onClick={this.submit} className={`${this.state.loading ? 'is-loading' : ''}button is-primary`} disabled={valid}>Guardar</button>
                        </div>
                        <div className="section-gray">
                            <div className="field">
                                <label className="label">Evento</label>
                                <div className="control toggle-switch has-text-centered">
                                    <input type="radio" id="choice1" name="visibility" checked={event.visibility === "PUBLIC"} value="PUBLIC" onChange={this.handleChange} />
                                    <label htmlFor="choice1">Público</label>
                                    <input type="radio" id="choice2" name="visibility" checked={event.visibility === "ORGANIZATION"} value="ORGANIZATION" onChange={this.handleChange} />
                                    <label htmlFor="choice2">Privado</label>
                                    <div id="flap"><span className="content">{event.visibility === "PUBLIC" ? "Público" : "Privado"}</span></div>
                                </div>
                            </div>
                            <SelectInput name={'Organizado por:'} isMulti={false} selectedOptions={selectedOrganizer} selectOption={this.selectOrganizer} options={organizers} required={true} />
                            <div className="field picture">
                                <label className="label has-text-grey-light">Imagen</label>
                                <div className="control">
                                    <ImageInput picture={event.picture} imageFile={this.state.imageFile}
                                        divClass={'drop-img'} content={<img src={event.picture} alt={'Imagen Perfil'} />}
                                        classDrop={'dropzone'} contentDrop={<button onClick={(e) => { e.preventDefault() }} className={`button is-primary is-inverted is-outlined ${this.state.imageFile ? 'is-loading' : ''}`}>Cambiar foto</button>}
                                        contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br /><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                        changeImg={this.changeImg} errImg={this.state.errImg}
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10 }} />
                                </div>
                                {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                            </div>
                            <SelectInput name={'Categorías:'} isMulti={true} max_options={2} selectedOptions={selectedCategories} selectOption={this.selectCategory} options={categories} required={true} />
                            <SelectInput name={'Tipo'} isMulti={false} selectedOptions={selectedType} selectOption={this.selectType} options={types} required={true} />
                        </div>
                    </div>
                </div>
                {timeout && (<LogOut />)}
                {serverError && (<ErrorServe errorData={errorData} />)}
                <Dialog modal={this.state.modal} title={'Borrar Evento'}
                    content={<p>¿Estas seguro de eliminar este evento?</p>}
                    first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.deleteEvent }}
                    message={this.state.message} isLoading={this.state.isLoading}
                    second={{ title: 'Cancelar', class: '', action: this.closeModal }} />
                <div className="control">
                    <ImageInput picture={event.banner_image} imageFile={this.state.imageFileBannerImage}
                        divClass={'drop-img'} content={<img src={event.banner_image ? event.picture : event.banner_image} alt={'Imagen Perfil'} />}
                        classDrop={'dropzone'} contentDrop={<button onClick={(e) => { e.preventDefault() }} className={`button is-primary is-inverted is-outlined ${this.state.imageFileBannerImage ? 'is-loading' : ''}`}>Cambiar foto</button>}
                        contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br /><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                        changeImg={this.banner_image} errImg={this.state.errImg}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10 }} />
                </div>
                {this.state.fileMsgBanner && (<p className="help is-success">{this.state.fileMsgBanner}</p>)}
            </React.Fragment>
        );
    }
}

//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
function handleFields(organizers, types, categories, event) {
    let selectedCategories = [];
    let selectedType = {};
    const { category_ids, organizer_id, event_type_id } = event;
    if (category_ids) {
        categories.map(item => {
            let pos = category_ids.indexOf(item.value);
            return (pos >= 0) ? selectedCategories.push(item) : ''
        });
    }
    const pos = organizers.map((e) => { return e.value; }).indexOf(organizer_id);
    const selectedOrganizer = organizers[pos];
    if (event_type_id) {
        const pos = types.map((e) => { return e.value; }).indexOf(event_type_id);
        selectedType = types[pos];
    } else selectedType = undefined;
    return { selectedOrganizer, selectedCategories, selectedType }
}

export default General;
