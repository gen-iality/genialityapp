import { Button, Card, Col, Image, Result, Space, Typography } from 'antd';
import {  Certificates } from '../types';
import { DownloadOutlined } from '@ant-design/icons';
import { generateCert } from '../helpers/certificados.helper';

interface Props {
  certificate: Certificates;
  isMobile: boolean;
  eventValue: any;
  eventUserValue: any;
}
export const CertificateItem = ({ certificate, isMobile, eventValue, eventUserValue }: Props) => {
  return (
    <Col key={'certi' + certificate._id} xs={24} sm={12} md={8} lg={8} xl={8} xxl={8}>
      <Card bordered={false} bodyStyle={{ padding: 0, backgroundColor: eventValue.styles.toolbarDefaultBg }}>
        <Image style={{ borderRadius: 15 }} src={certificate.background} alt={certificate.name} preview={false} />
        <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
          <div style={{ display: 'flex', alignContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
            <Result
              icon={<></>}
              title={
                <Space direction='vertical'>
                  <Typography.Text>{certificate.name}</Typography.Text>
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    onClick={() => generateCert(eventUserValue, certificate, eventValue)}
                    style={{
                      border: 'none',
                      boxShadow: 'none',
                      backgroundColor: eventValue.styles.toolbarDefaultBg,
                    }}
                    key={'download' + certificate._id}
                    icon={<DownloadOutlined style={{ color: eventValue.styles.textMenu }} />}>
                    <Typography.Text style={{ color: eventValue.styles.textMenu }}>Descargar</Typography.Text>
                  </Button>
                </Space>
              }
              style={{ width: '100%', height: '100%', padding: isMobile ? '20px' : '48px 32px' }}
            />
          </div>
        </div>
      </Card>
    </Col>
  );
};
