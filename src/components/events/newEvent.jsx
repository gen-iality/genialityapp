/*global google*/
import React, { Component } from 'react';
import { DateTimePicker } from "react-widgets";
import ImageInput from "../shared/imageInput";
import Geosuggest from 'react-geosuggest'
import { Actions } from "../../helpers/request";
import Moment from "moment";
import { BaseUrl } from "../../helpers/constants";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : {
                name:'',
                description: '',
                hour_start : Moment().toDate(),
                date_start : Moment().toDate(),
                hour_end : Moment().toDate(),
                date_end : Moment().toDate(),
            }
        };
        this.submit = this.submit.bind(this);
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({event:{...this.state.event,[name]:value}})
    };

    changeDate=(value,name)=>{
        this.setState({event:{...this.state.event,[name]:value}})
    };

    changeImg = (files) => {
        const file = files[0];
        if(!file){
            this.setState({errImg:'Only images files allowed. Please try again (:'});
        }else{
            this.setState({imageFile: file,
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
                        },fileMsg:'Image uploaded successfull'
                    });
                });
        }
    };

    cancelImg = (e) => {
        this.setState({imageFile:null,
            formValues:{...this.state.formValues, picture: this.state.urlImg}});
        e.preventDefault();
        e.stopPropagation();
    };

    async submit(e) {
        this.setState({loading:true});
        e.preventDefault();
        e.stopPropagation();
        const { event } = this.state;
        const hour_start = Moment(event.hour_start).format('HH:mm');
        const date_start = Moment(event.date_start).format('YYYY-MM-DD');
        const hour_end = Moment(event.hour_end).format('HH:mm');
        const date_end = Moment(event.date_end).format('YYYY-MM-DD');
        const datetime_from = Moment(date_start+' '+hour_start, 'YYYY-MM-DD HH:mm');
        const datetime_to = Moment(date_end+' '+hour_end, 'YYYY-MM-DD HH:mm');
        const data = {
            name: event.name,
            datetime_from : datetime_from.format('YYYY-MM-DD HH:mm:ss'),
            datetime_to : datetime_to.format('YYYY-MM-DD HH:mm:ss'),
            picture: event.picture,
            location: event.location,
            visibility: event.visibility?event.visibility:'PUBLIC',
            description: event.description
        };
        try {
            const result = await Actions.create('/api/user/events', data);
            console.log(result);
            this.setState({loading:false});
            if(result._id){
                window.location.replace(`${BaseUrl}/edit/${result._id}`);
            }else{
                this.setState({msg:'Cant Create',create:false})
            }
        } catch (e) {
            console.log('Some error');
            console.log(e)
        }
    }

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
            console.log(location);
            this.setState({event:{...this.state.event,location}})
        }
    };

    render() {
        const { event } = this.state;
        return (
            <div className={`modal ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Nuevo Evento</p>
                        <button className="delete" data-dismiss="quickview" onClick={(e)=>{this.props.newEvent()}}/>
                    </header>
                    <section className="modal-card-body">
                        <div className="content">
                            <div className="columns">
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Nombre</label>
                                        <div className="control">
                                            <input className="input" name={"name"} type="text"
                                                   placeholder="Text input" value={event.name}
                                                   onChange={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Dirección</label>
                                        <div className="control">
                                            <Geosuggest
                                                placeholder={'Dirección'}
                                                onSuggestSelect={this.onSuggestSelect}
                                                location={new google.maps.LatLng(53.558572, 9.9278215)}
                                                radius="20"/>
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column">
                                            <div className="field">
                                                <label className="label">Fecha Inicio</label>
                                                <div className="control">
                                                    <DateTimePicker
                                                        value={event.date_start}
                                                        format={'DD/MM/YY'}
                                                        time={false}
                                                        onChange={value => this.changeDate(value,"date_start")}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="field">
                                                <label className="label">Hora Inicio</label>
                                                <div className="control">
                                                    <DateTimePicker
                                                        value={event.hour_start}
                                                        format={'HH:mm'}
                                                        step={60}
                                                        date={false}
                                                        onChange={value => this.changeDate(value,"hour_start")}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="columns">
                                        <div className="column">
                                            <div className="field">
                                                <label className="label">Fecha Fin</label>
                                                <div className="control">
                                                    <DateTimePicker
                                                        value={event.date_end}
                                                        format={'DD/MM/YY'}
                                                        time={false}
                                                        onChange={value => this.changeDate(value,"date_end")}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="column">
                                            <div className="field">
                                                <label className="label">Hora Fin</label>
                                                <div className="control">
                                                    <DateTimePicker
                                                        value={event.hour_end}
                                                        format={'HH:mm'}
                                                        step={60}
                                                        date={false}
                                                        onChange={value => this.changeDate(value,"hour_end")}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="field">
                                        <label className="label">Descripción</label>
                                        <div className="control">
                                        <textarea className="textarea" name={"description"}
                                                  placeholder="Textarea" value={event.description} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Foto</label>
                                        <div className="control">
                                            <ImageInput picture={event.picture} imageFile={this.state.imageFile}
                                                        cancelImg={this.cancelImg} changeImg={this.changeImg} errImg={this.state.errImg}/>
                                        </div>
                                        {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                                    </div>
                                    <div className="field">
                                        <label className="label">Visibilidad</label>
                                        <div className="control">
                                            <div className="select">
                                                <select value={event.visibility} onChange={this.handleChange} name={'visibility'}>
                                                    <option>Selecciona...</option>
                                                    <option value={'PUBLIC'}>Público</option>
                                                    <option value={'ORGANIZATION'}>Privado</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <footer className="modal-card-foot">
                        <div className="field">
                            <div className="control">
                                {
                                    this.state.loading? <p>Saving...</p>
                                        :<button onClick={this.submit} className={`button is-outlined is-success`}>Create</button>
                                }
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}

export default NewEvent;