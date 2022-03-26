import { Card, Button, Space, Typography } from 'antd';
import { DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { useTypeActivity } from '../../../../context/typeactivity/hooks/useTypeActivity';
import AgendaContext from '../../../../context/AgendaContext';
import { useContext } from 'react';
import { deleteLiveStream, stopLiveStream } from '../../../../adaptors/gcoreStreamingApi';
import { AgendaApi } from '../../../../helpers/request';
import { CurrentEventContext } from '../../../../context/eventContext';

const TransmitionOptions = (props: any) => {
  const { toggleActivitySteps, executer_stopStream } = useTypeActivity();
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
            {isVisible && dataLive?.active && (
              <Button onClick={() => executer_stopStream()} type='primary' danger>
                Detener
              </Button>
            )}
            <Button
              onClick={async () => {
                if (isVisible && meeting_id) {
                  await deleteTransmition();
                }
                await AgendaApi.editOne({ video: null }, activityEdit, cEvent?.value?._id);
                await deleteTypeActivity();
                toggleActivitySteps('initial');
              }}
              type='text'
              danger>
              <DeleteOutlined /> Eliminar {props.type}
            </Button>
          </Space>
        }
      />
    </Card>
  );
};

export default TransmitionOptions;
