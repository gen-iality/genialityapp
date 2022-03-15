import React, { useContext } from "react";
import { Badge, Col, Menu, Row, Space } from "antd";
import { useRouteMatch, Link } from "react-router-dom";
import * as iconComponents from "@ant-design/icons";
import { stylesMenuItems } from "../helpers/csshelpers";
import { UseEventContext } from "../../../../context/eventContext";
import { HelperContext } from "../../../../context/HelperContext";
import { setSectionPermissions } from "../../../../redux/sectionPermissions/actions";
import { connect } from "react-redux";

const MenuEvent = ({ isMobile }) => {
  let { url } = useRouteMatch();
  let cEvent = UseEventContext();
  let { totalsolicitudes, eventPrivate } = useContext(HelperContext);
  let event = cEvent.value;

  return (
    <>
      {!isMobile ? (
        <Menu style={stylesMenuItems} mode="inline" defaultSelectedKeys={["1"]}>
          {event.itemsMenu &&
            !eventPrivate.private &&
            Object.keys(event.itemsMenu).map((key) => {
              //icono personalizado
              if (!event.itemsMenu[key].name || !event.itemsMenu[key].section) {
                return <></>;
              }

              let IconoComponente = iconComponents[event.itemsMenu[key].icon];

              return key == "networking" ? (
                <Menu.Item
                  style={{ position: "relative", color: event.styles.textMenu }}
                  key={event.itemsMenu[key].section}
                  className="MenuItem_event"
                >
                  <Badge
                    key={event.itemsMenu[key].section}
                    count={totalsolicitudes}
                  >
                    <Col key={event.itemsMenu[key].section}>
                      <Row key={event.itemsMenu[key].section}>
                        <IconoComponente
                          style={{
                            margin: "0 auto",
                            fontSize: "22px",
                            color: event.styles.textMenu,
                          }}
                        />{" "}
                      </Row>
                      <Row key={event.itemsMenu[key].section}>
                        <Link
                          className="menuEvent_section-text"
                          style={{ color: event.styles.textMenu }}
                          to={`${url}/${event.itemsMenu[key].section}`}
                        >
                          {` ${event.itemsMenu[key].name}`}
                        </Link>
                      </Row>
                    </Col>
                  </Badge>
                </Menu.Item>
              ) : (
                key !== "networking" && (
                  <>
                    <Menu.Item
                      key={event.itemsMenu[key].section}
                      className="MenuItem_event"
                    >
                      <IconoComponente
                        style={{
                          fontSize: "22px",
                          display: "flex",
                          alignItems: "center",
                          color: event.styles.textMenu,
                          justifyContent: "center",
                        }}
                      />
                      <Link
                        style={{ color: event.styles.textMenu }}
                        to={`${url}/${event.itemsMenu[key].section}`}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: event.styles.textMenu,
                            justifyContent: "center",
                          }}
                        >
                          {" "}
                          {` ${event.itemsMenu[key].name}`}
                        </span>
                      </Link>
                    </Menu.Item>
                  </>
                )
              );
            })}
        </Menu>
      ) : (
        isMobile &&
        !eventPrivate.private && (
          <Menu
            style={stylesMenuItems}
            mode="vertical"
            defaultSelectedKeys={["1"]}
          >
            {event.itemsMenu &&
              Object.keys(event.itemsMenu).map((key) => {
                //icono personalizado
                let IconoComponente = iconComponents[event.itemsMenu[key].icon];
                if (
                  !event.itemsMenu[key].name ||
                  !event.itemsMenu[key].section
                ) {
                  return <></>;
                }

                return (
                  <Menu.Item
                    style={{
                      position: "relative",
                      color: event.styles.textMenu,
                    }}
                    key={event.itemsMenu[key].section}
                    className="MenuItem_event"
                  >
                    <IconoComponente
                      style={{
                        margin: "0 auto",
                        fontSize: "22px",
                        color: event.styles.textMenu,
                      }}
                    />

                    <Link
                      className="menuEvent_section-text"
                      style={{ color: event.styles.textMenu }}
                      to={`${url}/${event.itemsMenu[key].section}`}
                    >
                      {` ${event.itemsMenu[key].name}`}
                    </Link>
                  </Menu.Item>
                );
              })}
          </Menu>
        )
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  sectionPermissions: state.viewSectionPermissions,
});

const mapDispatchToProps = {
  setSectionPermissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(MenuEvent);
