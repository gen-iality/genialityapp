import { Component } from 'react';
import { Card, Row, Col, Skeleton } from 'antd';
import { imageUtils } from '../../Utilities/ImageUtils';
class LoadingEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const events = [0, 1, 2, 3, 4, 5, 6, 7];
    return (
      <Row gutter={[16, 16]}>
        {events.map((event, key) => {
          return (
            <Col key={key} xs={24} sm={12} md={12} lg={8} xl={6}>
              <Card
                bordered={false}
                style={{ width: '100%' }}
                cover={<img src={imageUtils.EventImage} alt='Evius.co' />}
                bodyStyle={{ padding: '5px 0px 5px 0px' }}>
                <Skeleton title={false} paragraph={{ rows: 3, width: [190, 230, 80] }} active />
              </Card>
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default LoadingEvent;
