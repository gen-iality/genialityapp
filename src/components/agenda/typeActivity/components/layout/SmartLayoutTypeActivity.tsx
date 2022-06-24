import { Typography, Layout, Row, Col, Button, Spin } from 'antd';
import { useState } from 'react';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

export interface SmartLayoutTypeActivityProps {
  title?: string;
  onSetType: (typeString: string) => void;
  children: JSX.Element | JSX.Element[];
  onClosedForm: () => void,
}

const SmartLayoutTypeActivity = (props: SmartLayoutTypeActivityProps) => {
  const {
    title,
    children,
    onSetType,
    onClosedForm,
  } = props;

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

  const handleClosePopup = () => {
    closeModal();
    onClosedForm();
  }

  const handleButtonPreviousClick = () => {
    if (previewKey === 'close' || typeOptions.key === 'type') handleClosePopup();
    if (previewKey === 'type' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
    if (previewKey !== 'preview' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
  };

  const handleButtonNextClick = async () => {
    if (selectedKey !== 'initial' && buttonsTextNextOrCreate !== 'Crear') {
      toggleActivitySteps(selectedKey);
      return;
    } else if (selectedKey === 'initial') {
      handleClosePopup();
    } else {
      await onSetType(typeOptions.key);
      handleClosePopup();
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

      <Footer
        style={{
          backgroundColor: '#fff',
          padding: '20px 0px 0px 0px',
        }}
      >
        <Row justify='end' gutter={[8, 8]}>
          <Col>
            <Button onClick={handleButtonPreviousClick}>
              {buttonTextPreviousOrCancel}
            </Button>
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
