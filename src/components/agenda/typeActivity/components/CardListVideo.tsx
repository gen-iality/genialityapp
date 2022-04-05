import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { ReloadOutlined } from '@ant-design/icons';
import { Card, List, Button } from 'antd';

const CardListVideo = (props: any) => {
  console.log('%c🆗 - Videos', 'color: #00A6ED;', props.videos);
  const { visualizeVideo } = useTypeActivity();

  const dowloadVideo = async (url: string) => {
    console.log('URL===>', url);
    fetch(url)
      .then((response) => response.blob())
      .then((video) => {
        console.log('RESPONSE==>', video);
        const url = window.URL.createObjectURL(video);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'video.mp4');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      {props.videos && (
        <List
          header={
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p>Listado de videos</p>
              <Button onClick={() => props.refreshData()}>
                <ReloadOutlined />
              </Button>
            </div>
          }
          bordered={false}
          dataSource={props.videos}
          renderItem={(item: any) => (
            <List.Item
              actions={[
                <Button type='link' onClick={() => dowloadVideo(item.url)} key='list-loadmore-edit'>
                  Descargar
                </Button>,
                <a onClick={() => visualizeVideo(item.hls_url)} key='list-loadmore-edit'>
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
