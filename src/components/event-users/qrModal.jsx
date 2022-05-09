import { Component } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { FaCamera } from 'react-icons/fa';
import { IoIosQrScanner, IoIosCamera } from 'react-icons/io';
import QrReader from 'react-qr-reader';
import { firestore } from '../../helpers/firebase';
import { Modal, Row, Col, Tabs, Button, Select, Input, Form, Typography, Alert, InputNumber, Spin } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@/context/MessageService';
import axios from 'axios';
import { useRequest } from '@/services/useRequest';
import { getFieldDataFromAnArrayOfFields } from '@/Utilities/generalUtils';
import FormEnrollUserToEvent from '../forms/FormEnrollUserToEvent';

const { TabPane } = Tabs;
const { Option } = Select;
const { Title } = Typography;
const ApiUrl = process.env.VITE_API_URL;

const html = document.querySelector('html');
class QrModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'camera',
      facingMode: 'user',
      qrData: {},
      nextreadcc: true,
      saveqrsscanner: [],
      formVisible: false,
      checkInLoader: false,
    };
  }

  handleScan = (data) => {
    if (!data) {
      return;
    }

    let pos = this.props.usersReq
      .map((e) => {
        return e._id;
      })
      .indexOf(data);

    const qrData = {};
    if (pos >= 0) {
      this.setState({ documentOrId: data });
      this.searchCC('qr');
    } else {
      qrData.msg = 'User not found';
      qrData.another = true;
      qrData.formVisible = true;
      this.setState({ qrData });
    }
  };

  handleError = (err) => {
    console.error(err);
  };

  readQr = () => {
    const { qrData } = this.state;
    if (qrData.user && !qrData.user.checked_in) this.props.checkIn(qrData.user);
    this.setState({
      qrData: {
        ...this.state.qrData,
        msg: '',
        user: null,
        formVisible: false,
      },
    });
    this.setState({ documentOrId: '' });
  };

  closeQr = () => {
    this.setState(
      { qrData: { ...this.state.qrData, msg: '', user: null }, documentOrId: '', tabActive: 'camera' },
      () => {
        this.props.closeModal();
      }
    );
    html.classList.remove('is-clipped');
    this.props.clearOption(); // Clear dropdown to options scanner
  };

  handleSearchByCc = (documento, usersRef) => {
    const { fields } = this.props;
    const { name } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');

    usersRef
      .where(`properties.${name}`, '==', `${documento}`)
      .get()
      .then((querySnapshot) => {
        const qrData = {};
        if (querySnapshot.empty) {
          qrData.msg = 'User not found';
          qrData.another = true;
          qrData.user = {
            properties: {
              names: 'Jhon Doe',
              email: `${documento}@evius.co`,
              checkInField: documento,
              bloodtype: 'S',
              birthdate: '2022-05-02',
              gender: 'M',
              rol_id: '60e8a7e74f9fb74ccd00dc22',
              checked_in: true,
            },
          };
          qrData.formVisible = true;
          this.setState({ qrData });
        } else {
          querySnapshot.forEach((doc) => {
            console.log('🚀CC-----', doc.data());
            qrData.msg = 'User found';
            qrData.user = doc.data();
            qrData.formVisible = true;
            qrData.another = !!qrData.user.checked_in;
            this.setState({ qrData, checkInLoader: false });
          });
        }
      })
      .catch((e) => {
        this.setState({ found: 0 });
      });
  };

  searchCC = (Scanner) => {
    const usersRef = firestore.collection(`${this.props.eventID}_event_attendees`);
    let value = String(this.state.documentOrId).toLowerCase();

    // Conditional to show modal (QR or Document scanner)
    if (Scanner === 'qr') {
      usersRef
        .where('_id', '==', `${value}`)
        .get()
        .then((querySnapshot) => {
          const qrData = {};
          if (querySnapshot.empty) {
            qrData.msg = 'User not found';
            qrData.another = true;
            qrData.user = null;
            qrData.formVisible = true;
            this.setState({ qrData, checkInLoader: false });
          } else {
            querySnapshot.forEach((doc) => {
              console.log('🚀QR-----', doc.data());
              qrData.msg = 'User found';
              qrData.user = doc.data();
              qrData.another = !!qrData?.user?.checked_in;
              qrData.formVisible = true;
              this.setState({ qrData, checkInLoader: false });
            });
          }
        })
        .catch(() => {
          this.setState({ found: 0 });
        });
    } else {
      this.handleSearchByCc(value, usersRef);
    }
  };

  setDocumentOrId = (e, isId) => {
    // capturar toda la data el lector de documento
    // if (e.keyCode === 9) {
    //   e.preventDefault();
    //   return false;
    // }
    // return;
    //this.setState({ documentOrId: '' });
    // e.preventDefault();d
    const { value } = e.target;
    if (isId) {
      this.setState({ documentOrId: value });
    } else {
      let cedulaOnlynumbers = value.match(/(\d+)/);
      this.setState({ documentOrId: Number(cedulaOnlynumbers[0]) });
    }
  };

  // con esto puedo validar la data del lector con ant
  searchDocument = (value) => {
    console.log('🚀 debug ~ QrModal ~ value', value);
  };

  editQRUser = (user) => {
    this.closeQr();
    this.props.openEditModalUser(user);
  };

  // Limpia el input al escanear un codigo que no esta registrado
  cleanInputSearch = () => {
    this.setState({ documentOrId: '', qrData: {} });
  };

  /* function that saves the user's checkIn. If the user's checkIn was successful,
will show the checkIn information in the popUp. If not, it will show an error message.*/
  userCheckIn = async (user) => {
    const theUserWasChecked = await this.props.checkIn(user._id, user);

    if (theUserWasChecked) {
      this.setState(
        {
          qrData: { ...this.state.qrData, msg: '', formVisible: true, user: {} },
          documentOrId: '',
          checkInLoader: true,
        },
        () => {
          setTimeout(() => {
            this.handleScan(user._id);
          }, 1000);
        }
      );
      return;
    }

    DispatchMessageService({
      type: 'error',
      msj: 'Lo sentimos, hubo un error al registrar el checkIn del usuario',
      action: 'show',
    });
  };

  render() {
    const { qrData, facingMode, tabActive, checkInLoader } = this.state;
    // console.log('🚀 -+-+-+-+-+-', qrData);

    const { fields, typeScanner, openModal } = this.props;

    const { label } = getFieldDataFromAnArrayOfFields(fields, 'checkInField');

    return (
      <div style={{ textAlign: 'center' }}>
        <Modal visible={openModal} onCancel={this.closeQr} footer={null}>
          <Title level={4} type='secondary'>
            {typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
          </Title>
          {qrData.user ? (
            <div>
              {qrData.user?.checked_in && qrData?.user?.checkedin_at && (
                <div>
                  <Title level={3} type='secondary'>
                    Usuario Chequeado
                  </Title>
                  <Title level={5}>
                    El checkIn se llevó a cabo el día: <FormattedDate value={qrData?.user?.checkedin_at?.toDate()} /> a
                    las <FormattedTime value={qrData?.user?.checkedin_at?.toDate()} /> horas
                  </Title>
                </div>
              )}
              {/* {fields.map((obj, key) => {
                let val = qrData.user.properties[obj.name];
                if (obj.type === 'boolean') val = qrData.user.properties[obj.name] ? 'SI' : 'NO';
                return (
                  <p key={key}>
                    {obj.label}: {val}
                  </p>
                );
              })} */}
            </div>
          ) : typeScanner === 'scanner-qr' ? (
            <React.Fragment>
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
                    <Select value={facingMode} onChange={(e) => this.setState({ facingMode: e })}>
                      <Option value='user'>Selfie</Option>
                      <Option value='environment'>Rear</Option>
                    </Select>
                  </Form.Item>
                  <Row justify='center' wrap gutter={8}>
                    <QrReader
                      delay={500}
                      facingMode={facingMode}
                      onError={this.handleError}
                      onScan={this.handleScan}
                      style={{ width: '80%' }}
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
                  <Form layout='vertical'>
                    <Form.Item label={'Id Usuario'}>
                      <Input
                        // allowClear
                        value={this.state.documentOrId}
                        onChange={(value) => this.setDocumentOrId(value, true)}
                        name={'searchCC'}
                        autoFocus
                      />
                    </Form.Item>
                    <Row justify='center' wrap gutter={8}>
                      <Col>
                        <Button type='primary' onClick={(e) => this.searchCC('qr', e)}>
                          Buscar
                        </Button>
                      </Col>
                      <Col>
                        <Button type='ghost' onClick={() => this.cleanInputSearch()}>
                          Limpiar
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </TabPane>
              </Tabs>
            </React.Fragment>
          ) : (
            <Form layout='vertical' onFinish={this.buscar}>
              <Form.Item label={label} name='document'>
                <Input
                  // allowClear
                  value={this.state.documentOrId}
                  onChange={(value) => this.setDocumentOrId(value, false)}
                  // capturar toda la data del lector de documentos
                  // onKeyDown={(value) => this.setDocumentOrId(value, false)}
                  name={'searchCC'}
                  autoFocus
                />
              </Form.Item>
              <Row justify='center' wrap gutter={8}>
                <Col>
                  <Button type='primary' htmlType='submit' onClick={this.searchCC}>
                    Buscar
                  </Button>
                </Col>
                <Col>
                  <Button type='ghost' onClick={() => this.cleanInputSearch()}>
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
          {qrData?.msg === 'User not found' && (
            <Alert
              type={qrData?.msg === 'User found' ? 'success' : 'error'}
              message={'Usuario no encontrado'}
              showIcon
              closable
              className='animate__animated animate__pulse'
              style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                backgroundColor: '#FFFFFF',
                color: '#000000',
                borderLeft: `5px solid ${qrData?.msg === 'User found' ? '#52C41A' : '#FF4E50'}`,
                fontSize: '14px',
                textAlign: 'start',
                borderRadius: '5px',
                marginTop: '10px',
              }}
            />
          )}
          <Spin tip='checkIn en progreso' spinning={checkInLoader}>
            {qrData?.formVisible && (
              <FormEnrollUserToEvent
                fields={fields}
                editUser={qrData?.user && qrData?.user}
                // options={}
                // saveUser={}
                // loaderWhenSavingUpdatingOrDelete={}
                visibleInCms
              />
            )}
            <Row justify='center' wrap gutter={8}>
              <Col>
                {qrData.user && !qrData.another && (
                  <Button
                    type='primary'
                    onClick={() => {
                      this.userCheckIn(qrData.user);
                    }}>
                    Check User
                  </Button>
                )}
              </Col>
              <Col>
                {qrData.user && (
                  <Button className='button' onClick={this.readQr}>
                    Read Other
                  </Button>
                )}
              </Col>
            </Row>
          </Spin>
        </Modal>
      </div>
    );
  }
}

export default QrModal;
