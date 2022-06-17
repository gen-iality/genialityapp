import { Card, Button, Space, Typography, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import AgendaContext from '../../../../context/AgendaContext';
import { useContext, useState } from 'react';
import { deleteLiveStream, deleteAllVideos } from '../../../../adaptors/gcoreStreamingApi';
import { AgendaApi, TypesAgendaApi } from '../../../../helpers/request';
import { CurrentEventContext } from '../../../../context/eventContext';
import Service from '../../../agenda/roomManager/service';
import { firestore } from '@/helpers/firebase';
const TransmitionOptions = (props: any) => {
  const { toggleActivitySteps, executer_stopStream, loadingStop } = useTypeActivity();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { dataLive, meeting_id, deleteTypeActivity, activityEdit, removeAllRequest } = useContext(AgendaContext);
  const cEvent = useContext(CurrentEventContext);
  const deleteTransmition = async () => {
    deleteLiveStream(meeting_id);
    await deleteTypeActivity();
  };
  const refActivity = `request/${cEvent.value?._id}/activities/${activityEdit}`;
  const isVisible = props.type === 'Transmisión' || props.type === 'EviusMeet';

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Opciones de {props.type}
          </Typography.Text>
        }
        avatar={<WarningOutlined style={{ color: '#FE5455', fontSize: '25px' }} />}
        description={
          <Space>
            {isVisible && dataLive?.active && (
              <Button loading={loadingStop} type='primary' danger onClick={() => executer_stopStream()}>
                Detener
              </Button>
            )}

            {
              <Popconfirm
                title={`¿Está seguro que desea ${
                  props.type === 'Transmisión' ||
                  props.type === 'EviusMeet' ||
                  props.type === 'vimeo' ||
                  props.type === 'Youtube'
                    ? 'eliminar transmisión'
                    : props.type === 'reunión'
                    ? 'eliminar sala de reunión'
                    : 'eliminar video'
                }? `}
                onConfirm={async () => {
                  setLoadingDelete(true);
                  if (isVisible && meeting_id) {
                    await deleteAllVideos(dataLive.name, meeting_id);
                    await removeAllRequest(refActivity);
                    await deleteTransmition();
                  }
                  const thing = await AgendaApi.editOne({ video: null }, activityEdit, cEvent?.value?._id);
                  await deleteTypeActivity();
                  toggleActivitySteps('initial');
                  setLoadingDelete(false);
                  // Force to delete that, right? I will need the non-existent doc
                  const deleted = await TypesAgendaApi.deleteOne(thing.type._id, cEvent?.value?._id);
                  console.log('deleted', deleted)
                }}
                onCancel={() => console.log('cancelado')}
                okText='Sí'
                cancelText='No'>
                <Button loading={loadingDelete} danger>
                  Eliminar
                </Button>
              </Popconfirm>
            }
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptions;
