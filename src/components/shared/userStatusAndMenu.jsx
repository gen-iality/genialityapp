/** React's libraries */
import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

/** Redux imports */
import { connect } from 'react-redux';
import { setViewPerfil } from '../../redux/viewPerfil/actions';

/** Antd imports */
import { Menu, Dropdown, Avatar, Button, Col, Row, Space, Badge, Modal, Image, Grid, Typography } from 'antd';
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import TicketConfirmationOutlineIcon from '@2fd/ant-design-icons/lib/TicketConfirmationOutline';
import AccountOutlineIcon from '@2fd/ant-design-icons/lib/AccountOutline';
import BadgeAccountOutlineIcon from '@2fd/ant-design-icons/lib/BadgeAccountOutline';
import CalendarCheckOutlineIcon from '@2fd/ant-design-icons/lib/CalendarCheckOutline';
import HexagonMultipleOutlineIcon from '@2fd/ant-design-icons/lib/HexagonMultipleOutline';
import LogoutIcon from '@2fd/ant-design-icons/lib/Logout';

/** Helpers and utils */
import { OrganizationApi } from '@helpers/request';

/** Context */
import withContext from '@context/withContext';

/** Components */
import WithLoading from './withLoading';

const MenuStyle = {
  flex: 1,
  textAlign: 'right',
};

const ItemStyle = {
  backgroundColor: 'white',
  minWidth: 150,
  padding: 5,
  margin: 5,
};
const { confirm, destroyAll } = Modal;
const { useBreakpoint } = Grid;
const { Text } = Typography;

const UserStatusAndMenu = (props) => {
  const { cEventUser } = props;
  const user = props.user;
  const photo = props.photo;
  const name = props.name;
  const logout = props.logout;
  const organizationId = props.match.params.id;

  const [visible, setVisible] = useState(true);
  const [isSomeAdminUser, setIsSomeAdminUser] = useState(false);
  const [isAtOrganizationLanding, setIsAtOrganizationLanding] = useState(false);
  const [organization, setOrganization] = useState({});

  const intl = useIntl();
  const screens = useBreakpoint();

  function linkToTheMenuRouteS(menuRoute) {
    window.location.href = `${window.location.origin}${menuRoute}`;
  }

  useEffect(() => {
    OrganizationApi.mine().then((data) => {
      const someAdmin = data.some((orgUser) => orgUser.rol?.type === 'admin');
      console.log('organization user has some admin rol?', someAdmin);
      setIsSomeAdminUser(someAdmin);
    });
  }, []);

  useEffect(() => {
    OrganizationApi.getOne(organizationId).then((response) => {
      console.log('response', response);
      setOrganization(response);
    });
  }, []);

  useEffect(() => {
    // Why do I have to do that bro
    const path = props.match?.path || '';
    if (path.startsWith('/organization') && path.endsWith('/events')) {
      setIsAtOrganizationLanding(true);
    } else {
      setIsAtOrganizationLanding(false);
    }
  }, [props.match]);

  const menu = !props.anonimususer ? (
    <Menu>
      {props.location.pathname.includes('landing') && cEventUser.value && cEventUser.status === 'LOADED' && (
        <Menu.ItemGroup
          title={intl.formatMessage({
            id: 'header.title.Event',
            defaultMessage: 'Curso',
          })}
        >
          {props.location.pathname.includes('landing') && cEventUser.value && cEventUser.status === 'LOADED' && (
            <Badge
              count={intl.formatMessage({
                id: 'header.new',
                defaultMessage: 'Nuevo',
              })}
            >
              <Menu.Item
                onClick={() => {
                  props.setViewPerfil({
                    view: true,
                    perfil: {
                      _id: props.userEvent?._id,
                      properties: props.userEvent,
                    },
                  });
                }}
                icon={<BadgeAccountOutlineIcon style={{ fontSize: '18px' }} />}
              >
                <FormattedMessage id="header.my_data_event" defaultMessage="Mi perfil en el curso" />
              </Menu.Item>
            </Badge>
          )}
        </Menu.ItemGroup>
      )}
      <Menu.ItemGroup
        title={intl.formatMessage({
          id: 'header.title.Management',
          defaultMessage: 'Administración',
        })}
      >
        {visible && (
          <Menu.Item
            icon={<TicketConfirmationOutlineIcon style={{ fontSize: '18px' }} />}
            onClick={() => linkToTheMenuRouteS(`/myprofile/tickets`)}
          >
            <FormattedMessage
              id={import.meta.env.VITE_HEADER_MENU_FIRST_ITEM_MANAGEMENT}
              defaultMessage={import.meta.env.VITE_HEADER_MENU_FIRST_ITEM_DEFAULT_MESSAGE_MANAGEMENT}
            />
          </Menu.Item>
        )}
        {visible && !isAtOrganizationLanding && (
          <Menu.Item
            icon={<CalendarCheckOutlineIcon style={{ fontSize: '18px' }} />}
            onClick={() => linkToTheMenuRouteS(`/myprofile/events`)}
          >
            <FormattedMessage
              id={import.meta.env.VITE_HEADER_MENU_SECOND_ITEM_MANAGEMENT}
              defaultMessage={import.meta.env.VITE_HEADER_MENU_SECOND_ITEM_DEFAULT_MESSAGE_MANAGEMENT}
            />
          </Menu.Item>
        )}
        {((visible && isSomeAdminUser) || (visible && !isAtOrganizationLanding)) && (
          <Menu.Item
            icon={<HexagonMultipleOutlineIcon style={{ fontSize: '18px' }} />}
            onClick={() => {
              linkToTheMenuRouteS(`/myprofile/organization`);
            }}
          >
            <FormattedMessage id="header.my_organizations" defaultMessage="Administrar mis cursos" />
          </Menu.Item>
        )}
        <Menu.Divider />
        {visible && (
          <Menu.Item
            onClick={() =>
              linkToTheMenuRouteS(
                window.location.toString().includes('admin/organization')
                  ? `/create-event/${props.userEvent._id}/?orgId=${window.location.pathname.split('/')[3]}`
                  : window.location.toString().includes('organization') &&
                    !window.location.toString().includes('myprofile')
                  ? `/create-event/${props.userEvent._id}/?orgId=${props.eventId}`
                  : `/create-event/${props.userEvent._id}`,
              )
            }
          >
            <Button block type="primary" size="medium">
              <FormattedMessage id="header.create_event" defaultMessage="Crear curso" />
            </Button>
          </Menu.Item>
        )}
      </Menu.ItemGroup>

      <Menu.ItemGroup
        title={intl.formatMessage({
          id: 'header.title.User',
          defaultMessage: 'Usuario',
        })}
      >
        <Badge
          count={intl.formatMessage({
            id: 'header.new',
            defaultMessage: 'Nuevo',
          })}
        >
          <Menu.Item
            icon={<AccountOutlineIcon style={{ fontSize: '18px' }} />}
            onClick={() => linkToTheMenuRouteS(`/myprofile`)}
          >
            <FormattedMessage id="header.profile" defaultMessage="Cuenta de usuario" />
          </Menu.Item>
        </Badge>

        <Menu.Item danger icon={<LogoutIcon style={{ fontSize: '18px' }} />} onClick={() => showPropsConfirm()}>
          <FormattedMessage id="header.logout" defaultMessage="Salir" />
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  ) : (
    <Menu>
      {!props.anonimususer ? (
        <Menu.Item style={ItemStyle}>{`Bienvenido ${props.cUser?.value?.names}`}</Menu.Item>
      ) : (
        <Menu.Item danger icon={<LogoutIcon style={{ fontSize: '18px' }} />} onClick={() => showPropsConfirm()}>
          <FormattedMessage id="header.logout" defaultMessage="Salir" />
        </Menu.Item>
      )}
    </Menu>
  );

  const loggedOutUser = <div style={MenuStyle}></div>;

  const loggedInuser = (
    <Row style={MenuStyle}>
      <Col style={MenuStyle}>
        <Dropdown arrow overlay={menu} placement="bottomRight">
          <a onClick={(e) => e.preventDefault()}>
            <Space
              className="shadowHover"
              style={{
                height: '40px',
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid #e8e8e8',
                background: '#f5f5f5',
              }}
            >
              {photo ? (
                <Avatar src={photo} />
              ) : (
                <Avatar className="avatar_menu-user">
                  {name && name.charAt(0).toUpperCase()}
                  {name && name.substring(name.indexOf(' ') + 1, name.indexOf(' ') + 2)}
                </Avatar>
              )}
              <span className="name_menu-user">{name}</span>
              <DownOutlined style={{ fontSize: '12px' }} />
            </Space>
          </a>
        </Dropdown>
      </Col>
    </Row>
  );

  function showPropsConfirm() {
    confirm({
      centered: true,
      title: intl.formatMessage({
        id: 'header.confirm.title',
        defaultMessage: '¿Estás seguro de que quieres cerrar la sesión?',
      }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({
        id: 'header.confirm.content',
        defaultMessage: 'Si cierra la sesión, algunas de las funciones del sitio web quedarán desactivadas.',
      }),
      okText: intl.formatMessage({
        id: 'header.confirm.okText',
        defaultMessage: 'Si, cerrar la sesión',
      }),
      okType: 'danger',
      cancelText: intl.formatMessage({
        id: 'header.confirm.cancelText',
        defaultMessage: 'Cancelar',
      }),
      onOk() {
        /* Sending a boolean to the backend to know if the logout is manual or not. */
        logout(false);
        destroyAll();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <>
      {user ? (
        <>
          {isAtOrganizationLanding && !screens.xs && (
            <>
              <Col>
                <Image
                  style={{
                    height: '50px',
                    borderRadius: '10px',
                    boxShadow: '2px 2px 10px 1px rgba(0,0,0,0.25)',
                    backgroundColor: '#FFFFFF',
                  }}
                  src={organization?.styles?.event_image || 'error'}
                  fallback="http://via.placeholder.com/500/F5F5F7/CCCCCC?text=No%20Image"
                />
              </Col>
              <Col style={{ marginLeft: '2rem' }}>
                <Text style={{ fontWeight: '700' }}>{organization.name}</Text>
              </Col>
            </>
          )}
          {loggedInuser}
        </>
      ) : (
        loggedOutUser
      )}
    </>
  );
};

const mapDispatchToProps = {
  setViewPerfil,
};

const UserStatusAndMenuWithContext = withContext(UserStatusAndMenu);
export default connect(null, mapDispatchToProps)(WithLoading(withRouter(UserStatusAndMenuWithContext)));
