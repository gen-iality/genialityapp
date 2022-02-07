import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addLoginInformation } from '../../redux/user/actions';
//Libraries and stuffs
import { Actions, CategoriesApi, EventsApi, UsersApi } from '../../helpers/request';
import Loading from '../loaders/loading';
import Moment from 'moment';
import ImageInput from '../shared/imageInput';
import { TiArrowLoopOutline } from 'react-icons/ti';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '../modal/twoAction_old';
import { auth } from '../../helpers/firebase';
import { DateTimePicker } from 'react-widgets';
import FormNetwork from '../shared/networkForm_old';
import { FormattedMessage } from 'react-intl';
import ErrorServe from '../modal/serverError';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: [],
      events: [],
      user: {},
      error: {},
      network: {},
      loading: true,
      valid: true,
      message: {
        class: '',
        content: '',
      },
    };
    this.saveForm = this.saveForm.bind(this);
  }

  async componentDidMount() {
    let userId = this.props.match.params.id;
    try {
      const categories = await CategoriesApi.getAll();
      const events = await EventsApi.mine();
      const user = await UsersApi.getProfile(userId, true);
      //const tickets = await UsersApi.mineTickets();
      user.name = user.displayName ? user.displayName : user.name ? user.name : user.email;
      user.picture = user.picture
        ? user.picture
        : user.photoUrl
        ? user.photoUrl
        : 'https://bulma.io/images/placeholders/128x128.png';
      user.location = user.location ? user.location : '';
      user.network = user.network ? user.network : { facebook: '', twitter: '', instagram: '', linkedIn: '' };
      user.birth_date = user.birth_date ? Moment(user.birth_date).toDate() : new Date();
      user.phoneNumber = user.phoneNumber ? user.phoneNumber : '';
      this.setState({ loading: false, user, events, categories, valid: false }, this.handleScroll);
    } catch (e) {
      this.setState({
        timeout: true,
        loading: false,
        errorData: { status: e.response.status, message: JSON.stringify(e.response.data) },
      });
    }
  }

  handleScroll = () => {
    const hash = this.props.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        let topOfElement = element.offsetTop + 60;
        window.scroll({ top: topOfElement });
      }
    }
  };

  changeImg = (files) => {
    const file = files[0];
    if (file) {
      this.setState({
        imageFile: file,
        user: { ...this.state.user, picture: null },
      });
      let data = new FormData();
      const url = '/api/files/upload',
        self = this;
      data.append('file', this.state.imageFile);
      Actions.post(url, data)
        .then((image) => {
          self.setState({
            user: {
              ...self.state.user,
              picture: image,
            },
            fileMsg: 'Image uploaded successfully',
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

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ user: { ...this.state.user, [name]: value } }, this.valid);
  };

  valid = () => {
    const {
      user: { email, name, phoneNumber, dni_number },
    } = this.state;
    const error = {};
    let nameValid,
      emailValid,
      phoneValid,
      dniValid,
      locationValid = false;
    if (name.length <= 0) {
      nameValid = true;
      error.name = nameValid && 'Fill a name';
    }
    if (email) {
      const EMAIL_REGEX = /^[\w]+@([\w-]+\.)+[\w-]{2,4}$/;
      emailValid = !(email.length > 6 && email.length < 61 && EMAIL_REGEX.test(email));
      error.email = emailValid && 'Fill a valid email';
    }
    if (!dni_number || dni_number.length < 4) {
      dniValid = true;
      error.dni = dniValid && 'Fill a dni with a least 5 digits';
    }
    if (phoneNumber.length < 7) {
      phoneValid = true;
      error.phone = phoneValid && 'Fill a phone with at least 7 digits';
    }
    // if (!location.FormattedAddress && !location.PlaceId) {
    //     locationValid = true;
    //     error.location = locationValid && 'Fill a correct address'
    // }
    let valid = nameValid || emailValid || dniValid || phoneValid || locationValid;
    this.setState({ valid, error });
  };

  changeDate = (value, name) => {
    this.setState({ user: { ...this.state.user, [name]: value } });
  };

  async saveForm() {
    const { user } = this.state;

    user.birth_date = Moment(user.birth_date).format('YYYY-MM-DD HH:mm:ss');

    try {
      const resp = await UsersApi.editProfile(user, user._id);

      resp.birth_date = resp.birth_date ? Moment(resp.birth_date).toDate() : new Date();
      this.props.addLoginInformation(user);
      this.setState({ user: resp });
      toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
    } catch (e) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      this.setState({ timeout: true, loader: false });
    }
  }

  closeModal = () => {
    this.setState({ modal: false });
  };

  resetPassword = () => {
    const { user } = this.state;
    auth
      .sendPasswordResetEmail(user.email)
      .then(() => {
        this.setState({ modal: true });
      })
      .catch(() => {});
  };

  changeNetwork = (e) => {
    const { name, value } = e.target;
    const { network } = this.state.user;
    network[name] = value;
    this.setState({ user: { ...this.state.user, network: network } });
  };

  render() {
    const { loading, timeout, user, valid, error, errorData } = this.state;

    return (
      <section className='section profile'>
        {loading ? (
          <Loading />
        ) : (
          <div className='container org-profile'>
            <div className='profile-info columns'>
              <div className='column is-4 user-info'>
                <ImageInput
                  picture={user.picture}
                  imageFile={this.state.imageFile}
                  divClass={'circle-img'}
                  content={<div style={{ backgroundImage: `url(${user.picture})` }} className='avatar-img' />}
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
                  <label className='label required is-size-7 has-text-grey-light'>Nombre</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'name'}
                      type='text'
                      placeholder='Nombre'
                      value={user.name}
                      onChange={this.handleChange}
                    />
                  </div>
                  {error.name && <p className='help is-danger'>{error.name}</p>}
                </div>
                <div className='field'>
                  <label className='label required is-size-7 has-text-grey-light'>Correo</label>
                  <div className='control'>
                    <input
                      className='input'
                      name={'email'}
                      type='email'
                      placeholder='Email'
                      value={user.email}
                      onChange={this.handleChange}
                    />
                  </div>
                  {error.email && <p className='help is-danger'>{error.email}</p>}
                </div>
                <div className='field change-password'>
                  <button className='button is-text is-size-7 has-text-grey-light' onClick={this.resetPassword}>
                    Haz clic aquí para cambiar tu contraseña
                  </button>
                </div>
              </div>
              <div className='column is-8 user-data userData'>
                <h1 className='title has-text-primary'>Datos</h1>
                <div className='columns is-9'>
                  <div className='field column'>
                    <label className='label is-size-7 required has-text-grey-light'>Cédula</label>
                    <div className='control'>
                      <input
                        className='input required has-text-weight-bold'
                        name={'dni_number'}
                        value={user.dni_number}
                        type='number'
                        placeholder='1234567890'
                        onChange={this.handleChange}
                      />
                    </div>
                    {error.dni && <p className='help is-danger'>{error.dni}</p>}
                  </div>
                  <div className='field column'>
                    <label className='label is-size-7 has-text-grey-light'>Dirección</label>
                    <div className='control'>
                      <input
                        className='input required has-text-weight-bold'
                        value={user.location}
                        name={'location'}
                        type='text'
                        placeholder='Ingresa tu dirección'
                        onChange={this.handleChange}
                      />
                    </div>
                    {error.location && <p className='help is-danger'>{error.location}</p>}
                  </div>
                </div>
                <div className='columns is-9'>
                  <div className='field column'>
                    <label className='label required is-size-7 has-text-grey-light'>Celular</label>
                    <div className='control'>
                      <input
                        className='input has-text-weight-bold'
                        name={'phoneNumber'}
                        value={user.phoneNumber}
                        type='number'
                        placeholder='+57 123 456 7890'
                        onChange={this.handleChange}
                      />
                    </div>
                    {error.phone && <p className='help is-danger'>{error.phone}</p>}
                  </div>
                  <div className='field column'>
                    <label className='label is-size-7 has-text-grey-light'>Empresa</label>
                    <div className='control'>
                      <input
                        className='input has-text-weight-bold'
                        name={'company'}
                        value={user.company}
                        type='text'
                        placeholder='Ingresa el nombre de tu empresa'
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className='columns is-9'>
                  <div className='field column'>
                    <label className='label is-size-7 has-text-grey-light required'>Fecha de nacimiento</label>
                    <div className='control'>
                      <DateTimePicker
                        value={user.birth_date}
                        format={'DD/MM/YYYY'}
                        max={new Date()}
                        time={false}
                        onChange={(value) => this.changeDate(value, 'birth_date')}
                      />
                    </div>
                  </div>
                  <div className='field column'>
                    <label className='label is-size-7 has-text-grey-light'>Intereses</label>
                    <div className='control'>
                      <input
                        className='input has-text-weight-bold'
                        name={'intereses'}
                        type='text'
                        placeholder='Proximamente'
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className='columns is-9'>
                  <div className='column'>
                    <div className='redes level columns is-multiline'>
                      <div className='column is-10'>
                        <FormNetwork changeNetwork={this.changeNetwork} object={user.network} />
                      </div>
                    </div>
                  </div>
                  <div className='column profile-buttons'>
                    <button className='button is-primary' onClick={this.saveForm} disabled={valid}>
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {timeout && <ErrorServe errorData={errorData} />}
        <Dialog
          modal={this.state.modal}
          title={'Reestablecer Contraseña'}
          content={
            <p>
              Se ha enviado un correo a <i>{user.email}</i> con instrucciones para cambiar la contraseña
            </p>
          }
          first={{ title: 'Ok', class: 'is-info is-outlined has-text-danger', action: this.closeModal }}
        />
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addLoginInformation: bindActionCreators(addLoginInformation, dispatch),
});

export default connect(null, mapDispatchToProps)(withRouter(Index));
