import { useState, useEffect, useContext } from 'react';
import { Spin, Alert, Col, Divider, Card, List, Button, Avatar, Tag, message } from 'antd';
import { ScheduleOutlined, CloseCircleOutlined } from '@ant-design/icons';
/* import 'react-toastify/dist/ReactToastify.css'; */
import { Networking, UsersApi } from '../../helpers/request';
import { getCurrentUser } from './services';
import { addNotification } from '../../helpers/netWorkingFunctions';
import { GetTokenUserFirebase } from '../../helpers/HelperAuth';
import { DispatchMessageService } from '../../context/MessageService';
import { CurrentEventUserContext } from '../../context/eventUserContext';
import { CurrentEventContext } from '@/context/eventContext';

// Componente que lista las invitaciones recibidas -----------------------------------------------------------
const InvitacionListReceived = ({ list, sendResponseToInvitation }) => {
  const [invitationsReceived, setInvitationsReceived] = useState([]);
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(true);
  const obtenerImageUser = async (idUser) => {
    const eventUser = await UsersApi.getOne(cEvent.value?._id, idUser);
    if (eventUser) {
      return eventUser.user?.picture;
    }
    return null;
  };
  useEffect(() => {
    if (list) {
      obtenerData();
    }

    async function obtenerData() {
      setLoading(true);
      var dataNew = await Promise.all(
        list.map(async (request) => {
          const picture = await obtenerImageUser(request.id_user_requested);
          return { ...request, picture };
        })
      );
      setInvitationsReceived(dataNew);
      setLoading(false);
    }
  }, [list]);

  if (invitationsReceived.length)
    return (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
        <Card>
          <List
            dataSource={invitationsReceived}
            renderItem={(item) => (
              <List.Item
                key={item._id}
                actions={[
                  <Button key='btn-aceptar' onClick={() => sendResponseToInvitation(item, true)}>
                    Aceptar
                  </Button>,
                  <Button key='btn-noaceptar' onClick={() => sendResponseToInvitation(item, false)}>
                    Rechazar
                  </Button>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item?.picture ? item.picture : null}>
                      {item?.picture
                        ? null
                        : item.user_name_requested
                        ? item.user_name_requested.charAt(0).toUpperCase()
                        : item._id.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={item.user_name_requested || item._id}
                  style={{ textAlign: 'left' }}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    );

  return !loading ? (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
      <Card>No tiene solicitudes actualmente</Card>
    </Col>
  ) : (
    <Spin />
  );
};

// Componente que lista las invitaciones enviadas -----------------------------------------------------------
const InvitacionListSent = ({ list }) => {
  const [invitationsSent, setInvitationsSent] = useState([]);
  const cEvent = useContext(CurrentEventContext);
  const [loading, setLoading] = useState(true);
  const obtenerImageUser = async (idUser) => {
    const eventUser = await UsersApi.getOne(cEvent.value?._id, idUser);
    if (eventUser) {
      return eventUser.user?.picture;
    }
    return null;
  };
  useEffect(() => {
    if (list) {
      obtenerData();
    }

    async function obtenerData() {
      setLoading(true);
      var dataNew = await Promise.all(
        list.map(async (request) => {
          const picture = await obtenerImageUser(request.id_user_requesting);
          return { ...request, picture };
        })
      );
      setInvitationsSent(dataNew);
      setLoading(false);
    }
  }, [list]);

  if (invitationsSent.length)
    return (
      <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
        <Card>
          <List
            dataSource={invitationsSent}
            renderItem={(item) => (
              <List.Item key={item._id}>
                <List.Item.Meta
                  avatar={
                    <Avatar src={item?.picture ? item.picture : null}>
                      {item?.picture
                        ? null
                        : item.user_name_requesting
                        ? item.user_name_requesting.charAt(0).toUpperCase()
                        : item._id.charAt(0).toUpperCase()}
                      {/* {console.log('ITEM===>', item)} */}
                    </Avatar>
                  }
                  title={item.user_name_requesting || item._id}
                  style={{ textAlign: 'left' }}
                />
                <div>
                  <Tag
                    icon={!item.response ? <ScheduleOutlined /> : <CloseCircleOutlined />}
                    color={item.response === 'rejected' && 'error'}>
                    {!item.response ? item.state : item.response}
                  </Tag>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </Col>
    );

  return !loading ? (
    <Col xs={24} sm={22} md={18} lg={18} xl={18} style={{ margin: '0 auto' }}>
      <Card>No ha enviado ninguna solicitud</Card>
    </Col>
  ) : (
    <Spin />
  );
};

export default function RequestList({ eventId, currentUser, tabActive, event, currentUserAc }) {
  const [requestListReceived, setRequestListReceived] = useState([]);
  const [requestListSent, setRequestListSent] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const eventUserCtx = useContext(CurrentEventUserContext);

  // Funcion que obtiene la lista de solicitudes o invitaciones recibidas
  const getInvitationsList = async () => {
    // Se consulta el id del usuario por el token
    setLoading(true);
    let evius_token = await GetTokenUserFirebase();
    if (evius_token) {
      // Servicio que obtiene el eventUserId del usuario actual
      let eventUser = eventUserCtx.value;
      // Servicio que trae las invitaciones / solicitudes recibidas
      Networking.getInvitationsReceived(eventId, eventUser._id).then(async ({ data }) => {
        setCurrentUserId(eventUser._id);

        // Solo se obtendran las invitaciones que no tengan respuesta
        if (data.length > 0) {
          let response = data.filter((item) => item.response == undefined);

          setRequestListReceived(response);
          await insertNameRequested(response);
        } else {
          setRequestListReceived([]);
        }
        setLoading(false);
      });

      // Servicio que trae las invitaciones / solicitudes enviadas
      Networking.getInvitationsSent(eventId, eventUser._id).then(({ data }) => {
        if (data.length > 0) {
          /* console.log('DATA===>', data); */
          setRequestListSent(data.filter((item) => !item.response || item.response === 'rejected'));
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
  };

  //Funcion para insertar dentro de requestListReceivedNew el nombre de quien envia la solicitud de contacto
  const insertNameRequested = async (requestListReceived) => {
    //Se crea un nuevo array
    let requestListReceivedNew = [];
    //Se itera el array que llega para obtener los datos
    for (let i = 0; i < requestListReceived.length; i++) {
      //dentro del for se consulta la api para obtener el usuario
      let dataUser = await UsersApi.getOne(eventId, requestListReceived[i].id_user_requested);
      // se realiza un if para validar que no se encuentre el campo response para insertar los datos resultantes
      if (!requestListReceived[i].response) {
        //se insertan los datos obtenidos del array que se esta iterando y se inserta el nombre del usuario
        requestListReceivedNew.push({
          created_at: requestListReceived[i].created_at,
          eventId: requestListReceived[i].event_id,
          id_user_requested: requestListReceived[i].id_user_requested,
          user_name_requested: dataUser.properties?.names || dataUser.properties?.name,
          id_user_requesting: requestListReceived[i].id_user_requesting,
          state: requestListReceived[i].state,
          updated_at: requestListReceived[i].updated_at,
          user_name_requesting: requestListReceived[i].id_user_requesting,
          _id: requestListReceived[i]._id,
        });
      }
    }

    //se envia a setRequestListReceived para no romper la demas logica
    setRequestListReceived(requestListReceivedNew);
  };

  // Funcion para aceptar o rechazar una invitacion o solicitud
  const sendResponseToInvitation = async (requestId, state) => {
    let data = { response: state ? 'accepted' : 'rejected' };
    Networking.acceptOrDeclineInvitation(eventId, requestId._id, data)
      .then(async () => {
        DispatchMessageService({
          type: 'success',
          msj: 'Respuesta enviada',
          action: 'show',
        });

        let notificationr = {
          idReceive: currentUserAc._id,
          idEmited: requestId && requestId._id,
          state: '1',
        };
        // notification(notificationr, currentUser._id);
        addNotification(notificationr, event, currentUserAc);
        setRequestListReceived(requestListReceived.filter((item) => item._id != requestId._id));
      })
      .catch((err) => {
        // console.error('ERROR API==>', err);
        DispatchMessageService({
          type: 'error',
          msj: 'Hubo un problema',
          action: 'show',
        });
      });
  };

  useEffect(() => {
    if (tabActive === 'solicitudes') {
      getInvitationsList();
    }
  }, [eventId, tabActive]);

  if (!loading)
    return currentUser === null ? (
      <Col xs={22} sm={22} md={15} lg={15} xl={15} style={{ margin: '0 auto' }}>
        <Alert
          message='Iniciar Sesión'
          description='Para poder ver contactos es necesario iniciar sesión.'
          type='info'
          showIcon
        />
      </Col>
    ) : (
      <div>
        <Divider>Solicitudes de contacto recibidas</Divider>
        <InvitacionListReceived list={requestListReceived} sendResponseToInvitation={sendResponseToInvitation} />
        <Divider>Solicitudes de contacto enviadas</Divider>
        <InvitacionListSent list={requestListSent} />
      </div>
    );
  if (loading) return <Spin></Spin>;
}
