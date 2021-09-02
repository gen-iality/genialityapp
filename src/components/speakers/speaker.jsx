import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import EviusReactQuill from '../shared/eviusReactQuill';
import { FaChevronLeft } from 'react-icons/fa';
import EventContent from '../events/shared/content';
import Loading from '../loaders/loading';
import { fieldsSelect, handleRequestError, sweetAlert, uploadImage, handleSelect } from '../../helpers/utils';
import { imageBox } from '../../helpers/constants';
import { CategoriesAgendaApi, SpeakersApi } from '../../helpers/request';
import { FaWhmcs } from 'react-icons/fa';
import Creatable from 'react-select';
import { Button } from 'antd';

class Speaker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isLoading: false,
      name: '',
      profession: '',
      description: '',
      description_activity: 'false',
      image: '',
      imageData: '',
      networks: [],
      order: '',
      selectedCategories: [],
      categories: [],
      isloadingSelect: { types: true, categories: true },
    };
    this.descriptionActivity = this.descriptionActivity.bind(this);
  }

  async componentDidMount() {
    const {
      eventID,
      location: { state },
    } = this.props;
    let categories = await CategoriesAgendaApi.byEvent(this.props.eventID);

    categories = handleSelect(categories);
    if (state.edit) {
      const info = await SpeakersApi.getOne(state.edit, eventID);
      Object.keys(this.state).map((key) => (info[key] ? this.setState({ [key]: info[key] }) : ''));

      this.setState({ selectedCategories: fieldsSelect(info.category_id, categories) });
    }
    const isloadingSelect = { types: false, categories: false };
    this.setState({ loading: false, isloadingSelect, categories });
  }

  handleChange = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    this.setState({ [name]: value });
  };
  handleImage = async (files) => {
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

  chgTxt = (content) => {
    this.setState({ description: content });
  };

  submit = async () => {
    try {
      sweetAlert.showLoading('Espera (:', 'Guardando...');
      const {
        eventID,
        location: { state },
      } = this.props;
      this.setState({ isLoading: true });
      const { name, profession, description_activity, description, image, order } = this.state;

      const info = {
        name,
        image,
        description_activity,
        description,
        profession,
        //category_id: selectedCategories.length ? selectedCategories.value : null,
        order: parseInt(order),
      };

      if (state.edit) await SpeakersApi.editOne(info, state.edit, eventID);
      else await SpeakersApi.create(eventID, info);
      sweetAlert.hideLoading();
      sweetAlert.showSuccess('Información guardada');
      this.props.history.push(`/event/${eventID}/speakers`)
    } catch (e) {
      sweetAlert.showError(handleRequestError(e));
    }
  };

  remove = () => {
    const {
      eventID,
      location: { state },
    } = this.props;
    if (state.edit) {
      sweetAlert.twoButton(`Está seguro de borrar a ${this.state.name}`, 'warning', true, 'Borrar', async (result) => {
        try {
          if (result.value) {
            sweetAlert.showLoading('Espera (:', 'Borrando...');
            await SpeakersApi.deleteOne(state.edit, eventID);
            this.setState({ redirect: true });
            sweetAlert.hideLoading();
          }
        } catch (e) {
          sweetAlert.showError(handleRequestError(e));
        }
      });
    } else this.setState({ redirect: true });
  };

  descriptionActivity(e) {
    this.setState({ description_activity: e.target.value });
  }

  //FN para guardar en el estado la opcion seleccionada
  selectCategory = (selectedCategories) => {
    //
    this.setState({ selectedCategories });
  };

  //FN para ir a una ruta específica (ruedas en los select)
  goSection = (path, state) => {
    this.props.history.push(path, state);
  };

  render() {
    const { matchUrl } = this.props;
    const newCategoryUrl = '/event/' + this.props.eventID; // Ruta creada para el boton de nueva categoria /event/[eventID]
    const {
      redirect,
      loading,
      name,
      profession,
      description,
      image,
      order,
      categories,
      selectedCategories,
      isloadingSelect,
    } = this.state;
    if (!this.props.location.state || redirect) return <Redirect to={matchUrl} />;
    return (
      <EventContent
        title={
          <span>
            <Link to={matchUrl}>
              <FaChevronLeft />
            </Link>
            Conferencista
          </span>
        }>
        {loading ? (
          <Loading />
        ) : (
          <div className='columns'>
            <div className='column is-8'>
              <div className='field'>
                <label className='label'>Nombre</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name={'name'}
                    value={name}
                    onChange={this.handleChange}
                    placeholder='Nombre conferencista'
                  />
                </div>
              </div>
              <div className='field'>
                <label className='label'>Profesión</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name={'profession'}
                    value={profession}
                    onChange={this.handleChange}
                    placeholder='Profesión'
                  />
                </div>
              </div>
              <div className='field'>
                <label className='label'>Descripción de conferencias</label>
                <div className='select'>
                  <select
                    defaultValue={this.state.description_activity}
                    onChange={(e) => {
                      this.descriptionActivity(e);
                    }}>
                    <option value='true'>Si</option>
                    <option value='false'>No</option>
                  </select>
                </div>
              </div>
              <div className='field'>
                <label className='label'>Orden de conferencistas</label>
                <input className='input' type='number' name={'order'} value={order} onChange={this.handleChange} />
              </div>
              <div className='field'>
                <label className='label'>Descripción (opcional)</label>
                <div className='control'>
                  <EviusReactQuill name='description' data={description} handleChange={this.chgTxt} />
                </div>
              </div>
            </div>
            <div className='column is-4 general'>
              <div className='field is-grouped'>
                <button className='button is-text' onClick={this.remove}>
                  x Eliminar conferencista
                </button>
                <button onClick={this.submit} className={`button is-primary`}>
                  Guardar
                </button>
              </div>
              <div className='section-gray'>
                <label className='label has-text-grey-light'>Imagen</label>
                <div className='columns'>
                  <div className='column'>
                    {image ? (
                      <img src={image} alt={`speaker_${name}`} className='author-image' />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: imageBox }} />
                    )}
                  </div>
                  <div className='column is-9'>
                    <div className='has-text-left'>
                      <p>Dimensiones: 1080px x 1080px</p>
                      <Dropzone
                        style={{ fontSize: '21px', fontWeight: 'bold' }}
                        onDrop={this.handleImage}
                        accept='image/*'
                        className='zone'>
                        <Button type='dashed' danger>
                          {image ? 'Cambiar imagen' : 'Subir imagen'}
                        </Button>
                      </Dropzone>
                    </div>
                  </div>
                </div>
                <label className='label has-text-grey-light'>Categoria</label>
                <div className='columns'>
                  <div className='column is-10'>
                    <Creatable
                      isClearable
                      styles={catStyles}
                      onChange={this.selectCategory}
                      isDisabled={isloadingSelect.categories}
                      isLoading={isloadingSelect.categories}
                      options={categories}
                      placeholder={'Sin categoría....'}
                      value={selectedCategories}
                    />
                  </div>
                  <div className='column is-2'>
                    <button onClick={() => this.goSection(`${newCategoryUrl}/agenda/categorias`)} className='button'>
                      <FaWhmcs />
                    </button>
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
    width: 10,
  },
});

const catStyles = {
  menu: (styles) => ({ ...styles, maxHeight: 'inherit' }),
  multiValue: (styles, { data }) => ({ ...styles, ...dot(data.item.color) }),
};

export default withRouter(Speaker);
