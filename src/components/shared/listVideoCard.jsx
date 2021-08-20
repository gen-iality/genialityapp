import { Card, Space } from 'antd';
import React, { Fragment, useContext } from 'react';
import VideoCard from './videoCard';
import { HelperContext } from '../../Context/HelperContext';
const ListVideoCard = () => {
  let { activitiesEvent } = useContext(HelperContext);

  return (
    <>
      {activitiesEvent && (
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
