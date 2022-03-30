import { Typography, Layout, Row, Col, Button, Spin } from 'antd';
import { useState } from 'react';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

const { Header, Content, Footer } = Layout;

interface propsOptions {
  title?: string;
  children: JSX.Element | JSX.Element[];
}

const LayoutTypeActivity = ({ title, children }: propsOptions) => {
  const [loading, setLoading] = useState(false);
  const {
    closeModal,
    selectedKey,
    previewKey,
    typeOptions,
    toggleActivitySteps,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
    disableNextButton,
    createTypeActivity,
  } = useTypeActivity();

  const previousOrCancel = () => {
    if (previewKey === 'close' || typeOptions.key === 'type') closeModal();
    if (previewKey === 'type' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
    if (previewKey !== 'preview' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
  };

  const nextOrCreate = async () => {
    if (selectedKey !== 'initial' && buttonsTextNextOrCreate !== 'Crear') {
      toggleActivitySteps(selectedKey);
      return;
    } else if (selectedKey === 'initial') {
      closeModal();
    } else {
      setLoading(true);
      createTypeActivity();
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header style={{ textAlign: 'center', padding: '20px 0px 20px 0px' }}>
        <Typography.Title level={3}>{title}</Typography.Title>
      </Header>
      <Content style={{ padding: '60px 50px 60px 50px' }}>{children}</Content>
      <Footer style={{ backgroundColor: '#fff', padding: '20px 0px 0px 0px' }}>
        <Row justify='end' gutter={[8, 8]} /* style={{ backgroundColor: 'red' }} */>
          <Col>
            <Button onClick={previousOrCancel}>{buttonTextPreviousOrCancel}</Button>
          </Col>
          <Col>
            {!loading ? (
              <Button disabled={disableNextButton} onClick={nextOrCreate} type='primary'>
                {buttonsTextNextOrCreate}
              </Button>
            ) : (
              <Spin />
            )}
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default LayoutTypeActivity;
