import { Alert, Tag, Button } from 'antd';
import { AuthUrl } from '../../../helpers/constants';
import { useIntl } from 'react-intl';

const AttendeeNotAllowedCheck = (props) => {
  let event = props.event;
  let currentUser = props.currentUser;
  let usuarioRegistrado = props.usuarioRegistrado;

  const intl = useIntl();

  return (
    <>
      {/* <Tag color='geekblue'>{event && event.allow_register ? 'El curso permite registro' : 'Es curso privado'}</Tag>
      <Tag color='geekblue'>{currentUser ? 'Usuario autenticado' : 'Usuario anónimo'}</Tag>
      <Tag color='geekblue'>{usuarioRegistrado ? 'Usuario registrado' : 'Usuario sin Registrar'}</Tag> */}

      {!currentUser && !event.allow_register && (
        <Alert
          //onClick={() => (window.location.href = "https://eviusauth.netlify.com")}
          message='Curso restringido. requiere usuario'
          description={
            <p>
              <b>Curso restringido: </b> Debes estar previamente registrado al curso para acceder al espacio en vivo,
              si estas registrado en el curso ingresa al sistema con tu usuario para poder acceder al curso,
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
