import { Card, Space } from 'antd';
import React, { Fragment, useContext } from 'react';
import VideoCard from './videoCard';
import { HelperContext } from '../../Context/HelperContext';
import { useState } from 'react';
const ListVideoCard = () => {
  let { activitiesEvent } = useContext(HelperContext);
  const [existActivity, setexistActivity] = useState(0);
  function ExistvideoInActivity() {
    activitiesEvent &&
      activitiesEvent.map((activity) => {
        console.log('video', activity.video);
        if (activity.video != undefined || activity.video != null) {
          {
            setexistActivity(1);
          }
        }
      });
  }
  React.useEffect(() => {
    ExistvideoInActivity();
    console.log('existactivity', existActivity);
  }, [activitiesEvent]);

  return (
    <>
      {existActivity == 1 && (
        <Fragment style={{ width: '100%' }}>
          <Card headStyle={{ border: 'none' }} title='Videos grabados'>
            <Space size='large' style={{ width: '100%', overflowX: 'auto', padding: '10px', margin: '10px' }}>
              {activitiesEvent &&
                activitiesEvent.map((activity, index) => {
                  if (activity.video) {
                    return <VideoCard key={index} activity={activity} />;
                  }
                })}
            </Space>
          </Card>
        </Fragment>
      )}
    </>
  );
};

export default ListVideoCard;
