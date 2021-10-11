import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Actions } from '../../helpers/request';
import { FormattedMessage } from 'react-intl';
import LogOut from '../shared/logOut';
import * as Cookie from 'js-cookie';
import privateInstance from '../../helpers/request';
import { parseUrl } from '../../helpers/constants';
import { BaseUrl } from '../../helpers/constants';

class Configuration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      configuration: {},
      app_configuration: {},
      dates: {},
      checkHome: false,
      checkCalendar: false,
      checkProfile: false,
      checkEventPlace: false,
      checkSpeaker: false,
      checkNews: false,
      checkSurveys: false,
      checkDocuments: false,
      checkWall: false,
      checkQuiz: false,
      checkRanking: false,
      checkVote: false,
      checkFaq: false,
      checkGallery: false,
      checkWebScreen: false,
      checkRegister: false,
      checkRankingScreen: false,
      information: {},
      url: ''
    };
    this.submit = this.submit.bind(this);
    this.checkInput = React.createRef();
    this.enable = this.enable.bind(this);
  }
  async componentDidMount() {
    const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
    this.setState({ information: info.app_configuration });
    this.setState({ info });
    this.setState({
      dates: {
        database: this.state.information
      }
    });

    this.setState({
      configuration: {
        ...this.state.info.app_configuration
      }
    });

    if (this.state.dates.database) {
      if (this.state.dates.database.HomeScreen) {
        this.setState({
          checkHome: true
        });
        document.getElementById('checkbox0').checked = true;
      } else {
        this.setState({
          checkHome: false
        });
        document.getElementById('checkbox0').checked = false;
      }

      if (this.state.dates.database.ProfileScreen) {
        this.setState({
          checkProfile: true
        });
        document.getElementById('checkbox1').checked = true;
      } else {
        this.setState({
          checkProfile: false
        });
        document.getElementById('checkbox1').checked = false;
      }

      if (this.state.dates.database.CalendarScreen) {
        this.setState({
          checkCalendar: true
        });
        document.getElementById('checkbox2').checked = true;
      } else {
        this.setState({
          checkCalendar: false
        });
        document.getElementById('checkbox2').checked = false;
      }

      if (this.state.dates.database.NewsScreen) {
        this.setState({
          checkNews: true
        });
        document.getElementById('checkbox3').checked = true;
      } else {
        this.setState({
          checkNews: false
        });
        document.getElementById('checkbox3').checked = false;
      }

      if (this.state.dates.database.EventPlaceScreen !== undefined) {
        this.setState({
          checkEventPlace: true
        });
        document.getElementById('checkbox4').checked = true;
      } else {
        this.setState({
          checkEventPlace: false
        });
        document.getElementById('checkbox4').checked = false;
      }

      if (this.state.dates.database.SpeakerScreen) {
        this.setState({
          checkSpeaker: true
        });
        document.getElementById('checkbox5').checked = true;
      } else {
        this.setState({
          checkSpeaker: false
        });
        document.getElementById('checkbox5').checked = false;
      }

      if (this.state.dates.database.SurveyScreen) {
        this.setState({
          checkSurveys: true
        });
        document.getElementById('checkbox6').checked = true;
      } else {
        this.setState({
          checkSurveys: false
        });
        document.getElementById('checkbox6').checked = false;
      }

      if (this.state.dates.database.DocumentsScreen) {
        this.setState({
          checkDocuments: true
        });
        document.getElementById('checkbox7').checked = true;
      } else {
        this.setState({
          checkDocuments: false
        });
        document.getElementById('checkbox7').checked = false;
      }

      if (this.state.dates.database.WallScreen) {
        this.setState({
          checkWall: true
        });
        document.getElementById('checkbox8').checked = true;
      } else {
        this.setState({
          checkWall: false
        });
        document.getElementById('checkbox8').checked = false;
      }

      if (this.state.dates.database.WebScreen) {
        this.setState({
          checkWebScreen: true
        });
        document.getElementById('checkbox9').checked = true;
      } else {
        this.setState({
          checkWebScreen: false
        });
        document.getElementById('checkbox9').checked = false;
      }

      if (this.state.dates.database.RankingScreen) {
        this.setState({
          checkRankingScreen: true
        });
        document.getElementById('checkbox10').checked = true;
      } else {
        this.setState({
          checkRankingScreen: false
        });
        document.getElementById('checkbox10').checked = false;
      }

      if (this.state.dates.database.FaqsScreen) {
        this.setState({
          checkFaq: true
        });
        document.getElementById('checkbox11').checked = true;
      } else {
        this.setState({
          checkFaq: false
        });
        document.getElementById('checkbox11').checked = false;
      }
    } else {
      this.setState({
        checkHome: false,
        checkCalendar: false,
        checkProfile: false,
        checkEventPlace: false,
        checkSpeaker: false,
        checkNews: false,
        checkSurveys: false,
        checkDocuments: false,
        checkWall: false,
        checkQuiz: false,
        checkRanking: false,
        checkVote: false,
        checkFaq: false,
        checkGallery: false,
        checkWebScreen: false,
        checkRegister: false,
        checkRankingScreen: false
      });
    }
    let dataUrl = parseUrl(document.URL);
    if (dataUrl && dataUrl.token) {
      if (dataUrl.token) {
        Cookie.set('evius_token', dataUrl.token,{ expires: 180 });
        privateInstance.defaults.params = {};
        privateInstance.defaults.params['evius_token'] = dataUrl.token;
      }
      if (dataUrl.refresh_token) {
        Actions.put('/api/me/storeRefreshToken', { refresh_token: dataUrl.refresh_token }).then(() => {
          //
        });
      }
    }
  }

  async submit(e) {
    e.preventDefault();
    e.stopPropagation();

    // this.state.data.push(this.state.styles);
    this.state.data = { styles: this.state.configuration };
    try {
      if (this.state.info._id) {
        //const info = await Actions.put(`api/events/${this.props.eventId}`, this.state.app_configuration);

        this.setState({ loading: false });
        toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
        window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
      } else {
        const result = await Actions.post(`/api/events/${this.props.eventId}`, this.state.app_configuration);

        this.setState({ loading: false });
        if (result._id) {
          window.location.replace(`${BaseUrl}/event/${this.props.eventId}/configurationApp`);
          toast.success(<FormattedMessage id='toast.success' defaultMessage='Ok!' />);
        } else {
          toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
          this.setState({ msg: 'Cant Create', create: false });
        }
      }
    } catch (error) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {this.setState({ timeout: true, loader: false });
        Cookie.remove('token');
        Cookie.remove('evius_token');
      }
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;

        if (error.request) {
          errorData = error.request;
        }

        this.setState({ serverError: true, loader: false, errorData });
      }
    }
  }

  sendInfoToState = async (name, val) => {
    if (this.state.configuration[name]) {
      delete this.state.configuration[name];

      this.setState({
        app_configuration: {
          app_configuration: {
            ...this.state.configuration
          }
        }
      });
    } else {
      await this.setState({
        configuration: {
          ...this.state.configuration,
          [name]: val
        }
      });

      await this.setState({
        app_configuration: {
          app_configuration: {
            ...this.state.configuration,
            [name]: val
          }
        }
      });
    }
  };

  updateStateTitle = (key_object, val) => {
    let object = this.state.configuration;
    object[key_object].title = val;
    this.setState(object);
  };

  changeInput = async (name, val) => {
    let url = document.getElementById(13).value;
    this.setState({ url });

    if (this.state.configuration[name]) {
      await this.setState({
        configuration: {
          ...this.state.configuration,
          [name]: val
        }
      });

      await this.setState({
        app_configuration: {
          app_configuration: {
            ...this.state.configuration,
            [name]: val
          }
        }
      });
    }
  };

  enable = async (val) => {
    var isChecked = document.getElementById(val.idCheck).checked;
    if (isChecked) {
      document.getElementById(val.id).disabled = false;
    } else {
      document.getElementById(val.id).disabled = true;
    }
  };

  render() {
    const { timeout } = this.state;

    const itemsDrawer = [
      {
        reference: this.checkInput,
        id: 1,
        idCheck: 'checkbox0',
        title: 'Home',
        name: 'HomeScreen',
        checked: this.state.checkHome,
        type: this.state.type,
        titles: this.state.checkHome ? 'Deshabilitar Home' : 'Habilitar Home',
        icon: 'home',
        key: 0,
        title_view: 'Modulo Home Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 2,
        idCheck: 'checkbox1',
        title: 'Profile',
        name: 'ProfileScreen',
        checked: this.state.checkProfile,
        type: this.state.type,
        titles: this.state.checkProfile ? 'Deshabilitar Perfil' : 'Habilitar Perfil',
        icon: 'user',
        key: 1,
        title_view: 'Modulo Perfil Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 3,
        idCheck: 'checkbox2',
        title: 'Calendar',
        name: 'CalendarScreen',
        checked: this.state.checkCalendar,
        type: this.state.type,
        titles: this.state.checkCalendar ? 'Deshabilitar Agenda' : 'Habilitar Agenda',
        icon: 'book-open',
        key: 2,
        title_view: 'Modulo Agenda Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 4,
        idCheck: 'checkbox3',
        title: 'News',
        name: 'NewsScreen',
        checked: this.state.checkNews,
        type: this.state.type,
        titles: this.state.checkNews ? 'Deshabilitar Noticias' : 'Habilitar Noticias',
        icon: 'file-text',
        key: 3,
        title_view: 'Modulo de Noticias Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 5,
        idCheck: 'checkbox4',
        title: 'EventPlace',
        name: 'EventPlaceScreen',
        checked: this.state.checkEventPlace,
        type: this.state.type,
        titles: this.state.checkEventPlace ? 'Deshabilitar Lugar de evento' : 'Habilitar lugar de evento',
        icon: 'map-pin',
        key: 4,
        title_view: 'Modulo lugar del evento visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 6,
        idCheck: 'checkbox5',
        title: 'Speakers',
        name: 'SpeakerScreen',
        checked: this.state.checkSpeaker,
        type: this.state.type,
        titles: this.state.checkSpeaker ? 'Deshabilitar Conferencistas' : 'Habilitar Conferencistas',
        icon: 'mic',
        key: 5,
        title_view: 'Modulo Conferencistas Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 7,
        idCheck: 'checkbox6',
        title: 'Survey',
        name: 'SurveyScreen',
        checked: this.state.checkSurveys,
        type: this.state.type,
        titles: this.state.checkSurveys ? 'Deshabilitar Encuestas' : 'Habilitar Encuestas',
        icon: 'edit-2',
        key: 6,
        title_view: 'Modulo de encuestas Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 8,
        idCheck: 'checkbox7',
        title: 'Documents',
        name: 'DocumentsScreen',
        checked: this.state.checkDocuments,
        type: this.state.type,
        titles: this.state.checkDocuments ? 'Deshabilitar Document' : 'Habilitar Document',
        icon: 'folder',
        key: 7,
        title_view: 'Modulo de documentos Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 9,
        idCheck: 'checkbox8',
        title: 'Wall',
        name: 'WallScreen',
        checked: this.state.checkWall,
        type: this.state.type,
        titles: this.state.checkWall ? 'Deshabilitar Wall' : 'Habilitar Wall',
        icon: 'message-square',
        key: 8,
        title_view: 'Modulo de Muro Visible',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 10,
        idCheck: 'checkbox9',
        title: 'Web',
        name: 'WebScreen',
        config: { url: this.state.url },
        checked: this.state.checkWebScreen,
        type: this.state.type,
        titles: this.state.checkWebScreen ? 'Deshabilitar Web Screen' : 'Habilitar Web Screen',
        icon: 'monitor',
        key: 9,
        title_view: 'Modulo de Web Screen',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 11,
        idCheck: 'checkbox10',
        title: 'Ranking',
        name: 'RankingScreen',
        checked: this.state.checkRankingScreen,
        type: this.state.type,
        titles: this.state.checkRankingScreen ? 'Deshabilitar Ranking' : 'Habilitar Ranking',
        icon: 'award',
        key: 10,
        title_view: 'Modulo Ranking',
        desc: 'Nombre en el aplicativo'
      },
      {
        reference: this.checkInput,
        id: 12,
        idCheck: 'checkbox11',
        title: 'F.A.Q',
        name: 'FaqsScreen',
        checked: this.state.checkFaq,
        type: this.state.type,
        titles: this.state.checkFaq ? 'Deshabilitar FAQ' : 'Habilitar FAQ',
        icon: 'help-circle',
        key: 11,
        title_view: 'Modulo de F.A.Q Visible',
        desc: 'Nombre en el aplicativo'
      }
    ];
    return (
      <React.Fragment>
        <div className='columns general'>
          <div className='column is-5'>
            <h2 className='title-section'>Configuracion de Aplicativo</h2>
            {itemsDrawer.map((item, key) => (
              <div className='column inner-column' key={key}>
                <br />
                <label>{item.titles}</label>
                <input
                  type='checkbox'
                  id={item.idCheck}
                  onClick={() => {
                    this.enable({ id: item.key, idCheck: item.idCheck });
                  }}
                  name={item.name}
                  value={item.key}
                  onChange={(e) => {
                    this.sendInfoToState(e.target.name, {
                      title: item.title,
                      name: item.name,
                      icon: item.icon,
                      key: item.key
                    });
                  }}
                />

                <label className='label has-text-grey-light'>{item.desc}</label>
                <input
                  className='input is-primary'
                  id={item.key}
                  ref={item.reference}
                  disabled
                  type='text'
                  placeholder={item.title}
                  onChange={(e) => {
                    this.updateStateTitle(item.name, e.target.value);
                  }}
                />
                {item.name === 'WebScreen' ? (
                  <div>
                    <label>Agrega un espacio al final del texto </label>
                    <input
                      name='WebScreen'
                      className='input is-primary'
                      style={{ marginTop: '2%' }}
                      id='13'
                      ref={item.reference}
                      type='text'
                      placeholder='Url de pagina web'
                      onChange={(e) => {
                        this.changeInput(e.target.name, {
                          title: item.title,
                          config: item.config,
                          name: item.name,
                          icon: item.icon,
                          key: item.key
                        });
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ))}
            <button id='button' className='button is-primary' onClick={this.submit}>
              Guardar
            </button>
          </div>
        </div>
        {timeout && <LogOut />}
      </React.Fragment>
    );
  }
}

export default Configuration;
