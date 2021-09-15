import React, { Component, Fragment } from 'react';
import { typeInputs } from '../../../helpers/constants';
import CreatableSelect from 'react-select/lib/Creatable';
import { Checkbox } from 'antd';
const html = document.querySelector('html');
class DatosModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        name: '',
        mandatory: false,
        visibleByContacts: false,
        visibleByAdmin: false,
        label: '',
        description: '',
        type: '',
        options: [],
        justonebyattendee: false,
      },
      valid: true,
    };
  }

  componentDidMount() {
    html.classList.add('is-clipped');
    if (this.props.edit) this.setState({ info: this.props.info }, this.validForm);
  }

  generateFieldNameForLabel(name, value) {
    //.replace(/[\u0300-\u036f]/g, "") = quita unicamente las tildes, normalize("NFD") pasa la cadena de texto a formato utf-8 y el normalize quita caracteres alfanumericos
    const generatedFieldName = toCapitalizeLower(value)
      .normalize('NFD')
      .replace(/[^a-z0-9_]+/gi, '');
    return generatedFieldName;
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    let tmpInfo = { ...this.state.info };

    //Generamos el nombre del campo para la base de datos(name) a partir del  label solo si el campo se esta creando
    if (name === 'label' && !this.state.info._id) {
      tmpInfo['name'] = this.generateFieldNameForLabel(name, value);
    }
    tmpInfo[name] = value;
    this.setState({ info: tmpInfo }, this.validForm);
  };

  validForm = () => {
    const { name, label, type, options } = this.state.info;
    let valid = !(name.length > 0 && label.length > 0 && type !== '');
    if (type === 'list') {
      valid = !(!valid && options && options.length > 0);
      if (!options) {
        this.setState({ info: { ...this.state.info, options: [] } });
      }
    }
    this.setState({ valid });
  };
  //Cambiar mandatory del campo del evento o lista
  changeFieldjustonebyattendee = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, justonebyattendee: !prevState.info.justonebyattendee } };
    });
  };

  //Cambiar mandatory del campo del evento o lista
  changeFieldCheck = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, mandatory: !prevState.info.mandatory } };
    });
  };

  changeFieldCheckVisibleByContacts = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, visibleByContacts: !prevState.info.visibleByContacts } };
    });
  };

  changeFieldCheckVisibleByAdmin = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, visibleByAdmin: !prevState.info.visibleByAdmin } };
    });
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
        this.setState(
          { inputValue: '', info: { ...this.state.info, options: [...this.state.info.options, createOption(value)] } },
          this.validForm
        );
        event.preventDefault();
        break;
      // eslint-disable-next-line no-empty
      default: {
      }
    }
  };

  //Guardar campo en el evento
  saveField = () => {
    html.classList.remove('is-clipped');
    const info = Object.assign({}, this.state.info);
    info.name = toCapitalizeLower(info.name);
    if (info.type !== 'list' && info.type !== 'multiplelist') delete info.options;
    this.props.action(info);
    const initModal = {
      name: '',
      mandatory: false,
      visibleByContacts: false,
      label: '',
      description: '',
      type: '',
      options: [],
      justonebyattendee: false,
    };
    this.setState({ info: initModal });
  };

  render() {
    const { inputValue, info, valid } = this.state;
    const { edit } = this.props;
    return (
      <Fragment>
        <section className='modal-card-body'>
          <div className='field'>
            <label className='label required has-text-grey-light'>Nombre Campo </label>
            <div className='control'>
              <input
                className='input'
                name={'label'}
                type='text'
                placeholder='Ej: Celular'
                value={info.label}
                onChange={this.handleChange}
              />
            </div>
          </div>
          <input
            className='input is-small'
            name={'name'}
            type='text'
            placeholder='Nombre del campo en base de datos'
            value={info.name}
            disabled={true}
            onChange={this.handleChange}
          />
          <div className='field'>
            <label className='label has-text-grey-light'>Posición Nombre del Campo </label>
            <div className=''>
              <label>
                <input
                  type='radio'
                  name='labelPosition'
                  value='arriba'
                  className='form-check-input'
                  checked={info.labelPosition === 'arriba' || !info.labelPosition}
                  onChange={this.handleChange}
                />
                Arriba &nbsp;
              </label>

              <label>
                <input
                  type='radio'
                  name='labelPosition'
                  value='izquierda'
                  className='form-check-input'
                  checked={info.labelPosition === 'izquierda'}
                  onChange={this.handleChange}
                />
                Izquierda &nbsp;
              </label>
              <label>
                <input
                  type='radio'
                  name='labelPosition'
                  value='derecha'
                  className='form-check-input'
                  checked={info.labelPosition === 'derecha'}
                  onChange={this.handleChange}
                />
                Derecha &nbsp;
              </label>
            </div>
          </div>

          <div className='field'>
            <div className='control'>
              <label className='label required'>Tipo de dato</label>
              <div className='control'>
                <div className='select'>
                  <select
                    disabled={!info.name === 'picture' || !info.name == 'email' || !info.name == 'names' ? false : true}
                    onChange={this.handleChange}
                    name={'type'}
                    value={info.type}>
                    <option value={''}>Seleccione...</option>
                    {typeInputs.map((type, key) => {
                      return (
                        <option key={key} value={type.value}>
                          {type.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            {(info.type === 'list' || info.type === 'multiplelist' || info.type === 'multiplelisttable') && (
              <div className='control'>
                <CreatableSelect
                  components={{ DropdownIndicator: null }}
                  inputValue={inputValue}
                  isClearable
                  isMulti
                  menuIsOpen={false}
                  onChange={this.changeOption}
                  onInputChange={this.handleInputChange}
                  onKeyDown={(e) => {
                    this.handleKeyDown(e);
                  }}
                  placeholder='Escribe la opción y presiona Enter o Tab...x'
                  value={info.options}
                  //required={true}
                />
                <Checkbox
                  name={`justonebyattendee`}
                  checked={info.justonebyattendee}
                  onChange={this.changeFieldjustonebyattendee}>
                  Solo una opción por usuario (cuando un asistente selecciona una opción esta desaparece del listado)
                </Checkbox>
              </div>
            )}
          </div>
          <div className='field'>
            <input
              className='is-checkradio is-primary'
              id={`mandatoryModal`}
              type='checkbox'
              name={`mandatory`}
              checked={info.mandatory}
              onChange={this.changeFieldCheck}
            />
            <label htmlFor={`mandatoryModal`}>Obligatorio</label>
          </div>

          <div className='field'>
            <input
              className='is-checkradio is-primary'
              id={`visibleByContactsModal`}
              type='checkbox'
              name={`visibleByContacts`}
              checked={info.visibleByContacts}
              onChange={this.changeFieldCheckVisibleByContacts}
            />
            <label htmlFor={`visibleByContactsModal`}>Visible para Contactos</label>
          </div>

          <div className='field'>
            <input
              className='is-checkradio is-primary'
              id={`visibleByAdminModal`}
              type='checkbox'
              name={`visibleByAdmin`}
              checked={info.visibleByAdmin}
              onChange={this.changeFieldCheckVisibleByAdmin}
            />
            <label htmlFor={`visibleByAdminModal`}>Visible para Admin</label>
          </div>

          <div className='field'>
            <label className='label has-text-grey-light'>Descripción</label>
            <textarea
              className='textarea'
              placeholder='descripción corta'
              name={'description'}
              value={info.description || ''}
              onChange={this.handleChange}
            />
          </div>

          <div className='field'>
            <label className='label has-text-grey-light'>Posición / Orden </label>
            <div className='control'>
              <input
                className='input'
                name={'order_weight'}
                type='number'
                placeholder='1'
                value={info.order_weight}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </section>
        <footer className='modal-card-foot'>
          <button className='button is-primary' onClick={this.saveField} disabled={valid}>
            {edit ? 'Guardar' : 'Agregar'}
          </button>
        </footer>
      </Fragment>
    );
  }
}

const createOption = (label) => ({ label, value: label });

//Función para convertir una frase en camelCase: "Hello New World" → "helloNewWorld"
function toCapitalizeLower(str) {
  const splitted = str.split(' ');
  const init = splitted[0].toLowerCase();
  const end = splitted.slice(1).map((item) => {
    item = item.toLowerCase();
    return item.charAt(0).toUpperCase() + item.substr(1);
  });
  return [init, ...end].join('');
}

export default DatosModal;
