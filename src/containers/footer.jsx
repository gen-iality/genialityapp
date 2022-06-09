import { Link } from 'react-router-dom';
import { Layout, Row, Col, Divider, List, Typography, Space } from 'antd';
import { FacebookFilled, InstagramFilled, LinkedinFilled } from '@ant-design/icons';
import { imageUtils } from '../Utilities/ImageUtils';

const Footer = () => {
  return (
    <Layout.Footer style={{ backgroundColor: '#111827' }}>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
          <List
            header={
              <Typography.Title style={{ color: '#fff' }} level={5}>
                GENIALITY
              </Typography.Title>
            }
            bordered={false}>
            <List.Item style={{ border: 'none' }}>
              <a target='_blank' href='https://geniality.com.co/' style={{ color: '#fff' }}>
                Inicio
              </a>
            </List.Item>
            <List.Item style={{ border: 'none' }}>
              <a target='_blank' href='https://geniality.com.co/' style={{ color: '#fff' }}>
                Tipos de cursos
              </a>
            </List.Item>
            <List.Item style={{ border: 'none' }}>
              <a target='_blank' href='https://geniality.com.co/' style={{ color: '#fff' }}>
                Casos de éxito
              </a>
            </List.Item>
            <List.Item style={{ border: 'none' }}>
              <a target='_blank' href='https://geniality.com.co/' style={{ color: '#fff' }}>
                Solicitar demo
              </a>
            </List.Item>
          </List>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
          <List
            header={
              <Typography.Title style={{ color: '#fff' }} level={5}>
                Ayuda
              </Typography.Title>
            }
            bordered={false}>
            <List.Item style={{ border: 'none' }}>
              <a target='_blank' href='https://geniality.com.co/' style={{ color: '#fff' }}>
                ¿Quiénes somos?
              </a>
            </List.Item>
            <List.Item style={{ border: 'none' }}>
              <Link to={'/faqs'} style={{ color: '#fff' }}>
                FAQS
              </Link>
            </List.Item>
          </List>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
          <List
            header={
              <Typography.Title style={{ color: '#fff' }} level={5}>
                Legal
              </Typography.Title>
            }
            bordered={false}>
            <List.Item style={{ border: 'none' }}>
              <Link to={'/terms'} style={{ color: '#fff' }}>
                Términos y condiciones
              </Link>
            </List.Item>
            <List.Item style={{ border: 'none' }}>
              <Link to={'/privacy'} style={{ color: '#fff' }}>
                Privacidad
              </Link>
            </List.Item>
            <List.Item style={{ border: 'none' }}>
              <Link to={'/policies'} style={{ color: '#fff' }}>
                Políticas
              </Link>
            </List.Item>
          </List>
        </Col>
      </Row>
      <Divider style={{ backgroundColor: '#fff' }} />
      <Row gutter={[0, 8]} wrap justify='space-between'>
        <Col
          xs={{ order: 2 }}
          sm={{ order: 2 }}
          md={{ order: 1 }}
          lg={{ order: 1 }}
          xl={{ order: 1 }}
          xxl={{ order: 1 }}>
          <img src={imageUtils.LogoSvg} width={200} />
        </Col>
        <Col
          xs={{ order: 1 }}
          sm={{ order: 1 }}
          md={{ order: 2 }}
          lg={{ order: 2 }}
          xl={{ order: 2 }}
          xxl={{ order: 2 }}>
          <Space wrap>
            <a
              href='https://www.linkedin.com/in/sandra-segura-2aa0251b6/#experience'
              target='_blank'
              style={{ color: '#fff' }}>
              <FacebookFilled style={{ fontSize: '35px' }} />
            </a>
            <a
              href='https://www.linkedin.com/in/sandra-segura-2aa0251b6/#experience'
              target='_blank'
              style={{ color: '#fff' }}>
              <InstagramFilled style={{ fontSize: '35px' }} />
            </a>
            <a
              href='https://www.linkedin.com/in/sandra-segura-2aa0251b6/#experience'
              target='_blank'
              style={{ color: '#fff' }}>
              <LinkedinFilled style={{ fontSize: '35px' }} />
            </a>
          </Space>
        </Col>
      </Row>
    </Layout.Footer>
  );
};

export default Footer;
