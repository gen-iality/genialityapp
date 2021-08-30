import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Actions, PushFeed } from '../../helpers/request';
import { FormattedMessage } from 'react-intl';
import Loading from '../loaders/loading';
import { handleRequestError, sweetAlert } from '../../helpers/utils';
import EventContent from '../events/shared/content';
import EvenTable from '../events/shared/table';

class pushNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: this.props.event,
      items: {},
      push: {},
      loading: true,
      notifications: {},
      result: [],
      app_configuration: [],
      route: ''
    };
    this.submit = this.submit.bind(this);
  }

  fetchItem = async () => {
    const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
    this.setState({ app_configuration: [info.app_configuration] });

    const result = await PushFeed.byEvent(this.props.eventId);
    result.reverse();
    this.setState({
      result,
      loading: false
    });
  };

  async componentDidMount() {
    this.fetchItem();
  }

  saveRole = async () => {
    try {
      if (this.state.id !== 'new') {
        await PushFeed.editOne(
          { route: this.state.route, title: this.state.title, body: this.state.body },
          this.state.id,
          this.props.eventId
        );
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.title = state.title;
              item.body = state.body;
              item.route = state.route;
              toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
              return item;
            } else return item;
          });
          return { list, id: '', title: '', body: '' };
        });
      } else {
        const newRole = await PushFeed.create(
          { route: this.state.route, title: this.state.title, body: this.state.body },
          this.props.eventId
        );
        this.setState((state) => {
          const list = state.list.map((item) => {
            if (item._id === state.id) {
              item.title = newRole.title;
              item.body = newRole.body;
              item.route = state.route;
              toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
              return item;
            } else return item;
          });
          return { list, id: '', title: '', body: '' };
        });
      }
    } catch (e) {
      e;
    }
  };

  editItem = (cert) => this.setState({ id: cert._id, title: cert.title, body: cert.body });

  removeItem = (id) => {
    sweetAlert.twoButton(`Está seguro de borrar este espacio`, 'warning', true, 'Borrar', async (result) => {
      try {
        if (result.value) {
          sweetAlert.showLoading('Espera (:', 'Borrando...');
          await PushFeed.deleteOne(id, this.props.eventId);
          this.setState(() => ({ id: '', title: '', body: '', route: '' }));
          this.fetchItem();
          sweetAlert.hideLoading();
        }
      } catch (e) {
        sweetAlert.showError(handleRequestError(e));
      }
    });
  };
  async submit(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const result = await Actions.create(`api/events/${this.props.eventId}/sendpush`, this.state.push);
      if (result) {
        toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
      } else {
        toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
        this.setState({ msg: 'Cant Create', create: false });
      }
      this.setState({ loading: false });
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

        this.setState({ serverError: true, loader: false, errorData })
      }
    }
  }

  render() {
    const { result, app_configuration } = this.state;
    return (
      <React.Fragment>
        <div className='columns general'>
          <div className='column is-12'>
            <h2 className='title-section'>Push Notifications</h2>
            <br />
            <label className='label'>Las notificaciones se envian a todos los usuarios del evento.</label>
            <div className='column inner-column'>
              <label className='label'>Titulo.</label>
              <input
                className='input'
                type='text'
                onChange={(save) => {
                  this.setState({ push: { ...this.state.push, title: save.target.value } });
                }}
                name='title'
              />
            </div>

            <div className='column inner-column'>
              <label className='label'>Mensaje</label>
              <input
                className='textarea'
                type='textarea'
                onChange={(save) => {
                  this.setState({
                    push: { ...this.state.push, body: save.target.value, data: '', id: this.props.eventId }
                  });
                }}
                name='title'
              />
            </div>

            <div style={{ marginBottom: '5%' }} className='column inner-column select is-primary'>
              <label className='label'>Envio de push a seccion en especifico</label>
              {app_configuration.map((item, key) => {
                return (
                  <div key={key}>
                    {item && (
                      <select
                        id='SelecRoute'
                        onChange={(save) => {
                          this.setState({ push: { ...this.state.push, route: save.target.value } });
                        }}>
                        <option>Seleccionar...</option>
                        {item.WebScreen && (
                          <option value={item.WebScreen.name ? item.WebScreen.name : ''}>
                            {item.WebScreen.title ? item.WebScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.RankingScreen.name ? item.RankingScreen.name : ''}>
                            {item.RankingScreen.title ? item.RankingScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.FaqsScreen.name ? item.FaqsScreen.name : ''}>
                            {item.FaqsScreen.title ? item.FaqsScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.WallScreen.name ? item.WallScreen.name : ''}>
                            {item.WallScreen.title ? item.WallScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.DocumentsScreen.name ? item.DocumentsScreen.name : ''}>
                            {item.DocumentsScreen.title ? item.DocumentsScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.SurveyScreen.name ? item.SurveyScreen.name : ''}>
                            {item.SurveyScreen.title ? item.SurveyScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.SpeakerScreen.name ? item.SpeakerScreen.name : ''}>
                            {item.SpeakerScreen.title ? item.SpeakerScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.EventPlaceScreen.name ? item.EventPlaceScreen.name : ''}>
                            {item.EventPlaceScreen.title ? item.EventPlaceScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.HomeScreen.name ? item.HomeScreen.name : ''}>
                            {item.HomeScreen.title ? item.HomeScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.ProfileScreen.name ? item.ProfileScreen.name : ''}>
                            {item.ProfileScreen.title ? item.ProfileScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.CalendarScreen.name ? item.CalendarScreen.name : ''}>
                            {item.CalendarScreen.title ? item.CalendarScreen.title : 'Seleccione...'}
                          </option>
                        )}
                        {item.WebScreen && (
                          <option value={item.NewsScreen.name ? item.NewsScreen.name : ''}>
                            {item.NewsScreen.title ? item.NewsScreen.title : 'Seleccione...'}
                          </option>
                        )}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
            <div>
              <button className='button is-primary' onClick={this.submit}>
                Enviar
              </button>
            </div>

            <div className='column is-12'>
              <EventContent
                title='Notificaciones'
                closeAction={this.goBack}
                description_complete={'Observe o elimine las notificaciones observadas '}
                addAction={this.newRole}
                addTitle={'Nuevo espacio'}>
                {this.state.loading ? (
                  <Loading />
                ) : (
                  <EvenTable head={['Titulo', 'Notificacion', 'Enviados', 'Fallidos', 'Fecha', '']}>
                    {result.map((cert, key) => {
                      return (
                        <tr key={key}>
                          <td>
                            <p>{cert.title}</p>
                          </td>

                          <td>
                            <p>{cert.body}</p>
                          </td>
                          <td>
                            <p>{cert.success}</p>
                          </td>
                          <td>
                            <p>{cert.fail}</p>
                          </td>
                          <td>{cert.created_at}</td>
                        </tr>
                      );
                    })}
                  </EvenTable>
                )}
              </EventContent>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default pushNotification;
