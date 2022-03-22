import { Row, Col } from 'antd';
import EventLanding from './eventLanding';
import { UseEventContext } from '../../context/eventContext';
import Lobby from '../fair/lobby/Lobby';
import { withRouter } from 'react-router-dom';

const EventHome = () => {
  /*Contextos*/
  let cEvent = UseEventContext();
  if (!cEvent.value) {
    return <>Cargando...</>;
  }

  return (
    <>
      {cEvent && cEvent.value && cEvent.value._id && cEvent.value._id !== '610e72451c2ae8638d5395c6' && (
        <Row justify='center'>
          <Col span={22} /* sm={24} md={16} lg={18} xl={18} */>
            <EventLanding />
          </Col>
        </Row>
      )}
      {cEvent && cEvent.value && cEvent.value._id && cEvent.value._id === '610e72451c2ae8638d5395c6' && <Lobby />}
    </>
  );
};

export default withRouter(EventHome);
