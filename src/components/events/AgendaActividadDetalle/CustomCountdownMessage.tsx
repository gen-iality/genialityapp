import { Result } from 'antd';
import React from 'react';

export default function CustomCountdownMessage() {
  return (
    <div className='mediaplayer' style={{ background: 'white' }}>
      <Result status='success' title='Estamos a punto de iniciar...' />
    </div>
  );
}
