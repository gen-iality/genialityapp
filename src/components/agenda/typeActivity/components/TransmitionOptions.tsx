import { Card, Button, Space, Typography, Spin, Popconfirm } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import AgendaContext from '../../../../context/AgendaContext';
import { useContext, useState } from 'react';
import { deleteLiveStream } from '../../../../adaptors/gcoreStreamingApi';
import { AgendaApi } from '../../../../helpers/request';
import { CurrentEventContext } from '../../../../context/eventContext';

const TransmitionOptions = (props: any) => {
  const { toggleActivitySteps, executer_stopStream, loadingStop } = useTypeActivity();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const { dataLive, meeting_id, deleteTypeActivity, activityEdit } = useContext(AgendaContext);
  const cEvent = useContext(CurrentEventContext);
  const deleteTransmition = async () => {
    deleteLiveStream(meeting_id);
    await deleteTypeActivity();
  };

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
            {isVisible && dataLive?.active && !loadingStop ? (
              <Button onClick={() => executer_stopStream()} type='primary' danger>
                Detener
              </Button>
            ) : (
              loadingStop && <Spin />
            )}

            {!loadingDelete ? (
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
                    await deleteTransmition();
                  }
                  await AgendaApi.editOne({ video: null }, activityEdit, cEvent?.value?._id);
                  await deleteTypeActivity();
                  toggleActivitySteps('initial');
                  setLoadingDelete(false);
                }}
                onCancel={() => console.log('cancelado')}
                okText='Si'
                cancelText='No'>
                <Button type='text' danger>
                  <DeleteOutlined />
                  {props.type === 'Transmisión' ||
                  props.type === 'EviusMeet' ||
                  props.type === 'vimeo' ||
                  props.type === 'Youtube'
                    ? 'Eliminar transmisión'
                    : props.type === 'reunión'
                    ? 'Eliminar sala de reunión'
                    : 'Eliminar video'}
                </Button>
              </Popconfirm>
            ) : (
              <Spin />
            )}
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptions;
