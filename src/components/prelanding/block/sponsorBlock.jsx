import { Grid, Row } from 'antd';
import { CurrentEventContext } from '@/context/eventContext';
import { useContext } from 'react';
const { useBreakpoint } = Grid;

const SponsorBlock = () => {
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;
  return <Row>Aqui patrocinadores</Row>;
};

export default SponsorBlock;
