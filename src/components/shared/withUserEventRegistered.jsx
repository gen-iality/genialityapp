import { useEffect, useState } from 'react';
import { Alert } from 'antd';

function WithUserEventRegistered(Component) {
  return function WihLoadingComponent(props) {
    const [currentUser, setCurrentUser] = useState(null);
    const [usuarioRegistrado, setUsuarioRegistrado] = useState(null);
    const [event, setEvent] = useState(null);

    useEffect(() => {
      (async () => {
        try {
          setCurrentUser(props.currentUser);
          setUsuarioRegistrado(props.usuarioRegistrado);
          setEvent(props.event);
        } catch (e) {
          e;
        }
      })();
    }, [props.usuarioRegistrado]);

    return (
      <div>
        {!currentUser && !usuarioRegistrado && (
          <div>
            {!currentUser && event && !event.allow_register && (
              <Alert
                message='Curso restringido. requiere usuario'
                description={
                  <p>
                    <b>Curso restringido:</b>
                    debes estar previamente registrado al curso para acceder al espacio en vivo, si estas registrado en
                    el curso ingresa al sistema con tu usuario para poder acceder al curso, &nbsp;&nbsp;
                  </p>
                }
                type='info'
                showIcon
              />
            )}

            {currentUser && !usuarioRegistrado && event && !event.allow_register && (
              <Alert
                message='Curso restringido. requiere registro previo'
                description={
                  <p>
                    <b>Curso restringido:</b>
                    debes estar previamente registrado al curso para acceder al espacio en vivo, si estas registrado y
                    no tienes acceso comunicate con el organizador &nbsp;&nbsp;
                  </p>
                }
                type='warning'
                showIcon
              />
            )}
          </div>
        )}

        <Component {...props} event={event} currentUser={currentUser} usuarioRegistrado={usuarioRegistrado} />
      </div>
    );
  };
}
export default WithUserEventRegistered;
