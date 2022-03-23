;
import { Button, Card, Typography } from 'antd';
import { UseCurrentUser } from '../../../../context/userContext';

const GoToEviusMeet = (props:any) => {
  const user=UseCurrentUser()
  const baseUrl='https://eviusmeets.netlify.app/prepare';
  console.log("USER===>",user.value)
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Evius Meet
          </Typography.Text>
        }
        description={<Button onClick={()=>window.open(`${baseUrl}?meetingId=${props.activityId}&username=${user.value?.names}&rol=1`, '_blank')} type='primary'>Entrar para transmitir</Button>}
      />
    </Card>
  );
};

export default GoToEviusMeet;
