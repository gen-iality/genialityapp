import React from 'react';
import WithLoading from './../shared/withLoading';
import { Badge, Menu, Spin } from 'antd';
import ScrollTo from 'react-scroll-into-view';

//Se importan todos los iconos a  un Objeto para llamarlos dinámicamente
import * as iconComponents from '@ant-design/icons';
import { Component } from 'react';
import * as Cookie from 'js-cookie';
import { connect } from 'react-redux';

import { gotoActivity } from '../../redux/stage/actions';
import {} from '../../redux/notifyNetworking/actions';

const stylesMenuItems = {
  height: '100%',
  padding: '30px 0',
  backgroundColor: 'transparent',
};

class MenuEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: this.props.eventId ? this.props.eventId : null,
      isEnabledLogin: true,
      loading: false,
      itemsMenu: this.props.itemsMenu ? this.props.itemsMenu : this.menuDefault,
      user: null,
      showSection: this.props.showSection,
      logged: false,
      email: false,
      section: 'evento',
      totalnotifications: null,
      styleText: this.props.styleText ? this.props.styleText : '#22222',
    };
    this.menuDefault = {
      evento: {
        name: 'Evento',
        section: 'evento',
        icon: 'CalendarOutlined',
        checked: false,
        permissions: 'public',
      },
      agenda: {
        name: 'Agenda',
        section: 'agenda',
        icon: 'ReadOutlined',
        checked: false,
        permissions: 'public',
      },
      speakers: {
        name: 'Conferencistas',
        section: 'speakers',
        icon: 'AudioOutlined',
        checked: false,
        permissions: 'public',
      },
      tickets: {
        name: 'Boletería',
        section: 'tickets',
        icon: 'CreditCardOutlined',
        checked: false,
        permissions: 'public',
      },
      certs: {
        name: 'Certificados',
        section: 'certs',
        icon: 'FileDoneOutlined',
        checked: false,
        permissions: 'public',
      },
      documents: {
        name: 'Documentos',
        section: 'documents',
        icon: 'FolderOutlined',
        checked: false,
        permissions: 'public',
      },
      wall: {
        name: 'Muro',
        section: 'wall',
        icon: 'TeamOutlined',
        checked: false,
        permissions: 'public',
      },
      survey: {
        name: 'Encuestas',
        section: 'survey',
        icon: 'FileUnknownOutlined',
        checked: false,
        permissions: 'public',
      },
      faqs: {
        name: 'Preguntas Frecuentes',
        section: 'faqs',
        icon: 'QuestionOutlined',
        checked: false,
        permissions: 'public',
      },
      networking: {
        name: 'Networking',
        section: 'networking',
        icon: 'LaptopOutlined',
        checked: false,
        permissions: 'public',
      },
      my_section: {
        name: 'Seccion Personalizada',
        section: 'my_section',
        icon: 'EnterOutlined',
        checked: false,
        permissions: 'public',
      },
      companies: {
        name: 'Empresas',
        section: 'companies',
        icon: 'ApartmentOutlined', // ApartmentOutlined
        checked: false,
        permissions: 'public',
      },
      interviews: {
        name: 'Vende / Mi agenda',
        section: 'interviews',
        icon: 'UserOutlined',
        checked: false,
        permissions: 'public',
      },
      partners: {
        name: 'Patrocinadores',
        section: 'partners',
        icon: 'DeploymentUnitOutlined',
        checked: false,
        permissions: 'public',
      },      
    ferias: {
      name: 'Ferias',
      section: 'ferias',
      icon: 'FundProjectionScreenOutlined',
      checked: false,
      permissions: 'public',
    },
    noticias: {
      name: 'Noticias',
      section: 'noticias',
      icon: 'NotificationOutlined',
      checked: false,
      permissions: 'public',
    },
    producto: {
      name: 'Producto',
      section: 'producto',
      icon: 'ShopOutlined ',
      checked: false,
      permissions: 'public',
    },
    };
  }

  async componentDidMount() {
    const isExistCookie = Cookie.get('evius_token');

    if (this.props.notifications !== undefined && this.props.notifications !== null) {
      this.setState({
        totalnotifications: this.props.notifications,
      });
    }

    if (isExistCookie) {
      this.setState({ isEnabledLogin: false });
    }

    if (this.props.user) {
      this.setState({ user: this.props.user });
    }

    this.setState({ loading: true });

    await this.handleInitialSection();

    this.setState({ loading: false });

    this.state.showSection(this.state.section);
  }

  handleInitialSection() {
    let itemsMenu = this.state.itemsMenu || {};

    itemsMenu = Object.keys(itemsMenu).map((key) => {
      if (this.state.itemsMenu[key] && this.state.itemsMenu[key].permissions == 'assistants' && !this.state.user) {
        return null;
      }

      return this.state.itemsMenu[key].section;
    });

    const initialSection = itemsMenu.filter((item) => item !== null);
    this.setState({ section: initialSection[0] });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.user && !this.state.user) {
      this.setState({ user: this.props.user, notifications: this.props.notifications });
    }
    this.state.notifications = this.props.notifications;
    if (prevState.section !== this.state.section) {
      this.handleInitialSection();
    }
  }

  callback = (section) => {
    if (section === 'agenda') {
      this.props.gotoActivity(null);
    }
  };

  render() {
    const { loading, styleText } = this.state;

    return (
      <ScrollTo selector='#visualizar' /*Desplazamiento automatico a la seccion seleccionada */>
        <Menu
          mode='inline'
          // theme="dark"
          defaultSelectedKeys={['1']}
          // defaultOpenKeys={['sub1']}
          style={stylesMenuItems}>
          {loading && (
            <div className='columns is-centered'>
              <Spin tip='Cargando Menú...'></Spin>
            </div>
          )}
          {this.state.itemsMenu &&
            Object.keys(this.state.itemsMenu).map((key) => {
              if (
                this.state.itemsMenu[key] &&
                this.state.itemsMenu[key].permissions == 'assistants' &&
                !this.state.user
              ) {
                return null;
              }

              if (this.state.itemsMenu[key].section === 'login' && !this.state.isEnabledLogin) {
                return null;
              }

              let IconoComponente = iconComponents[this.state.itemsMenu[key].icon];

              return (
                <Menu.Item
                  style={{ position: 'relative' }}
                  key={this.state.itemsMenu[key].section}
                  className='MenuItem_event'
                  onClick={() => this.state.showSection(this.state.itemsMenu[key].section)}
                  /*style={{display:'grid', marginBottom:'12%', height:'63px', paddingLeft:'15px !important'}}*/
                >
                  {this.state.itemsMenu[key].section === 'networking' && (
                    <Badge
                      style={{ position: 'absolute', top: 2, right: 5 }}
                      count={this.props.totalNotifyNetworking.total}>
                      <a className='head-example' />
                    </Badge>
                  )}
                  <IconoComponente style={{ margin: '0 auto', fontSize: '22px', color: styleText }} />

                  {this.state.eventId === '5faae7381fc1d06d3b28fca2' ||
                  this.state.eventId === '5f7e3564cdedb50e4c651602' ||
                  this.state.eventId === '5f7b31866df71d13c2782153' ||
                  this.state.eventId === '5f99a20378f48e50a571e3b6' ||
                  this.state.eventId === '5fca68b7e2f869277cfa31b0' ? (
                    <span
                      className='menuEvent_section-text'
                      style={{ color: styleText }}>{` ${this.state.itemsMenu[key].name}`}</span>
                  ) : (
                    <span className='menuEvent_section-text' style={{ color: styleText, position: 'relative' }}>
                      {` ${this.state.itemsMenu[key].name}`}
                    </span>
                  )}
                </Menu.Item>
              );
            })}
        </Menu>
      </ScrollTo>
    );
  }
}

const mapStateToProps = (state) => ({
  totalNotifyNetworking: state.notificationsNetReducer.data,
});

const mapDispatchToProps = {
  gotoActivity,
};

export default connect(mapStateToProps, mapDispatchToProps)(WithLoading(MenuEvent));
