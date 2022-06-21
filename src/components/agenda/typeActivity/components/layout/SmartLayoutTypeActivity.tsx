import { Typography, Layout, Row, Col, Button, Spin } from 'antd';
import { useState } from 'react';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export interface SmartLayoutTypeActivityProps {
  title?: string;
  onSetType: (typeString: string) => void;
  children: JSX.Element | JSX.Element[];
}

const SmartLayoutTypeActivity = ({ title, children, onSetType }: SmartLayoutTypeActivityProps) => {
  const {
    closeModal,
    selectedKey,
    previewKey,
    typeOptions,
    toggleActivitySteps,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
    disableNextButton,
    loadingCreate,
    // createTypeActivity,
  } = useTypeActivity();

  const handleButtonPreviousClick = () => {
    if (previewKey === 'close' || typeOptions.key === 'type') closeModal();
    if (previewKey === 'type' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
    if (previewKey !== 'preview' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
  };

  const handleButtonNextClick = async () => {
    if (selectedKey !== 'initial' && buttonsTextNextOrCreate !== 'Crear') {
      toggleActivitySteps(selectedKey);
      return;
    } else if (selectedKey === 'initial') {
      closeModal();
    } else {
      await onSetType(typeOptions.key);
      closeModal();
      // await createTypeActivity();
    }
  };

  return (
    <Layout>
      <Header style={{ textAlign: 'center', padding: '20px 0px 20px 0px' }}>
        <Title level={3}>
          {title || 'Sin título'}
        </Title>
      </Header>

      <Content style={{ padding: '60px 50px 60px 50px' }}>
        {children}
      </Content>

      <Footer style={{ backgroundColor: '#fff', padding: '20px 0px 0px 0px' }}>
        <Row justify='end' gutter={[8, 8]}>
          <Col>
            <Button onClick={handleButtonPreviousClick}>{buttonTextPreviousOrCancel}</Button>
          </Col>
          <Col>
            {loadingCreate ? <div style={{ width: 60 }}><Spin /></div> : (
              <Button
                disabled={disableNextButton}
                onClick={handleButtonNextClick}
                type='primary'
              >
                {buttonsTextNextOrCreate}
              </Button>
            )}
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default SmartLayoutTypeActivity;
