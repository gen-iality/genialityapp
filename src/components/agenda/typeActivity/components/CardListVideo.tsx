import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { DownloadOutlined, PlaySquareOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, List, Button, Image, Tooltip } from 'antd';

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
              <p>Videos grabados</p>
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
                <Tooltip title='Descargar'>
                  <Button
                    icon={<DownloadOutlined />}
                    type='link'
                    onClick={() => dowloadVideo(item.url)}
                    key='list-loadmore-edit'></Button>
                </Tooltip>,
                <Tooltip title='Visualizar'>
                  <Button
                    type='link'
                    icon={<PlaySquareOutlined />}
                    onClick={() => visualizeVideo(item.hls_url, item.created_at, item.name)}
                    key='list-loadmore-edit'></Button>
                </Tooltip>,
              ]}>
              <List.Item.Meta
                avatar={<Image style={{ borderRadius: '5px' }} preview={false} width={80} src={item.image} />}
                title={item.name}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CardListVideo;
