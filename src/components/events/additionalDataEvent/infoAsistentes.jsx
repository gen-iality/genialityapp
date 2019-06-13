import React, {Component} from "react";
import {typeInputs} from "../../../helpers/constants";
import CreatableSelect from "react-select/lib/Creatable";

class InfoAsistentes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fields:[],
            path:[],
            groups:[],
            inputValue: '',
            listValue: ''
        }
    }

    componentDidMount() {
        const {fields,groups} = parseProperties(this.props.data);
        this.setState({fields,groups})
    }

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

    submit = (flag) => {
        const {properties_group,user_properties} = handleProperties(this.state.fields,this.state.groups);
        const data = {
            user_properties : [...this.state.fields, ...user_properties],
            properties_group
        };
        flag? this.props.nextStep('fields',data) : this.props.prevStep('fields',data)
    };


    render() {
        const { fields, inputValue, newField, groups, listValue} = this.state;
        return (
            <div>
                <h1>Información Asistentes</h1>
                <p>Aquí puedes agregar los campos de información que le solictarás a tus asistentes</p>
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
                                                    !field.name.match('^(email|document|names)$') &&
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
    let groups = [];
    const {user_properties,properties_group} = event;
    let fields = user_properties.filter(item => !item.group_id);
    properties_group.map((group,key) => groups[key] = {group_id:group,fields:user_properties.filter(item => item.group_id === group)});
    return {fields,groups}
}

//Función para construir el campo user_properties y properties_group con los nuevos campos|grupos
function handleProperties(fields,groups){
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

export default InfoAsistentes