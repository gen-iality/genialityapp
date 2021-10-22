import React, { Component, Fragment } from 'react';
import { Redirect, withRouter, Link } from 'react-router-dom';
import Moment from 'moment';
import ReactQuill from 'react-quill';
import { DateTimePicker } from 'react-widgets';
import Select from 'react-select';
import Creatable from 'react-select';
import { FaWhmcs } from 'react-icons/fa';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import {
  AgendaApi,
  CategoriesAgendaApi,
  RolAttApi,
  SpacesApi,
  SpeakersApi,
  TypesAgendaApi
} from '../../helpers/request';
import { toolbarEditor } from '../../helpers/constants';
import { fieldsSelect, handleRequestError, handleSelect, sweetAlert, uploadImage } from '../../helpers/utils';
import Dropzone from 'react-dropzone';
import 'react-tabs/style/react-tabs.css';

class AgendaEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      redirect: false,
      deleteID: false,
      isLoading: { types: true, categories: true },
      name: '',
      subtitle: '',
      has_date: '',
      description: '',
      hour_start: new Date(),
      hour_end: new Date(),
      date: '',
      image: '',
      capacity: 0,
      type_id: '',
      space_id: '',
      access_restriction_type: 'OPEN',
      selectedCategories: [],
      selectedHosts: [],
      selectedType: '',
      selectedRol: [],
      days: [],
      spaces: [],
      categories: [],
      types: [],
      roles: [],
      hosts: []
    };
  }

  async componentDidMount() {
    const {
      event,
      location: { state }
    } = this.props;
    let days = [];
    const init = Moment(event.date_start);
    const end = Moment(event.date_end);
    const diff = end.diff(init, 'days');
    //Se hace un for para sacar los días desde el inicio hasta el fin, inclusivos
    for (let i = 0; i < diff + 1; i++) {
      days.push(
        Moment(init)
          .add(i, 'd')
          .format('YYYY-MM-DD')
      );
    }
    let spaces = await SpacesApi.byEvent(this.props.event._id);
    let hosts = await SpeakersApi.byEvent(this.props.event._id);
    let roles = await RolAttApi.byEvent(this.props.event._id);
    let categories = await CategoriesAgendaApi.byEvent(this.props.event._id);
    let types = await TypesAgendaApi.byEvent(this.props.event._id);
    //La información se neceista de tipo [{label,value}] para los select
    spaces = handleSelect(spaces);
    hosts = handleSelect(hosts);
    roles = handleSelect(roles);
    categories = handleSelect(categories);
    types = handleSelect(types);
    if (state.edit) {
      const info = await AgendaApi.getOne(state.edit, event._id);
      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ''));
      const { date, hour_start, hour_end } = handleDate(info);
      this.setState({
        deleteID: state.edit,
        date,
        hour_start,
        hour_end,
        selectedHosts: fieldsSelect(info.host_ids, hosts),
        selectedRol: fieldsSelect(info.access_restriction_rol_ids, roles),
        selectedType: fieldsSelect(info.type_id, types),
        selectedCategories: fieldsSelect(info.activity_categories_ids, categories)
      });
    } else {
      this.setState({ date: days[0] });
    }
    const isLoading = { types: false, categories: false };
    this.setState({ days, spaces, hosts, categories, types, roles, loading: false, isLoading });
  }

  //FN general para cambio en input
  handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };
  //FN para cambio en campo de fecha
  handleDate = (value, name) => {
    this.setState({ [name]: value });
  };
  //Cada select tiene su propia función para evitar errores y asegurar la información correcta
  selectType = (value) => {
    this.setState({ selectedType: value });
  };
  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories });
  };
  selectHost = (selectedHosts) => {
    this.setState({ selectedHosts });
  };
  selectRol = (selectedRol) => {
    this.setState({ selectedRol });
  };
  //FN para los select que permiten crear opción
  handleCreate = async (value, name) => {
    try {
      this.setState({ isLoading: { ...this.isLoading, [name]: true } });
      //Se revisa a que ruta apuntar
      const item =
        name === 'types'
          ? await TypesAgendaApi.create(this.props.event._id, { name: value })
          : await CategoriesAgendaApi.create(this.props.event._id, { name: value });
      const newOption = { label: value, value: item._id, item };
      this.setState(
        (prevState) => ({
          isLoading: { ...prevState.isLoading, [name]: false },
          [name]: [...prevState[name], newOption]
        }),
        () => {
          if (name === 'types') this.setState({ selectedType: newOption });
          else this.setState((state) => ({ selectedCategories: [...state.selectedCategories, newOption] }));
        }
      );
    } catch (e) {
      this.setState((prevState) => ({ isLoading: { ...prevState.isLoading, [name]: false } }));
      sweetAlert.showError(handleRequestError(e));
    }
  };
  //FN manejo de imagen input, la carga al sistema y la guarda en base64
  changeImg = async (files) => {
    try {
      const file = files[0];
      if (file) {
        const image = await uploadImage(file);
        this.setState({ image });
      } else {
        this.setState({ errImg: 'Only images files allowed. Please try again :)' });
      }
    } catch (e) {
      sweetAlert.showError(handleRequestError(e));
    }
  };

  //FN para el editor enriquecido
  chgTxt = (content) => this.setState({ description: content });

  //Envío de información
  submit = async () => {
    if (this.validForm()) {
      try {
        const info = this.buildInfo();

        sweetAlert.showLoading('Espera (:', 'Guardando...');
        const {
          event,
          location: { state }
        } = this.props;
        this.setState({ isLoading: true });
        if (state.edit) await AgendaApi.editOne(info, state.edit, event._id);
        else {
          const agenda = await AgendaApi.create(event._id, info);
          this.setState({ deleteID: agenda._id });
        }
        sweetAlert.hideLoading();
        sweetAlert.showSuccess('Información guardada');
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    }
  };

  //FN para construir la información a enviar al api
  buildInfo = () => {
    const {
      name,
      subtitle,
      has_date,
      hour_start,
      hour_end,
      date,
      space_id,
      capacity,
      access_restriction_type,
      selectedCategories,
      selectedHosts,
      selectedType,
      selectedRol,
      description,
      image
    } = this.state;
    const datetime_start = date + ' ' + Moment(hour_start).format('HH:mm');
    const datetime_end = date + ' ' + Moment(hour_end).format('HH:mm');
    const activity_categories_ids = selectedCategories.length > 0 ? selectedCategories.map(({ value }) => value) : [];
    const access_restriction_rol_ids = access_restriction_type !== 'OPEN' ? selectedRol.map(({ value }) => value) : [];
    const host_ids = selectedHosts? selectedHosts.length >= 0 ? [] :selectedHosts?.filter((host)=>host!==null).map(({ value }) => value):[];

    const type_id = selectedType.value;
    return {
      name,
      subtitle,
      datetime_start,
      datetime_end,
      space_id,
      image,
      description,
      capacity: parseInt(capacity, 10),
      activity_categories_ids,
      access_restriction_type,
      access_restriction_rol_ids,
      host_ids,
      type_id,
      has_date
    };
  };

  //FN para eliminar la actividad
  remove = () => {
    if (this.state.deleteID) {
      sweetAlert.twoButton(`Está seguro de borrar esta actividad`, 'warning', true, 'Borrar', async (result) => {
        try {
          if (result.value) {
            sweetAlert.showLoading('Espera (:', 'Borrando...');
            await AgendaApi.deleteOne(this.state.deleteID, this.props.event._id);
            this.setState({ redirect: true });
            sweetAlert.hideLoading();
          }
        } catch (e) {
          sweetAlert.showError(handleRequestError(e));
        }
      });
    } else this.setState({ redirect: true });
  };

  //Validación de campos

  validForm = () => {
    let title = '';
    if (this.state.name.length <= 0) title = 'El Nombre es requerido';
    else if (this.state.space_id <= 0) title = 'Selecciona un Espacio';
    else if (this.state.selectedCategories.length <= 0) title = 'Selecciona una Categoría';
    else if (this.state.selectedType <= 0) title = 'Selecciona un tipo de actividad';
    else if (this.state.access_restriction_type !== 'OPEN' && this.state.selectedRol.length <= 0)
      title = 'Seleccione un Rol para mostrar la Agenda';
    if (title.length > 0) {
      sweetAlert.twoButton(title, 'warning', false, 'OK', () => {});
      return false;
    } else return true;
  };

  //FN para ir a una ruta específica (ruedas en los select)
  goSection = (path, state) => {
    this.props.history.push(path, state);
  };

  //FN agrega todos los roles
  addRoles = () => {
    if (this.state.roles.length !== this.state.selectedRol)
      this.setState((prevState) => ({ selectedRol: prevState.roles }));
  };

  goBack = () => this.setState({ redirect: true });

  render() {
    const {
      loading,
      name,
      subtitle,
      date,
      hour_start,
      hour_end,
      image,
      access_restriction_type,
      capacity,
      space_id,
      selectedRol,
      selectedHosts,
      selectedType,
      selectedCategories
    } = this.state;
    const { hosts, spaces, categories, types, roles, isLoading } = this.state;
    const { matchUrl } = this.props;
    if (!this.props.location.state || this.state.redirect) return <Redirect to={matchUrl} />;
    return (
      <EventContent title='Actividad' closeAction={this.goBack}>
        {loading ? (
          <Loading />
        ) : (
          <div className='columns'>
            <div className='column is-8'>
              <div className='field'>
                <label className='label required'>Nombre</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name={'name'}
                    value={name}
                    onChange={this.handleChange}
                    placeholder='Nombre de la actividad'
                  />
                </div>
              </div>

              <div className='field'>
                <label className='label'>Subtítulo</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name={'subtitle'}
                    value={subtitle}
                    onChange={this.handleChange}
                    placeholder='Ej: Salón 1, Zona Norte, Área de juegos'
                  />
                </div>
              </div>
              <div className='field'>
                <label className='label'>Día</label>
                <div className='columns'>
                  {this.state.days.map((day, key) => {
                    return (
                      <div key={key} className='column'>
                        <input
                          type='radio'
                          name='date'
                          id={`radioDay${key}`}
                          className='is-checkradio'
                          checked={day === date}
                          value={day}
                          onChange={this.handleChange}
                        />
                        <label htmlFor={`radioDay${key}`}>{day}</label>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className='columns'>
                <div className='column'>
                  <div className='field'>
                    <label className='label'>Hora Inicio</label>
                    <div className='control'>
                      <DateTimePicker
                        value={hour_start}
                        dropUp
                        step={15}
                        date={false}
                        onChange={(value) => this.handleDate(value, 'hour_start')}
                      />
                    </div>
                  </div>
                </div>
                <div className='column'>
                  <div className='field'>
                    <label className='label'>Hora Fin</label>
                    <DateTimePicker
                      value={hour_end}
                      dropUp
                      step={15}
                      date={false}
                      onChange={(value) => this.handleDate(value, 'hour_end')}
                    />
                  </div>
                </div>
              </div>
              <label className='label'>Conferencista</label>
              <div className='columns'>
                <div className='column is-10'>
                  <Select
                    isClearable
                    isMulti
                    styles={creatableStyles}
                    onChange={this.selectHost}
                    options={hosts}
                    value={selectedHosts}
                  />
                </div>
                <div className='column is-2'>
                  <button
                    onClick={() => this.goSection(matchUrl.replace('agenda', 'speakers'), { child: true })}
                    className='button'>
                    <FaWhmcs />
                  </button>
                </div>
              </div>
              <label className='label required'>Espacio</label>
              <div className='field has-addons'>
                <div className='control'>
                  <div className='select'>
                    <select name={'space_id'} value={space_id} onChange={this.handleChange}>
                      <option>Seleccione un lugar/salón ...</option>
                      {spaces.map((space) => {
                        return (
                          <option key={space.value} value={space.value}>
                            {space.label}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className='control'>
                  <Link to={matchUrl.replace('agenda', 'espacios')}>
                    <button className='button'>
                      <FaWhmcs />
                    </button>
                  </Link>
                </div>
              </div>
              <div className='field'>
                <label className={`label`}>Clasificar actividad como:</label>
                <div className='control'>
                  <input
                    type='radio'
                    id={'radioOpen'}
                    name='access_restriction_type'
                    checked={access_restriction_type === 'OPEN'}
                    className='is-checkradio'
                    value={'OPEN'}
                    onChange={this.handleChange}
                  />
                  <label htmlFor={'radioOpen'}>
                    <strong>ABIERTA</strong>: Todos los asistentes (roles) pueden participar en la actividad
                  </label>
                </div>
                <div className='control'>
                  <input
                    type='radio'
                    id={'radioSuggested'}
                    name='access_restriction_type'
                    checked={access_restriction_type === 'SUGGESTED'}
                    className='is-checkradio'
                    value={'SUGGESTED'}
                    onChange={this.handleChange}
                  />
                  <label htmlFor={'radioSuggested'}>
                    <strong>RECOMENDADA</strong>: Actividad sugerida para algunos asistentes (roles)
                  </label>
                </div>
                <div className='control'>
                  <input
                    type='radio'
                    id={'radioExclusive'}
                    name='access_restriction_type'
                    checked={access_restriction_type === 'EXCLUSIVE'}
                    className='is-checkradio'
                    value={'EXCLUSIVE'}
                    onChange={this.handleChange}
                  />
                  <label htmlFor={'radioExclusive'}>
                    <strong>EXCLUSIVA</strong>: Solo algunos asistentes (roles) pueden participar en la actividad
                  </label>
                </div>
              </div>
              {access_restriction_type !== 'OPEN' && (
                <Fragment>
                  <div style={{ display: 'flex' }}>
                    <label className='label required'>Asginar a :</label>
                    <button className='button is-text is-small' onClick={this.addRoles}>
                      todos los roles
                    </button>
                  </div>
                  <div className='columns'>
                    <div className='column is-10'>
                      <Select
                        isClearable
                        isMulti
                        styles={creatableStyles}
                        onChange={this.selectRol}
                        options={roles}
                        placeholder={'Seleccione al menos un rol...'}
                        value={selectedRol}
                      />
                    </div>
                    <div className='column is-2'>
                      <button
                        onClick={() => this.goSection(matchUrl.replace('agenda', 'tipo-asistentes'))}
                        className='button'>
                        <FaWhmcs />
                      </button>
                    </div>
                  </div>
                </Fragment>
              )}
              <div className='field'>
                <label className='label'>Descripción</label>
                <div className='control'>
                  <ReactQuill value={this.state.description} modules={toolbarEditor} onChange={this.chgTxt} />
                </div>
              </div>
            </div>
            <div className='column is-4 general'>
              <div className='field is-grouped'>
                <button className='button is-text' onClick={this.remove}>
                  x Eliminar actividad
                </button>
                <button onClick={this.submit} className='button is-primary'>
                  Guardar
                </button>
              </div>
              <div className='section-gray'>
                <div className='field'>
                  <label className='label has-text-grey-light'>Imagen</label>
                  <p>Dimensiones: 1000px x 278px</p>
                  <Dropzone onDrop={this.changeImg} accept='image/*' className='zone'>
                    <button className='button is-text'>{image ? 'Cambiar imagen' : 'Subir imagen'}</button>
                  </Dropzone>
                  {image && <img src={image} alt={`activity_${name}`} />}
                </div>
                <div className='field'>
                  <label className={`label`}>Capacidad</label>
                  <div className='control'>
                    <input
                      className='input'
                      type='number'
                      min={0}
                      name={'capacity'}
                      value={capacity}
                      onChange={this.handleChange}
                      placeholder='Cupo total'
                    />
                  </div>
                </div>
                <label className='label'>Categorías</label>
                <div className='columns'>
                  <div className='column is-10'>
                    <Creatable
                      isClearable
                      styles={catStyles}
                      onChange={this.selectCategory}
                      onCreateOption={(value) => this.handleCreate(value, 'categories')}
                      isDisabled={isLoading.categories}
                      isLoading={isLoading.categories}
                      isMulti
                      options={categories}
                      placeholder={'Sin categoría....'}
                      value={selectedCategories}
                    />
                  </div>
                  <div className='column is-2'>
                    <button onClick={() => this.goSection(`${matchUrl}/categorias`)} className='button'>
                      <FaWhmcs />
                    </button>
                  </div>
                </div>
                <label className='label'>Tipo de actividad</label>
                <div className='columns'>
                  <div className='control column is-10'>
                    <Creatable
                      isClearable
                      styles={creatableStyles}
                      className='basic-multi-select'
                      classNamePrefix='select'
                      isDisabled={isLoading.types}
                      isLoading={isLoading.types}
                      onChange={this.selectType}
                      onCreateOption={(value) => this.handleCreate(value, 'types')}
                      options={types}
                      value={selectedType}
                    />
                  </div>
                  <div className='column is-2'>
                    <Link to={`${matchUrl}/tipos`}>
                      <button className='button'>
                        <FaWhmcs />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </EventContent>
    );
  }
}

//FN manejo/parseo de fechas
function handleDate(info) {
  let date, hour_start, hour_end;
  hour_start = Moment(info.datetime_start, 'YYYY-MM-DD HH:mm').toDate();
  hour_end = Moment(info.datetime_end, 'YYYY-MM-DD HH:mm').toDate();
  date = Moment(info.datetime_end, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD');
  return { date, hour_start, hour_end };
}

//Estilos de algunos select
const creatableStyles = {
  menu: (styles) => ({ ...styles, maxHeight: 'inherit' })
};

//Estilos para el tipo
const dot = (color = 'transparent') => ({
  alignItems: 'center',
  display: 'flex',
  ':before': {
    backgroundColor: color,
    content: '" "',
    display: 'block',
    margin: 8,
    height: 10,
    width: 10
  }
});

//Estilos de algunos otros select
const catStyles = {
  menu: (styles) => ({ ...styles, maxHeight: 'inherit' }),
  multiValue: (styles, { data }) => ({ ...styles, ...dot(data.item.color) })
};

export default withRouter(AgendaEdit);
