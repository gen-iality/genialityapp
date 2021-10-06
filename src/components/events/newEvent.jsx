import React, { Component } from 'react';
import { NavLink, withRouter, Switch, Route, Redirect } from 'react-router-dom';
import InfoGeneral from './newEvent/InfoGeneral';
import InfoAsistentes from './newEvent/infoAsistentes';
import Moment from 'moment';

import { Actions, UsersApi } from '../../helpers/request';
import { toast } from 'react-toastify';
import { FormattedMessage } from 'react-intl';
import { BaseUrl } from '../../helpers/constants';
import { Steps, Button, message, Card, Row } from 'antd';
import { PictureOutlined, ScheduleOutlined, VideoCameraOutlined } from '@ant-design/icons';
/*vistas de paso a paso */
import Informacion from './newEvent/informacion';
import Apariencia from './newEvent/apariencia';
import Tranmitir from './newEvent/transmitir';
/*vista de resultado de la creacion de un evento */
import Resultado from './newEvent/resultado';
import { cNewEventContext } from '../../Context/newEventContext';

const { Step } = Steps;

/* Objeto que compone el paso a paso y su contenido */

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepsValid: {
        info: false,
        fields: false,
      },
      current: 0,
      currentUser: null,
      steps: [
        {
          title: 'Información',
          icon: <ScheduleOutlined />,
        },
        {
          title: 'Apariencia',
          icon: <PictureOutlined />,
        },
        {
          title: 'Transmisión',
          icon: <VideoCameraOutlined />,
        },
      ],
      loading: false,
    };
    this.saveEvent = this.saveEvent.bind(this);
  }
  async componentDidMount() {
    if (this.props.match.params.user) {
      let profileUser = await UsersApi.getProfile(this.props.match.params.user);
      this.setState({ currentUser: profileUser });
    }
  }
  obtainContent = (step) => {
    switch (step.title) {
      case 'Información':
        return <Informacion currentUser={this.state.currentUser} />;
      case 'Apariencia':
        return <Apariencia currentUser={this.state.currentUser} />;
      case 'Transmisión':
        return <Tranmitir currentUser={this.state.currentUser} />;
    }
  };

  /*  nextStep = (field, data, next) => {
    this.setState(
      (prevState) => {
        return { [field]: data, stepsValid: { ...prevState.stepsValid, [field]: true } };
      },
      () => {
        this.goTo(next);
      }
    );
  }; */

  async saveEvent(fields) {
    let eventNewContext = this.context;
    this.setState({ loading: true });
    //console.log(eventNewContext.valueInputs.name)
    //console.log(eventNewContext.valueInputs.description)
    console.log(eventNewContext.selectedDateEvent)
    //console.log(eventNewContext.selectOrganization)
    //console.log(eventNewContext.imageEvents)
    if (eventNewContext.selectOrganization) {
      const data = {
        name: eventNewContext.valueInputs.name,
        address: '',
        type_event: 'onlineEvent',
        datetime_from: eventNewContext.selectedDateEvent?.from+":00",
        datetime_to: eventNewContext.selectedDateEvent?.at+":00",
        picture: null,
        venue: '',
        location: '',
        visibility: 'PUBLIC',
        description: eventNewContext.valueInputs?.description || '',
        category_ids: [],
        organizer_id: eventNewContext.selectOrganization.id,
        event_type_id: '5bf47203754e2317e4300b68',
        user_properties: [],
        allow_register: true,
        styles: {
          buttonColor: '#FFF',
          banner_color: '#FFF',
          menu_color: '#FFF',
          event_image: eventNewContext.imageEvents?.logo || null,
          banner_image: eventNewContext.imageEvents?.portada || null,
          menu_image: null,
          brandPrimary: '#FFFFFF',
          brandSuccess: '#FFFFFF',
          brandInfo: '#FFFFFF',
          brandDanger: '#FFFFFF',
          containerBgColor: '#ffffff',
          brandWarning: '#FFFFFF',
          toolbarDefaultBg: '#FFFFFF',
          brandDark: '#FFFFFF',
          brandLight: '#FFFFFF',
          textMenu: '#FFFFFF',
          activeText: '#FFFFFF',
          bgButtonsEvent: '#FFFFFF',
          banner_image_email: null,
          BackgroundImage: eventNewContext.imageEvents?.imgfondo || null,
          FooterImage: null,
          banner_footer: eventNewContext.imageEvents?.piepagina || null,
          mobile_banner: null,
          banner_footer_email: null,
          show_banner: false,
          show_card_banner: true,
          show_inscription: false,
          hideDatesAgenda: true,
          hideDatesAgendaItem: false,
          hideHoursAgenda: false,
          hideBtnDetailAgenda: true,
          loader_page: 'no',
          data_loader_page: null,
        },
      };
      console.log('EVENT TO CREATE==>', data);
      //CREAR EVENTO
      try {
        const result = await Actions.create('/api/events', data);

        if (result._id) {
          message.success("Evento creado correctamente..");
          window.location.replace(`${BaseUrl}/eventadmin/${result._id}`);
        } else {
          message.error(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
        }
      } catch (error) {
        console.log(error)
        message.error("Error al crear el evento");
      }
    } else {
      message.error('Seleccione una organización');
    }
  }

  /* prevStep = (field, data, prev) => {
    this.setState({ [field]: data }, () => {
      this.goTo(prev);
    });
  };

  goTo = (route) => {
    this.props.history.push(`${this.props.match.url}/${route}`);
  }; */

  /*Funciones para navegar en el paso a paso */
  next = () => {
    let eventNewContext = this.context;
    switch (this.state.current) {
      case 0:
        if (
          eventNewContext.validateField([
            { name: 'name', required: true, length: 4 },
            { name: 'description', required: eventNewContext.addDescription, length: 9 },
          ])
        ) {
          message.error('Error en los campos..');
        } else {
          this.nextPage();
        }
        break;
      case 1:
        eventNewContext.changeTransmision(false);
        this.nextPage();
        console.log(eventNewContext.valueInputs);
        break;
      case 2:
        break;
    }
  };

  nextPage = () => {
    let current = this.state.current + 1;
    this.setState({ current });
  };

  prev = () => {
    let eventNewContext = this.context;
    if (eventNewContext.optTransmitir && this.state.current == 2) {
      eventNewContext.changeTransmision(false);
    } else {
      let current = this.state.current - 1;
      this.setState({ current });
    }
  };

  render() {
    const { current } = this.state;
    let value = this.context;
    return (
      <Row justify='center' className='newEvent'>
        {/* Items del paso a paso */}
        <div className='itemStep'>
          <Steps current={current} responsive>
            {this.state.steps.map((item) => (
              <Step key={item.title} title={item.title} icon={item.icon} />
            ))}
          </Steps>
        </div>
        <Card className='card-container' bodyStyle={{ borderTop: '25px solid #50D3C9', borderRadius: '5px' }}>
          {/* Contenido de cada item del paso a paso */}
          <Row justify='center' style={{ marginBottom: '8px' }}>
            {this.obtainContent(this.state.steps[current])}
          </Row>
          {/* Botones de navegacion dentro del paso a paso */}
          {
            <div className='button-container'>
              {current > 0 && (
                <Button className='button' size='large' onClick={() => this.prev()}>
                  Anterior
                </Button>
              )}
              {current < this.state.steps.length - 1 && (
                <Button className='button' type='primary' size='large' onClick={() => this.next()}>
                  Siguiente
                </Button>
              )}
              {current === this.state.steps.length - 1 && (
                <Button className='button' type='primary' size='large' onClick={() => this.saveEvent()}>
                  Crear evento
                </Button>
              )}
            </div>
          }
        </Card>
        {/* <div className='steps'>
          <NavLink
            activeClassName={'is-active'}
            to={`${this.props.match.url}/main`}
            onClick={(e) => {
              e.preventDefault();
            }}
            className={`step-item ${this.state.stepsValid.info ? 'is-completed' : ''}`}>
            <div className='step-marker'>1</div>
            <div className='step-details'>
              <p className='step-title'>
                Información <br /> General
              </p>
            </div>
          </NavLink>
          <NavLink
            activeClassName={'is-active'}
            to={`${this.props.match.url}/attendees`}
            onClick={(e) => {
              e.preventDefault();
            }}
            className={`step-item ${this.state.stepsValid.fields ? 'is-completed' : ''}`}>
            <div className='step-marker'>2</div>
            <div className='step-details'>
              <p className='step-title'>
                Información <br /> Asistentes
              </p>
            </div>
          </NavLink>
        </div>
        <Switch>
          <Route
            exact
            path={`${this.props.match.url}/`}
            render={() => <Redirect to={`${this.props.match.url}/main`} />}
          />
          <Route
            exact
            path={`${this.props.match.url}/main`}
            render={() => <InfoGeneral nextStep={this.nextStep} data={this.state.info} />}
          />
          <Route
            path={`${this.props.match.url}/attendees`}
            render={() => (
              <InfoAsistentes nextStep={this.saveEvent} prevStep={this.prevStep} data={this.state.fields} />
            )}
          />
        </Switch> */}
      </Row>
    );
  }
}
NewEvent.contextType = cNewEventContext;
export default withRouter(NewEvent);
