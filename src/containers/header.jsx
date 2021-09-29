import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { app } from '../helpers/firebase';
import * as Cookie from 'js-cookie';
import { ApiUrl } from '../helpers/constants';
import { OrganizationApi, getCurrentUser, EventsApi } from '../helpers/request';
import LogOut from '../components/shared/logOut';
import ErrorServe from '../components/modal/serverError';
import UserStatusAndMenu from '../components/shared/userStatusAndMenu';
import { connect } from 'react-redux';
import * as userActions from '../redux/user/actions';
import * as eventActions from '../redux/event/actions';
import MenuOld from '../components/events/shared/menu';
import { Menu, Drawer, Button, Col, Row, Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { parseUrl } from '../helpers/constants';
import withContext from '../Context/withContext';

const { setEventData } = eventActions;
const { addLoginInformation, showMenu } = userActions;

const { Header } = Layout;
const zIndex = {
  zIndex: '1',
};

class Headers extends Component {
  constructor(props) {
    super(props);
    this.props.history.listen((location) => {
      this.handleMenu(location);
    });

    this.state = {
      selection: [],
      organizations: [],
      name: 'user',
      user: false,
      menuOpen: false,
      timeout: false,
      modal: false,
      loader: true,
      create: false,
      valid: true,
      serverError: false,
      showAdmin: false,
      showEventMenu: false,
      tabEvtType: true,
      tabEvtCat: true,
      eventId: null,
      userEvent: null,
    };
    this.setEventId = this.setEventId.bind(this);
    this.logout = this.logout.bind(this);
  }

  showDrawer = () => {
    this.setState({
      showEventMenu: true,
    });
  };

  onClose = () => {
    this.setState({
      showEventMenu: false,
    });
  };

  setEventId = () => {
    const path = window.location.pathname.split('/');
    let eventId = path[2] || path[1];
    return eventId;
  };

  async componentDidMount() {
    const eventId = this.setEventId();
    this.setState({ eventId });

    /** ESTO ES TEMPORAL Y ESTA MAL EL USUARIO DEBERIA MAJEARSE DE OTRA MANERA */
    let evius_token = null;
    let dataUrl = parseUrl(document.URL);
    if (dataUrl && dataUrl.token) {
      Cookie.set('evius_token', dataUrl.token, { expires: 180 });
      evius_token = dataUrl.token;
    }
    if (!evius_token) {
      evius_token = await Cookie.get('evius_token');
    }

    // Si no tenemos token, significa que no tenemos usuario.
    if (!evius_token) {
      this.setState({ user: false, loader: false });
      return;
    }

    //Si existe el token consultamos la información del usuario
    const data = await getCurrentUser();
    console.log('USERDATA==>', data);
  
    if (data) {
      console.log("DATA==>",data)
      const user = await EventsApi.getEventUser(data._id, eventId);
      console.log('USERDATA2==>', user);
      const photo = user!=null ? user.user?.picture:data.picture
      const name = user!=null?user?.properties?.name || user?.properties?.names: data.name || data.names;

      const organizations = await OrganizationApi.mine();

      this.setState(
        {
          name,
          userEvent: {...user?.properties,_id:user?.account_id},
          photo,
          uid: data.uid,
          id: data._id,
          user: true,
          cookie: evius_token,
          loader: false,
          organizations,
        },
        () => {
          this.props.addLoginInformation(data);
        }
      );
      this.handleMenu(this.props.location);
    } else {
      //Problemas
      this.setState({ timeout: true, loader: false });
    }
  }

  handleMenu = (location) => {
    const splited = location.pathname.split('/');
    if (splited[1] === '') {
      this.setState({ showAdmin: false, menuOpen: false });
    } else if (splited[1] === 'eventadmin' || splited[1] === 'orgadmin') {
      this.setState({ showAdmin: true, showEventMenu: false, menuOpen: false });
      window.scrollTo(0, 0);
    }
  };

  async componentDidUpdate(prevProps) {
    if (
      this.props.loginInfo.name !== prevProps.loginInfo.name ||
      this.props.loginInfo.picture !== prevProps.loginInfo.picture
    ) {
      console.log('LOGIN INFO==>', this.props.loginInfo);
      const user = await EventsApi.getEventUser(this.props?.loginInfo?._id, this.state.eventId);
      console.log('USERDATA2==>', user);
      const photo = user?.user? user.user?.picture:this.props.loginInfo.picture;
      const name = user?.user ?user?.properties?.name || user?.properties?.names: this.props.loginInfo.name || this.props.loginInfo.names;

      this.setState({ name, photo, user: true,userEvent: {...user?.properties,_id:user?.account_id || this.props?.loginInfo?._id}, });
    }

    if (prevProps && prevProps.location !== this.props.location) {
      this.handleMenu(this.props.location);
    }
  }

  logout = () => {
    app
      .auth()
      .signOut()
      .then(() => {
        Cookie.remove('token');
        Cookie.remove('evius_token');

        //const urlRedirect = this.state.eventId ? `${BaseUrl}/landing/${this.state.eventId}` : `${BaseUrl}`
        //window.location.replace(urlRedirect);

        // Solucion temporal, se esta trabajando un reducer que permita identificar
        // el eventId sin importar su posición, actualmente se detecta un problema
        // cuando la url tiene el eventId en una posicion diferente al final
        window.location.replace('/');
      })
      .catch(function(error) {
        // An error happened.
        error;
      });
  };

  openMenu = () => {
    this.setState((menuState) => {
      return { menuOpen: !menuState.menuOpen, filterOpen: false };
    });
  };

  goReport = (e) => {
    e.preventDefault();
    window.location.replace(`${ApiUrl}/events/reports`);
  };

  handleMenuEvent = () => {
    this.setState({ showEventMenu: true }, () => {
      this.props.showMenu();
    });
  };

  render() {
    const { timeout, serverError, errorData, photo, name, showAdmin, showEventMenu } = this.state;
    const { eventMenu, location } = this.props;
    return (
      <React.Fragment>
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <Menu theme='light' mode='horizontal'>
            <Row justify='space-between' align='middle'>
              {/*evius LOGO */}

              {/* <h1>Lanzamiento HBOMax Región Andina</h1> */}

              <Row className='logo-header' justify='space-between' align='middle'>
                {/* {this.props.event !== null && this.props.event.name} */}
                <Link to={'/'}>{/* <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }} /> */}</Link>
                {/* Menú de administrar un evento (esto debería aparecer en un evento no en todo lado) */}
                {showAdmin && (
                  <Col span={2} offset={3} data-target='navbarBasicExample'>
                    <span className='icon icon-menu' onClick={this.handleMenuEvent}>
                      <Button style={zIndex} onClick={this.showDrawer}>
                        {React.createElement(this.state.showEventMenu ? MenuUnfoldOutlined : MenuFoldOutlined, {
                          className: 'trigger',
                          onClick: this.toggle,
                        })}
                      </Button>
                    </span>
                  </Col>
                )}
              </Row>

              {/* Dropdown de navegacion para el usuario  */}

              <UserStatusAndMenu
                isLoading={this.state.loader}
                user={this.state.user}
                menuOpen={this.state.menuOpen}
                loader={this.state.loader}
                photo={photo}
                name={name}
                userEvent={this.state.userEvent}
                eventId={this.state.eventId}
                logout={this.logout}
                openMenu={this.openMenu}
                loginInfo={this.props.loginInfo}
              />
            </Row>
          </Menu>
        </Header>

        {/* Menu mobile */}

        {showAdmin && showEventMenu && (
          <div id='navbarBasicExample' className={`${eventMenu ? 'is-active' : ''}`}>
            <Drawer
              className='hiddenMenuMobile_Landing'
              title='Administrar evento'
              maskClosable={true}
              bodyStyle={{ padding: '0px' }}
              placement='left'
              closable={true}
              onClose={this.onClose}
              visible={this.state.showEventMenu}>
              <MenuOld match={location.pathname} />
            </Drawer>
          </div>
        )}

        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.categories.items,
  types: state.types.items,
  loginInfo: state.user.data,
  eventMenu: state.user.menu,
  permissions: state.permissions,
  error: state.categories.error,
  event: state.event.data,
});

const mapDispatchToProps = {
  setEventData,
  addLoginInformation,
  showMenu,
};

let HeaderWithContext = withContext(Headers);
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderWithContext));
