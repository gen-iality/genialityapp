import React, { useState, useEffect } from "react";

import { Spin, Alert, Col, Divider, Card, List, Button, Avatar, Tag, message } from "antd";
import { ScheduleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import * as Cookie from "js-cookie";
import { Networking, UsersApi } from "../../helpers/request";
import { getCurrentUser, getCurrentEventUser } from "./services";

// Componente que lista las invitaciones recibidas -----------------------------------------------------------
const InvitacionListReceived = ({ list, sendResponseToInvitation }) => {
  const [invitationsReceived, setInvitationsReceived] = useState([]);
  const [visibleItem, setVisibleItem] = useState(true);

  useEffect(() => {
    setInvitationsReceived(list);
  }, [list]);

  if (invitationsReceived.length)
    return (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <List
            dataSource={invitationsReceived}
            renderItem={(item) => (
              < List.Item
                key={item._id}
                actions={[
                  <Button key='btn-aceptar' onClick={() => sendResponseToInvitation(item._id, true)}>Aceptar</Button>,
                  <Button key='btn-noaceptar' onClick={() => sendResponseToInvitation(item._id, false)}>No Aceptar</Button>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {item.user_name_requested
                        ? item.user_name_requested.charAt(0).toUpperCase()
                        : item._id.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.user_name_requested || item._id}
                  style={{ textAlign: "left" }}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    );

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
      <Card>No tiene solicitudes actualmente</Card>
    </Col>
  );
};

// Componente que lista las invitaciones enviadas -----------------------------------------------------------
const InvitacionListSent = ({ list }) => {
  const [invitationsSent, setInvitationsSent] = useState([]);

  useEffect(() => {
    setInvitationsSent(list);
  }, [list]);

  if (invitationsSent.length)
    return (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
        <Card>
          <List
            dataSource={invitationsSent}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <List.Item.Meta
                  avatar={
                    <Avatar>
                      {item.user_name_requesting
                        ? item.user_name_requesting.charAt(0).toUpperCase()
                        : item._id.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.user_name_requesting || item._id}
                  style={{ textAlign: "left" }}
                />
                <div>
                  <Tag
                    icon={!item.response ? <ScheduleOutlined /> : <CloseCircleOutlined />}
                    color={item.response === "rejected" && "error"}>
                    {!item.response ? item.state : item.response}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    );

  return (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: "0 auto" }}>
      <Card>No ha enviado ninguna solicitud</Card>
    </Col>
  );
};

export default function RequestList({ eventId }) {
  const [requestListReceived, setRequestListReceived] = useState([]);
  const [requestListSent, setRequestListSent] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Funcion que obtiene la lista de solicitudes o invitaciones recibidas
  const getInvitationsList = async () => {
    // Se consulta el id del usuario por el token

    getCurrentUser(Cookie.get("evius_token")).then(async (user) => {
      // Servicio que obtiene el eventUserId del usuario actual
      let eventUser = await getCurrentEventUser(eventId, user._id);

      // Servicio que trae las invitaciones / solicitudes recibidas
      Networking.getInvitationsReceived(eventId, eventUser._id).then(({ data }) => {
        setCurrentUserId(user._id);

        // Solo se obtendran las invitaciones que no tengan respuesta
        if (data.length > 0) {
          setRequestListReceived(data.filter((item) => !item.response))
          insertNameRequested(data);
        };
      });

      // Servicio que trae las invitaciones / solicitudes enviadas
      Networking.getInvitationsSent(eventId, eventUser._id).then(({ data }) => {
        if (data.length > 0) setRequestListSent(data.filter((item) => !item.response || item.response === "rejected"));
      });
    });
  };

  //Funcion para insertar dentro de requestListReceivedNew el nombre de quien envia la solicitud de contacto
  const insertNameRequested = async (requestListReceived) => {
    //Se crea un nuevo array
    let requestListReceivedNew = []
    //Se itera el array que llega para obtener los datos
    for (let i = 0; i < requestListReceived.length; i++) {
      //dentro del for se consulta la api para obtener el usuario      
      let dataUser = await UsersApi.getOne(eventId, requestListReceived[i].id_user_requested)
      // se realiza un if para validar que no se encuentre el campo response para insertar los datos resultantes
      if (!requestListReceived[i].response) {
        //se insertan los datos obtenidos del array que se esta iterando y se inserta el nombre del usuario
        requestListReceivedNew.push({
          created_at: requestListReceived[i].created_at,
          eventId: requestListReceived[i].event_id,
          id_user_requested: requestListReceived[i].id_user_requested,
          user_name_requested: dataUser.properties.names,
          id_user_requesting: requestListReceived[i].id_user_requesting,
          state: requestListReceived[i].state,
          updated_at: requestListReceived[i].updated_at,
          user_name_requesting: requestListReceived[i].id_user_requesting,
          _id: requestListReceived[i]._id
        })
      }
    }
    console.log(requestListReceivedNew)
    //se envia a setRequestListReceived para no romper la demas logica
    setRequestListReceived(requestListReceivedNew)
  }

  // Funcion para aceptar o rechazar una invitacion o solicitud
  const sendResponseToInvitation = (requestId, state) => {
    let data = { response: state ? "accepted" : "rejected" };

    Networking.acceptOrDeclineInvitation(eventId, requestId, data)
      .then((response) => {
        getInvitationsList();

        console.log('respuesta de la invitacion ', response)
        message.success("Respuesta enviada");
      })
      .catch((err) => {
        console.log(err);
        message.error("Hubo un problema", err);
      });
  };

  useEffect(() => {
    getInvitationsList();

  }, [eventId]);

  if (currentUserId)
    return currentUserId === "guestUser" ? (
      <Col xs={22} sm={22} md={15} lg={15} xl={15} style={{ margin: "0 auto" }}>
        <Alert
          message="Iniciar Sesión"
          description="Para poder ver contactos es necesario iniciar sesión."
          type="info"
          showIcon
        />
      </Col>
    ) : (
        <div>
          <Divider>Solicitudes Recibidas</Divider>
          <InvitacionListReceived list={requestListReceived} sendResponseToInvitation={sendResponseToInvitation} />
          <Divider>Solicitudes Enviadas</Divider>
          <InvitacionListSent list={requestListSent} />
        </div>
      );
  return <Spin></Spin>;
};
