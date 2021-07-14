import React from 'react';

function feriaBanner(props) {
  // const imageBanner = props.imagen
  return (
    <div className='container-bannerEvent'>
      <img
        src={props.imagen}
        style={{
          width: '100%',
          // height:'50vh'
        }}
      />
    </div>
  );
}

export default feriaBanner;
