import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import ErrorServe from '../components/modal/serverError';
import UserStatusAndMenu from '../components/shared/userStatusAndMenu';
import { connect } from 'react-redux';
import * as userActions from '../redux/user/actions';
import * as eventActions from '../redux/event/actions';
import MenuOld from '../components/events/shared/menu';
import {
  Menu,
  Drawer,
  Button,
  Col,
  Row,
  Layout,
  Space,
  Grid,
  Dropdown,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LockOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import withContext from '../context/withContext';
import ModalLoginHelpers from '../components/authentication/ModalLoginHelpers';
import { recordTypeForThisEvent } from '../components/events/Landing/helpers/thisRouteCanBeDisplayed';
import { FormattedMessage } from 'react-intl';
import AccountCircleIcon from '@2fd/ant-design-icons/lib/AccountCircle';
import { useIntl } from 'react-intl';

const { useBreakpoint } = Grid;

const { setEventData } = eventActions;
const { addLoginInformation, showMenu } = userActions;

const { Header } = Layout;
const zIndex = {
  zIndex: '1',
};
const initialDataGeneral = {
  selection: [],
  name: '',
  user: false,
  menuOpen: false,
  modal: false,
  create: false,
  valid: true,
  serverError: false,
  showAdmin: false,
  showEventMenu: false,
  tabEvtType: true,
  tabEvtCat: true,
  eventId: null,
  userEvent: null,
  modalVisible: false,
  tabModal: '1',
  anonimususer: false,
};

const Headers = (props) => {
  const { cUser, showMenu, loginInfo, cHelper, cEvent, cEventUser } = props;
  const { logout } = cHelper;
  const [headerIsLoading, setHeaderIsLoading] = useState(true);
  const [dataGeneral, setdataGeneral] = useState(initialDataGeneral);
  const [showButtons, setshowButtons] = useState({
    buttonregister: true,
    buttonlogin: true,
  });
  const [fixed, setFixed] = useState(false);
  const screens = useBreakpoint();
  const intl = useIntl();
  const openMenu = () => {
    setdataGeneral({
      ...dataGeneral,
      menuOpen: !dataGeneral.menuOpen,
      filterOpen: false,
    });
  };

  const handleMenuEvent = () => {
    setdataGeneral({
      ...dataGeneral,
      showEventMenu: !dataGeneral.showEventMenu,
    });
    showMenu();
  };

  const showDrawer = () => {
    setdataGeneral({ ...dataGeneral, showEventMenu: true });
  };

  const onClose = () => {
    setdataGeneral({ ...dataGeneral, showEventMenu: false });
  };

  async function LoadCurrentUser() {
    let { value, status } = cUser;

    if (!value && status === 'LOADED')
      return setHeaderIsLoading(false), setdataGeneral(initialDataGeneral);
    if (!value) return;

    setdataGeneral({
      name: value?.names || value?.name,
      userEvent: { ...value, properties: { names: value.names || value.name } },
      photo: value?.picture
        ? value?.picture
        : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      uid: value?.user?.uid,
      id: value?.user?._id,
      user: true,
      anonimususer: value?.isAnonymous || false,
    });
    setHeaderIsLoading(false);
    // }
  }

  const WhereHerePath = () => {
    let containtorganization = window.location.pathname.includes(
      '/organization'
    );
    return containtorganization ? 'organization' : 'landing';
  };

  const MenuMobile = (
    <Menu>
      <Menu.Item
        onClick={() => {
          cHelper.HandleControllerLoginVisible({
            visible: true,
            organization: WhereHerePath(),
          });

          cHelper.authModalDispatch({ type: 'showLogin' });
        }}
      >
        <FormattedMessage id='header.expired_signin' defaultMessage='Sign In' />
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          cHelper.HandleControllerLoginVisible({
            visible: true,
            organization: WhereHerePath(),
          });

          cHelper.authModalDispatch({ type: 'showRegister' });
        }}
      >
        <FormattedMessage
          id='registration.button.create'
          defaultMessage='Sign Up'
        />
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    LoadCurrentUser();
  }, [cUser?.value]);

  useEffect(() => {
    async function RenderButtonsForTypeEvent() {
      let typeEvent = recordTypeForThisEvent(cEvent);
      switch (typeEvent) {
        case 'PRIVATE_EVENT':
          setshowButtons({
            buttonregister: false,
            buttonlogin: true,
          });
          break;

        case 'PUBLIC_EVENT_WITH_REGISTRATION':
          setshowButtons({
            buttonregister: true,
            buttonlogin: true,
          });
          break;

        case 'UN_REGISTERED_PUBLIC_EVENT':
          setshowButtons({
            buttonregister: false,
            buttonlogin: false,
          });
          break;

        default:
          setshowButtons({
            buttonregister: true,
            buttonlogin: true,
          });
          break;
      }
    }

    if (cEvent?.value) {
      RenderButtonsForTypeEvent();
    }
  }, [cEvent]);

  useEffect(() => {
    const onScroll = (e) => {
      const showHeaderFixed = window.scrollY > 100;
      fixed != showHeaderFixed && setFixed(showHeaderFixed);
    };
    document.addEventListener('scroll', onScroll);
  }, [fixed]);

  return (
    <React.Fragment>
      <Header
        style={{
          position: fixed ? 'fixed' : 'relative',
          zIndex: 1,
          width: '100%',
          left: 0,
          top: 0,
          float: 'right',
          background: 'red',
          height: '45px',
          transition: 'all 0.5s ease-out',
          opacity: fixed ? '0.9' : '1',
        }}
      >
        <Menu theme='light' mode='horizontal'>
          <Row justify='space-between' align='middle'>
            <Row className='logo-header' justify='space-between' align='middle'>
              {/* Menú de administrar un evento (esto debería aparecer en un evento no en todo lado) */}
              {dataGeneral?.showAdmin && (
                <Col span={2} offset={3} data-target='navbarBasicExample'>
                  <span
                    className='icon icon-menu'
                    onClick={() => handleMenuEvent()}
                  >
                    <Button style={zIndex} onClick={() => showDrawer()}>
                      {React.createElement(
                        dataGeneral.showEventMenu
                          ? MenuUnfoldOutlined
                          : MenuFoldOutlined,
                        {
                          className: 'trigger',
                          onClick: () => {
                            console.log('CERRAR');
                          },
                        }
                      )}
                    </Button>
                  </span>
                </Col>
              )}
            </Row>

            {headerIsLoading ? (
              <LoadingOutlined
                style={{
                  fontSize: '30px',
                }}
              />
            ) : !dataGeneral.userEvent ? (
              screens.xs ? (
                <Space>
                  <Dropdown overlay={MenuMobile}>
                    <Button
                      style={{
                        backgroundColor: '#3681E3',
                        color: '#FFFFFF',
                        border: 'none',
                      }}
                      size='large'
                      shape='circle'
                      icon={<AccountCircleIcon style={{ fontSize: '28px' }} />}
                    />
                  </Dropdown>
                </Space>
              ) : (
                <Space>
                  {showButtons.buttonlogin ? (
                    <Button
                      icon={<LockOutlined />}
                      style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                      size='large'
                      onClick={() => {
                        cHelper.HandleControllerLoginVisible({
                          visible: true,
                          organization: WhereHerePath(),
                        });

                        cHelper.authModalDispatch({ type: 'showLogin' });
                      }}
                    >
                      {intl.formatMessage({
                        id: 'modal.title.login',
                        defaultMessage: 'Iniciar sesión',
                      })}
                    </Button>
                  ) : (
                    <Space>
                      <Dropdown overlay={MenuMobile}>
                        <Button
                          style={{
                            backgroundColor: '#3681E3',
                            color: '#FFFFFF',
                            border: 'none',
                          }}
                          size='large'
                          shape='circle'
                          icon={
                            <AccountCircleIcon style={{ fontSize: '28px' }} />
                          }
                        />
                      </Dropdown>
                    </Space>
                  )}

                  {showButtons.buttonregister && (
                    <Button
                      size='large'
                      onClick={() => {
                        cHelper.HandleControllerLoginVisible({
                          visible: true,
                          organization: WhereHerePath(),
                        });

                        cHelper.authModalDispatch({ type: 'showRegister' });
                      }}
                    >
                      {intl.formatMessage({
                        id: 'modal.title.register',
                        defaultMessage: 'Registrarme',
                      })}
                    </Button>
                  )}
                </Space>
              )
            ) : dataGeneral.userEvent != null && !dataGeneral.anonimususer ? (
              <UserStatusAndMenu
                user={dataGeneral.user}
                menuOpen={dataGeneral.menuOpen}
                photo={
                  dataGeneral.photo
                    ? dataGeneral.photo
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                }
                name={dataGeneral.name ? dataGeneral.name : ''}
                userEvent={dataGeneral.userEvent}
                eventId={dataGeneral.eventId}
                logout={(calback) => logout(calback)}
                openMenu={() => openMenu()}
                loginInfo={loginInfo}
              />
            ) : (
              dataGeneral.userEvent != null &&
              dataGeneral.anonimususer && (
                <UserStatusAndMenu
                  user={dataGeneral.user}
                  menuOpen={dataGeneral.menuOpen}
                  photo={
                    'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                  }
                  name={cUser.value?.names}
                  userEvent={dataGeneral.userEvent}
                  eventId={dataGeneral.eventId}
                  logout={(calback) => logout(calback)}
                  openMenu={() => console.log('openMenu')}
                  loginInfo={loginInfo}
                  anonimususer={true}
                />
              )
            )}

            {<ModalLoginHelpers organization={1} />}
          </Row>
        </Menu>
      </Header>

      {/* Menu mobile */}

      {dataGeneral.showAdmin && dataGeneral.showEventMenu && (
        <div id='navbarBasicExample'>
          <Drawer
            className='hiddenMenuMobile_Landing'
            title='Administrar evento'
            maskClosable={true}
            bodyStyle={{ padding: '0px' }}
            placement='left'
            closable={true}
            onClose={() => onClose()}
            visible={dataGeneral.showEventMenu}
          >
            <MenuOld match={window.location.pathname} />
          </Drawer>
        </div>
      )}

      {dataGeneral.serverError && <ErrorServe errorData={errorData} />}
    </React.Fragment>
  );
};

const mapStateToProps = (state) => ({
  categories: state.categories.items,
  types: state.types.items,
  loginInfo: state.user.data,
  eventMenu: state.user.menu,
  permissions: state.permissions,
  error: state.categories.error,
  event: state.event.data,
  modalVisible: state.stage.modal,
});

const mapDispatchToProps = {
  setEventData,
  addLoginInformation,
  showMenu,
};

let HeaderWithContext = withContext(withRouter(Headers));
export default connect(mapStateToProps, mapDispatchToProps)(HeaderWithContext);
