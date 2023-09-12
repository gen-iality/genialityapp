/** React's libraries */
import { useEffect, useState, createElement, FunctionComponent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { useIntl } from 'react-intl'

/** Redux imports */
import { connect } from 'react-redux'
import * as userActions from '../redux/user/actions'
import * as eventActions from '../redux/event/actions'

/** Antd imports */
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
  Popover,
} from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LockOutlined,
  LoadingOutlined,
} from '@ant-design/icons'
import AccountCircleIcon from '@2fd/ant-design-icons/lib/AccountCircle'

/** Context */
import withContext, { WithEviusContextProps } from '@context/withContext'

/** Components */
import ModalLoginHelpers from '@components/authentication/ModalLoginHelpers'
import MenuOld from '@components/events/shared/menu'
import { recordTypeForThisEvent } from '@components/events/Landing/helpers/thisRouteCanBeDisplayed'
import ErrorServe from '@components/modal/serverError'
import UserStatusAndMenu from '@components/shared/userStatusAndMenu'
import { OrganizationFuction } from '@helpers/request'

const { useBreakpoint } = Grid

const { setEventData } = eventActions
const { addLoginInformation, showMenu } = userActions

const { Header } = Layout
const zIndex = {
  zIndex: '1',
}
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
}

type MapStateToProps = {
  categories: any
  types: any
  loginInfo: any
  eventMenu: any
  permissions: any
  error: any
  event: any
  modalVisible: any
}

const mapDispatchToProps = {
  setEventData,
  addLoginInformation,
  showMenu,
}

type IHeaderContainerProps = WithEviusContextProps<
  MapStateToProps & typeof mapDispatchToProps
>

const HeaderContainer: FunctionComponent<IHeaderContainerProps> = (props) => {
  const { showMenu, loginInfo, cHelper, cEvent, cEventUser, cUser } = props
  const { helperDispatch } = cHelper

  const [headerIsLoading, setHeaderIsLoading] = useState(true)
  const [dataGeneral, setDataGeneral] = useState<any>(initialDataGeneral)
  const [showButtons, setShowButtons] = useState({
    buttonregister: true,
    buttonlogin: true,
  })
  const [fixed, setFixed] = useState(false)
  const screens = useBreakpoint()
  const navigate = useNavigate()
  const intl = useIntl()

  // We use this to know the default position
  const [currentOrganization, setCurrentOrganization] = useState<any>(null)
  const params = useParams<{ id?: string }>()
  const orgId = params.id

  const openMenu = () => {
    setDataGeneral({
      ...dataGeneral,
      menuOpen: !dataGeneral.menuOpen,
      filterOpen: false,
    })
  }

  const handleMenuEvent = () => {
    setDataGeneral({
      ...dataGeneral,
      showEventMenu: !dataGeneral.showEventMenu,
    })
    showMenu()
  }

  const showDrawer = () => {
    setDataGeneral({ ...dataGeneral, showEventMenu: true })
  }

  const onClose = () => {
    setDataGeneral({ ...dataGeneral, showEventMenu: false })
  }

  const LoadCurrentUser = async () => {
    const { value, status } = cUser

    if (!value && status === 'LOADED')
      return setHeaderIsLoading(false), setDataGeneral(initialDataGeneral)
    if (!value) return

    setDataGeneral({
      name: value?.names || value?.name,
      userEvent: { ...value, properties: { names: value.names || value.name } },
      photo:
        value.picture ??
        'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      uid: value.user?.uid,
      id: value.user?._id,
      user: true,
      anonimususer: value?.isAnonymous || false,
    })
    setHeaderIsLoading(false)
  }

  const WhereHerePath = () => {
    const containtorganization = window.location.pathname.includes('/organization')
    if (containtorganization) {
      OrganizationFuction.obtenerDatosOrganizacion(orgId).then((_organization) => {
        setCurrentOrganization(_organization)
      })
    }
    return containtorganization ? 'organization' : 'landing'
  }

  useEffect(() => {
    if (!orgId) return

    WhereHerePath()
  }, [orgId])

  const userLogOut = (callBack: any) => {
    const params = {
      user: cUser.value,
      // TODO: replace setCurrentUser too
      setCurrentUser: cUser.setCurrentUser,
      resetEventUser: cEventUser.resetEventUser,
      formatMessage: intl.formatMessage,
      handleChangeTypeModal: cHelper.handleChangeTypeModal,
      history: navigate,
    }

    helperDispatch({
      type: 'logout',
      showNotification: callBack,
      params,
    })
  }

  const MenuMobile = (
    <Menu>
      <Menu.Item
        onClick={() => {
          helperDispatch({
            type: 'showLogin',
            visible: true,
            organization: WhereHerePath(),
          })
        }}
      >
        <FormattedMessage id="header.expired_signin" defaultMessage="Sign In" />
      </Menu.Item>

      <Menu.Item
        onClick={() => {
          helperDispatch({
            type: 'showRegister',
            visible: true,
            organization: WhereHerePath(),
          })
        }}
      >
        <FormattedMessage id="registration.button.create" defaultMessage="Sign Up" />
      </Menu.Item>
    </Menu>
  )

  useEffect(() => {
    LoadCurrentUser()
  }, [cUser?.value])

  const RenderButtonsForTypeEvent = async () => {
    const typeEvent = recordTypeForThisEvent(cEvent)
    switch (typeEvent) {
      case 'PRIVATE_EVENT':
        setShowButtons({
          buttonregister: false,
          buttonlogin: true,
        })
        break

      case 'PUBLIC_EVENT_WITH_REGISTRATION':
        setShowButtons({
          buttonregister: true,
          buttonlogin: true,
        })
        break

      case 'PUBLIC_EVENT_WITH_REGISTRATION_ANONYMOUS':
        setShowButtons({
          buttonregister: true,
          buttonlogin: true,
        })
        break

      default:
        setShowButtons({
          buttonregister: true,
          buttonlogin: true,
        })
        break
    }
  }

  useEffect(() => {
    if (cEvent?.value) {
      RenderButtonsForTypeEvent()
    }
  }, [cEvent])

  useEffect(() => {
    const onScroll = (e: any) => {
      const showHeaderFixed = window.scrollY > 64
      fixed != showHeaderFixed && setFixed(showHeaderFixed)
    }
    document.addEventListener('scroll', onScroll)
  }, [fixed])

  return (
    <>
      <Header
        style={{
          position: 'sticky',
          zIndex: 1,
          width: '100%',
          left: 0,
          top: 0,
          float: 'right',
          height: '45px',
          transition: 'all 0.5s ease-out',
          opacity: fixed ? '0.9' : '1',
        }}
      >
        <Menu style={{ border: '0px' }} theme="light" mode="horizontal">
          <Row justify="end" align="middle">
            <Row className="logo-header" justify="space-between" align="middle">
              {/* Menú de administrar un curso (esto debería aparecer en un curso no en todo lado) */}
              {dataGeneral?.showAdmin && (
                <Col span={2} offset={3} data-target="navbarBasicExample">
                  <span className="icon icon-menu" onClick={() => handleMenuEvent()}>
                    <Button style={zIndex} onClick={() => showDrawer()}>
                      {createElement(
                        dataGeneral.showEventMenu ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                          className: 'trigger',
                          onClick: () => {
                            console.log('CERRAR')
                          },
                        },
                      )}
                    </Button>
                  </span>
                </Col>
              )}
            </Row>

            {headerIsLoading && (
              <LoadingOutlined
                style={{
                  fontSize: '30px',
                }}
              />
            )}

            {!headerIsLoading && (
              <>
                {!dataGeneral.userEvent ? (
                  screens.xs ? (
                    <Space>
                      <Dropdown overlay={MenuMobile}>
                        <Button
                          style={{
                            backgroundColor: '#3681E3',
                            color: '#FFFFFF',
                            border: 'none',
                          }}
                          size="large"
                          shape="circle"
                          icon={<AccountCircleIcon style={{ fontSize: '28px' }} />}
                        />
                      </Dropdown>
                    </Space>
                  ) : (
                    <Space>
                      {showButtons.buttonlogin ? (
                        <Button
                          data-testid="btn-login"
                          icon={<LockOutlined />}
                          style={{ backgroundColor: '#52C41A', color: '#FFFFFF' }}
                          size="large"
                          onClick={() => {
                            helperDispatch({
                              type: 'showLogin',
                              visible: true,
                              organization: WhereHerePath(),
                            })
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
                              size="large"
                              shape="circle"
                              icon={<AccountCircleIcon style={{ fontSize: '28px' }} />}
                            />
                          </Dropdown>
                        </Space>
                      )}

                      {showButtons.buttonregister && (
                        <Button
                          size="large"
                          onClick={() => {
                            helperDispatch({
                              type: 'showRegister',
                              visible: true,
                              organization: WhereHerePath(),
                              defaultPositionId: currentOrganization?.default_position_id,
                            })
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
                      dataGeneral.photo ??
                      'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
                    }
                    name={dataGeneral.name ? dataGeneral.name : ''}
                    userEvent={dataGeneral.userEvent}
                    eventId={dataGeneral.eventId}
                    logout={(callBack: any) => userLogOut(callBack)}
                    openMenu={() => openMenu()}
                    loginInfo={loginInfo}
                  />
                ) : (
                  dataGeneral.userEvent != null &&
                  dataGeneral.anonimususer && (
                    <UserStatusAndMenu
                      user={dataGeneral.user}
                      menuOpen={dataGeneral.menuOpen}
                      photo="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                      name={cUser.value?.names}
                      userEvent={dataGeneral.userEvent}
                      eventId={dataGeneral.eventId}
                      logout={(callBack: any) => userLogOut(callBack)}
                      openMenu={() => console.log('openMenu')}
                      loginInfo={loginInfo}
                      anonimususer
                    />
                  )
                )}
                {<ModalLoginHelpers organization={1} />}
                {((currentOrganization?.public_help_message as string) ?? '').trim() && (
                  <div
                    style={{ cursor: 'help', marginLeft: '1rem' }}
                    role="button"
                    aria-label="información de contacto de soporte"
                  >
                    <Popover
                      content={currentOrganization?.public_help_message}
                      title="Ayuda"
                    >
                      <QuestionCircleOutlined />
                    </Popover>
                  </div>
                )}
              </>
            )}
          </Row>
        </Menu>
      </Header>

      {/* Menu mobile */}

      {dataGeneral.showAdmin && dataGeneral.showEventMenu && (
        <div id="navbarBasicExample">
          <Drawer
            className="hiddenMenuMobile_Landing"
            title="Administrar curso"
            maskClosable
            bodyStyle={{ padding: '0px' }}
            placement="left"
            closable
            onClose={() => onClose()}
            open={dataGeneral.showEventMenu}
          >
            <MenuOld match={window.location.pathname} />
          </Drawer>
        </div>
      )}

      {/* {dataGeneral.serverError && <ErrorServe errorData={errorData} />} */}
      {/* where is errorData?, I think that it was `dataGeneral.serverError` */}
      {dataGeneral.serverError && <ErrorServe errorData={dataGeneral.serverError} />}
    </>
  )
}

const mapStateToProps = (state: any) => ({
  categories: state.categories.items,
  types: state.types.items,
  loginInfo: state.user.data,
  eventMenu: state.user.menu,
  permissions: state.permissions,
  error: state.categories.error,
  event: state.event.data,
  modalVisible: state.stage.modal,
})

const HeaderWithContext = withContext(HeaderContainer)
export default connect(mapStateToProps, mapDispatchToProps)(HeaderWithContext)
