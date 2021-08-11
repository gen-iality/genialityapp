import React from 'react';
import { UseEventContext } from '../../../Context/eventContext';
const EviusFooter = () => {
  let cEventContext = UseEventContext();
  return (
    <>
      {cEventContext.value.styles && cEventContext.value.styles.banner_footer && (
        <div style={{ textAlign: 'center' }}>
          <img alt='image-dialog' src={cEventContext.value.styles.banner_footer} />
        </div>
      )}
    </>
  );
};

export default EviusFooter;
