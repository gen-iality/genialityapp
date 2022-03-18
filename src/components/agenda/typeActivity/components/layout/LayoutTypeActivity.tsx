import React from 'react';
import { Typography, Layout, Row, Col, Button } from 'antd';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

const { Header, Content, Footer } = Layout;

interface propsOptions {
  title?: string;
  children: React.ReactChild;
}

const LayoutTypeActivity = ({ title, children }: propsOptions) => {
  const { closeModal, activityOptions, selectActivitySteps } = useTypeActivity();
  console.log('🚀 debug ~ LayoutTypeActivity ~ activityOptions', activityOptions);

  const previousOrCancel = () => {
    if (activityOptions.prevView !== 'initial') {
      selectActivitySteps(activityOptions.prevView);
      return;
    }

    closeModal();
  };

  const nextOrCreate = () => {
    if (activityOptions.nextView !== 'create') {
      selectActivitySteps(activityOptions.nextView);
      return;
    }
    console.log('🚀 ***CREAR TRANSMISION***');

    closeModal();
  };

  const buttonsTextRenderValidation = (validate: string) => {
    if (validate === 'previousOrCancel') {
      if (activityOptions.prevView === 'initial') return 'Cancelar';
      if (activityOptions.prevView !== 'initial') return 'Anterior';
    }

    if (activityOptions.nextView !== 'create') return 'Siguiente';
    else return 'Crear';
  };

  return (
    <Layout>
      <Header style={{ textAlign: 'center', padding: '0px 0px 20px 0px' }}>
        <Typography.Title level={2}>{title}</Typography.Title>
      </Header>
      <Content style={{ padding: '20px 50px 20px 50px' }}>{children}</Content>
      <Footer style={{ backgroundColor: '#fff', padding: '20px 0px 0px 0px' }}>
        <Row justify='end' gutter={[8, 8]} /* style={{ backgroundColor: 'red' }} */>
          <Col>
            <Button onClick={previousOrCancel}>{buttonsTextRenderValidation('previousOrCancel')}</Button>
          </Col>
          <Col>
            <Button onClick={nextOrCreate} type='primary'>
              {buttonsTextRenderValidation('nextOrCreate')}
            </Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default LayoutTypeActivity;
