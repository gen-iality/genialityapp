import { Col, Image, Row } from 'antd';
import { useState } from 'react';
import { PropsSponsor } from '../types/Prelanding';

const SponsorBlock = ({ sponsors } : PropsSponsor ) => {

  const [efectVisual, setEfectVisual] = useState<{ key: number | null, value: string }>({ key: null, value: '100%' });


  return (
    <Row justify='center' align='middle' gutter={[32, 0]}>
      {sponsors?.map(
        (sponsor, index) =>
          sponsor.visible && (
            <Col key={`col-${sponsor.id}`}>
              <Image
                preview={false}
                style={{
                  width: '200px',
                  aspectRatio: '4/4',
                  objectFit: 'contain',
                  filter: `grayscale(${efectVisual.key === index ? efectVisual.value : '100%'})`,
                }}
                key={sponsor.id}
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
