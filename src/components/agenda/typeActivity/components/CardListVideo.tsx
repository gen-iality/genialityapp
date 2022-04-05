import { DownloadOutlined } from '@ant-design/icons';
import { Card, List, Button } from 'antd';
import React from 'react';

const CardListVideo = (props: any) => {
  console.log('%c🆗 - Videos', 'color: #00A6ED;', props.videos);
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      {props.videos && (
        <List
          header={<div>Listado de videos</div>}
          bordered={false}
          dataSource={props.videos}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <Button type='link' href={item.download} key='list-loadmore-edit'>
                  Descargar
                </Button>,
                <a onClick={() => props.toggleActivitySteps('visualize', { data: item?.url })} key='list-loadmore-edit'>
                  Visualizar
                </a>,
              ]}>
              <p>{item.name}</p>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CardListVideo;
