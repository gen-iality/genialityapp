import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import 'react-toastify/dist/ReactToastify.css';

class Properties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: []
    };
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    const { org } = this.props;
    let fields = org.user_properties.filter((item) => !item.group_id);
    this.setState({ fields, org });
  }

  //*********** CAMPOS EVENTO
  //Agregar nuevo campo
  addField = () => {
    const { fields } = this.state;
    this.setState({ fields: [...fields, { name: '', unique: false, mandatory: false, edit: true }], newField: true });
  };
  //Guardar campo en el evento o lista
  saveField = (index, key) => {
    const { fields, groups } = this.state;
    if (key || key === 0) {
      const obj = groups[key].fields[index];
      obj['edit'] = !obj['edit'];
      this.setState({ groups });
    } else {
      fields[index].edit = !fields[index].edit;
      this.setState({ fields, newField: false });
    }
  };
  //Editar campo en el evento o lista
  editField = (index, key) => {
    const { fields, groups } = this.state;
    if (key || key === 0) {
      const obj = groups[key].fields[index];
      obj['edit'] = !obj['edit'];
      this.setState({ groups });
    } else {
      fields[index].edit = !fields[index].edit;
      this.setState({ fields, newField: true });
    }
  };
  //Borrar campo en el evento o lista
  removeField = (index, key) => {
    const { groups, fields } = this.state;
    if (key || key === 0) {
      groups[key].fields.splice(index, 1);
      this.setState({ groups });
    } else {
      fields.splice(index, 1);
      this.setState({ fields, newField: false });
    }
  };
  //Cambiar input del campo del evento o lista
  handleChangeField = (e, index, key) => {
    let { name, value } = e.target;
    const { fields, groups } = this.state;
    if (name === 'name') value = value.toLowerCase();
    if (key || key === 0) {
      let { fields } = groups[key];
      fields[index][name] = value;
      this.setState({ groups });
    } else {
      fields[index][name] = value;
      this.setState({ fields });
    }
  };
  //Cambiar mandatory del campo del evento o lista
  changeFieldCheck = (e, index, key) => {
    const { fields, groups } = this.state;
    const { name } = e.target;
    if (key || key === 0) {
      let { fields } = groups[key];
      fields[index][name] = !fields[index][name];
      this.setState({ groups });
    } else {
      fields[index][name] = !fields[index][name];
      this.setState({ fields });
    }
  };
  //Funciones para lista de opciones del campo
  handleInputChange = (index, inputValue) => {
    this.setState({ inputValue });
  };
  changeOption = (index, key, option) => {
    const { fields } = this.state;
    const field = fields[index];
    field.options = option;
    this.setState({ fields });
  };
  handleKeyDown = (event, index) => {
    const { inputValue, fields } = this.state;
    const field = fields[index];
    field.options = field.options ? field.options : [];
    if (!inputValue) return;
    switch (event.index) {
      case 'Enter':
      case 'Tab':
        field.options = [...field.options, createOption(inputValue, index)];
        this.setState({
          inputValue: '',
          fields
        });
        event.preventDefault();
        break;
      default:
        break;
    }
  };

  //Envío de datos
  async submit(e) {
    e.preventDefault();
    e.stopPropagation();
    const { fields, org } = this.state;
    const self = this;
    this.setState({ loading: true });
    org.user_properties = fields;
    try {

      self.setState({ loading: false });
      this.props.updateOrg(org);
      toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
    } catch (error) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;

        if (error.request) {
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
    }
  }

  render() {
    const { fields, inputValue, newField, loading } = this.state
    return (
      <React.Fragment>
        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <p className='subtitle is-5'>
                <strong>Campos de Evento</strong>
              </p>
            </div>
            <div className='level-item'>
              <button className='button' onClick={this.addField} disabled={newField}>
                <span className='icon is-small'>
                  <i className='fas fa-plus' />
                </span>
              </button>
            </div>
          </div>
          <div className='level-right'>
            <div className='level-item'>
              <button className={`button is-success ${loading ? 'is-loading' : ''}`} onClick={this.submit}>
                <span className='icon is-small'>
                  <i className='fas fa-check' />
                </span>
                <span>Guardar</span>
              </button>
            </div>
          </div>
        </div>
        {fields.map((field, key) => {
          return (
            <div className='card' key={key}>
              <article className='media' style={{ padding: '0.75rem' }}>
                <div className='media-content'>
                  <div className='columns'>
                    <div className='field column'>
                      <label className='label required has-text-grey-light'>Nombre</label>
                      <div className='control'>
                        <input
                          className='input'
                          name={'name'}
                          type='text'
                          disabled={!field.edit}
                          placeholder='Nombre del campo'
                          value={field.name}
                          onChange={(e) => {
                            this.handleChangeField(e, key);
                          }}
                        />
                      </div>
                    </div>
                    <div className='field column'>
                      <div className='control'>
                        <label className='label required'>Tipo</label>
                        <div className='control'>
                          <div className='select'>
                            <select
                              onChange={(e) => {
                                this.handleChangeField(e, key);
                              }}
                              name={'type'}
                              value={field.type}
                              disabled={!field.edit}>
                              <option value={''}>Seleccione...</option>
                              <option value={'text'}>Texto</option>
                              <option value={'email'}>Correo</option>
                              <option value={'number'}>Numérico</option>
                              <option value={'list'}>Lista Opciones</option>
                              <option value={'date'}>Fecha (DD/MM/YYYY)</option>
                              <option value={'boolean'}>Si/No</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      {field.type === 'list' && (
                        <div className='control'>
                          <CreatableSelect
                            components={{ DropdownIndicator: null }}
                            inputValue={inputValue}
                            isDisabled={!field.edit}
                            isClearable
                            isMulti
                            menuIsOpen={false}
                            onChange={this.changeOption.bind(this, key)}
                            onInputChange={this.handleInputChange.bind(this, key)}
                            onKeyDown={(e) => {
                              this.handleKeyDown(e, key);
                            }}
                            placeholder='Escribe la opción y presiona Enter o Tab...'
                            value={field.options}
                          />
                        </div>
                      )}
                    </div>
                    <div className='column field'>
                      <input
                        className='is-checkradio is-primary'
                        id={`mandatory${key}`}
                        type='checkbox'
                        name={`mandatory`}
                        checked={field.mandatory}
                        onChange={(e) => {
                          this.changeFieldCheck(e, key);
                        }}
                        disabled={!field.edit}
                      />
                      <label htmlFor={`mandatory${key}`}>Obligatorio</label>
                    </div>
                  </div>
                  {field.name !== 'email' && (
                    <div className='columns'>
                      <div className='column is-1'>
                        <nav className='level is-mobile'>
                          <div className='level-left'>
                            {field.edit && (
                              <a
                                className='level-item'
                                onClick={() => {
                                  this.saveField(key);
                                }}>
                                <span className='icon has-text-info'>
                                  <i className='fas fa-save'></i>
                                </span>
                              </a>
                            )}
                            {!field.edit && (
                              <a
                                className='level-item'
                                onClick={() => {
                                  this.editField(key);
                                }}>
                                <span className='icon has-text-black'>
                                  <i className='fas fa-edit'></i>
                                </span>
                              </a>
                            )}
                            <a
                              className='level-item'
                              onClick={() => {
                                this.removeField(key);
                              }}>
                              <span className='icon has-text-danger'>
                                <i className='fas fa-trash'></i>
                              </span>
                            </a>
                          </div>
                        </nav>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          );
        })}
      </React.Fragment>
    );
  }
}

const createOption = (label, key) => ({ label, value: label, parent: key });

export default Properties;
