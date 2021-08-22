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

  return (
    <>
      {existActivity == 1 && (
        <Fragment style={{ width: '100%' }}>
              {activitiesEvent &&
                activitiesEvent.map((activity, index) => {
                  if (activity.video) {
                    return <VideoCard key={index} activity={activity} />;
                  }
                })}
        </Fragment>
      )}
    </>
  );
};

export default ListVideoCard;
