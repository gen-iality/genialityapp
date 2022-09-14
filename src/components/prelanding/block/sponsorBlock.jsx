import { Card, Grid, Row } from 'antd';
import { CurrentEventContext } from '@/context/eventContext';
import { useContext } from 'react';
const { useBreakpoint } = Grid;

const SponsorBlock = ({ sponsors = [] }) => {
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;
  return (
    <Row>
      {sponsors?.map((sponsor, index) => (
        <>
          {sponsor.visible && (
            <Card title={sponsor.name} style={{ margin: '0 10px 0 10px', textAlign: 'center' }}>
              <img width={100} key={index} src={sponsor?.list_image} alt={`sponsor${index}`} />
            </Card>
          )}
        </>
      ))}
    </Row>
  );
};

export default SponsorBlock;
