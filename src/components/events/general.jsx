import React, {Component} from 'react';
import { DateTimePicker } from 'react-widgets'
import Moment from "moment"
import ImageInput from "../shared/imageInput";
import {Actions} from "../../helpers/request";
import 'react-widgets/lib/scss/react-widgets.scss'
import {EventUrl} from "../../helpers/constants";
Moment.locale('es');

class General extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : this.props.event
        }
        this.submit = this.submit.bind(this)
    }

    handleChange = (e) => {
      const {name} = e.target;
      const {value} = e.target;
      this.setState({event:{...this.state.event,[name]:value}})
    };

    changeDate=(value,name)=>{
        this.setState({event:{...this.state.event,[name]:value}})
    };

    selectChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        value = (value === 'true');
        this.setState({event:{...this.state.event,[name]:value}})
    }

    handleFileChange  = (files) => {
        const file = files[0];
        file ? this.setState({imageFile: file}) : this.setState({errImg:'Only images files allowed. Please try again (:'});
    };

    uploadImg = (e) => {
        console.log('MAKE THE AXIOS REQUEST');
        let data = new FormData();
        const url = '/api/files/upload',
            self = this;
        data.append('file',this.state.imageFile);
        Actions.post(url, data)
            .then((image) => {
                self.setState({
                    formValues: {
                        ...self.state.formValues,
                        picture: image
                    },fileMsg:'Image uploaded successfull'
                });
                Actions.edit(
                    EventUrl,
                    {picture: image},
                    this.state.event._id)
                    .then((snap)=>{
                        console.log(snap)
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
        e.preventDefault();
        e.stopPropagation();
        const { event } = this.state;
        const data = {
            name: event.name,
            date_start : Moment(event.date_start).format('YYYY-MM-DD'),
            date_end : Moment(event.date_end).format('YYYY-MM-DD'),
            location: event.location,
            hour : Moment(event.hour).format('HH:mm'),
            picture: 'https://storage.googleapis.com/herba-images/evius/events/ryD968oYNEBQA5k4qiXTyddS3nD1HciSJ0socZbA.png',
            public: event.public,
            description: event.description
        };
        Actions.edit(
            EventUrl,
            data,
            event._id
        ).then((result)=>{
            console.log(result);
        });
    }

    render() {
        const { event } = this.state;
        return (
            <form onSubmit={this.submit}>
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
                                                format={'L'}
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
                                                value={event.hour}
                                                step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value,"hour")}/>
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
                                                format={'L'}
                                                time={false}
                                                onChange={value => this.changeDate(value,"date_end")}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Hora Fin?</label>
                                        {/*<div className="control">
                                            <DateTimePicker
                                                value={event.hour}
                                                step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value)}/>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Descripción</label>
                                <div className="control">
                                    <textarea className="textarea" name={"description"} placeholder="Textarea" value={event.description} onChange={this.handleChange}/>
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
                                        <select value={event.public} onChange={this.selectChange} name={'public'}>
                                            <option value={true}>Público</option>
                                            <option value={false}>Privado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="field">
                    <div className="control">
                        <button type={"submit"} className="button is-outlined is-success">Save!</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default General;