/*global google*/
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Geosuggest from 'react-geosuggest';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import { MdAttachFile } from 'react-icons/md';
import { TiArrowLoopOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';
import { Actions, CategoriesApi, OrganizationApi } from '../../helpers/request';
import { BaseUrl } from '../../helpers/constants';
import ImageInput from '../shared/imageInput';
import Loading from '../loaders/loading';
import LogOut from '../shared/logOut';
import FormNetwork from '../shared/networkForm';
import Dialog from '../modal/twoAction';
import ErrorServe from '../modal/serverError';
import 'react-toastify/dist/ReactToastify.css';

class OrganizationProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: [],
      org: {
        location: {},
        doc: {}
      },
      events: [],
      loading: true,
      valid: true,
      wait: false,
      message: {
        class: '',
        content: ''
      },
      timeout: false,
      serverError: false,
      errorData: {}
    };
    this.saveForm = this.saveForm.bind(this);
  }

  async componentDidMount() {
    try {
      const categories = await CategoriesApi.getAll();
      this.setState({ categories, org: this.props.org, loading: false });
    } catch (e) {
      this.setState({ timeout: true, loading: false });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ org: { ...this.state.org, [name]: value } }, this.valid);
  };

  valid = () => {
    /*const {org} = this.state;
        let valid;
        if(org.phone.length <= 7) valid = true;*/
    this.setState({ valid: false });
  };

  //Doc
  docDrop = (files) => {
    const file = files[0];
    !file
      ? this.setState({
          org: {
            ...this.state.org,
            doc: { ...this.state.org.doc, flag: false, file: '', msg: 'sólo archivos pdf permitidos' }
          }
        })
      : this.uploadFile(file);
  };
  uploadFile = (archivo) => {
    let data = new FormData();
    this.setState({ docLoading: true });
    const url = '/api/files/upload',
      self = this;
    data.append('file', archivo);
    Actions.post(url, data)
      .then((file) => {
        self.setState({
          org: {
            ...self.state.org,
            doc: {
              ...this.state.org.doc,
              flag: true,
              name: archivo.name,
              file,
              msg: 'Upload successfully'
            }
          },
          docLoading: false
        });
        toast.success(<FormattedMessage id='toast.file' defaultMessage='Ok!' />);
      })
      .catch(() => {
        toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
        this.setState({ timeout: true, loader: false });
      });
  };

  onSuggestSelect = (suggest) => {
    if (suggest) {
      const place = suggest.gmaps;
      const location =
        place.geometry && place.geometry.location
          ? {
              Latitude: place.geometry.location.lat(),
              Longitude: place.geometry.location.lng()
            }
          : {};
      const componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name'
      };
      const mapping = {
        street_number: 'number',
        route: 'street',
        locality: 'city',
        administrative_area_level_1: 'state'
      };
      for (let i = 0; i < place.address_components.length; i++) {
        const addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
          const val = place.address_components[i][componentForm[addressType]];
          location[mapping[addressType]] = val;
        }
      }
      location.FormattedAddress = place.formatted_address;
      location.PlaceId = place.place_id;
      this.setState({ org: { ...this.state.org, location } }, this.valid);
    }
  };

  changeImg = (files) => {
    const file = files[0];
    if (file) {
      this.setState({ imageFile: file, org: { ...this.state.org, picture: null } });
      let data = new FormData();
      const url = '/api/files/upload',
        self = this;
      data.append('file', this.state.imageFile);
      Actions.post(url, data)
        .then((image) => {
          self.setState({
            org: {
              ...self.state.org,
              picture: image
            },
            fileMsg: 'Image uploaded successfully'
          });
          toast.success(<FormattedMessage id='toast.img' defaultMessage='Ok!' />);
        })
        .catch(() => {
          toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
          this.setState({ timeout: true, loader: false });
        });
    } else {
      this.setState({ errImg: 'Only images files allowed. Please try again (:' });
    }
  };

  async saveForm() {
    const { org } = this.state;
    this.setState({ wait: true });
    const name = org.doc.name ? org.doc.name : org.doc;
    org.doc = org.doc.file ? org.doc.file : org.doc;
    try {
      if (org._id) {
        const resp = await OrganizationApi.editOne(org, org._id);
        if (resp._id) {
          org.doc = !org.doc && { name };
          this.setState({ msg: 'Saved successfully', create: false, org, wait: false });
          toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
          this.props.updateOrg(org);
        } else {
          this.setState({ msg: 'Cant Create', create: false, wait: false });
          toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
        }
      } else {
        const result = await Actions.create('/api/organizations', org);
        if (result._id) {
          const html = document.querySelector('html');
          html.classList.add('is-clipped');
          this.setState({ modalOrg: true, wait: false, org: { ...this.state.org, _id: result._id } });
          toast.success(<FormattedMessage id='toast.org' defaultMessage='Ok!' />);
        } else {
          toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
          this.setState({ msg: 'Cant Create', create: false });
        }
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) this.setState({ timeout: true, loader: false, wait: false });
        else this.setState({ serverError: true, loader: false, errorData: data, wait: false });
      } else {
        let errorData = error.message;

        if (error.request) {
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData, wait: false });
      }
    }
  }

  closeOrg = () => {
    const { org } = this.state;
    const html = document.querySelector('html');
    html.classList.remove('is-clipped');
    window.location.replace(`${BaseUrl}/organization/${org._id}`);
  };

  changeNetwork = (e) => {
    const { name, value } = e.target;
    const { network } = this.state.org;
    network[name] = value;
    this.setState({ org: { ...this.state.org, network: network } });
  };

  render() {
    const { org, loading, docLoading, wait, valid } = this.state;
    const { timeout, serverError, errorData } = this.state;
    return (
      <div className='profile'>
        {loading ? (
          <Loading />
        ) : (
          <div className='container org-profile'>
            <div className='profile-info columns'>
              <div className='column is-4 user-info'>
                <ImageInput
                  picture={org.picture}
                  imageFile={this.state.imageFile}
                  divClass={'circle-img'}
                  content={<div style={{ backgroundImage: `url(${org.picture})` }} className='avatar-img' />}
                  classDrop={'change-img is-size-2'}
                  contentDrop={<TiArrowLoopOutline className='has-text-white' />}
                  contentZone={
                    <figure className='image is-128x128'>
                      <img
                        className='is-rounded'
                        src='https://bulma.io/images/placeholders/128x128.png'
                        alt={'profileimage'}
                      />
                    </figure>
                  }
                  style={{}}
                  changeImg={this.changeImg}
                />
                <div className='field'>
                  <label className='label required is-size-7 has-text-grey-light'>Nombre Empresa</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'name'}
                      type='text'
                      placeholder='Nombre'
                      value={org.name}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className='field'>
                  <label className='label required is-size-7 has-text-grey-light'>Correo Corporativo</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'email'}
                      type='email'
                      placeholder='Email'
                      value={org.email}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                {/*<div className="field">
                                        <label className="label is-size-7 has-text-grey-light">Estado de empresa</label>
                                        <div className="control">
                                            <input className="input" name={"estado"} type="text" placeholder="Estado" disabled={true} onChange={this.handleChange} />
                                        </div>
                                    </div>*/}
              </div>
              <div className='column is-8 user-data userData'>
                <h1 className='title has-text-primary'>Datos</h1>
                <div className='columns is-9'>
                  <div className='field column'>
                    <label className='label required is-size-7 has-text-grey-light'>NIT</label>
                    <div className='control'>
                      <input
                        className='input has-text-weight-bold'
                        name={'nit'}
                        type='number'
                        placeholder='123456789-0'
                        value={org.nit}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className='field column'>
                    <label className='label is-size-7 has-text-grey-light'>Cámara de Comercio</label>
                    {docLoading ? (
                      <p>Subiendo archivo</p>
                    ) : (
                      <React.Fragment>
                        {org.doc.name ? (
                          <Dropzone
                            accept='application/pdf'
                            className='document-zone'
                            style={{ padding: 0 }}
                            onDrop={this.docDrop}>
                            <div className='field has-addons'>
                              <div className='control is-expanded'>
                                <input className='input' type='text' disabled={true} value={org.doc.name} />
                              </div>
                              <div className='control'>
                                <a className='button is-outlined is-info'>
                                  <TiArrowLoopOutline />
                                </a>
                              </div>
                            </div>
                          </Dropzone>
                        ) : (
                          <React.Fragment>
                            <Dropzone accept='application/pdf' className='document-zone' onDrop={this.docDrop}>
                              <div className='control'>
                                <span className='has-text-grey-light'>Selecciona archivo</span>
                                <MdAttachFile />
                              </div>
                            </Dropzone>
                            <p className={'help ' + (org.doc.flag ? 'is-success' : 'is-danger')}>{org.doc.msg}</p>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </div>
                </div>
                <div className='columns is-9'>
                  <div className='field column'>
                    <label className='label is-size-7 has-text-grey-light'>Dirección</label>
                    <div className='control'>
                      <Geosuggest
                        placeholder={'Ingresa tu dirección'}
                        onSuggestSelect={this.onSuggestSelect}
                        initialValue={org.location.FormattedAddress}
                        location={new google.maps.LatLng(org.location.Latitude, org.location.Longitude)}
                        radius='20'
                      />
                    </div>
                  </div>
                  <div className='field column'>
                    <label className='label required is-size-7 has-text-grey-light'>Celular o Teléfono</label>
                    <div className='control'>
                      <input
                        className='input has-text-weight-bold'
                        name={'phone'}
                        type='tel'
                        placeholder='+57 123 456 7890'
                        value={org.phone}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  {/*<div className="field column">
                                            <label className="label is-size-7 has-text-grey-light">Opción</label>
                                            <div className="control">
                                                <input className="input" name={"opcion"} type="text"
                                                        placeholder="Opción" value={org.phone}
                                                        onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>*/}
                </div>
                <div className='columns is-9'>
                  <div className='column'>
                    <div className='redes level columns is-multiline'>
                      <div className='column is-10'>
                        <FormNetwork changeNetwork={this.changeNetwork} object={org.network} />
                      </div>
                    </div>
                  </div>
                  <div className='column profile-buttons'>
                    <button
                      className={`button is-primary ${wait ? 'is-loading' : ''}`}
                      onClick={this.saveForm}
                      disabled={valid}>
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
        <Dialog
          modal={this.state.modalOrg}
          title={'Organización Creada'}
          content={
            <div>
              <p className='has-text-weight-bold has-text-success'>Organización creada correctamente</p>
              <p>Nuestro equipo validará tu información</p>
            </div>
          }
          first={{ title: 'OK', class: '', action: this.closeOrg }}
        />
      </div>
    );
  }
}

export default withRouter(OrganizationProfile);
