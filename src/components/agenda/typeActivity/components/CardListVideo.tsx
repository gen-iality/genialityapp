import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { BorderOutlined, DownloadOutlined, PlaySquareOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, List, Button, Image, Tooltip, Typography } from 'antd';
import moment from 'moment';

const CardListVideo = (props: any) => {
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
              <Typography.Text strong>Videos grabados</Typography.Text>
              <Button icon={<ReloadOutlined />} onClick={() => props.refreshData()}>
                Actualizar lista
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
                    size='large'
                    icon={<DownloadOutlined />}
                    type='link'
                    onClick={() => dowloadVideo(item.url)}
                    key='list-loadmore-edit'></Button>
                </Tooltip>,
                <Tooltip title='Visualizar'>
                  <Button
                    size='large'
                    type='text'
                    icon={<PlaySquareOutlined />}
                    onClick={() => visualizeVideo(item.hls_url, item.created_at, item.name)}
                    key='list-loadmore-edit'></Button>
                </Tooltip>,
                <Tooltip placement='left' color={'blue'} title='Asignar a esta actividad'>
                  <Button
                    size='large'
                    icon={
                      <BorderOutlined /> /* sin asignar es <BorderOutlined /> y asigando es <CheckSquareOutlined />  */
                    }
                    type='text'
                    onClick={() => console.log('asignar')}
                    key='list-loadmore-edit'></Button>
                </Tooltip>,
              ]}>
              <List.Item.Meta
                avatar={
                  <Image
                    style={{ borderRadius: '5px' }}
                    preview={false}
                    width={100}
                    height={60}
                    src={item.image}
                    alt='Miniatura del video'
                    fallback={'https://www.labgamboa.com/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg'}
                  />
                }
                title={item.name}
                description={moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CardListVideo;
