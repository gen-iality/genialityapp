import React, { Component } from 'react';
import axios from 'axios';
import Moment from 'moment';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { DateTimePicker } from 'react-widgets';
import ImageInput from '../../shared/imageInput';
import SelectInput from '../../shared/selectInput';
import { Actions, CategoriesApi, OrganizationApi, TypesApi } from '../../../helpers/request';
import Loading from '../../loaders/loading';
import EviusReactQuill from '../../shared/eviusReactQuill';
import API from '../../../helpers/request';
import * as Cookie from 'js-cookie';
import { Button, Input, Modal, Form } from 'antd';

class InfoGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {},
      error: {},
      loading: true,
      valid: true,
      path: [],
      selectedCategories: [],
      selectedOrganizer: {},
      selectedType: {},
      currentUserr: null,
      newOrganization: false,
    };
    this.onFinish = this.onFinish.bind(this);
  }
  async getCurrentUser() {
    let evius_token = Cookie.get('evius_token');
    if (!evius_token) {
      this.setState({ currentUser: 'guest', loading: false });
    } else {
      try {
        const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get('evius_token')}`);
        if (resp?.data) {
          this.setState({ currentUser: resp.data });
        }
      } catch (e) {
        console.log('EXCEPTION==>', e);
      }
    }
  }

  async onFinish(values) {
    console.log(values);
    await this.updateOrganization(values.name);
  }

  async onFinishFailed() {}
  async createOrganization(user = 0, name) {
    let newOrganization = {
      name: user == 0 ? this.state.currentUser?.name || this.state.currentUser?.names : name,
    };
    //CREAR ORGANIZACION------------------------------
    let create = await OrganizationApi.createOrganization(newOrganization);
    if (create) {
      return create;
    }
    return null;
  }
  async updateOrganization(name) {
    let organizationNew = await this.createOrganization(1, name);
    let organizers = await OrganizationApi.mine();
    organizers = organizers.map((item) => {
      return { value: item.id, label: item.name };
    });
    this.setState({ organizers, newOrganization: false });
  }

  async componentDidMount() {
    try {
      await this.getCurrentUser();
      const event = this.props.data;
      const categories = await CategoriesApi.getAll();
      const types = await TypesApi.getAll();
      let organizers = await OrganizationApi.mine();
      if (organizers && organizers.length == 0) {
        let organization = await this.createOrganization();
        organizers.push(organization);
      }
      organizers = organizers.map((item) => {
        return { value: item.id, label: item.name };
      });

      const { selectedCategories, selectedOrganizer, selectedType } = handleFields(
        organizers,
        types,
        categories,
        event
      );

      this.setState(
        {
          newEvent: true,
          loading: false,
          event,
          categories,
          organizers,
          types,
          selectedCategories,
          selectedOrganizer,
          selectedType,
        },
        this.valid
      );
    } catch (error) {
      // Error
      if (error.response) {
        console.error(error.response);
        const { status } = error.response;
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false });
      } else {
        console.error('Error', error.message);
        if (error.request) console.error(error.request);
        this.setState({ serverError: true, loader: false, errorData: { status: 400, message: JSON.stringify(error) } });
      }
      console.error(error.config);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ event: { ...this.state.event, [name]: value } }, this.valid);
  };

  handleReactQuill = (e) => {
    this.setState({ event: { ...this.state.event, description: e } }, this.valid);
  };

  //Validación
  valid = () => {
    const error = {};
    const { event, selectedOrganizer, selectedType, selectedCategories } = this.state,
      valid =
        event.name.length > 0 &&
        event.allow_register !== '' &&
        ((event.type_event === 'physicalEvent' && event.venue.length > 0) || event.type_event === 'onlineEvent') &&
        !!selectedOrganizer &&
        !!selectedType &&
        selectedCategories.length > 0;
    this.setState({ valid: !valid, error });
  };

  //Funciones para manejar el cambio en listas desplegables
  selectCategory = (selectedCategories) => {
    this.setState({ selectedCategories }, this.valid);
  };
  selectOrganizer = (selectedOrganizer) => {
    if (!selectedOrganizer.value) selectedOrganizer = undefined;
    this.setState({ selectedOrganizer }, this.valid);
  };
  selectType = (selectedType) => {
    if (!selectedType.value) selectedType = undefined;
    this.setState({ selectedType }, this.valid);
  };

  //Cambio en los input de fechas
  changeDate = (value, name) => {
    let {
      event: { date_end },
    } = this.state;
    if (name === 'date_start') {
      const diff = Moment(value).diff(Moment(date_end), 'days');
      if (diff >= 0)
        date_end = Moment(date_end)
          .add(diff, 'days')
          .toDate();
      this.setState({ minDate: value, event: { ...this.state.event, date_end: date_end, date_start: value } });
    } else this.setState({ event: { ...this.state.event, [name]: value } });
  };

  //Cambio en el input de imagen
  changeImg = (files) => {
    const file = files[0];
    const url = '/api/files/upload',
      path = [],
      self = this;
    if (file) {
      this.setState({
        imageFile: file,
        event: { ...this.state.event, picture: null },
      });
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append('file', file);
        return Actions.post(url, data).then((image) => {
          if (image) path.push(image);
        });
      });

      // eslint-disable-next-line no-unused-vars
      axios.all(uploaders).then((data) => {
        self.setState({
          event: {
            ...self.state.event,
            picture: path[0],
          },
          fileMsg: 'Imagen subida con exito',
          imageFile: null,
          path,
        });
        toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
      });
    } else {
      this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
    }
  };

  //Envío de datos
  submit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { event, path } = this.state;
    const categories = this.state.selectedCategories.map((item) => {
      return item.value;
    });
    const data = {
      name: event.name,
      hour_start: event.hour_start,
      date_start: event.date_start,
      hour_end: event.hour_end,
      date_end: event.date_end,
      picture: path.length > 1 ? path : event.picture,
      venue: event.venue,
      location: event.location,
      visibility: event.visibility ? event.visibility : 'PUBLIC',
      description: event.description,
      categories: categories,
      organizer_id: this.state.selectedOrganizer.value,
      event_type_id: this.state.selectedType.value,
      address: event.address,
      type_event: event.type_event,
      allow_register: event.allow_register,
    };
    this.props.nextStep('info', data, 'attendees');
  };

  render() {
    if (this.state.loading) return <Loading />;
    const {
      event,
      categories,
      organizers,
      types,
      selectedCategories,
      selectedOrganizer,
      selectedType,
      valid,
    } = this.state;
    return (
      <React.Fragment>
        <div className='columns'>
          <div className='column'>
            <div className='field'>
              <label className='label required has-text-grey-light'>Nombre</label>
              <div className='control'>
                <input
                  className='input'
                  name={'name'}
                  type='text'
                  placeholder='Nombre del evento'
                  value={event.name}
                  onChange={this.handleChange}
                />
              </div>
            </div>
            <div className='field'>
              <label className='label required has-text-grey-light'>Tipo de evento</label>
              <div className='control'>
                <div className='select'>
                  <select name='type_event' onChange={this.handleChange}>
                    <option value=''>Seleccionar...</option>
                    <option value='physicalEvent'>Evento Fisico</option>
                    <option value='onlineEvent'>Evento Virtual</option>
                  </select>
                </div>
              </div>
            </div>

            {event.type_event === 'physicalEvent' && (
              <>
                <div className='field'>
                  <label className='label has-text-grey-light'>Dirección</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'address'}
                      type='text'
                      placeholder='¿Cuál es la dirección del evento?'
                      value={event.address}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className='field'>
                  <label className='label has-text-grey-light'>Lugar</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'venue'}
                      type='text'
                      placeholder='Lugar del evento'
                      value={event.venue}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </>
            )}
            <div className='field'>
              <div className='columns is-mobile'>
                <div className='column inner-column'>
                  <div className='field'>
                    <label className='label has-text-grey-light'>Fecha Inicio</label>
                    <div className='control'>
                      <DateTimePicker
                        value={event.date_start}
                        format={'DD/MM/YYYY'}
                        time={false}
                        onChange={(value) => this.changeDate(value, 'date_start')}
                      />
                    </div>
                  </div>
                </div>
                <div className='column inner-column'>
                  <div className='field'>
                    <label className='label has-text-grey-light'>Hora Inicio</label>
                    <div className='control'>
                      <DateTimePicker
                        value={event.hour_start}
                        step={60}
                        date={false}
                        onChange={(value) => this.changeDate(value, 'hour_start')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='field'>
              <div className='columns is-mobile'>
                <div className='column inner-column'>
                  <div className='field'>
                    <label className='label has-text-grey-light'>Fecha Fin</label>
                    <div className='control'>
                      <DateTimePicker
                        value={event.date_end}
                        min={this.minDate}
                        format={'DD/MM/YYYY'}
                        time={false}
                        onChange={(value) => this.changeDate(value, 'date_end')}
                      />
                    </div>
                  </div>
                </div>
                <div className='column inner-column'>
                  <div className='field'>
                    <label className='label has-text-grey-light'>Hora Fin</label>
                    <div className='control'>
                      <DateTimePicker
                        value={event.hour_end}
                        step={60}
                        date={false}
                        onChange={(value) => this.changeDate(value, 'hour_end')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='field'>
              <label className='label has-text-grey-light'>Descripción</label>
              <div className='control'>
                <EviusReactQuill name='description' data={event.description} handleChange={this.handleReactQuill} />
              </div>
            </div>
          </div>
          <div className='column'>
            <div className='field picture'>
              <label className='label has-text-grey-light'>Foto</label>
              <div className='control'>
                <ImageInput
                  picture={event.picture}
                  imageFile={this.state.imageFile}
                  divClass={'drop-img'}
                  content={<img src={event.picture} alt={'Imagen Perfil'} />}
                  classDrop={'dropzone'}
                  contentDrop={
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className={`button is-primary is-inverted is-outlined ${
                        this.state.imageFile ? 'is-loading' : ''
                      }`}>
                      Cambiar foto
                    </button>
                  }
                  contentZone={
                    <div className='has-text-grey has-text-weight-bold has-text-centered'>
                      <span>Subir foto</span>
                      <br />
                      <small>(Tamaño recomendado: 1280px x 960px)</small>
                    </div>
                  }
                  changeImg={this.changeImg}
                  errImg={this.state.errImg}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    height: 250,
                    width: '100%',
                    borderWidth: 2,
                    borderColor: '#b5b5b5',
                    borderStyle: 'dashed',
                    borderRadius: 10,
                  }}
                />
              </div>
              {this.state.fileMsg && <p className='help is-success'>{this.state.fileMsg}</p>}
            </div>
            <div className='field'>
              <label className='label has-text-grey-light'>El evento acepta registros o es privado</label>
              <p>
                En un evento privado no se aceptan registros externos, la personas que asisten al evento han sido
                añadidas por un administrador u organizador del evento
              </p>
              <div className='control'>
                <div className='select'>
                  <select value={event.allow_register} onChange={this.handleChange} name={'allow_register'}>
                    <option value=''>Seleccionar...</option>
                    <option value={true}>Público</option>
                    <option value={false}>Privado</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='field'>
              <label className='label has-text-grey-light'>Visibilidad del evento</label>
              <p>Determina si es visible desde el listado general de eventos de Evius</p>
              <div className='control'>
                <div className='select'>
                  <select value={event.visibility} onChange={this.handleChange} name={'visibility'}>
                    <option value=''>Seleccionar...</option>
                    <option value={'PUBLIC'}>Público</option>
                    <option value={'ORGANIZATION'}>Privado</option>
                  </select>
                </div>
              </div>
            </div>          
                    <SelectInput 
                      name={ "Organizado por:" }                   
                      isMulti={false}
                      selectedOptions={selectedOrganizer}
                      selectOption={this.selectOrganizer}
                      options={organizers}
                      required={true}
                    />              
                <Button id={'addOrganization'}  onClick={()=>this.setState({newOrganization:true})}>
              Agregar organización
            </Button>
            <SelectInput
              name={'Tipo'}
              isMulti={false}
              selectedOptions={selectedType}
              selectOption={this.selectType}
              options={types}
              required={true}
            />
            <SelectInput
              name={'Categorías:'}
              isMulti={true}
              max_options={2}
              selectedOptions={selectedCategories}
              selectOption={this.selectCategory}
              options={categories}
              required={true}
            />
          </div>
        </div>
        <div className='buttons is-left'>
          <button onClick={this.submit} className={`button is-primary`} disabled={valid}>
            Siguiente
          </button>
        </div>
        <Modal
          footer={false}
          title='Agregar organización'
          onCancel={() => this.setState({ newOrganization: false })}
          visible={this.state.newOrganization}>
          <Form
            name='basic'
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: false }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Nombre"
              name="name"
              rules={[{ required: true, message: 'Ingrese un nombre válido' }]}
            >
              <Input id='nameOrganizer'></Input>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button  id={'addOrganizers'} type="primary" htmlType="submit">
                Agregar
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

//Función para organizar las opciones de las listas desplegables (Organizado,Tipo,Categoría)
function handleFields(organizers, types, categories, event) {
  let selectedCategories = [];
  let selectedType = {};
  const { category_ids, organizer_id, event_type_id } = event;
  if (category_ids) {
    categories.map((item) => {
      let pos = category_ids.indexOf(item.value);
      return pos >= 0 ? selectedCategories.push(item) : '';
    });
  }
  const pos = organizers
    .map((e) => {
      return e.value;
    })
    .indexOf(organizer_id);
  const selectedOrganizer = organizers[pos];
  if (event_type_id) {
    const pos = types
      .map((e) => {
        return e.value;
      })
      .indexOf(event_type_id);
    selectedType = types[pos];
  } else selectedType = undefined;
  return { selectedOrganizer, selectedCategories, selectedType };
}

export default InfoGeneral;
