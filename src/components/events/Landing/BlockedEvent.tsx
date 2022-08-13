import { Result } from 'antd';

const BlockedEvent = (props: any) => {
  const formatDate = props.location.state;
  return <Result status={403} title={`Evento no disponible desde el ${formatDate}`} />;
};

export default BlockedEvent;
