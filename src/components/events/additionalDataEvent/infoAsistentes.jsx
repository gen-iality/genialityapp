import React, {Component} from "react";
import {typeInputs} from "../../../helpers/constants";
import {uniqueID} from "../../../helpers/utils";
import CreatableSelect from "react-select/lib/Creatable";

const initModal = {name:'',mandatory:false,label:'',description:'',type:'',options:[]};
const initOpt = [
    {label: "Nombres",mandatory: true,name: "names",type: "text",unique: false},
    {label: "Correo",mandatory: true,name: "email",type: "email",unique: true}
];
class InfoAsistentes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields:[],
            modal:false,
            info:initModal
        }
    }

    componentDidMount() {
        const {fields} = parseProperties(this.props.data);
        this.setState({fields})
    }

    addField = () => {
        this.setState({info:initModal,modal:true})
    };
    //Guardar campo en el evento
    saveField = () => {
        if(this.state.edit){
            const fields = [...this.state.fields];
            const pos = fields.map(f=>f.uuid).indexOf(this.state.info.uuid);
            fields[pos] = this.state.info;
            this.setState({fields,modal:false,info:initModal})
        }else{
            const info = Object.assign({},this.state.info);
            info.uuid = uniqueID();
            this.setState({fields:[...this.state.fields,info],modal:false,info:initModal,edit:false})
        }
    };
    //Editar campo en el evento
    editField = (info) => {
        this.setState({info,modal:true,edit:true})
    };
    //Borrar campo en el evento o lista
    removeField = (key) => {
        const {fields} = this.state;
        fields.splice(key, 1);
        this.setState({fields})
    };
    //Cambiar input del campo del evento
    handleChange = (e) => {
        let {name, value} = e.target;
        if(name === 'label'){
            this.setState({info:{...this.state.info,[name]:value,name:toCapitalizeLower(value)}});
        }else this.setState({info:{...this.state.info,[name]:value}});
    };
    //Cambiar mandatory del campo del evento o lista
    changeFieldCheck = (e,id) => {
        if(id){
            const fields = [...this.state.fields];
            const pos = fields.map(f=>f.uuid).indexOf(id);
            fields[pos].mandatory = !fields[pos].mandatory;
            this.setState({fields,modal:false,info:initModal})
        }
        else
        {
            this.setState(prevState => {
                return {info: {...this.state.info, mandatory: !prevState.info.mandatory}}
            })
        }
    };
    //Funciones para lista de opciones del campo
    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };
    changeOption = (option) => {
        this.setState({ info:{...this.state.info,options:option} });
    };
    handleKeyDown = (event) => {
        const { inputValue } = this.state;
        const value = inputValue;
        if (!value) return;
        switch (event.keyCode) {
            case 9:
            case 13:
                this.setState({inputValue: '',info:{...this.state.info,options:[...this.state.info.options,createOption(value)]}});
                event.preventDefault();
                break;
            default: {}
        }
    };

    submit = (flag) => {
        const data = {
            user_properties : [...this.state.fields,...initOpt]
        };
        flag? this.props.nextStep('fields',data) : this.props.prevStep('fields',data)
    };

    closeModal = () => {
        this.setState({inputValue:'',modal:false,info:initModal})
    };

    render() {
        const { fields, inputValue, newField, info} = this.state;
        return (
            <div>
                <h1>Información Asistentes</h1>
                <p>Aquí puedes agregar los campos de información que le solictarás a tus asistentes</p>
                <div className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <p className="subtitle is-5"><strong>Campos de Evento</strong></p>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button is-primary" onClick={this.addField} disabled={newField}>Agregar Campo</button>
                        </div>
                    </div>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>Tipo de Campo</th>
                        <th>Nombre</th>
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
                                <td>{field.type}</td>
                                <td>{field.label}</td>
                                <td>
                                    <input className="is-checkradio is-primary" type="checkbox" name={`mandatory${field.uuid}`}
                                           checked={field.mandatory} onChange={e=>this.changeFieldCheck(e,field.uuid)}/>
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
                <div className={`modal ${this.state.modal ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">{this.state.edit?'Editar Campo':'Agregar Campo'}</p>
                            <button className="delete is-large" aria-label="close" onClick={this.closeModal}/>
                        </header>
                        <section className="modal-card-body">
                            <div className="field">
                                <label className="label required has-text-grey-light">Nombre para mostrar</label>
                                <div className="control">
                                    <input className="input" name={"label"} type="text"
                                           placeholder="Nombre del campo" value={info.label}
                                           onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <label className="label required">Tipo</label>
                                    <div className="control">
                                        <div className="select">
                                            <select onChange={this.handleChange} name={'type'} value={info.type}>
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
                                    info.type === 'list' && (
                                        <div className="control">
                                            <CreatableSelect
                                                components={{DropdownIndicator: null,}}
                                                inputValue={inputValue}
                                                isClearable
                                                isMulti
                                                menuIsOpen={false}
                                                onChange={this.changeOption}
                                                onInputChange={this.handleInputChange}
                                                onKeyDown={(e)=>{this.handleKeyDown(e)}}
                                                placeholder="Escribe la opción y presiona Enter o Tab..."
                                                value={info.options}
                                            />
                                        </div>
                                    )
                                }
                            </div>
                            <div className="field">
                                <input className="is-checkradio is-primary" id={`mandatoryModal`}
                                       type="checkbox" name={`mandatory`} checked={info.mandatory}
                                       onChange={this.changeFieldCheck}/>
                                <label htmlFor={`mandatoryModal`}>Obligatorio</label>
                            </div>
                            <div className="field">
                                <label className="label required has-text-grey-light">Descripción</label>
                                <textarea className="textarea" placeholder="e.g. Hello world" name={'description'}
                                          value={info.description} onChange={this.handleChange}></textarea>
                            </div>
                            <div className="field column">
                                <label className="label required has-text-grey-light">Etiqueta</label>
                                <div className="control">
                                    <input className="input is-small" name={"name"} type="text"
                                           placeholder="Nombre del campo" value={info.name}
                                           onChange={this.handleChange}
                                    />
                                </div>
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-primary" onClick={this.saveField}>{this.state.edit?'Editar Campo':'Agregar Campo'}</button>
                        </footer>
                    </div>
                </div>
                <div className="buttons is-right">
                    <button onClick={e=>{this.submit(true)}} className={`button is-primary`}>Siguiente</button>
                    <button onClick={e=>{this.submit(false)}} className={`button is-text`}>Anterior</button>
                </div>
            </div>
        )
    }
}

//Función para mostrar los campos y grupos por separado
function parseProperties(event){
    const {user_properties} = event;
    let fields = user_properties.filter(item => !item.group_id);
    return {fields}
}

const createOption = (label) => ({label, value: label});

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

export default InfoAsistentes
