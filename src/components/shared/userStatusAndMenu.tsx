import { CSSProperties, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import WithLoading from "./withLoading";
import {
  Menu,
  Dropdown,
  Avatar,
  Button,
  Col,
  Row,
  Space,
  Badge,
  Modal,
  Typography,
} from "antd";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useHistory, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { setViewPerfil } from "../../redux/viewPerfil/actions";
import withContext from "../../context/withContext";
import TicketConfirmationOutlineIcon from "@2fd/ant-design-icons/lib/TicketConfirmationOutline";
import AccountOutlineIcon from "@2fd/ant-design-icons/lib/AccountOutline";
import BadgeAccountOutlineIcon from "@2fd/ant-design-icons/lib/BadgeAccountOutline";
import CalendarCheckOutlineIcon from "@2fd/ant-design-icons/lib/CalendarCheckOutline";
import HexagonMultipleOutlineIcon from "@2fd/ant-design-icons/lib/HexagonMultipleOutline";
import LogoutIcon from "@2fd/ant-design-icons/lib/Logout";
import { getCorrectColor } from "@/helpers/utils";
import { UseEventContext } from "@/context/eventContext";
const MenuStyle: CSSProperties = {
  flex: 1,
  textAlign: "right",
};

const ItemStyle: CSSProperties = {
  backgroundColor: "white",
  minWidth: 150,
  padding: 5,
  margin: 5,
};
const { confirm, destroyAll } = Modal;

const UserStatusAndMenu = (props: any) => {
  let { cEventUser } = props;
  let user = props.user;
  let photo = props.photo;
  let name = props.name;
  let logout = props.logout;
  let colorHeader = props.colorHeader;
  const [visible, setVisible] = useState(true);
  const intl = useIntl();
  const eventContext = UseEventContext();
  const eventId = eventContext.value?._id;
  const history = useHistory();

  function linkToTheMenuRouteS(menuRoute: any) {
    window.location.href = `${window.location.origin}${menuRoute}`;
  }
  useEffect(() => {
    // console.log('first',  eventId)
    // console.log('first',  eventId == '64074725abdc1ea2c80b5062')
    if (eventId && eventId === "64074725abdc1ea2c80b5062") setVisible(false);
  }, [eventId]);

  let menu = !props.anonimususer ? (
    <Menu>
      {props.location.pathname.includes("landing") &&
        cEventUser.value &&
        cEventUser.status === "LOADED" && (
          <Menu.ItemGroup
            key="user-status-menu-item-group-1"
            title={
              <>
                {intl.formatMessage({
                  id: "header.title.Event",
                  defaultMessage: "Evento",
                })}
              </>
            }
          >
            {props.location.pathname.includes("landing") &&
              cEventUser.value &&
              cEventUser.status === "LOADED" && (
                <Badge
                  count={intl.formatMessage({
                    id: "header.new",
                    defaultMessage: "Nuevo",
                  })}
                >
                  <Menu.Item
                    key="user-status-menu-item-group-1-menu-item-1"
                    onClick={() => {
                      props.setViewPerfil({
                        view: true,
                        perfil: {
                          _id: props.userEvent?._id,
                          properties: props.userEvent,
                        },
                      });
                    }}
                    icon={
                      <BadgeAccountOutlineIcon style={{ fontSize: "18px" }} />
                    }
                  >
                    <FormattedMessage
                      id="header.my_data_event"
                      defaultMessage="Mi perfil en el evento"
                    />
                  </Menu.Item>
                </Badge>
              )}
          </Menu.ItemGroup>
        )}
      {visible && props?.userEvent?.is_admin && (
        <Menu.ItemGroup
          key="user-status-menu-item-group-2"
          title={intl.formatMessage({
            id: "header.title.Management",
            defaultMessage: "Administración",
          })}
        >
          {visible && (
            <Menu.Item
              key="user-status-menu-item-group-2-menu-item-1"
              icon={
                <TicketConfirmationOutlineIcon style={{ fontSize: "18px" }} />
              }
              onClick={() => linkToTheMenuRouteS(`/myprofile/tickets`)}
            >
              <FormattedMessage
                id="header.my_tickets"
                defaultMessage="Mis Tiquetes"
              />
            </Menu.Item>
          )}
          {visible && (
            <Menu.Item
              key="user-status-menu-item-group-2-menu-item-2"
              icon={<CalendarCheckOutlineIcon style={{ fontSize: "18px" }} />}
              onClick={() => linkToTheMenuRouteS(`/myprofile/events`)}
            >
              <FormattedMessage
                id="header.my_events"
                defaultMessage="Mis eventos"
              />
            </Menu.Item>
          )}
          {visible && (
            <Menu.Item
              key="user-status-menu-item-group-2-menu-item-3"
              icon={<HexagonMultipleOutlineIcon style={{ fontSize: "18px" }} />}
              onClick={() => {
                linkToTheMenuRouteS(`/myprofile/organization`);
              }}
            >
              <FormattedMessage
                id="header.my_organizations"
                defaultMessage="Administrar Mis Eventos"
              />
            </Menu.Item>
          )}
          <Menu.Divider />
          {visible && (
            <Menu.Item
              key="user-status-menu-item-group-2-menu-item-4"
              onClick={() =>
                linkToTheMenuRouteS(
                  window.location.toString().includes("admin/organization")
                    ? `/create-event/${props.userEvent._id}/?orgId=${
                        window.location.pathname.split("/")[3]
                      }`
                    : window.location.toString().includes("organization") &&
                      !window.location.toString().includes("myprofile")
                    ? `/create-event/${props.userEvent._id}/?orgId=${props.eventId}`
                    : `/create-event/${props.userEvent._id}`
                )
              }
            >
              <Button block type="primary" size="middle">
                <FormattedMessage
                  id="header.create_event"
                  defaultMessage="Crear Evento"
                />
              </Button>
            </Menu.Item>
          )}
        </Menu.ItemGroup>
      )}

      <Menu.ItemGroup
        key="user-status-menu-item-group-3"
        title={intl.formatMessage({
          id: "header.title.User",
          defaultMessage: "Usuario",
        })}
      >
        {visible && (
          <Badge
            count={intl.formatMessage({
              id: "header.new",
              defaultMessage: "Nuevo",
            })}
          >
            <Menu.Item
              key="user-status-menu-item-group-3-menu-item-1"
              icon={<AccountOutlineIcon style={{ fontSize: "18px" }} />}
              onClick={() => linkToTheMenuRouteS(`/myprofile`)}
            >
              <FormattedMessage
                id="header.profile"
                defaultMessage="Cuenta de usuario"
              />
            </Menu.Item>
          </Badge>
        )}

        <Menu.Item
          key="user-status-menu-item-group-3-menu-item-2"
          danger
          icon={<LogoutIcon style={{ fontSize: "18px" }} />}
          onClick={() => {
            showPropsConfirm();
          }}
        >
          <FormattedMessage id="header.logout" defaultMessage="Salir" />
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  ) : (
    <Menu>
      {!props.anonimususer ? (
        <Menu.Item
          key="user-status-menu-item-1-anonimususer"
          style={ItemStyle}
        >{`Bienvenido ${props.cUser?.value?.names}`}</Menu.Item>
      ) : (
        <Menu.Item
          key="user-status-menu-item-2-anonimususer"
          danger
          icon={<LogoutIcon style={{ fontSize: "18px" }} />}
          onClick={() => showPropsConfirm()}
        >
          <FormattedMessage id="header.logout" defaultMessage="Salir" />
        </Menu.Item>
      )}
    </Menu>
  );

  let loggedOutUser = <div style={MenuStyle}></div>;

  let loggedInuser = (
    <Row style={MenuStyle}>
      <Col style={MenuStyle}>
        <Dropdown
          arrow
          overlay={menu}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Space
            className="shadowHover"
            style={{
              height: "50px",
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "15px",
              backdropFilter: "blur(8px)",
              background: "#FFFFFF4D",
            }}
          >
            {photo ? (
              <Avatar shape="square" src={photo} />
            ) : (
              <Avatar shape="square" className="avatar_menu-user">
                {name && name.charAt(0).toUpperCase()}
                {name &&
                  name.substring(name.indexOf(" ") + 1, name.indexOf(" ") + 2)}
              </Avatar>
            )}
            <Typography.Text
              style={{ color: getCorrectColor(colorHeader) }}
              className="name_menu-user"
            >
              {name}
            </Typography.Text>
            <DownOutlined
              style={{ fontSize: "12px", color: getCorrectColor(colorHeader) }}
            />
          </Space>
        </Dropdown>
      </Col>
    </Row>
  );

  async function showPropsConfirm() {
    confirm({
      centered: true,
      title: intl.formatMessage({
        id: "header.confirm.title",
        defaultMessage: "¿Estás seguro de que quieres cerrar la sesión?",
      }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({
        id: "header.confirm.content",
        defaultMessage:
          "Estás a punto de cerrar la sesión. No podrás visualizar tu contenido hasta que vuelvas a iniciar la sesión nuevamente.",
      }),
      okText: intl.formatMessage({
        id: "header.confirm.okText",
        defaultMessage: "Si, cerrar la sesión",
      }),
      okType: "danger",
      cancelText: intl.formatMessage({
        id: "header.confirm.cancelText",
        defaultMessage: "Cancelar",
      }),
      onOk() {
        logout(false);
        destroyAll();
        window.sessionStorage.removeItem("session");
        if (props.cEvent.value.redirect_landing) {
          history.replace(`/landing/${props?.cEvent?.value?._id}`);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  return <>{user ? loggedInuser : loggedOutUser}</>;
};

const mapDispatchToProps = {
  setViewPerfil,
};
let UserStatusAndMenuWithContext = withContext(UserStatusAndMenu);
export default connect(
  null,
  mapDispatchToProps
)(WithLoading(withRouter(UserStatusAndMenuWithContext)));
