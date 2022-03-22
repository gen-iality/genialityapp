;
import { Button, Card, Input, Space, Tooltip, Typography } from 'antd';
import { CopyFilled } from '@ant-design/icons';

const CardShareLinkEviusMeet = () => {
  return (
    <Card bodyStyle={{ padding: '21' }} style={{ borderRadius: '8px' }}>
      <Card.Meta
        title={
          <Typography.Text style={{ fontSize: '20px' }} strong>
            Enlaces para participantes
          </Typography.Text>
        }
        description={'Lorem ipsum dolor sit amet consectetur adipisicing elit. '}
      />{' '}
      <br />
      <Space direction='vertical' style={{ width: '100%' }}>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text>Enlace para host</Typography.Text>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 31px)' }}
              disabled
              value={
                'https://eviusmeets.netlify.app/prepare?meetingId=617854261432914e2026a544&rtmp=rtmp://027156.entrypoint.cloud.wowza.com/app-Jk5Q65d5/eWpOdnZy'
              } /* value={linkRolProductor} */
            />
            <Tooltip title='Copiar productor url'>
              <Button
                /* onClick={() => copyToClipboard('Productor')} */
                /* icon={
                    copySuccessProductor ? (
                      <CheckCircleFilled style={{ color: '#52C41A' }} />
                    ) : (
                      <CopyFilled style={{ color: '#0089FF' }} />
                    )
                  } */
                icon={<CopyFilled style={{ color: '#0089FF' }} />}
              />
            </Tooltip>
          </Input.Group>
        </Space>
        <Space direction='vertical' style={{ width: '100%' }}>
          <Typography.Text>Enlace para speakers</Typography.Text>
          <Input.Group compact>
            <Input
              style={{ width: 'calc(100% - 31px)' }}
              disabled
              value={
                'https://eviusmeets.netlify.app/prepare?meetingId=617854261432914e2026a544&rtmp=rtmp://027156.entrypoint.cloud.wowza.com/app-Jk5Q65d5/eWpOdnZy'
              } /* value={linkRolProductor} */
            />
            <Tooltip title='Copiar speaker url'>
              <Button
                /* onClick={() => copyToClipboard('Productor')} */
                /* icon={
                    copySuccessProductor ? (
                      <CheckCircleFilled style={{ color: '#52C41A' }} />
                    ) : (
                      <CopyFilled style={{ color: '#0089FF' }} />
                    )
                  } */
                icon={<CopyFilled style={{ color: '#0089FF' }} />}
              />
            </Tooltip>
          </Input.Group>
        </Space>
      </Space>
    </Card>
  );
};

export default CardShareLinkEviusMeet;
