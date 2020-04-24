import React, { Fragment, useState, useEffect } from "react";

import { Spin, Alert, Col, Divider, Card } from "antd";

import * as Cookie from "js-cookie";
import { Networking } from "../../helpers/request";
import { userRequest, getCurrentUserId, getCurrentEventUser } from "./services";

export default ({ eventId }) => {
  const [requestList, setRequestList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  const getInvitationsList = async () => {
    getCurrentUserId(Cookie.get("evius_token")).then(async (userId) => {
      let response = await getCurrentEventUser(eventId, userId);

      Networking.getInvitationsReceived(eventId, response._id).then(({ data }) => {
        console.log("esta es la respuesta :", data);
        setCurrentUserId(userId);
        if (data) setRequestList(data);
      });
    });
  };

  useEffect(() => {
    getInvitationsList();
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
    ) : requestList.length > 0 ? (
      <Divider>Aqui se cargara la lista</Divider>
    ) : (
      <Divider>No tiene solicitudes actualmente</Divider>
    );

  return <Spin></Spin>;
};
