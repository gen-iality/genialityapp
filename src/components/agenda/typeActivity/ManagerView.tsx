;
import { Row, Col, Card, Typography } from 'antd';
import CardPreview from '../typeActivity/components/CardPreview';
import GoToEviusMeet from './components/GoToEviusMeet';
import TransmitionOptions from './components/TransmitionOptions';
import CardShareLinkEviusMeet from './components/CardShareLinkEviusMeet';
import CardParticipantRequests from './components/CardParticipantRequests';
import CardRTMP from './components/CardRTMP';
import CardStartTransmition from './components/CardStartTransmition';
import { useTypeActivity } from '../../../context/typeactivity/hooks/useTypeActivity';

const ManagerView = (props:any) => {

  const { data } = useTypeActivity();
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={10}>
          <CardPreview type={props.type} activityName={props.activityName} />
        </Col>
        <Col span={14}>
         {(props.type=="Transmisión" ||props.type=="EviusMeet" )  && <CardStartTransmition />}
          <Row gutter={[16, 16]}>
           {props.type=="reunión" && <Col span={24}>
              <GoToEviusMeet activityId={props.activityId}  />
            </Col>}
            <Col span={24}>
              <TransmitionOptions type={props.type} />
            </Col>
            {props.type=="Video" &&<Col span={24}>
            <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
              <Card.Meta
                title={
                  <Typography.Text style={{ fontSize: '20px' }} strong>
                  Video cargado
                  </Typography.Text>
                }
                description={'Esta es la url cargada'}
              />{' '}
              <br />
              <strong>Url:</strong>{' '}{data}
              </Card>
            </Col>}
            {props.type=="reunión" &&<Col span={24}>
              <CardShareLinkEviusMeet activityId={props.activityId} />
            </Col>}
            {props.type=="EviusMeet" && <Col span={24}>
              <CardParticipantRequests />
            </Col>}
          </Row>
        </Col>
        {(props.type=="Transmisión" ||props.type=="EviusMeet" )  && <Col span={24}>
          <CardRTMP />
        </Col>}
      </Row>
    </>
  );
};

export default ManagerView;
