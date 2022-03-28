import { Row, Col, Card, Typography } from 'antd';
import CardPreview from '../typeActivity/components/CardPreview';
import GoToEviusMeet from './components/GoToEviusMeet';
import TransmitionOptions from './components/TransmitionOptions';
import CardShareLinkEviusMeet from './components/CardShareLinkEviusMeet';
import CardParticipantRequests from './components/CardParticipantRequests';
import CardRTMP from './components/CardRTMP';
import CardStartTransmition from './components/CardStartTransmition';
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';
import { useState, useContext, useEffect } from 'react';
import AgendaContext from '../../../context/AgendaContext';
import { CurrentEventContext } from '../../../context/eventContext';
import ModalListRequestsParticipate from '../roomManager/components/ModalListRequestsParticipate';
const ManagerView = (props: any) => {
  const eventContext = useContext(CurrentEventContext);
  const { data } = useTypeActivity();
  const { activityEdit, getRequestByActivity, request, transmition, dataLive } = useContext(AgendaContext);
  const [viewModal, setViewModal] = useState(false);
  const refActivity = `request/${eventContext.value?._id}/activities/${activityEdit}`;
  useEffect(() => {
    if (props.type !== 'EviusMeet') return;
    getRequestByActivity(refActivity);
  }, [props.type]);
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <CardPreview type={props.type} activityName={props.activityName} />
        </Col>
        <Col span={14}>
          {(props.type == 'Transmisión' || props.type == 'EviusMeet') && <CardStartTransmition />}
          <Row gutter={[16, 16]}>
            {(props.type == 'reunión' || props.type == 'EviusMeet') && dataLive?.active && (
              <Col span={12}>
                <GoToEviusMeet type={props.type} activityId={props.activityId} />
              </Col>
            )}
            {((props.type === 'EviusMeet' && dataLive?.active) || props.type !== 'EviusMeet') && (
              <Col span={props.type == 'Video' ? 24 : 12}>
                <TransmitionOptions type={props.type} />
              </Col>
            )}
            {props.type == 'Video' && (
              <Col span={24}>
                <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
                  <Card.Meta
                    title={
                      <Typography.Text style={{ fontSize: '20px' }} strong>
                        Video cargado
                      </Typography.Text>
                    }
                    description={'Esta es la url cargada'}
                  />
                  <br />
                  <strong>Url:</strong> {data}
                </Card>
              </Col>
            )}
            {(props.type == 'reunión' || props.type == 'EviusMeet') && dataLive?.active && (
              <Col span={24}>
                <CardShareLinkEviusMeet activityId={props.activityId} />
              </Col>
            )}
            {props.type == 'EviusMeet' && dataLive?.active && (
              <Col span={24}>
                <CardParticipantRequests request={request} setViewModal={setViewModal} />
              </Col>
            )}
          </Row>
        </Col>
        {(props.type == 'Transmisión' || props.type == 'EviusMeet') && dataLive?.active && (
          <Col span={24}>
            <CardRTMP />
          </Col>
        )}
      </Row>
      <ModalListRequestsParticipate refActivity={refActivity} visible={viewModal} handleModal={setViewModal} />
    </>
  );
};

export default ManagerView;
