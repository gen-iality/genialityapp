import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import * as Cookie from 'js-cookie';
import { ApiUrl, AuthUrl, icon } from '../helpers/constants';
import API, { OrganizationApi } from '../helpers/request';
import { FormattedMessage } from 'react-intl';
import LogOut from '../components/shared/logOut';
import ErrorServe from '../components/modal/serverError';
import LetterAvatar from '../components/shared/letterAvatar';
import UserStatusAndMenu from '../components/shared/userStatusAndMenu';
import { connect } from 'react-redux';
import { addLoginInformation, showMenu } from '../redux/user/actions';
import { Logo } from '../../src/logo.svg';
import MenuOld from '../components/events/shared/menu';
import { Menu, Dropdown, Avatar, Drawer, Button, Col, Row, Layout } from 'antd';
import { DownOutlined, UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { parseUrl } from '../helpers/constants';

const { Header, Content, Footer } = Layout;
const zIndex = {
  zIndex: '1'
};

class Headers extends Component {
  constructor(props) {
    super(props);
    this.props.history.listen((location, action) => {
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
      tabEvtCat: true
    };
  }

  showDrawer = () => {
    this.setState({
      showEventMenu: true
    });
  };

  onClose = () => {
    this.setState({
      showEventMenu: false
    });
  };

  async componentDidMount() {
    /** ESTO ES TEMPORAL Y ESTA MAL EL USUARIO DEBERIA MAJEARSE DE OTRA MANERA */
    let evius_token = Cookie.get('evius_token');
    let dataUrl = parseUrl(document.URL);
    if (dataUrl && dataUrl.token) {
      Cookie.set('evius_token', dataUrl.token,{ expires: 180 });
      evius_token = dataUrl.token;
    }
    if (!evius_token) {
      this.setState({ user: false, loader: false });
      return;
    }

    try {
      const resp = await API.get(`/auth/currentUser?evius_token=${evius_token}`);

      if (resp.status === 200 || resp.status === 201 || resp.status === 202) {
        const data = resp.data;
        const name = data.name ? data.name : data.displayName ? data.displayName : data.email;
        const photo = data.photoUrl ? data.photoUrl : data.picture;
        const organizations = await OrganizationApi.mine();

        this.setState(
          { name, photo, uid: data.uid, id: data._id, user: true, cookie: evius_token, loader: false, organizations },
          () => {
            this.props.dispatch(addLoginInformation(data));
          }
        );
        this.handleMenu(this.props.location);
      } else {
        this.setState({ timeout: true, loader: false });
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = {};

        if (error.message) {
          errorData.message = error.message;
        } else if (error.request) {
          errorData.message = JSON.stringify(error.request);
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
    }
  }

  handleMenu = (location) => {
    const splited = location.pathname.split('/');
    if (splited[1] === '') {
      this.setState({ showAdmin: false, menuOpen: false });
    } else if (splited[1] === 'event') {
      this.setState({ showAdmin: true, showEventMenu: false, menuOpen: false });
      window.scrollTo(0, 0);
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.loginInfo.name !== prevProps.loginInfo.name ||
      this.props.loginInfo.picture !== prevProps.loginInfo.picture
    ) {
      const name = this.props.loginInfo.name;
      const photo = this.props.loginInfo.picture;
      this.setState({ name, photo, user: true });
    }
  }

  logout = () => {
    Cookie.remove('token');
    Cookie.remove('evius_token');
    window.location.replace(`${AuthUrl}/logout`);
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
      this.props.dispatch(showMenu());
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

              <Row className='logo-header' justify='space-between' align='middle'>
                <Link to={'/'}>
                  <div className='icon-header' dangerouslySetInnerHTML={{ __html: icon }} />
                </Link>

                {/* Menú de administrar un evento (esto debería aparecer en un evento no en todo lado) */}
                {showAdmin && (
                  <Col span={2} offset={3} data-target='navbarBasicExample'>
                    <span className='icon icon-menu' onClick={this.handleMenuEvent}>
                      <Button style={zIndex} onClick={this.showDrawer}>
                        {React.createElement(this.state.showEventMenu ? MenuUnfoldOutlined : MenuFoldOutlined, {
                          className: 'trigger',
                          onClick: this.toggle
                        })}
                      </Button>
                    </span>
                  </Col>
                )}
              </Row>

              {/* Items para la barra del menu */}

              {/* <Menu theme="light" mode="horizontal" defaultSelectedKeys={["3"]}>
                  <Menu.Item key="1">nav 1</Menu.Item>
                  <Menu.Item key="2">nav 2</Menu.Item>
                  <Menu.Item key="3">nav 3</Menu.Item>
                </Menu> */}

              {/* Dropdown de navegacion para el usuario  */}

              <UserStatusAndMenu
                isLoading={this.state.loader}
                user={this.state.user}
                menuOpen={this.state.menuOpen}
                loader={this.state.loader}
                photo={photo}
                name={name}
                eventId={this.state.id}
                logout={this.logout}
                openMenu={this.openMenu}
              />
            </Row>
          </Menu>
        </Header>

        {/* Menu mobile */}

        {showAdmin && showEventMenu && (
          <div id='navbarBasicExample' className={`${eventMenu ? 'is-active' : ''}`}>
            <Drawer
              zIndex={1000}
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
  error: state.categories.error
});

export default connect(mapStateToProps)(withRouter(Headers));
