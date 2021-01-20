import React, { useEffect } from 'react';
import { Alert, Tag, Button } from 'antd';
import { AuthUrl } from '../../../helpers/constants';

const AttendeeNotAllowedCheck = (props) => {
  let event = props.event;
  let currentUser = props.currentUser;
  let usuarioRegistrado = props.usuarioRegistrado;

  useEffect(() => {
    console.log('allowed', props);
  }, []);
  return (
    <>
      {/* <Tag color='geekblue'>{event && event.allow_register ? 'El Evento permite registro' : 'Es Evento Privado'}</Tag>
      <Tag color='geekblue'>{currentUser ? 'Usuario Autenticado' : 'Usuario Anónimo'}</Tag>
      <Tag color='geekblue'>{usuarioRegistrado ? 'Usuario Registrado' : 'Usuario sin Registrar'}</Tag> */}

      {!currentUser && !event.allow_register && (
        <Alert
          //onClick={() => (window.location.href = "https://eviusauth.netlify.com")}
          message='Evento restringido. requiere usuario'
          description={
            <p>
              <b>Evento Restringido: </b> Debes estar previamente registrado al evento para acceder al espacio en vivo,
              si estas registrado en el evento ingresa al sistema con tu usuario para poder acceder al evento,
              &nbsp;&nbsp;
              {/* <Button type="primary">
                <a href={AuthUrl}>Ir a Ingreso</a>
              </Button> */}
            </p>
          }
          type='info'
          showIcon
        />
      )}

      {currentUser && !usuarioRegistrado && !event.allow_register && (
        <Alert
          message='Evento restringido. requiere registro previo'
          description={
            <p>
              <b>Evento Restringido:</b> debes estar previamente registrado al evento para acceder al espacio en vivo,
              si estas registrado y no tienes acceso comunicate con el organizador &nbsp;&nbsp;
            </p>
          }
          type='warning'
          showIcon
        />
      )}
    </>
  );
};
export default AttendeeNotAllowedCheck;
