import { Button, Card, Input, Space, Tooltip, Typography } from 'antd';
import { CopyFilled } from '@ant-design/icons';
import AgendaContext from '../../../../context/AgendaContext';
import { useContext, useEffect, useState } from 'react';

const CardRTMP = () => {
  const { dataLive, copyToClipboard } = useContext(AgendaContext);
  const [dataRtmp, setDataRtmp] = useState(null);
  useEffect(() => {
    if (dataLive && dataLive?.push_url) {
      const data = dataLive?.push_url.split('/');
      const password = data[data.length - 1];
      const rtmp = dataLive.push_url.replace(password, '');
      console.log('PASSWORD==>', password, rtmp);
      setDataRtmp({ rtmp, password });
    }
  }, [dataLive]);

  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            RTMP
          </Typography.Text>
        }
        description={
          'El protocolo de mensajería en tiempo real te permite transmitir audio, video y datos a través de Internet. '
        }
      />{' '}
      <br />
      <Space direction='vertical' style={{ width: '100%' }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text>RTMP url</Typography.Text>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 31px)' }}
              disabled
              value={dataRtmp?.rtmp} /* value={linkRolProductor} */
            />
            <Tooltip title='Copiar RTMP url'>
              <Button
                onClick={() => copyToClipboard(dataRtmp?.rtmp)}
                icon={<CopyFilled style={{ color: '#0089FF' }} />}
              />
            </Tooltip>
          </Input.Group>
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text>RTMP clave</Typography.Text>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 31px)' }}
              disabled
              value={dataRtmp?.password} /* value={linkRolProductor} */
            />
            <Tooltip title='Copiar RTMP clave'>
              <Button
                onClick={() => copyToClipboard(dataRtmp?.password)}
                icon={<CopyFilled style={{ color: '#0089FF' }} />}
              />
            </Tooltip>
          </Input.Group>
        </Space>
      </Space>
    </Card>
  );
};

export default CardRTMP;
