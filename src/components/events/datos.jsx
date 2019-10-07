import React, {Component} from "react";
import {uniqueID} from "../../helpers/utils";
import {typeInputs} from "../../helpers/constants";
import {Actions, EventsApi} from "../../helpers/request";
import {toast} from "react-toastify";
import {FormattedMessage} from "react-intl";
import {BaseUrl} from "../../helpers/constants";
import FieldEvent from "../modal/fieldEvent";

class Datos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event : {},
            info : {},
            newField: false,
            edit: false,
            fields:[]
        }
    }

    async componentDidMount(){
        const {event} = this.props;
        const {fields,groups} = parseProperties(event);
        this.setState({fields,groups,loading:false});
    }

    //*********** CAMPOS EVENTO
    //Agregar nuevo campo
    addField = () => {
        this.setState({edit:false,modal:true})
    };
    //Guardar campo en el evento
    saveField = (field) => {
        if(this.state.edit){
            const fields = [...this.state.fields];
            const pos = fields.map(f=>f.uuid).indexOf(field.uuid);
            fields[pos] = field;
            this.setState({fields,modal:false,edit:false,newField:false})
        }else{
            const info = Object.assign({},field);
            info.uuid = uniqueID();
            this.setState({fields:[...this.state.fields,info],modal:false,edit:false,newField:false})
        }
    };
    //Cambiar obligatorio
    changeCheck = (uuid) => {
        this.setState(prevState => {
            const list = prevState.fields.map(field => {
                if (field.uuid === uuid){
                    field.mandatory = !field.mandatory;
                    return field
                } else return field;
            });
            return {fields:list}
        })
    };
    //Abrir modal para editar dato
    editField = (info) => {
        this.setState({info,modal:true,edit:true})
    };
    //Borrar dato de la lista
    removeField = (key) => {
        const {fields} = this.state;
        fields.splice(key, 1);
        this.setState({fields})
    };
    closeModal = () => {
        this.setState({inputValue:'',modal:false,info:{},edit:false})
    };
    //*********** FIN CAMPOS EVENTO

    //Envío de datos
    async submit(e) {
        e.preventDefault();
        e.stopPropagation();
        const { event,groups,fields } = this.state;
        const self = this;
        const {properties_group,user_properties} = handleProperties(event,fields,groups);
        const data = {user_properties : [...this.state.fields, ...user_properties], properties_group};
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

    render() {
        const { fields, newField} = this.state;
        return (
            <div className="event-datos">
                <h2 className="title-section">Recopilación de datos</h2>
                <p>Configure los datos que desea recolectar de los asistentes del evento</p>
                <button className="button add is-pulled-right" onClick={this.addField} disabled={newField}>
                    <span className="icon"><i className="fab fa-plus-circle"/></span>
                    <span>Agregar dato</span>
                </button>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Dato</th>
                        <th>Tipo de Dato</th>
                        <th>Obligatorio</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Email</td>
                        <td>Correo</td>
                        <td>
                            <input className="is-checkradio is-primary" type="checkbox" id={"mandEmail"} checked={true} disabled={true}/>
                            <label className="checkbox" htmlFor={"mandEmail"}/>
                        </td>
                        <td/>
                    </tr>
                    <tr>
                        <td>Texto</td>
                        <td>Nombres</td>
                        <td>
                            <input className="is-checkradio is-primary" type="checkbox" id={"mandName"} checked={true} disabled={true}/>
                            <label className="checkbox" htmlFor={"mandName"}/>
                        </td>
                        <td/>
                    </tr>
                    {fields.map((field,key)=>{
                        return <tr key={key}>
                            <td>{field.label}</td>
                            <td>{typeInputs.find(type=>type.value === field.type).label}</td>
                            <td>
                                <input className="is-checkradio is-primary" id={`mandatory${field.label}`}
                                       type="checkbox" name={`mandatory`} checked={field.mandatory}
                                       onChange={event => this.changeCheck(field.uuid)}/>
                                <label htmlFor={`mandatory${field.label}`}></label>
                            </td>
                            <td>
                                <button onClick={e=>this.editField(field)}><span className="icon"><i className="fas fa-edit"/></span></button>
                                <button onClick={e=>this.removeField(key)}><span className="icon"><i className="fas fa-trash-alt"/></span></button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
                {this.state.modal&&<FieldEvent edit={this.state.edit} infoModal={this.state.info} modal={this.state.modal} saveField={this.saveField} closeModal={this.closeModal}/>}
            </div>
        )
    }
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

export default Datos
