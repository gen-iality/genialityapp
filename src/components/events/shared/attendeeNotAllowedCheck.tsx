import { Alert, Tag, Button } from 'antd';
import { AuthUrl } from '../../../helpers/constants';
import { useIntl } from 'react-intl';

const AttendeeNotAllowedCheck = (props: any) => {
  let event = props.event;
  let currentUser = props.currentUser;
  let usuarioRegistrado = props.usuarioRegistrado;

  const intl = useIntl();

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
          message={<b>{intl.formatMessage({ id: 'auth.restricted.event.title' })}</b>}
          description={<p>{intl.formatMessage({ id: 'auth.restricted.event.message' })}</p>}
          type='warning'
          showIcon
        />
      )}
    </>
  );
};
export default AttendeeNotAllowedCheck;
