;
import { Typography, Layout, Row, Col, Button } from 'antd';
import { useTypeActivity } from '../../../../../context/typeactivity/hooks/useTypeActivity';

const { Header, Content, Footer } = Layout;

interface propsOptions {
  title?: string;
  children: JSX.Element | JSX.Element[];
}

const LayoutTypeActivity = ({ title, children }: propsOptions) => {
  const {
    closeModal,
    selectedKey,
    previewKey,
    typeOptions,
    toggleActivitySteps,
    buttonsTextNextOrCreate,
    buttonTextPreviousOrCancel,
    disableNextButton,
  } = useTypeActivity();
  console.log('🚀 NEXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXxx', disableNextButton);
  console.log('🚀 SELECCIONE ESTE kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk', { selectedKey, typeOptions });

  const previousOrCancel = () => {
    console.log('🚀 PREVIEW KEY ', previewKey, '----------------', typeOptions.key);
    if (previewKey === 'close' || typeOptions.key === 'type') closeModal();
    if (previewKey === 'type' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
    if (previewKey !== 'preview' && typeOptions.key !== 'type') toggleActivitySteps(previewKey);
  };

  const nextOrCreate = () => {
    if (selectedKey !== 'initial') {
      toggleActivitySteps(selectedKey);
      return;
    }
    closeModal();
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
            <Button onClick={previousOrCancel}>{buttonTextPreviousOrCancel}</Button>
          </Col>
          <Col>
            <Button disabled={disableNextButton} onClick={nextOrCreate} type='primary'>
              {buttonsTextNextOrCreate}
            </Button>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};

export default LayoutTypeActivity;
