import { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { OrganizationFuction, UsersApi } from '../../../helpers/request';
import { Steps, Button, Card, Row, Spin } from 'antd';
import { ContactsOutlined, PictureOutlined, ScheduleOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '../../../context/MessageService';
/*vistas de paso a paso */

import Informacion from './newEvent/informacion';
import Apariencia from './newEvent/apariencia';
import AccessType from './newEvent/accessTypeEvent';
/*vista de resultado de la creacion de un evento */
import { cNewEventContext } from '../../../context/newEventContext';
const { Step } = Steps;

/* Objeto que compone el paso a paso y su contenido */

class NewEvent extends Component {
  constructor(props) {
    super(props);
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var orgId = urlParams.get('orgId');

    this.state = {
      orgId: orgId,
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
          title: 'Tipo de acceso',
          icon: <ContactsOutlined />,
        },
        /*{
          title: 'Apariencia',
          icon: <PictureOutlined />,
        },*/
        /* {
          title: 'Transmisión',
          icon: <VideoCameraOutlined />,
        },*/
      ],
      loading: false,
    };
  }

  async componentDidMount() {
    // eslint-disable-next-line react/prop-types
    if (this.props.match?.params?.user) {
      // eslint-disable-next-line react/prop-types
      let profileUser = await UsersApi.getProfile(this.props.match?.params?.user);
      this.setState({ currentUser: profileUser });
    }
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    var orgId = urlParams.get('orgId');
    if (orgId) {
      let eventNewContext = this.context;
      let organization = await OrganizationFuction.obtenerDatosOrganizacion(orgId);
      if (organization) {
        organization = { ...organization, id: organization._id };
        eventNewContext.selectedOrganization(organization);
        eventNewContext.eventByOrganization(false);
      }
    }
  }
  obtainContent = (step) => {
    switch (step.title) {
      case 'Información':
        return <Informacion orgId={this.state.orgId} currentUser={this.state.currentUser} />;
      case 'Apariencia':
        return <Apariencia currentUser={this.state.currentUser} />;
      /* case 'Transmisión':
        return <Tranmitir currentUser={this.state.currentUser} />;*/
      case 'Tipo de acceso':
        return <AccessType />;
    }
  };
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
          DispatchMessageService({
            type: 'error',
            msj: 'Error en los campos...',
            action: 'show',
          });
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
    let context = this.context;
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#ECF2F7',
        }}>
        <Row justify='center' className='newEvent' style={{ transition: 'all 1.5s ease-out' }}>
          {/* Items del paso a paso */}
          <div className='itemStep'>
            <Steps current={current} responsive>
              {this.state.steps.map((item) => (
                <Step key={item.title} title={item.title} icon={item.icon} />
              ))}
            </Steps>
          </div>
          <Card
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              width: `90%`,
              height: `80%`,
              borderRadius: '25px',
            }}
            className='card-container'>
            {/* Contenido de cada item del paso a paso */}
            <Row justify='center' style={{ marginBottom: '8px' }}>
              {this.obtainContent(this.state.steps[current])}
            </Row>
            {/* Botones de navegacion dentro del paso a paso */}
            {/* SE VALIDA CON window.history.length  PARA DETECTAR SI ES POSIBLE HACER EL BACK YA QUE AVECES SE ABRE UNA PESTAÑA NUEVA*/}
            {!context.state.loading && (
              <div className='button-container'>
                {current <= 0 && (
                  <Button
                    className='button'
                    size='large'
                    onClick={() => (window.history.length == 1 ? window.close() : window.history.back())}>
                    {window.history.length == 1 ? 'Salir' : 'Cancelar'}
                  </Button>
                )}
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
                  <Button
                    className='button'
                    type='primary'
                    size='large'
                    onClick={async () => await this.context.saveEvent()}>
                    Crear evento
                  </Button>
                )}
              </div>
            )}
            {this.context.state.loading && (
              <Row justify='center'>
                Espere.. <Spin />
              </Row>
            )}
          </Card>
        </Row>
      </div>
    );
  }
}
NewEvent.contextType = cNewEventContext;
export default withRouter(NewEvent);
