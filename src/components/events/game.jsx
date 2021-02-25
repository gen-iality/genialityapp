import React from 'react';
import { connect } from 'react-redux';
function Game(props) {
  const { currentUser } = props;
  return (
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
  );
}
const mapStateToProps = (state) => ({
  currentUser: state.user.data,
});
export default connect(mapStateToProps)(Game);
