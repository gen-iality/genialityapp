import { SmileOutlined } from '@ant-design/icons';
import { Result, Grid } from 'antd';
import React, { useContext } from 'react';
import ReactPlayer from 'react-player';
import HelperContext from '../../../Context/HelperContext';

const { useBreakpoint } = Grid;

export const VideoActivity = () => {
  let { currentActivity } = useContext(HelperContext);
  const screens = useBreakpoint();
  return (
    <>
      {currentActivity?.video ? (
        /* <ReactPlayer
          width={'100%'}
          style={{
            display: 'block',
            margin: '0 auto',
          }}
          url={currentActivity && currentActivity?.video}
          controls
        /> */
        <div className='mediaplayer'>
          <ReactPlayer
            style={{ height: `${screens.xs ? '25vh' : '55vh'}`, objectFit: 'cover' }}
            width='100%'
            url={currentActivity && currentActivity?.video}
            controls
          />
        </div>
      ) : (
        <Result icon={<SmileOutlined />} title='Este evento ha terminado!' />
      )}
    </>
  );
};
