import { deleteVideo } from '@/adaptors/gcoreStreamingApi';
import AgendaContext from '@/context/AgendaContext';
import { CurrentEventContext } from '@/context/eventContext';
import { useTypeActivity } from '@/context/typeactivity/hooks/useTypeActivity';
import { milisegundosTohour } from '@/helpers/helperFormatMseconds';
import { AgendaApi } from '@/helpers/request';
import {
  BorderOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlaySquareOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Card, List, Button, Image, Tooltip, Typography, message, Spin, Popconfirm, Tag } from 'antd';
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
  const obtenerStatus = (status: string) => {
    return status == 'ready' ? 'Procesado' : 'Procesando...';
  };

  const asignarVideo = async (url: string) => {
    setKeyVideo(url);
    setLoading(true);
    try {
      if (activityEdit && cEvent?.value?._id && url) {
        const urlVideo = url === selectVideo ? null : url;
        const video = await AgendaApi.editOne({ video: urlVideo }, activityEdit, cEvent?.value?._id);
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
                    disabled={item?.status == 'ready' ? false : true}
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
                    disabled={item?.status == 'ready' ? false : true}
                    download={'video.mp4'}
                    href={item.download}
                    key='option-dowload'></Button>
                </Tooltip>,
                <Tooltip title='Visualizar'>
                  <Button
                    size='large'
                    type='text'
                    disabled={item?.status == 'ready' ? false : true}
                    icon={<PlaySquareOutlined />}
                    onClick={() => visualizeVideo(item.hls_url, item.created_at, item.name)}
                    key='option-preview'></Button>
                </Tooltip>,
                ,
                <Popconfirm
                  title={'¿Está seguro que deseas eliminar esta grabación?'}
                  onCancel={() => console.log('cancelado')}
                  onConfirm={async () => {
                    const resp = await deleteVideo(item.id);
                    if (resp) {
                      await props.refreshData();
                      message.success('Video borrado correctamente.');
                    } else {
                      message.error('Error al eliminar video');
                    }
                  }}
                  okText='Si'
                  cancelText='No'>
                  <Tooltip color={'red'} title='Eliminar video'>
                    <Button
                      danger
                      size='large'
                      icon={<DeleteOutlined />}
                      disabled={item?.status == 'ready' ? false : true}
                      type='text'
                      key='option-delete'></Button>
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
                title={<p>{item.name + '  ' + '(' + obtenerStatus(item?.status) + ')'}</p>}
                description={
                  <>
                    {' '}
                    {moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                    <Tag style={{ marginLeft: 20 }}>{milisegundosTohour(item?.duration)}</Tag>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CardListVideo;
