import { useEffect } from 'react';
import { Form, Row, Select, Tabs, Input, Button, Col } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import CameraFrontVariantIcon from '@2fd/ant-design-icons/lib/CameraFrontVariant';
import CameraRearVariantIcon from '@2fd/ant-design-icons/lib/CameraRearVariant';
import CameraFlipOutlineIcon from '@2fd/ant-design-icons/lib/CameraFlipOutline';
import { SearchAndCleanButtons } from './buttonsQrModal';
import QrReader from 'react-qr-reader';

const { TabPane } = Tabs;
const { Option } = Select;

function QrAndDocumentForm({
  form,
  facingMode,
  setFacingMode,
  label,
  handleScan,
  handleError,
  searchUserByParameter,
  cleanInputSearch,
  typeScanner,
}: any) {
  /** We listen to the event of the document input to divide the captured information and be able to continue using the form of ant desing */
  useEffect(() => {
    const codigo: any = window.document.getElementById('document');

    if (codigo)
      codigo.addEventListener('keydown', (evento: any) => {
        if (evento.keyCode === 9) {
          evento.preventDefault();
          // Split items by space
          codigo.value = codigo.value + ' ';
          return false;
        }
        return;
      });
  }, []);

  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={searchUserByParameter}
      // autoComplete='off'
    >
      {typeScanner === 'scanner-qr' ? (
        <>
          <Tabs defaultValue='1'>
            <TabPane
              tab={
                <>
                  <CameraOutlined />
                  {'Camara'}
                </>
              }
              key='1'>
              <Form.Item>
                {/* <Select value={facingMode} onChange={(e) => setFacingMode(e)}>
                  <Option value='user'>Selfie</Option>
                  <Option value='environment'>Rear</Option>
                </Select> */}
                <Row justify='center' wrap gutter={8}>
                  <Col>
                    <Button
                      type='primary'
                      icon={<CameraFlipOutlineIcon />}
                      onClick={() => (facingMode === 'user' ? setFacingMode('environment') : setFacingMode('user'))}>
                      {facingMode === 'user' ? ' Front' : 'Rear'} Camera
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
              <Row justify='center' wrap gutter={8}>
                <QrReader
                  delay={500}
                  facingMode={facingMode}
                  onError={handleError}
                  onScan={handleScan}
                  style={{
                    width: '80%',
                    marginBottom: '20px',
                  }}
                />
              </Row>
            </TabPane>
            <TabPane
              tab={
                <>
                  <ExpandOutlined />
                  {'Pistola'}
                </>
              }
              key='2'>
              <>
                <Form.Item label={'Id Usuario'} name='qr'>
                  <Input autoFocus allowClear />
                </Form.Item>
              </>
            </TabPane>
          </Tabs>
        </>
      ) : (
        <>
          <Form.Item label={label} name='document'>
            <Input id='document' allowClear autoFocus />
          </Form.Item>
        </>
      )}
      <SearchAndCleanButtons cleanInputSearch={cleanInputSearch} />
    </Form>
  );
}

export default QrAndDocumentForm;
