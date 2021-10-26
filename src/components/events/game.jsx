import React, { useEffect } from 'react';
import { Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

function Game(props) {
  const { currentUser, openOtherGame, theUserHasPlayed, cEvent } = props;

  useEffect(() => {
    const evius_body = document.getElementById('evius-body');
    evius_body.style.cssText = 'overflow-y: hidden;';

    return () => {
      evius_body.style.cssText = 'overflow-y: visible;';
    };
  }, []);

  const colorTexto = cEvent.styles.textMenu;
  const colorFondo = cEvent.styles.toolbarDefaultBg;

  const imagePlaceHolder =
    "https://via.placeholder.com/1500x540/" +
    colorFondo.replace("#", "") +
    "/" +
    colorTexto.replace("#", "") +
    "?text=Muchas%20gracias%20por%20participar%20";

  return (<>
    {openOtherGame ? <>{theUserHasPlayed === null ? <Space
      direction='horizontal'
      style={{
        background: colorFondo,
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        width: '100%',
        height: '457px'
      }}
    >
      <LoadingOutlined style={{ fontSize: '100px', color: colorTexto }} />
    </Space> : theUserHasPlayed === true ? <div>
      <img
        src={
          imagePlaceHolder
        }
        alt="finishedGame"
        style={{
          width: "100%",
          height: "60vh",
          objectFit: "cover",
        }}
      />
    </div> : <iframe
      src={
        `https://novanetagfarafiologos.netlify.app/` +
        ('?userId=' +
          (currentUser && currentUser._id ? currentUser._id : '5e9caaa1d74d5c2f6a02a3c2') +
          '&name=' +
          (currentUser.displayName ? currentUser.displayName : 'anonimo') +
          '&email=' +
          (currentUser.email ? currentUser.email : 'evius@evius.co'))
      }
      frameBorder='0'
      allow='autoplay; fullscreen; camera *;microphone *'
      allowFullScreen
      allowusermedia
      style={{ zIndex: '10', width: '100%', height: '457px' }}></iframe>} </> :

      <iframe
        src={
          `https://juegocastrol2.netlify.app/` +
          ('?uid=' +
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
    }</>);
}
const mapStateToProps = (state) => ({
  currentUser: state.user.data,
});
export default connect(mapStateToProps)(Game);
