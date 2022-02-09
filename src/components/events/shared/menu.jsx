import React, { Component, Fragment } from 'react';
import { NavLink, withRouter, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { rolPermissions } from '../../../helpers/constants';
import { Menu } from 'antd';
import {
  EditOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserAddOutlined,
  NotificationOutlined,
  IdcardOutlined,
  LineChartOutlined,
  ApartmentOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { EventsApi } from '../../../helpers/request';

const { SubMenu } = Menu;

class MenuConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentTab: true,
      generalTab: false,
      peopleTab: true,
      commTab: true,
      checkInTab: true,
      ticketTab: true,
      stylesTab: true,
      guestTab: true,
      url: '',
      collapsed: false,
      organizationId: '',
    };
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  handleClick = (e) => {
    if (!navigator.onLine) e.preventDefault();
  };

  eventOrganization = async (eventId) => {
    const currentEvent = await EventsApi.getOne(eventId);
    const organizationId = currentEvent.organizer_id;
    this.setState({ organizationId });
  };

  componentDidMount() {
    const { pathname } = this.props.location;
    const splitted = pathname.split('/');
    this.setState({ url: '/' + splitted[1] + '/' + splitted[2] });
    this.eventOrganization(splitted[2]);
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (this.props.match.url !== prevProps.match.url) {
      this.setState({ url: match.url });
    }
  }

  render() {
    const { permissions } = this.props;
    const { url, organizationId } = this.state;

    return (
      <Fragment>
        <Menu
          defaultSelectedKeys={['11']}
          defaultOpenKeys={['sub2']}
          mode='inline'
          inlineCollapsed={this.state.collapsed}
        >

          {/* Configuración de contraseña */}

          {/* <SubMenu
            key='sub10'
            title={
              <span>
                <UsergroupAddOutlined />
                <span>Administrar Usuarios</span>
              </span>
            }>
            <Menu.Item key='31'>
              Consultar password usuarios
              <NavLink to={`${url}/adminUsers`}></NavLink>
            </Menu.Item>
          </SubMenu> */}


          <SubMenu
            key='sub2'
            title={
              <span>
                <SettingOutlined />
                <span>Configuración General</span>
              </span>
            }>
            <Menu.Item key='11'>
              Datos del evento
              <NavLink onClick={this.handleClick} to={`${url}/main`}></NavLink>
            </Menu.Item>

            <Menu.Item key='12'>
              Apariencia del evento
              <NavLink onClick={this.handleClick} to={`${url}/styles`}></NavLink>
            </Menu.Item>

            {/* <Menu.Item key="12">
                <NavLink onClick={this.handleClick} to={`${url}/configurationApp`}>
                  Habilitar secciones
                </NavLink>
              </Menu.Item> */}

            <Menu.Item key='13'>
              Habilitar secciones del evento
              <NavLink onClick={this.handleClick} to={`${url}/menuLanding`}></NavLink>
            </Menu.Item>

            <Menu.Item key='14'>
              Configuración de tickets
              <NavLink onClick={this.handleClick} to={`${url}/ticketsEvent`}></NavLink>
            </Menu.Item>
          </SubMenu>

          {/* Configuración de Contendio*/}
          <SubMenu
            key='sub1'
            title={
              <span>
                <EditOutlined />
                <span>Contenido del evento</span>
              </span>
            }>
            <Menu.Item key='1'>
              Agenda/Actividades
              <NavLink onClick={this.handleClick} to={`${url}/agenda`}></NavLink>
            </Menu.Item>

            <Menu.Item key='empresas'>
              Empresas
              <NavLink onClick={this.handleClick} to={`${url}/empresas`}></NavLink>
            </Menu.Item>

            <Menu.Item key='2'>
              Host/Anfitriones
              <NavLink onClick={this.handleClick} to={`${url}/speakers`}></NavLink>
            </Menu.Item>

            <Menu.Item key='3'>
              <NavLink onClick={this.handleClick} to={`${url}/espacios`}>
                Espacios
              </NavLink>
            </Menu.Item>

            <Menu.Item key='4'>
              Certificados
              <NavLink onClick={this.handleClick} to={`${url}/certificados`}></NavLink>
            </Menu.Item>

            <Menu.Item key='5'>
              Encuestas
              <NavLink onClick={this.handleClick} to={`${url}/trivia`}></NavLink>
            </Menu.Item>

            <Menu.Item key='6'>
              Noticias
              <NavLink onClick={this.handleClick} to={`${url}/news`}></NavLink>
            </Menu.Item>

            <Menu.Item key='7'>
              Preguntas Frecuentes
              <NavLink onClick={this.handleClick} to={`${url}/faqs`}></NavLink>
            </Menu.Item>

            <Menu.Item key='8'>
              Documentos
              <NavLink onClick={this.handleClick} to={`${url}/documents`}></NavLink>
            </Menu.Item>
            <Menu.Item key='110'>
              Contenido Informativo
              <NavLink onClick={this.handleClick} to={`${url}/informativesection`}></NavLink>
            </Menu.Item>
            <Menu.Item key='9'>
              Reporte de Networking
              <NavLink onClick={this.handleClick} to={`${url}/reportNetworking`}></NavLink>
            </Menu.Item>

            <Menu.Item key='10'>
              Producto
              <NavLink onClick={this.handleClick} to={`${url}/product`}></NavLink>
            </Menu.Item>

            {/* <Menu.Item key="9">
                <NavLink onClick={this.handleClick} to={`${url}/pages`}>
                  Agregar sección
                </NavLink>
              </Menu.Item> */}
          </SubMenu>

          {/* Configuración de Asistentes */}
          <SubMenu
            className='SubMenuCofigASIS'
            key='sub3'
            title={
              <span>
                <SolutionOutlined />
                <span>Configuración Asistentes</span>
              </span>
            }>
            <Menu.Item key='15'>
              Datos/Campos a recolectar de asistentes
              <NavLink onClick={this.handleClick} to={`${url}/datos`}></NavLink>
            </Menu.Item>

            <Menu.Item key='16'>
              Confirmación registro
              <NavLink onClick={this.handleClick} to={`${url}/confirmacion-registro`}></NavLink>
            </Menu.Item>

            <Menu.Item key='17'>
              Tipo de asistentes
              <NavLink onClick={this.handleClick} to={`${url}/tipo-asistentes`}></NavLink>
            </Menu.Item>

            {permissions.data.ids.includes(rolPermissions.admin_staff._id) && false && (
              <Menu.Item key='18'>
                Organizadores
                <NavLink onClick={this.handleClick} to={`${url}/staff`}></NavLink>
              </Menu.Item>
            )}
          </SubMenu>

          {/* Sección de checkin */}
          <SubMenu
            key='sub6'
            title={
              <span>
                <IdcardOutlined />
                <span>Asistentes</span>
              </span>
            }>
            <Menu.Item key='19'>
              Asistentes / Checkin
              <NavLink onClick={this.handleClick} to={`${url}/assistants`}></NavLink>
            </Menu.Item>

            <Menu.Item key='20'>
              Check In por Actividad
              <NavLink onClick={this.handleClick} to={`${url}/checkin-actividad`}></NavLink>
            </Menu.Item>

            <Menu.Item>
              Gestion de Chats
              <NavLink onClick={this.handleClick} to={`${url}/chatexport`}></NavLink>
            </Menu.Item>

            <Menu.Item key='21'>
              Enviar Correos a Asistentes
              <NavLink onClick={this.handleClick} to={`${url}/invitados`}></NavLink>
            </Menu.Item>

            {permissions.data.ids.includes(rolPermissions.admin_badge._id) && (
              <Menu.Item key='22'>
                Configurarr Escarapela
                <NavLink onClick={this.handleClick} to={`${url}/badge`}></NavLink>
              </Menu.Item>
            )}
          </SubMenu>

          {/* Configuración de invitados */}
          {permissions.data.ids.includes(rolPermissions.admin_invitations._id) && false && (
            <SubMenu
              key='sub4'
              title={
                <span>
                  <UserAddOutlined />
                  <span>Invitados</span>
                </span>
              }>
              <Menu.Item key='23'>
                Invitados sin confirmar
                <NavLink onClick={this.handleClick} to={`${url}/invitados`}></NavLink>
              </Menu.Item>

              <Menu.Item key='24'>
                Enviar información a invitados sin confirmar
                <NavLink onClick={this.handleClick} to={`${url}/invitados`}></NavLink>
              </Menu.Item>

              <Menu.Item key='25'>
                Invitaciones pasadas
                <NavLink onClick={this.handleClick} to={`${url}/messages`}></NavLink>
              </Menu.Item>
            </SubMenu>
          )}

          {/* Seccion de envio de comunicaciones */}
          {(permissions.data.ids.includes(rolPermissions.admin_invitations._id) || true) && (
            <SubMenu
              key='sub5'
              title={
                <span>
                  <NotificationOutlined />
                  <span>Comunicaciones</span>
                </span>
              }>
              <Menu.Item key='26'>
                Comunicaciones enviadas
                <NavLink onClick={this.handleClick} to={`${url}/messages`}></NavLink>
              </Menu.Item>

              {/* <Menu.Item key='27'>
                Push Notificaciones
                <NavLink onClick={this.handleClick} to={`${url}/notificationsApp`}></NavLink>
              </Menu.Item> */}

              <Menu.Item key='28'>
                Enviar información a asistentes
                <NavLink onClick={this.handleClick} to={`${url}/invitados`}></NavLink>
              </Menu.Item>
            </SubMenu>
          )}

          {/* Sección para gestion de entradas */}
          {/*
            <SubMenu
              key="sub7"
              title={
                <span>
                  <CreditCardOutlined />
                  <span>Entradas</span>
                </span>
              }>
              <Menu.Item key="27">
                <NavLink onClick={this.handleClick} to={`${url}/ticket`}>
                  Administrar entradas
                </NavLink>
              </Menu.Item>

              <Menu.Item key="28">
                <NavLink onClick={this.handleClick} to={`${url}/orders`}>
                  Pedidos
                </NavLink>
              </Menu.Item>
            </SubMenu> 

          {/* Sección estadisticas */}

          <SubMenu
            key='sub8'
            title={
              <span>
                <LineChartOutlined />
                <span>Estadisticas</span>
              </span>
            }>
            <Menu.Item key='29'>
              Estadísticas del evento
              <NavLink onClick={this.handleClick} to={`${url}/dashboard`}></NavLink>
            </Menu.Item>
          </SubMenu>
          {/* Seccion de Organización */}
          {(permissions.data.ids.includes(rolPermissions.admin_invitations._id) || true) && (
            <SubMenu
              key='sub9'
              title={
                <span>
                  <ApartmentOutlined />
                  <span>Administrar organizaciones</span>
                </span>
              }>
              <Menu.Item key='30'>
                Panel de administración
                <NavLink onClick={this.handleClick} to={`/admin/organization/${organizationId}`}></NavLink>
              </Menu.Item>
            </SubMenu>
          )}
        </Menu>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  permissions: state.permissions,
});

export default connect(mapStateToProps)(withRouter(MenuConfig));
