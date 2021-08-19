import { Card, Space, Typography } from 'antd';

import Moment from 'moment';
import React from 'react'
import ReactPlayer from 'react-player';

const videoCard = (props) => {

    const preview = props.video ? props.video : 'https://www.youtube.com/embed/kVl9mEoQSgA'
    const nameVideo = props.nameVideo ? props.nameVideo : 'Nombre del video (Es el nombre de la actividad)'
    
     
    const { Meta } = Card;
    const {Paragraph} =Typography
    return (
        <Card
        bordered={false}
        bodyStyle={{padding:'10px 0px 0px 0px'}}
        style={{width:'250px'}}
         cover={
                (
                <ReactPlayer
                    light={true}
                    width={'100%'}
                    height={'150px'}
                    url={preview}
                  />
                )
              }>
          <Meta description={
                  <div>
                      <Space direction='vertical' size={-10}>
                    <Paragraph ellipsis={{rows:2}}>{nameVideo}</Paragraph>
                    <span style={{ fontSize: '10px' }}>
                      <Space size='small'>
                        <i className='fas fa-calendar-alt' />
                        <time dateTime={Moment()}>{Moment().format('DD MMM YYYY')}</time>
                       
                      </Space>
                    </span>
                    </Space>
                    
                    
                  </div>
                }/>
        </Card>
    )
}

export default videoCard
