import React, { Component, Fragment } from "react";
import { NavLink, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { rolPermissions } from "../../../helpers/constants";
import { Menu, Button } from "antd";
import {
  AppstoreOutlined,
  EditOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserAddOutlined,
  NotificationOutlined,
  IdcardOutlined,
  CreditCardOutlined,
  LineChartOutlined
} from "@ant-design/icons";

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
      url: "",
      collapsed: false
    };
  }

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  handleClick = e => {
    if (!navigator.onLine) e.preventDefault();
  };

  componentDidMount() {
    const { pathname } = this.props.location;
    const splitted = pathname.split("/");
    this.setState({ url: "/" + splitted[1] + "/" + splitted[2] });
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (this.props.match.url !== prevProps.match.url) {
      this.setState({ url: match.url });
    }
  }

  render() {
    const { permissions } = this.props;
    const { contentTab, generalTab, peopleTab, commTab, checkInTab, ticketTab, guestTab, stylesTab, url } = this.state;
    return (
      <Fragment>
        <div>
          <Menu
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["sub1"]}
            mode="inline"
            inlineCollapsed={this.state.collapsed}>
            {/* Configuración de contenido */}

            <SubMenu
              key="sub1"
              title={
                <span>
                  <EditOutlined />
                  <span>Contenido del evento</span>
                </span>
              }>
              <Menu.Item key="1">
                <NavLink onClick={this.handleClick} to={`${url}/agenda`}>
                  Agenda/Actividades
                </NavLink>
              </Menu.Item>

              <Menu.Item key="2">
                <NavLink onClick={this.handleClick} to={`${url}/speakers`}>
                  Conferencistas
                </NavLink>
              </Menu.Item>

              <Menu.Item key="3">
                <NavLink onClick={this.handleClick} to={`${url}/espacios`}>
                  Espacios
                </NavLink>
              </Menu.Item>

              <Menu.Item key="4">
                <NavLink onClick={this.handleClick} to={`${url}/certificados`}>
                  Certificados
                </NavLink>
              </Menu.Item>

              <Menu.Item key="5">
                <NavLink onClick={this.handleClick} to={`${url}/trivia`}>
                  Encuestas
                </NavLink>
              </Menu.Item>

              <Menu.Item key="6">
                <NavLink onClick={this.handleClick} to={`${url}/news`}>
                  Noticias
                </NavLink>
              </Menu.Item>

              <Menu.Item key="7">
                <NavLink onClick={this.handleClick} to={`${url}/faqs`}>
                  Preguntas Frecuentes
                </NavLink>
              </Menu.Item>

              <Menu.Item key="8">
                <NavLink onClick={this.handleClick} to={`${url}/documents`}>
                  Documentos
                </NavLink>
              </Menu.Item>

              {/* <Menu.Item key="9">
                <NavLink onClick={this.handleClick} to={`${url}/pages`}>
                  Agregar sección
                </NavLink>
              </Menu.Item> */}
            </SubMenu>

            <SubMenu
              key="sub2"
              title={
                <span>
                  <SettingOutlined />
                  <span>Configuración General</span>
                </span>
              }>
              <Menu.Item key="10">
                <NavLink onClick={this.handleClick} to={`${url}/main`}>
                  Datos del evento
                </NavLink>
              </Menu.Item>

              <Menu.Item key="11">
                <NavLink onClick={this.handleClick} to={`${url}/styles`}>
                  Apariencia del evento
                </NavLink>
              </Menu.Item>

              <Menu.Item key="12">
                <NavLink onClick={this.handleClick} to={`${url}/configurationApp`}>
                  Habilitar secciones
                </NavLink>
              </Menu.Item>

              <Menu.Item key="13">
                <NavLink onClick={this.handleClick} to={`${url}/menuLanding`}>
                  Habilitar secciones del evento
                </NavLink>
              </Menu.Item>
            </SubMenu>

            {/* Configuración de Asistentes */}

            <SubMenu
              key="sub3"
              title={
                <span>
                  <SolutionOutlined />
                  <span>Configuración Asistentes</span>
                </span>
              }>
              <Menu.Item key="13">
                <NavLink onClick={this.handleClick} to={`${url}/datos`}>
                  Datos de asistentes
                </NavLink>
              </Menu.Item>

              <Menu.Item key="14">
                <NavLink onClick={this.handleClick} to={`${url}/tipo-asistentes`}>
                  Tipo de asistentes
                </NavLink>
              </Menu.Item>

              {permissions.data.ids.includes(rolPermissions.admin_staff._id) && false && (
                <Menu.Item key="15">
                  <NavLink onClick={this.handleClick} to={`${url}/staff`}>
                    Organizadores
                  </NavLink>
                </Menu.Item>
              )}
            </SubMenu>

            {/* Sección de checkin */}

            <SubMenu
              key="sub6"
              title={
                <span>
                  <IdcardOutlined />
                  <span>Asistentes</span>
                </span>
              }>
              <Menu.Item key="25">
                <NavLink onClick={this.handleClick} to={`${url}/assistants`}>
                  Asistentes / Checkin
                </NavLink>
              </Menu.Item>

              <Menu.Item key="26">
                <NavLink onClick={this.handleClick} to={`${url}/checkin-actividad`}>
                  Check In por Actividad
                </NavLink>
              </Menu.Item>

              <Menu.Item key="16">
                <NavLink onClick={this.handleClick} to={`${url}/invitados`}>
                  Enviar Correos a Asistentes
                </NavLink>
              </Menu.Item>

              {permissions.data.ids.includes(rolPermissions.admin_badge._id) && (
                <Menu.Item key="24">
                  <NavLink onClick={this.handleClick} to={`${url}/badge`}>
                    Configurarr Escarapela
                  </NavLink>
                </Menu.Item>
              )}
            </SubMenu>

            {/* COnfiguración de invitados */}
            {permissions.data.ids.includes(rolPermissions.admin_invitations._id) && false && (
              <SubMenu
                key="sub4"
                title={
                  <span>
                    <UserAddOutlined />
                    <span>Invitados</span>
                  </span>
                }>
                <Menu.Item key="16">
                  <NavLink onClick={this.handleClick} to={`${url}/invitados`}>
                    Invitados sin confirmar
                  </NavLink>
                </Menu.Item>

                <Menu.Item key="18">
                  <NavLink onClick={this.handleClick} to={`${url}/invitados`}>
                    Enviar información a invitados sin confirmar
                  </NavLink>
                </Menu.Item>

                <Menu.Item key="19">
                  <NavLink onClick={this.handleClick} to={`${url}/messages`}>
                    Invitaciones pasadas
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            )}

            {/* Seccion de envio de comunicaciones */}
            {(permissions.data.ids.includes(rolPermissions.admin_invitations._id) || true) && (
              <SubMenu
                key="sub5"
                title={
                  <span>
                    <NotificationOutlined />
                    <span>Comunicaciones</span>
                  </span>
                }>
                <Menu.Item key="20">
                  <NavLink onClick={this.handleClick} to={`${url}/messages`}>
                    Comunicaciones enviadas
                  </NavLink>
                </Menu.Item>

                <Menu.Item key="21">
                  <NavLink onClick={this.handleClick} to={`${url}/notificationsApp`}>
                    Push Notificaciones
                  </NavLink>
                </Menu.Item>

                <Menu.Item key="22">
                  <NavLink onClick={this.handleClick} to={`${url}/invitados`}>
                    Enviar información a asistenes
                  </NavLink>
                </Menu.Item>
              </SubMenu>
            )}

            {/* Sección para gestion de entradas */}

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
              key="sub8"
              title={
                <span>
                  <LineChartOutlined />
                  <span>Estadisticas</span>
                </span>
              }>
              <Menu.Item key="29">
                <NavLink onClick={this.handleClick} to={`${url}/dashboard`}>
                  Estadísticas del evento
                </NavLink>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  permissions: state.permissions
});

export default connect(mapStateToProps)(withRouter(MenuConfig));
