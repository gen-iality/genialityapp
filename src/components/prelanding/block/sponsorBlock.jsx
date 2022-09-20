import { Card, Col, Grid, Image, Row } from 'antd';
import { CurrentEventContext } from '@/context/eventContext';
import { useContext, useState } from 'react';
const { useBreakpoint } = Grid;

const SponsorBlock = ({ sponsors = [] }) => {
  const screens = useBreakpoint();
  const cEvent = useContext(CurrentEventContext);
  const [efectVisual, setEfectVisual] = useState({ key: null, value: '100%' });
  const bgColor = cEvent.value?.styles?.toolbarDefaultBg;
  const textColor = cEvent.value?.styles?.textMenu;

  return (
    <Row justify='center' align='middle' gutter={[32, 0]}>
      {sponsors?.map(
        (sponsor, index) =>
          sponsor.visible && (
            <Col>
              <Image
                preview={false}
                style={{
                  width: '200px',
                  aspectRatio: '4/4',
                  objectFit: 'contain',
                  filter: `grayscale(${efectVisual.key === index ? efectVisual.value : '100%'})`,
                }}
                key={index}
                src={sponsor?.list_image}
                alt={`sponsor-${sponsor.name}`}
                onMouseEnter={() => setEfectVisual({ key: index, value: '0%' })}
                onMouseLeave={() => setEfectVisual({ key: null, value: '100%' })}
              />
            </Col>
          )
      )}
    </Row>
  );
};

export default SponsorBlock;
