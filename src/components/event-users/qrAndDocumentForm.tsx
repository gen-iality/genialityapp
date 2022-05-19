import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import { Form, Row, Select, Tabs, Input } from 'antd';
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
  return (
    <Form layout='vertical' form={form} onFinish={searchUserByParameter}>
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
                <Select value={facingMode} onChange={(e) => setFacingMode(e)}>
                  <Option value='user'>Selfie</Option>
                  <Option value='environment'>Rear</Option>
                </Select>
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
            <Input allowClear autoFocus />
          </Form.Item>
        </>
      )}
      <SearchAndCleanButtons cleanInputSearch={cleanInputSearch} />
    </Form>
  );
}

export default QrAndDocumentForm;
