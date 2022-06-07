import { Badge, Card } from 'antd';

function LessonViewedCheck(props) {
  const { isTaken = 'false' } = props;

  return <>{isTaken && <Badge.Ribbon text='Viewed' color='green' placement='start' />}</>;
}

export default LessonViewedCheck;
