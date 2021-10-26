import React, { useContext, useEffect } from 'react';
import { Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import WithEviusContext from '../../Context/withContext';
import HelperContext from '../../Context/HelperContext';

function Game(props) {
  let { theUserHasPlayed } = useContext(HelperContext);

  useEffect(() => {
    const evius_body = document.getElementById('evius-body');
    evius_body.style.cssText = 'overflow-y: hidden;';
    return () => {
      evius_body.style.cssText = 'overflow-y: visible;';
    };
  }, []);

  const colorTexto = props.cEvent.value?.styles.textMenu;
  const colorFondo = props.cEvent.value?.styles.toolbarDefaultBg;

  const imagePlaceHolder =
    'https://via.placeholder.com/1500x540/' +
    colorFondo.replace('#', '') +
    '/' +
    colorTexto.replace('#', '') +
    '?text=Muchas%20gracias%20por%20participar%20';

  return (
    <>
      {props.cEvent.value?.openOtherGame ? (
        <>
          {theUserHasPlayed === null ? (
            <Space
              direction='horizontal'
              style={{
                background: colorFondo,
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
                width: '100%',
                height: '457px',
              }}>
              <LoadingOutlined style={{ fontSize: '100px', color: colorTexto }} />
            </Space>
          ) : theUserHasPlayed === true ? (
            <div>
              <img
                src={imagePlaceHolder}
                alt='finishedGame'
                style={{
                  width: '100%',
                  height: '60vh',
                  objectFit: 'cover',
                }}
              />
            </div>
          ) : (
            <iframe
              src={
                `https://novanetagfarafiologos.netlify.app/` +
                ('?userId=' +
                  (props.cEventUser.value && props.cEventUser.value._id
                    ? props.cEventUser.value._id
                    : '5e9caaa1d74d5c2f6a02a3c2') +
                  '&name=' +
                  (props.cEventUser.value.properties.displayName
                    ? props.cEventUser.value.properties.displayName
                    : 'anonimo') +
                  '&email=' +
                  (props.cEventUser.value.properties?.email
                    ? props.cEventUser.value.properties?.email
                    : 'evius@evius.co'))
              }
              frameBorder='0'
              allow='autoplay; fullscreen; camera *;microphone *'
              allowFullScreen
              allowusermedia
              style={{ zIndex: '10', width: '100%', height: '457px' }}></iframe>
          )}{' '}
        </>
      ) : (
        <iframe
          src={
            `https://juegocastrol2.netlify.app/` +
            ('?uid=' +
              (props.cEventUser.value && props.cEventUser.value._id
                ? props.cEventUser.value._id
                : '5e9caaa1d74d5c2f6a02a3c2') +
              '&displayName=' +
              (props.cEventUser.value.properties.displayName
                ? props.cEventUser.value.properties.displayName
                : 'anonimo') +
              '&email=' +
              (props.cEventUser.value.properties?.email ? props.cEventUser.value.properties?.email : 'evius@evius.co'))
          }
          frameBorder='0'
          allow='autoplay; fullscreen; camera *;microphone *'
          allowFullScreen
          allowusermedia
          style={{ zIndex: '10', width: '100%', height: '457px' }}></iframe>
      )}
    </>
  );
}

export default WithEviusContext(Game);
