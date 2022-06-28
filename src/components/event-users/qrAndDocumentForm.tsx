import { useEffect } from 'react';
import { Form, Row, Select, Tabs, Input, Button, Col } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import CameraFlipOutlineIcon from '@2fd/ant-design-icons/lib/CameraFlipOutline';
import { SearchAndCleanButtons } from './buttonsQrModal';
// @ts-ignore: Unreachable code error
import QrReader from 'react-qr-reader';
import { divideInformationObtainedByTheCodeReader } from '@/Utilities/checkInUtils';

const { TabPane } = Tabs;

function QrAndDocumentForm({
  form,
  facingMode,
  setFacingMode,
  label,
  handleScan,
  handleError,
  searchAttendeeByParameter,
  cleanInputSearch,
  typeScanner,
}: any) {
  /** We listen to the event of the document input to divide the captured information and be able to continue using the form of ant desing */

  return (
    <Form
      layout='vertical'
      form={form}
      onFinish={searchAttendeeByParameter}
      // autoComplete='off'
    >
      {typeScanner === 'scanner-qr' ? (
        <>
          <Tabs defaultValue='1' destroyInactiveTabPane={true}>
            <TabPane
              tab={
                <>
                  <CameraOutlined />
                  {'Camara'}
                </>
              }
              key='1'>
              <Form.Item>
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
                  delay={1500}
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
                <Form.Item
                  label={'Id Usuario'}
                  name='qr'
                  rules={[{ required: true, message: 'El campo Id Usuario no debe estar vacío!' }]}>
                  <Input autoFocus allowClear />
                </Form.Item>
              </>
            </TabPane>
          </Tabs>
        </>
      ) : (
        <>
          <Form.Item
            label={label}
            name='document'
            rules={[{ required: true, message: 'El campo documentó no debe estar vacío!' }]}>
            <Input
              onKeyDown={(event: any) => divideInformationObtainedByTheCodeReader({ event })}
              id='document'
              allowClear
              autoFocus
            />
          </Form.Item>
        </>
      )}
      <SearchAndCleanButtons cleanInputSearch={cleanInputSearch} />
    </Form>
  );
}

export default QrAndDocumentForm;
