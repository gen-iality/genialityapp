import * as React from 'react';

import { Typography, Layout, Row, Col, Button, Spin } from 'antd';

import { ModalWrapperUIProps } from '../interfaces/ModalWrapperUIProps';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export interface ActivityTypeModalLayoutProps extends ModalWrapperUIProps {
  somethingWasSelected: boolean,
  render: () => React.ReactNode,
};

function ActivityTypeModalLayout(props: ActivityTypeModalLayoutProps) {
  const {
    render,
    somethingWasSelected,
    // Inheret
    title,
    onClose = () => {},
    onConfirm = () => {},
  } = props;

  const handleSelectButton = () => {
    console.debug('somethingWasSelected', somethingWasSelected);
    if (somethingWasSelected) {
      onConfirm();
      onClose(true);
      console.debug('confirm & close modal');
    }
  };

  return (
    <Layout>
      <Header style={{ textAlign: 'center', padding: '20px 0px 20px 0px' }}>
        <Title level={3}>
          {title}
        </Title>
      </Header>

      <Content style={{ padding: '60px 50px 60px 50px' }}>
        {render()}
      </Content>

      <Footer style={{ backgroundColor: '#fff', padding: '20px 0px 0px 0px' }}>
        <Row justify='end' gutter={[8, 8]}>
          <Col>
            <Button
              disabled={!somethingWasSelected}
              type='primary'
              onClick={handleSelectButton}
            >
              Seleccionar
            </Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
}

export default ActivityTypeModalLayout;
