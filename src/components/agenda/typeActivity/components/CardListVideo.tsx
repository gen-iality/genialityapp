import AgendaContext from '@/context/AgendaContext';
import { CurrentEventContext } from '@/context/eventContext';
import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { AgendaApi } from '@/helpers/request';
import {
  BorderOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlaySquareOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Card, List, Button, Image, Tooltip, Typography, message, Spin, Popconfirm } from 'antd';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';

const CardListVideo = (props: any) => {
  const { visualizeVideo } = useTypeActivity();
  const { activityEdit } = useContext(AgendaContext);
  const cEvent = useContext(CurrentEventContext);
  const [selectVideo, setSelectVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyVideo, setKeyVideo] = useState<string | null>(null);

  useEffect(() => {
    if (activityEdit) {
      obtenerDetalleActivity();
    }
    async function obtenerDetalleActivity() {
      const agenda = await AgendaApi.getOne(activityEdit);
      if (agenda.video) {
        setSelectVideo(agenda.video);
      }
    }
  }, [props?.videos]);

  const asignarVideo = async (url: string) => {
    setKeyVideo(url);
    setLoading(true);
    try {
      if (activityEdit && cEvent?.value?._id && url) {
        const urlVideo = url == selectVideo ? null : url;
        const video = await AgendaApi.editOne({ video: url == urlVideo }, activityEdit, cEvent?.value?._id);
        if (video) {
          setSelectVideo(urlVideo);
          message.success('Asignado correctamente el video');
        } else {
          message.error('Error al asignar el video');
        }
      } else {
        message.error('No se puede asignar el video');
      }
    } catch (e) {
      message.error('Error al asignar el video');
    }
    setLoading(false);
    setKeyVideo(null);
  };

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
                <Tooltip color={'green'} title='Asignar a esta actividad'>
                  <Button
                    size='large'
                    icon={
                      !loading && item.hls_url == selectVideo ? (
                        <CheckSquareOutlined style={{ color: '#52C41A' }} />
                      ) : keyVideo !== item.hls_url ? (
                        <BorderOutlined />
                      ) : (
                        keyVideo == item.hls_url && <Spin />
                      ) /* sin asignar es <BorderOutlined /> y asigando es <CheckSquareOutlined />  */
                    }
                    type='text'
                    onClick={() => asignarVideo(item.hls_url)}
                    key='option-assign'></Button>
                </Tooltip>,
                <Tooltip title='Descargar'>
                  <Button
                    size='large'
                    icon={<DownloadOutlined />}
                    type='link'
                    onClick={() => dowloadVideo(item.url)}
                    key='option-dowload'></Button>
                </Tooltip>,
                <Tooltip title='Visualizar'>
                  <Button
                    size='large'
                    type='text'
                    icon={<PlaySquareOutlined />}
                    onClick={() => visualizeVideo(item.hls_url, item.created_at, item.name)}
                    key='option-preview'></Button>
                </Tooltip>,
                ,
                <Popconfirm
                  title={'¿Está seguro que deseas eliminar esta grabación?'}
                  onCancel={() => console.log('cancelado')}
                  onConfirm={() => console.log('eliminar')}
                  okText='Si'
                  cancelText='No'>
                  <Tooltip color={'red'} title='Eliminar video'>
                    <Button danger size='large' icon={<DeleteOutlined />} type='text' key='option-delete'></Button>
                  </Tooltip>
                </Popconfirm>,
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
