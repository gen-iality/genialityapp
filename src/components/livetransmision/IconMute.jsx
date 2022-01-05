import { SoundOutlined, StopOutlined } from '@ant-design/icons';
import React from 'react';

const IconMute = ({ callback }) => {
  return (
    <div onClick={callback} style={styles.square}>
      <SoundOutlined style={styles.icon} />
      <StopOutlined style={styles.icon} />
    </div>
  );
};

export default IconMute;

const styles = {
  square: {
    zIndex: 2,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    margin: 'auto',
  },
  icon: {
    position: 'absolute',
    color: 'rgba(140,140,140,1)',
    fontSize: '20vw',
    fontWeight: '100',
    left: 'calc(50% - 10vw)',
    top: 'calc(50% - 10vw)',
  },
};
