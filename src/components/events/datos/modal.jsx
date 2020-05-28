import React, { Component, Fragment } from "react";
import { typeInputs } from "../../../helpers/constants";
import CreatableSelect from "react-select/lib/Creatable";
import { Radio } from "antd";
import { normalizeUnits } from "moment";


const html = document.querySelector("html");
class DatosModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: { name: '', mandatory: false, visible: false, label: '', description: '', type: '', options: [] },
            valid: true
        }
    }

    componentDidMount() {
        html.classList.add('is-clipped');
        if (this.props.edit) this.setState({ info: this.props.info }, this.validForm);
    }

    generateFieldNameForLabel(name, value) {
        //.replace(/[\u0300-\u036f]/g, "") = quita unicamente las tildes, normalize("NFD") pasa la cadena de texto a formato utf-8 y el normalize quita caracteres alfanumericos
        const generatedFieldName = toCapitalizeLower(value).normalize("NFD").replace(/[^a-z0-9]+/gi, "")
        console.log("ERROR", generatedFieldName);
        this.setState({
            info: {
                ...this.state.info, [name]: value, name: generatedFieldName
            }
        }, this.validForm);
    }

    handleChange = (e) => {
        let { name, value } = e.target;
        //Generamos el nombre del campo para la base de datos(name) a partir del label solo si el campo se esta creando
        if (name === 'label' && !this.state.info._id) {
            this.generateFieldNameForLabel(name, value)
        }
        else this.setState({ info: { ...this.state.info, [name]: value } }, this.validForm);
    };

    validForm = () => {
        const { name, label, type, options } = this.state.info;
        let valid = !(name.length > 0 && label.length > 0 && type !== "");
        if (type === "list") valid = !(!valid && options.length > 0);
        this.setState({ valid })
    };

    //Cambiar mandatory del campo del evento o lista
    changeFieldCheck = (e) => {
        this.setState(prevState => {
            return { info: { ...this.state.info, mandatory: !prevState.info.mandatory } }
        })
    };

    changeFieldCheckVisible = (e) => {
        this.setState(prevState => {
            return { info: { ...this.state.info, visible: !prevState.info.visible } }
        })
    };
    //Funciones para lista de opciones del campo
    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };
    changeOption = (option) => {
        this.setState({ info: { ...this.state.info, options: option } }, this.validForm);
    };
    handleKeyDown = (event) => {
        const { inputValue } = this.state;
        const value = inputValue;
        if (!value) return;
        switch (event.keyCode) {
            case 9:
            case 13:
                this.setState({ inputValue: '', info: { ...this.state.info, options: [...this.state.info.options, createOption(value)] } }, this.validForm);
                event.preventDefault();
                break;
            default: { }
        }
    };
    //Guardar campo en el evento
    saveField = () => {
        html.classList.remove('is-clipped');
        const info = Object.assign({}, this.state.info);
        info.name = toCapitalizeLower(info.name);
        if (info.type !== "list") delete info.options;
        this.props.action(info);
        const initModal = { name: '', mandatory: false, visible: false, label: '', description: '', type: '', options: [] };
        this.setState({ info: initModal });
    };

    render() {
        const { inputValue, info, valid } = this.state;
        const { edit } = this.props;
        return (
            <Fragment>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label required has-text-grey-light">Nombre Campo </label>
                        <div className="control">
                            <input className="input" name={"label"} type="text"
                                placeholder="Ej: Celular" value={info.label}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>
                    <input className="input is-small" name={"name"} type="text"
                        placeholder="Nombre del campo en base de datos" value={info.name} disabled={true}
                        onChange={this.handleChange}
                    />
                    <div className="field">
                        <label className="label has-text-grey-light">Posición Nombre del Campo </label>
                        <div className="">
                            <label>
                                <input
                                    type="radio"
                                    name="labelPosition"
                                    value="arriba"
                                    className="form-check-input"
                                    checked={info.labelPosition == "arriba" || !info.labelPosition}
                                    onChange={this.handleChange}
                                />
    Arriba &nbsp;</label>

                            <label>
                                <input
                                    type="radio"
                                    name="labelPosition"
                                    value="izquierda"
                                    className="form-check-input"
                                    checked={info.labelPosition == "izquierda"}
                                    onChange={this.handleChange}
                                />
    Izquierda &nbsp;</label>

                            <label>
                                <input
                                    type="radio"
                                    name="labelPosition"
                                    value="derecha"
                                    className="form-check-input"
                                    checked={info.labelPosition == "derecha"}
                                    onChange={this.handleChange}
                                />
    Derecha &nbsp;</label>


                        </div>
                    </div>

                    <div className="field">
                        <div className="control">
                            <label className="label required">Tipo de dato</label>
                            <div className="control">
                                <div className="select">
                                    <select onChange={this.handleChange} name={'type'} value={info.type}>
                                        <option value={''}>Seleccione...</option>
                                        {
                                            typeInputs.map((type, key) => {
                                                return <option key={key} value={type.value}>{type.label}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        {
                            (info.type === 'list' || info.type === 'multiplelist') && (
                                <div className="control">
                                    <CreatableSelect
                                        components={{ DropdownIndicator: null, }}
                                        inputValue={inputValue}
                                        isClearable
                                        isMulti
                                        menuIsOpen={false}
                                        onChange={this.changeOption}
                                        onInputChange={this.handleInputChange}
                                        onKeyDown={(e) => { this.handleKeyDown(e) }}
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
                            onChange={this.changeFieldCheck} />
                        <label htmlFor={`mandatoryModal`}>Obligatorio</label>
                    </div>

                    <div className="field">
                        <input className="is-checkradio is-primary" id={`visibleModal`}
                            type="checkbox" name={`visible`} checked={info.visible}
                            onChange={this.changeFieldCheckVisible} />
                        <label htmlFor={`visibleModal`}>Visible en aplicativo</label>
                    </div>

                    <div className="field">
                        <label className="label has-text-grey-light">Descripción</label>
                        <textarea className="textarea" placeholder="descripción corta" name={'description'}
                            value={info.description} onChange={this.handleChange} />
                    </div>

                    <div className="field">
                        <label className="label has-text-grey-light">Posición / Orden </label>
                        <div className="control">
                            <input className="input" name={"order_weight"} type="number"
                                placeholder="1" value={info.order_weight}
                                onChange={this.handleChange}
                            />
                        </div>
                    </div>

                </section>
                <footer className="modal-card-foot">
                    <button className="button is-primary" onClick={this.saveField} disabled={valid}>{edit ? 'Guardar' : 'Agregar'}</button>
                </footer>
            </Fragment>
        )
    }
}

const createOption = (label) => ({ label, value: label });

//Función para convertir una frase en camelCase: "Hello New World" → "helloNewWorld"
function toCapitalizeLower(str) {
    const splitted = str.split(' ');
    const init = splitted[0].toLowerCase();
    const end = splitted.slice(1).map(item => {
        item = item.toLowerCase();
        return item.charAt(0).toUpperCase() + item.substr(1);
    });
    return [init, ...end].join('')
}

export default DatosModal
