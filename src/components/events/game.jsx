import React, { useEffect, useContext } from 'react';
import { HelperContext } from '../../Context/HelperContext';

function Game(props) {
  let { gameData } = useContext(HelperContext);

  useEffect(() => {
    const evius_body = document.getElementById('evius-body');
    evius_body.style.cssText = 'overflow-y: hidden;';
    return () => {
      evius_body.style.cssText = 'overflow-y: visible;';
    };
  }, []);

  const { currentUser } = props;

  return (
    <iframe
      src={
        `${gameData.baseUrl}` +
        ('/?uid=' +
          (currentUser && currentUser._id ? currentUser._id : '5e9caaa1d74d5c2f6a02a3c2') +
          '&displayName=' +
          (currentUser.displayName ? currentUser.displayName : 'anonimo') +
          '&email=' +
          (currentUser.email ? currentUser.email : 'evius@evius.co'))
      }
      frameBorder='0'
      allow='autoplay; fullscreen; camera *;microphone *'
      allowFullScreen
      allowusermedia
      style={{ zIndex: '10', width: '100%', height: '457px' }}></iframe>
  );
}

export default Game;
