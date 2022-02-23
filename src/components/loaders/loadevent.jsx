import React, { Component } from 'react';
import EventImage from '../../eventimage.png';
import { Card, Row, Col, Skeleton } from 'antd';

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
                cover={
                  <img src={EventImage} alt='Evius.co' />
                }
                bodyStyle={{ padding: '5px 0px 5px 0px' }}
              >
                <Skeleton title={false} paragraph={{rows: 3, width: [190, 230, 80]}} active/>
              </Card>
              {/* <div className='card'>
                <div className='card-image'>
                  <figure className='image is-16by9'>
                    <img src={EventImage} alt='Evius.co' />
                  </figure>
                </div>
                <div className='card-content'>
                  <div className='content'>
                    <div className='event-loading'>
                      <div className='bounce1' />
                      <div className='bounce2' />
                      <div className='bounce3' />
                    </div>
                  </div>
                </div>
              </div> */}
            </Col>
          );
        })}
      </Row>
    );
  }
}

export default LoadingEvent;
