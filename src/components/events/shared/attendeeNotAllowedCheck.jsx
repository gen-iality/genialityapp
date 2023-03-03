import { Alert, Tag, Button } from 'antd';
import { AuthUrl } from '@helpers/constants';
import { useIntl } from 'react-intl';

const AttendeeNotAllowedCheck = (props) => {
  const event = props.event;
  const currentUser = props.currentUser;
  const usuarioRegistrado = props.usuarioRegistrado;

  const intl = useIntl();

  return (
    <>
      {!currentUser && !event.allow_register && (
        <Alert
          //onClick={() => (window.location.href = "https://eviusauth.netlify.com")}
          message="Curso restringido. requiere usuario"
          description={
            <p>
              <b>Curso restringido: </b> Debes estar previamente registrado al curso para acceder al espacio en vivo,
              si estas registrado en el curso ingresa al sistema con tu usuario para poder acceder al curso,
            </p>
          }
          type="info"
          showIcon
        />
      )}

      {currentUser && !usuarioRegistrado && !event.allow_register && (
        <Alert
          message={<b>{intl.formatMessage({ id: 'auth.restricted.event.title' })}</b>}
          description={<p>{intl.formatMessage({ id: 'auth.restricted.event.message' })}</p>}
          type="warning"
          showIcon
        />
      )}
    </>
  );
};
export default AttendeeNotAllowedCheck;
