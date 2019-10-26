import React, {Component} from 'react';
import {Redirect, withRouter} from "react-router-dom";
import Moment from "moment";
import ReactQuill from "react-quill";
import {FaChevronLeft, FaWhmcs} from "react-icons/fa";
import {DateTimePicker} from "react-widgets";
import EventContent from "../events/shared/content";
import {Link} from "react-router-dom";
import {SpacesApi} from "../../helpers/request";

class AgendaEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDay:true,
            description:"",
            days:[],
            spaces:[]
        }
    }

    async componentDidMount() {
        const { event } = this.props;
        let days = [];
        const init = Moment(event.date_start);
        const end = Moment(event.date_end);
        const diff = end.diff(init, 'days');
        for(let i = 0; i < diff+1; i++){
            days.push(Moment(init).add(i,'d'))
        }
        const {data} = await SpacesApi.byEvent(this.props.event._id);
        this.setState({days,spaces:parseSelect(data)});
    }

    handleChange = (e) => {
        const {name} = e.target;
        const {value} = e.target;
        this.setState({[name]:value});
    };

    handleBox = (e) => {
        const {name} = e.target;
        this.setState((prevState) => {
            return {[name]:!prevState[name]}
        });
    };

    chgTxt=(content, delta, source, editor)=>{
        console.log(editor.getHTML());
        this.setState({description:content})
    };

    render() {
        const {spaces} = this.state;
        const {matchUrl} = this.props;
        if(!this.props.location.state) return <Redirect to={matchUrl}/>;
        return (
            <EventContent title={<span><Link to={matchUrl}><FaChevronLeft/></Link>Activdad</span>}>
                <div className="columns">
                    <div className="column is-8">
                        <div className="field">
                            <label className="label">Nombre</label>
                            <div className="control">
                                <input className="input" type="description" name={"name"} onChange={this.handleChange} placeholder="Nombre de la actividad"/>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Día</label>
                            <div className="control">
                                {
                                    this.state.days.map((day,key)=>{
                                        return <label key={key} className="radio">
                                            <input type="radio" name="day" onChange={this.handleChange}/>
                                            {Moment(day).format('DD/MM/YY')}
                                        </label>
                                    })
                                }
                            </div>
                        </div>
                        <div className="field">
                            <input id="switchRoundedOutlinedDefault" type="checkbox"
                                   name="allDay" className="switch is-rounded is-outlined"
                                   checked={this.state.allDay} onClick={this.handleBox}/>
                            <label htmlFor="switchRoundedOutlinedDefault">Todo El Día</label>
                        </div>
                        {
                            !this.state.allDay && (
                                <div className="columns">
                                    <div className="column">
                                        <div className="field">
                                            <label className="label">Hora Inicio</label>
                                            <div className="control">
                                                <DateTimePicker
                                                    dropUp step={15}
                                                    date={false}
                                                    onChange={value => this.changeDate(value,"hour_start")}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column">
                                        <div className="field">
                                            <label className="label">Hora Fin</label>
                                            <DateTimePicker
                                                dropUp step={60}
                                                date={false}
                                                onChange={value => this.changeDate(value,"hour_end")}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <label className="label">Conferencista</label>
                        <div className="field has-addons">
                            <div className="control">
                                <div className="select">
                                    <select>
                                        <option>Buscar ponente</option>{
                                        this.state.days.map((day,key)=>{
                                            return <option key={key}>{Moment(day).format('DD/MM/YY')}</option>
                                        })
                                    }
                                    </select>
                                </div>
                            </div>
                            <div className="control">
                                <button className="button"><FaWhmcs/></button>
                            </div>
                        </div>
                        <label className="label">Espacio</label>
                        <div className="field has-addons">
                            <div className="control">
                                <div className="select">
                                    <select>
                                        <option>Seleccione un lugar/salón ...</option>{
                                        spaces.map(space=>{
                                            return <option key={space.value} value={space.value}>{space.label}</option>
                                        })
                                    }
                                    </select>
                                </div>
                            </div>
                            <div className="control">
                                <Link to={matchUrl.replace("agenda","espacios")}>
                                    <button className="button"><FaWhmcs/></button>
                                </Link>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Descripción (opcional)</label>
                            <div className="control">
                                <ReactQuill value={this.state.description} modules={modules} onChange={this.chgTxt}/>
                            </div>
                        </div>
                    </div>
                    <div className="column is-4 general">
                        {/*<ReactQuill value={this.state.description} modules={{toolbar:false}} readOnly={true}/>*/}
                        <div className="field is-grouped">
                            <button className="button is-text" onClick={this.modalEvent}>x Eliminar actividad</button>
                            <button onClick={this.submit} className={`${this.state.loading?'is-loading':''}button is-primary`}>Guardar</button>
                        </div>
                        <div className="section-gray">
                            <div className="field picture">
                                <label className="label has-text-grey-light">Imagen</label>
                                <div className="control">

                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Categoría</label>
                                <div className="control">
                                    <div className="select">
                                        <select>
                                            <option>Sin categoría</option>{
                                            spaces.map(space=>{
                                                return <option key={space.value} value={space.value}>{space.label}</option>
                                            })
                                        }
                                        </select>
                                    </div>
                                    <p className="help is-pulled-right">Agregar categoría</p>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Tipo de actividad</label>
                                <div className="control">
                                    <div className="select">
                                        <select>
                                            <option>Sin actividad</option>{
                                            spaces.map(space=>{
                                                return <option key={space.value} value={space.value}>{space.label}</option>
                                            })
                                        }
                                        </select>
                                    </div>
                                    <p className="help is-info is-pulled-right">Agregar actividad</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </EventContent>
        );
    }
}

function parseSelect(data) {
    const list = [];
    data.map(i=>list.push({label:i.name,value:i._id}));
    return list
}

const modules = {
    toolbar: [
        [{ 'font': []}],
        [{ 'header': [0,1, 2, 3] }],
        [{ 'size': []}],
        [{ 'align': []}],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        [{'color':[]}, {'background':[]}],
        ['clean']
    ],
};

export default withRouter(AgendaEdit);
