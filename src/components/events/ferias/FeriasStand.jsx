import { useHistory } from 'react-router';
import { Badge } from 'antd';

function FeriasStand(props) {
  const history = useHistory();
  return (
    <>
      <div
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => {
          history.push(`/landing/${props.eventId}/ferias/${props.companyId}/detailsCompany`);
        }}>
        <div
          className='mini-banner'
          style={{
            border: `2px solid  ${props.color}`,
            borderRadius: '12px',
            width: '60%',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '20px',
            backgroundColor: 'white',
          }}>
          <Badge.Ribbon text={props.text} color={props.color}>
            <img
              src={props.image}
              style={{
                width: '100%',
                /* border:`10px solid white`, borderRadius:'12px', */
                height: '20vh',
                objectFit: 'contain',
              }}
            />{' '}
          </Badge.Ribbon>
        </div>
        <img
          src={
            'https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/evius%2FViews%2F2021-08-04.png?alt=media&token=fc7df0fa-1b18-406f-8d0a-59bf030a5372'
          }
          style={{
            width: '100%',
            /* border:`10px solid white`, borderRadius:'12px', */
            height: '35vh',
            objectFit: 'contain',
          }}
        />
      </div>
    </>
  );
}

export default FeriasStand;
