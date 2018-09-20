import React, { Component } from 'react';
import { DateTimePicker } from "react-widgets";
import ImageInput from "../shared/imageInput";
import { Actions } from "../../helpers/request";
import Moment from "moment";
import { BaseUrl } from "../../helpers/constants";

class NewEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : {
                name:'',
                summary: '',
                hour_start : Moment().toDate(),
                date_start : Moment().toDate(),
                hour_end : Moment().toDate(),
                date_end : Moment().toDate(),
            }
        };
        this.submit = this.submit.bind(this);
        this.uploadImg = this.uploadImg.bind(this);
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        this.setState({event:{...this.state.event,[name]:value}})
    };

    changeDate=(value,name)=>{
        this.setState({event:{...this.state.event,[name]:value}})
    };

    handleFileChange  = (files) => {
        const file = files[0];
        file ? this.setState({imageFile: file}) : this.setState({errImg:'Only images files allowed. Please try again (:'});
    };

    async uploadImg(e) {
        console.log('MAKE THE AXIOS REQUEST');
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
        e.preventDefault();
        e.stopPropagation();
    };

    changeImg = (files) => {
        const file = files[0];
        file ? this.setState({imageFile: file,
            event:{...this.state.event, picture: null}}) : this.setState({errImg:'Only images files allowed. Please try again (:'});
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
            location: event.location,
            visibility: event.visibility?event.visibility:'PUBLIC',
            summary: event.summary
        };
        try {
            const result = await Actions.create('/api/user/events', data);
            console.log(result);
            this.setState({loading:false});
            if(result._id){
                window.location.replace(`${BaseUrl}/edit/${result._id}/general`);
            }else{
                this.setState({msg:'Cant Create',create:false})
            }
        } catch (e) {
            console.log('Some error');
            console.log(e)
        }
    }

    render() {
        const { event } = this.state;
        return (
            <div className={`modal ${this.props.modal ? "is-active" : ""}`}>
                <div className="modal-background"></div>
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
                                            <input className="input" name={"location"} type="text"
                                                   placeholder="Text input" value={event.location}
                                                   onChange={this.handleChange}
                                            />
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
                                        <label className="label">Descripción Corta ({event.summary.length}/500)</label>
                                        <div className="control">
                                        <textarea className="textarea" name={"summary"} maxLength={500}
                                                  placeholder="Textarea" value={event.summary} onChange={this.handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Foto</label>
                                        <div className="control">
                                            <ImageInput picture={event.picture} handleFileChange={ this.handleFileChange}
                                                        imageFile={this.state.imageFile} uploadImg={this.uploadImg}
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