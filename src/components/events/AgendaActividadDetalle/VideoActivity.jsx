import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import HelperContext from '../../../Context/HelperContext';

export const VideoActivity = () => {
  let { currentActivity } = useContext(HelperContext);
  return (
    <>
      {currentActivity.video ? (
        <ReactPlayer
          width={'100%'}
          style={{
            display: 'block',
            margin: '0 auto',
          }}
          url={currentActivity && currentActivity?.video}
          controls
        />
      ) : (
        <Result
        icon={<SmileOutlined />}
        title="Este evento ha terminado!"
      />
      )}
    </>
  );
};
