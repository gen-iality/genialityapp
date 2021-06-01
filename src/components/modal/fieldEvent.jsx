import React, { Component } from 'react';
import { typeInputs } from '../../helpers/constants';
import CreatableSelect from 'react-select/lib/Creatable';

const initModal = { name: '', mandatory: false, label: '', description: '', type: '', options: [] };
const html = document.querySelector('html');
class FieldEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: initModal,
    };
  }

  componentDidMount() {
    html.classList.add('is-clipped');
    if (this.props.edit) this.setState({ info: this.props.infoModal });
    else this.setState({ info: initModal });
  }

  closeModal = () => {
    html.classList.remove('is-clipped');
    this.setState({ info: initModal }, this.props.closeModal);
  };

  //Cambiar input del campo del evento
  handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'label') {
      this.setState({ info: { ...this.state.info, [name]: value, name: toCapitalizeLower(value) } });
    } else this.setState({ info: { ...this.state.info, [name]: value } });
  };
  //Cambiar mandatory del campo del evento o lista
  changeFieldCheck = () => {
    this.setState((prevState) => {
      return { info: { ...this.state.info, mandatory: !prevState.info.mandatory } };
    });
  };

  //Funciones para lista de opciones del campo
  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  };
  changeOption = (option) => {
    this.setState({ info: { ...this.state.info, options: option } });
  };
  handleKeyDown = (event) => {
    const { inputValue } = this.state;
    const value = inputValue;
    if (!value) return;
    switch (event.keyCode) {
      case 9:
      case 13:
        this.setState({
          inputValue: '',
          info: { ...this.state.info, options: [...this.state.info.options, createOption(value)] },
        });
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  //Guardar campo en el evento
  saveField = () => {
    html.classList.remove('is-clipped');
    this.props.saveField(this.state.info);
    this.setState({ info: initModal });
  };

  render() {
    const { inputValue, info } = this.state;
    return (
      <div className={`modal ${this.props.modal ? 'is-active' : ''}`}>
        <div className='modal-background' />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{this.props.edit ? 'Editar Dato' : 'Agregar Dato'}</p>
            <button className='delete is-large' aria-label='close' onClick={this.closeModal} />
          </header>
          <section className='modal-card-body'>
            <div className='field'>
              <label className='label required has-text-grey-light'>Nombre del dato</label>
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
            <div className='field'>
              <label className='label required has-text-grey-light'>Etiqueta a la izquierda</label>
              <div className='control'>
                <input
                  className='input'
                  name={'labelizquierda'}
                  type='text'
                  placeholder='Ej: Celular'
                  value={info.labelizquierda}
                  onChange={this.handleChange}
                />
              </div>
            </div>

            <div className='field'>
              <div className='control'>
                <label className='label required'>Tipo de dato</label>
                <div className='control'>
                  <div className='select'>
                    <select onChange={this.handleChange} name={'type'} value={info.type}>
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
              {info.type === 'list' && (
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
                    placeholder='Escribe la opción y presiona Enter o Tab...'
                    value={info.options}
                  />
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
              <label className='label required has-text-grey-light'>Descripción</label>
              <textarea
                className='textarea'
                placeholder='descripción corta'
                name={'description'}
                value={info.description}
                onChange={this.handleChange}
              />
            </div>
            <div className='field column'>
              <label className='label required has-text-grey-light'>Etiqueta</label>
              <div className='control'>
                <input
                  className='input is-small'
                  name={'name'}
                  type='text'
                  placeholder='Nombre del campo'
                  value={info.name}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-primary' onClick={this.saveField}>
              {this.props.edit ? 'Guardar' : 'Agregar'}
            </button>
          </footer>
        </div>
      </div>
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

export default FieldEvent;
