import React, { Component } from 'react';
import { NavLink, withRouter, Switch, Route, Redirect } from 'react-router-dom';
import InfoGeneral from './newEvent/InfoGeneral';
import InfoAsistentes from './newEvent/infoAsistentes';
import Moment from 'moment';

import { Actions } from '../../helpers/request';
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
const steps = [
  {
    title: 'Información',
    icon: <ScheduleOutlined />,
    content: <Informacion />,
  },
  {
    title: 'Apariencia',
    icon: <PictureOutlined />,
    content: <Apariencia />,
  },
  {
    title: 'Transmisión',
    icon: <VideoCameraOutlined />,
    content: <Tranmitir />,
  },
];

class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        name: '',
        location: {},
        description: '',
        category_ids: [],
        venue: '',
        event_type_id: '',
        hour_start: Moment().toDate(),
        date_start: Moment().toDate(),
        hour_end: Moment().toDate(),
        date_end: Moment().toDate(),
        address: '',
        type_event: '',
        allow_register: '',
      },
      fields: [],
      tickets: {},
      content: [],
      stepsValid: {
        info: false,
        fields: false,
      },
      current: 0,
    };
    this.saveEvent = this.saveEvent.bind(this);
  }

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
    const { info } = this.state;
    // const self = this;
    //this.setState({loading:true});
    const hour_start = Moment(info.hour_start).format('HH:mm');
    const date_start = Moment(info.date_start).format('YYYY-MM-DD');
    const hour_end = Moment(info.hour_end).format('HH:mm');
    const date_end = Moment(info.date_end).format('YYYY-MM-DD');
    const datetime_from = Moment(date_start + ' ' + hour_start, 'YYYY-MM-DD HH:mm');
    const datetime_to = Moment(date_end + ' ' + hour_end, 'YYYY-MM-DD HH:mm');
    const data = {
      name: info.name,
      address: info.address,
      type_event: info.type_event,
      datetime_from: datetime_from.format('YYYY-MM-DD HH:mm:ss'),
      datetime_to: datetime_to.format('YYYY-MM-DD HH:mm:ss'),
      picture: info.picture,
      venue: info.venue,
      location: info.location,
      visibility: info.visibility ? info.visibility : 'PUBLIC',
      description: info.description,
      category_ids: info.categories,
      organizer_id: info.organizer_id,
      event_type_id: info.event_type_id,
      user_properties: [...fields],
      allow_register: info.allow_register,
      styles: {
        buttonColor: '#FFF',
        banner_color: '#FFF',
        menu_color: '#FFF',
        event_image: null,
        banner_image: null,
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
        BackgroundImage: null,
        FooterImage: null,
        banner_footer: null,
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
    try {
      const result = await Actions.create('/api/events', data);
      this.setState({ loading: false });
      if (result._id) {
        window.location.replace(`${BaseUrl}/event/${result._id}`);
      } else {
        toast.warn(<FormattedMessage id='toast.warning' defaultMessage='Idk' />);
        this.setState({ msg: 'Cant Create', create: false });
      }
    } catch (error) {
      toast.error(<FormattedMessage id='toast.error' defaultMessage='Sry :(' />);
      if (error.response) {
        console.error(error.response);
        const { status, data } = error.response;
        console.error('STATUS', status, status === 401);
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        console.error('Error', error.message);
        if (error.request) {
          console.error(error.request);
          errorData = error.request;
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
      console.error(error.config);
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
    switch (this.state.current) {
      case 0:
        let eventNewContext = this.context;
        if (
          eventNewContext.validateField([
            { name: 'name', required: true, length: 4 },
            { name: 'description', required: eventNewContext.addDescription, length: 9 },
          ])
        ) {
          console.log('ERROR INPUTS==>', eventNewContext.errorInputs);
        } else {
          this.nextPage();
        }
        break;
    }
  };

  nextPage = () => {
    let current = this.state.current + 1;  
    this.setState({ current });
  };

  prev = () => {
    let current = this.state.current - 1;
    this.setState({ current });
  };

  render() {
    const { current } = this.state;
    let value = this.context;   
    return (
      <Row justify='center' className='newEvent'>
        {/* Items del paso a paso */}
        <div className='itemStep'>
          <Steps current={current} responsive>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} icon={item.icon} />
            ))}
          </Steps>
        </div>
        <Card className='card-container' bodyStyle={{ borderTop: '25px solid #50D3C9', borderRadius: '5px' }}>
          {/* Contenido de cada item del paso a paso */}
          <Row justify='center' style={{ marginBottom: '8px' }}>
            {steps[current].content}
          </Row>
          {/* Botones de navegacion dentro del paso a paso */}
          <div className='button-container'>
            {current > 0 && (
              <Button className='button' size='large' onClick={() => this.prev()}>
                Anterior
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button className='button' type='primary' size='large' onClick={() => this.next()}>
                Siguiente
              </Button>
            )}
            {current === steps.length - 1 && (
              <Button
                className='button'
                type='primary'
                size='large'
                onClick={() => message.success('Processing complete!')}>
                Crear evento
              </Button>
            )}
          </div>
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
