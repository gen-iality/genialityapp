import { UseEventContext } from '../../../context/eventContext';
import { useHistory } from 'react-router-dom';
const EviusFooter = () => {
  let cEventContext = UseEventContext();
  let history = useHistory();
  return (
    <>
      {cEventContext.value.styles && cEventContext.value.styles.banner_footer && (
        <div
          onClick={() =>
            cEventContext.value._id == '60cb7c70a9e4de51ac7945a2'
              ? history.push(`/landing/${cEventContext.value._id}/tickets`)
              : null
          }
          style={{ textAlign: 'center' }}>
          <img alt='image-dialog' src={cEventContext.value.styles.banner_footer} style={{ maxWidth: '100%' }} />
        </div>
      )}
    </>
  );
};

export default EviusFooter;
