import React, { Component } from 'react';
import { Redirect, Link, withRouter } from 'react-router-dom';
import Moment from 'moment';
import 'moment/locale/es-us';
import { Actions, EventsApi } from '../../helpers/request';
import Dialog from '../modal/twoAction_old';
import ImageInput from '../shared/imageInput';
import LogOut from '../shared/logOut';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormattedMessage } from 'react-intl';
import Quill from 'react-quill';
import { Button, Checkbox, Row, Space } from 'antd';
Moment.locale('es-us');

class SendRsvp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rsvp: {},
      include_date: true,
      selection: [],
      showimgDefault: true,
    };
    this.submit = this.submit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  componentDidMount() {
    let default_header = ' Has sido invitado a: <br /> <span className="strong">' + this.props.event.name + '</span> ';
    this.setState({
      rsvp: {
        ...this.state.rsvp,
        content_header: default_header,
        subject: this.props.event.name,
        message: this.props.event.description,
        image: this.props.event.picture,
        image_header:
          this.props.event.styles && this.props.event.styles.banner_image_email
            ? this.props.event.styles.banner_image_email
            : this.props.event.styles.banner_image
            ? this.props.event.styles.banner_image
            : this.props.event.picture,
        image_footer:
          this.props.event.styles && this.props.event.styles.banner_footer
            ? this.props.event.styles.banner_footer
            : this.props.event.picture,
      },
      selection: this.props.selection.length > 0 ? this.props.selection : this.props.location.selection,
    });
  }

  changeImg = (files) => {
    const file = files[0];
    if (file) {
      this.setState({ imageFile: file });
      this.uploadImg('imageFile', 'image');
    } else {
      this.setState({ errImg: 'Only images files allowed. Please try again :)' });
    }
  };

  changeImgHeader = (files) => {
    const file = files[0];
    if (file) {
      this.setState({ imageFileHeader: file });
      this.uploadImg('imageFileHeader', 'image_header');
    } else {
      this.setState({ errImg: 'Only images files allowed. Please try again :)' });
    }
  };

  changeImgFooter = (files) => {
    const file = files[0];
    if (file) {
      this.setState({ imageFileFooter: file });
      this.uploadImg('imageFileFooter', 'image_footer');
    } else {
      this.setState({ errImg: 'Only images files allowed. Please try again :)' });
    }
  };

  uploadImg = (imageFieldName, imageStateName) => {
    let data = new FormData();
    const url = '/api/files/upload',
      self = this;
    data.append('file', this.state[imageFieldName]);
    Actions.post(url, data)
      .then((image) => {
        self.setState({
          rsvp: {
            ...self.state.rsvp,
            [imageStateName]: image,
          },
          [imageFieldName]: false,
        });
      })
      .catch(() => {
        this.setState({ timeout: true, loader: false });
      });
  };

  handleChange = (e) => {
    let { name, value } = e.target;
    this.setState({
      rsvp: { ...this.state.rsvp, [name]: value },
    });
  };

  QuillComplement2 = (content) =>
    this.setState({
      rsvp: { ...this.state.rsvp, message: content },
    });

  QuillComplement1 = (content) =>
    this.setState({
      rsvp: { ...this.state.rsvp, content_header: content },
    });

  async submit() {
    const { event } = this.props;
    const { rsvp, include_date, selection } = this.state;
    let users = [];
    selection.map((item) => {
      return users.push(item._id);
    });
    this.setState({ dataMail: users, disabled: true });
    try {
      let data;

      if (this.state.showimgDefault) {
        data = {
          content_header: rsvp.content_header,
          subject: rsvp.subject,
          message: rsvp.message,
          image_header: rsvp.image_header,
          image_footer: rsvp.image_footer,
          image: rsvp.image,
          eventUsersIds: users,
          include_date: include_date,
        };
      } else {
        data = {
          content_header: rsvp.content_header,
          subject: rsvp.subject,
          message: rsvp.message,
          image_header: rsvp.image_header,
          image_footer: rsvp.image_footer,
          eventUsersIds: users,
          include_date: include_date,
        };
      }
      console.log('Dataenviar', data);
      await EventsApi.sendRsvp(JSON.stringify(data), event._id);
      toast.success(<FormattedMessage id='toast.email_sent' defaultMessage='Ok!' />);
      this.setState({ disabled: false, redirect: true, url_redirect: '/eventadmin/' + event._id + '/messages' });
    } catch (e) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      this.setState({ disabled: false, timeout: true, loader: false });
    }
  }

  closeModal = () => {
    this.setState((prevState) => {
      return { modal: !prevState.modal };
    });
  };

  /*PLANTILLAS  en lenguaje MJML
    https://mjml.io/try-it-live/templates/austin
    https://mjml.io/try-it-live/templates/sphero-droids
    https://mjml.io/try-it-live/templates/ticketshop
    
    */

  onChangeDate(e) {
    this.setState({
      include_date: e.target.checked,
    });
  }

  render() {
    const { timeout, disabled, include_date } = this.state;
    if (this.state.redirect) return <Redirect to={{ pathname: this.state.url_redirect }} />;
    return (
      <div className='columns event-rsvp'>
        <div className='column is-8'>
          <div className='columns is-multiline is-centered'>
            {/* email subject */}
            <div className='column is-10'>
              <div className='box rsvp-subject'>
                <div className='field'>
                  <div className='rsvp-subject-txt'>
                    <label className='label'>
                      Asunto del correo <br /> <small>(Por defecto será el nombre del evento)</small>
                    </label>
                    <i className='fa fa-info-circle info-icon'></i>
                  </div>
                  <div className='control'>
                    <input
                      className='input'
                      type='text'
                      name='subject'
                      placeholder='Escribe aquí el asunto del correo'
                      onChange={this.handleChange}
                      value={this.state.rsvp.subject}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* -- endof email subject */}

            {/* <div className="column is-10">
                            <div className="rsvp-title has-text-centered">
                                <h2 className="rsvp-title-txt">
                                    Hola "INVITADO", has sido invitado a:
                                    <br />
                                    <span className="strong">{this.props.event.name}</span>
                                </h2>

                            </div>
        </div> */}
            <div className='column is-10'>
              <div className='rsvp-pic'>
                <p className='rsvp-pic-txt'>
                  Sube una imagen <br /> <small>(Por defecto será la imagen del banner)</small>
                </p>
                <ImageInput
                  picture={this.state.rsvp.image_header}
                  imageFile={this.state.imageFileHeader}
                  divClass={'rsvp-pic-img'}
                  content={<img src={this.state.rsvp.image_header} alt={'Imagen Perfil'} />}
                  classDrop={'dropzone'}
                  contentDrop={
                    <button
                      className={`button is-primary is-inverted is-outlined ${
                        this.state.imageFileHeader ? 'is-loading' : ''
                      }`}>
                      Cambiar foto
                    </button>
                  }
                  contentZone={<div>Subir foto</div>}
                  changeImg={this.changeImgHeader}
                  errImg={this.state.errImg}
                />
              </div>
            </div>

            <div className='column is-10'>
              <div className='field rsvp-desc'>
                <label className='label'>
                  Cabecera del correo <br /> <small></small>
                </label>
                <div className='control'>
                  {/* <textarea className="textarea" value={this.state.rsvp.message} onChange={this.handleChange} name={"message"} /> */}
                  <Quill
                    value={this.state.rsvp.content_header}
                    onChange={this.QuillComplement1}
                    name='content_header'
                  />
                </div>
              </div>
              <div>
                <Checkbox style={{ marginRight: '2%' }} defaultChecked={include_date} onChange={this.onChangeDate} />
                <label>Especificar fecha del evento</label>
              </div>
            </div>

            {include_date && (
              <div className='column is-10'>
                <div className='columns is-mobile is-multiline is-centered rsvp-date-wrapper'>
                  <div className='column is-12'>
                    <div className='columns is-mobile is-centered'>
                      <div className='column'>
                        <div className='columns rsvp-date'>
                          <div className='column is-two-thirds'>
                            <p>Fecha Inicio</p>
                            <p className='date'>{Moment(this.props.event.datetime_from).format('DD MMM YYYY')}</p>
                          </div>
                          <div className='column is-one-third'>
                            <span className='icon is-large has-text-grey-lighter'>
                              <i className='far fa-calendar-alt fa-2x' />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='vertical-line'></div>
                      <div className='column'>
                        <div className='columns rsvp-date'>
                          <div className='column is-two-thirds'>
                            <p>Hora</p>
                            <p className='date'>{Moment(this.props.event.datetime_from).format('HH:mm')}</p>
                          </div>
                          <div className='column is-one-third'>
                            <span className='icon is-large has-text-grey-lighter'>
                              <i className='far fa-clock fa-2x' />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='column is-12'>
                    <div className='columns is-mobile is-centered'>
                      <div className='column'>
                        <div className='columns rsvp-date'>
                          <div className='column is-two-thirds'>
                            <p>Fecha Fin</p>
                            <p className='date'>{Moment(this.props.event.datetime_to).format('DD MMM YYYY')}</p>
                          </div>
                          <div className='column is-one-third'>
                            <span className='icon is-large has-text-grey-lighter'>
                              <i className='far fa-calendar-alt fa-2x' />
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='vertical-line'></div>
                      <div className='column'>
                        <div className='columns rsvp-date'>
                          <div className='column is-two-thirds'>
                            <p>Hora</p>
                            <p className='date'>{Moment(this.props.event.datetime_to).format('HH:mm')}</p>
                          </div>
                          <div className='column is-one-third'>
                            <span className='icon is-large has-text-grey-lighter'>
                              <i className='far fa-clock fa-2x' />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='column is-10'>
              <div className='columns is-mobile is-centered rsvp-where'>
                <div className='column is-2 has-text-centered'>
                  <span className='icon is-large has-text-grey-lighter'>
                    <i className='fas fa-map-marker-alt fa-2x' />
                  </span>
                </div>
                <div className='column is-8'>
                  Ubicación del evento
                  <br />
                  {console.log('Que hay?', this.props.event)}
                  <span className='rsvp-location'>
                    {this.props.event.location !== null && this.props.event.location.FormattedAddress}
                  </span>
                </div>
              </div>
            </div>

            <div className='column is-10'>
              <div className='rsvp-pic'>
                <Space direction='vertical'>
                  <p className='rsvp-pic-txt'>
                    Sube una imagen <br /> <small>(Por defecto será la del evento)</small>
                  </p>

                  <Row style={{ margin: 10 }}>
                    {!this.state.showimgDefault ? (
                      <Button onClick={() => this.setState({ showimgDefault: true })} type='success'>
                        Mostrar imagen por defecto
                      </Button>
                    ) : (
                      <Button onClick={() => this.setState({ showimgDefault: false })} danger>
                        Quitar imagen por defecto
                      </Button>
                    )}
                  </Row>
                </Space>

                {this.state.showimgDefault && (
                  <Row>
                    <ImageInput
                      picture={this.state.rsvp?.image}
                      imageFile={this.state.imageFile}
                      divClass={'rsvp-pic-img'}
                      content={<img src={this.state.rsvp?.image} alt={'Imagen Perfil'} />}
                      classDrop={'dropzone'}
                      contentDrop={
                        <button
                          className={`button is-primary is-inverted is-outlined ${
                            this.state.imageFile ? 'is-loading' : ''
                          }`}>
                          Cambiar foto
                        </button>
                      }
                      contentZone={<div>Subir foto</div>}
                      changeImg={this.changeImg}
                      errImg={this.state.errImg}
                    />
                  </Row>
                )}
              </div>
            </div>

            <div className='column is-10'>
              <div className='field rsvp-desc'>
                <label className='label'>
                  Cuerpo de la invitación <br /> <small>(Por defecto será la descripción del evento)</small>
                </label>
                <div className='control'>
                  {/* <textarea className="textarea" value={this.state.rsvp.message} onChange={this.handleChange} name={"message"} /> */}
                  <Quill value={this.state.rsvp.message} onChange={this.QuillComplement2} name='message' />
                </div>
              </div>
            </div>

            <div className='column is-10'>
              <div className='rsvp-pic'>
                <p className='rsvp-pic-txt'>
                  Sube una imagen <br />{' '}
                  <small>
                    (Por defecto será la imagen footer del evento o la image del organizador, la que este disponible)
                  </small>
                </p>
                <ImageInput
                  picture={this.state.rsvp.image_footer}
                  imageFile={this.state.imageFileFooter}
                  divClass={'rsvp-pic-img'}
                  content={<img src={this.state.rsvp.image_footer} alt={'Imagen Perfil'} />}
                  classDrop={'dropzone'}
                  contentDrop={
                    <button
                      className={`button is-primary is-inverted is-outlined ${
                        this.state.imageFileFooter ? 'is-loading' : ''
                      }`}>
                      Cambiar foto
                    </button>
                  }
                  contentZone={<div>Subir foto</div>}
                  changeImg={this.changeImgFooter}
                  errImg={this.state.errImg}
                />
              </div>
            </div>

            <div className='column is-10'>
              <div className='columns is-centered'>
                <div className='column has-text-centered'>
                  <button
                    className='button is-primary'
                    onClick={() => {
                      this.setState({ modal: true });
                    }}>
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='column is-4'>
          <div className='box rsvp-send'>
            <div className='columns is-centered-is-multiline'>
              <div className='column'>
                <p className='rsvp-send-title'>
                  Seleccionados <span>{this.state.selection?.length}</span>
                </p>
                <p>
                  {this.state.selection?.map((el) => {
                    return el.properties.email + ', ';
                  })}
                </p>
              </div>
            </div>

            <div className='column rsvp-send-users'>
              {this.state.selection?.map((item, key) => {
                return (
                  <p key={key} className='selection'>
                    {item.email}
                  </p>
                );
              })}
            </div>

            <div className='column has-text-centered'>
              <Link to={{ pathname: `${this.props.matchUrl}` }}>
                <button className='button is-primary'>Editar Seleccionados</button>
              </Link>
            </div>
          </div>
        </div>
        <Dialog
          modal={this.state.modal}
          title={'Confirmación'}
          content={<p>Se van a enviar {this.state.selection?.length} invitaciones</p>}
          first={{ title: 'Enviar', class: 'is-info', action: this.submit, disabled: disabled }}
          second={{ title: 'Cancelar', class: '', action: this.closeModal }}
          message={{ class: '', content: '' }}
        />
        {timeout && <LogOut />}
      </div>
    );
  }
}

export default withRouter(SendRsvp);
