import { SmileOutlined } from '@ant-design/icons';
import { Result, Grid } from 'antd';
import ReactPlayer from 'react-player';
import { useHelper } from '@context/helperContext/hooks/useHelper';

const { useBreakpoint } = Grid;

export const VideoActivity = () => {
  const { currentActivity } = useHelper();
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
            style={{ objectFit: 'cover' }}
            width='100%'
            height={`${screens.xs ? '100%' : '55vh'}`}
            url={currentActivity && currentActivity?.video}
            controls
          />
        </div>
      ) : (
        <Result icon={<SmileOutlined />} title='Este curso ha terminado!' />
      )}
    </>
  );
};
