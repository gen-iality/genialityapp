import { Badge, Card } from 'antd';

function LessonViewedCheck(props) {
  const { isTaken = false } = props;

  if (!isTaken) return null;

  return (
    <Badge.Ribbon text='Viewed' color='green' placement='end' />
  );
}

export default LessonViewedCheck;
