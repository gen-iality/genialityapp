import { Card, Space, Col, Row } from 'antd';
import VideoCard from './videoCard';
import { UseEventContext } from '../../context/eventContext';
import { useHelper } from '../../context/helperContext/hooks/useHelper';
import { useState } from 'react';

const ListVideoCard = () => {
  let cEvent = UseEventContext();
  let { activitiesEvent } = useHelper();
  const [existActivity, setexistActivity] = useState(0);
  function ExistvideoInActivity() {
    activitiesEvent &&
      activitiesEvent.map((activity) => {
        if (activity.video != undefined || activity.video != null) {
          {
            setexistActivity(1);
          }
        }
      });
  }
  React.useEffect(() => {
    ExistvideoInActivity();
  }, [activitiesEvent]);

  if (!cEvent.value) {
    return <>Cargando...</>;
  }

  let countactivityToShow = 0;

  return (
    <>
      {existActivity === 1 && (
        <Row gutter={[20, 20]} style={{ margin: '25px' }}>
          {activitiesEvent &&
            //activitiesEvent.sort((a, b) => a.updated_at - b.updated_at)&&
            activitiesEvent.map((activity, index) => {
              if (countactivityToShow < 3) {
                if (activity.video) {
                  countactivityToShow++;
                  return (
                    <Col key={index} xs={0} sm={0} md={24} lg={8} xl={8}>
                      <VideoCard
                        bordered={false}
                        key={cEvent.value._id}
                        event={cEvent.value}
                        action={{ name: 'Ver', url: `landing/${cEvent.value._id}` }}
                        activity={activity}
                      />
                    </Col>
                  );
                }
                //Solo los últimos 3
                // if (index > 2) return;

                //return <VideoCard key={index} activity={activity} />;
              }
            })}
        </Row>
      )}
    </>
  );
};

export default ListVideoCard;
