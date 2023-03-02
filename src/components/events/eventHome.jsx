import { Row, Col } from 'antd';
import EventLanding from './eventLanding';
import { useEventContext } from '@context/eventContext';
import Lobby from '../fair/lobby/Lobby';
import { withRouter } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { CurrentEventUserContext } from '@context/eventUserContext';

const EventHome = (props) => {
  /*Contextos*/
  const { setActivitiesAttendee } = props;
  const cEvent = useEventContext();
  const cEventUser = useContext(CurrentEventUserContext);
  if (!cEvent.value) {
    return <>Cargando...</>;
  }
  //PERMITE EJECUTAR CODIGO JAVASCRIPT // Se utiliza para redirigir despues de loquear un eventuser
  useEffect(() => {
    if (!cEvent.value || !cEventUser.value) return;
    cEvent && cEvent.value && cEvent.value?.message_user && cEventUser.value ? eval(cEvent.value?.message_user) : null;
  }, [cEvent, cEventUser]);

  return (
    <>
      {cEvent && cEvent.value && cEvent.value._id && cEvent.value._id !== '610e72451c2ae8638d5395c6' && (
        <Row justify="center">
          <Col span={24} /* sm={24} md={16} lg={18} xl={18} */ style={{ padding: '1rem' }}>
            <EventLanding setActivitiesAttendee={setActivitiesAttendee} />
          </Col>
        </Row>
      )}
      {cEvent && cEvent.value && cEvent.value._id && cEvent.value._id === '610e72451c2ae8638d5395c6' && <Lobby />}
    </>
  );
};

export default withRouter(EventHome);
