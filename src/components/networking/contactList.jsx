import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider } from "antd";

import * as Cookie from "js-cookie";
import { userRequest, getCurrentUserId } from "./services";

export default ({ eventId }) => {
  const [contactsList, setContactsList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getuserContactList = async () => {
    let response = await getCurrentUserId(Cookie.get("evius_token"));
    setCurrentUserId(response);
  };

  useEffect(() => {
    getuserContactList();
  }, [eventId]);

  if (currentUserId)
    return currentUserId == "guestUser" ? (
      <Col xs={22} sm={22} md={15} lg={15} xl={15} style={{ margin: "0 auto" }}>
        <Alert
          message="Iniciar Sesión"
          description="Para poder ver contactos es necesario iniciar sesión."
          type="info"
          showIcon
        />
      </Col>
    ) : contactsList.length > 0 ? (
      <Divider>Aqui se cargara la lista</Divider>
    ) : (
      <Divider>No tiene contactos actualmente</Divider>
    );

  return <Spin></Spin>;
};
