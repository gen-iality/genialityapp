import React, { Component } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { FaCamera } from 'react-icons/fa';
import { IoIosQrScanner, IoIosCamera } from 'react-icons/io';
import QrReader from 'react-qr-reader';
import { firestore } from '../../helpers/firebase';
import { Modal, Row, Col, Tabs , Button, Select, Input, Form} from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

const html = document.querySelector('html');
class QrModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabActive: 'camera',
      facingMode: 'user',
      qrData: {},
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
      qrData.msg = 'User found';
      qrData.user = this.props.usersReq[pos];
      qrData.another = !!qrData.user.checked_in;
      this.setState({ qrData });
    } else {
      qrData.msg = 'User not found';
      qrData.another = true;
      qrData.user = null;
      this.setState({ qrData });
    }
  };
  handleError = (err) => {
    console.error(err);
  };
  readQr = () => {
    const { qrData } = this.state;
    if (qrData.user && !qrData.user.checked_in) this.props.checkIn(qrData.user);
    this.setState({ qrData: { ...this.state.qrData, msg: '', user: null } });
    this.setState({ newCC: '' });
  };
  closeQr = () => {
    this.setState(
      { qrData: { ...this.state.qrData, msg: '', user: null }, qrModal: false, newCC: '', tabActive: 'camera' },
      () => {
        this.props.closeModal();
      }
    );
    html.classList.remove('is-clipped');
    this.props.clearOption(); // Clear dropdown to options scanner
  };
  searchCC = (Scanner) => {
    const usersRef = firestore.collection(`${this.props.eventID}_event_attendees`);
    let value = String(this.state.newCC).toLowerCase();

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
            this.setState({ qrData });
          } else {
            querySnapshot.forEach((doc) => {
              qrData.msg = 'User found';
              qrData.user = doc.data();
              qrData.another = !!qrData.user.checked_in;
              this.setState({ qrData });
            });
          }
        })
        .catch(() => {
          this.setState({ found: 0 });
        });
    } else {
      usersRef
        .where('documento', '==', `${value}`)
        .get()
        .then((querySnapshot) => {
          const qrData = {};
          if (querySnapshot.empty) {
            qrData.msg = 'User not found';
            qrData.another = true;
            qrData.user = null;
            this.setState({ qrData });
          } else {
            querySnapshot.forEach((doc) => {
              qrData.msg = 'User found';
              qrData.user = doc.data();
              qrData.another = !!qrData.user.checked_in;
              this.setState({ qrData });
            });
          }
        })
        .catch(() => {
          this.setState({ found: 0 });
        });
    }
  };
  changeCC = (e) => {
    const { value } = e.target;
    this.setState({ newCC: value });
  };
  editQRUser = (user) => {
    this.closeQr();
    this.props.openEditModalUser(user);
  };

  // Limpia el input al escanear un codigo que no esta registrado
  cleanInputSearch = () => {
    this.setState({ newCC: '' });
  };

  render() {
    const { qrData, facingMode, tabActive } = this.state;
    const { fields, typeScanner } = this.props;
    return (
      <div>
        <Modal 
          title={typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
          visible={qrData}
          onCancel={this.closeQr}
          footer={[
            <>
              {qrData.user && ! !qrData.another && (
                <Button
                  type='primary'
                  onClick={() => {
                    this.props.checkIn(qrData.user._id);
                  }}>
                  Check User
                </Button>
              )}
            </>,
            <>
              {qrData.user && (
                <Button
                  onClick={() => {
                    this.editQRUser(qrData.user);
                  }}>
                  Edit User
                </Button>
              )}
            </>,
            <>
              {qrData.user && (
                <Button className='button' onClick={this.readQr}>
                  Read Other
                </Button>
              )}
            </>,
          ]}
        >
          {qrData.user ? (
            <div>
              {qrData.user.checked_in && (
                <div>
                  <h1 className='title'>Usuario Chequeado</h1>
                  <h2 className='subtitle'>
                    Fecha: <FormattedDate value={qrData.user.checked_at.toDate()} /> -{' '}
                    <FormattedTime value={qrData.user.checked_at.toDate()} />
                  </h2>
                </div>
              )}
              {fields.map((obj, key) => {
                let val = qrData.user.properties[obj.name];
                if (obj.type === 'boolean') val = qrData.user.properties[obj.name] ? 'SI' : 'NO';
                return (
                  <p key={key}>
                    {obj.label}: {val}
                  </p>
                );
              })}
            </div>
            ) : typeScanner === 'scanner-qr' ? (
              <React.Fragment>
                <Tabs defaultValue='1'>
                  <TabPane tab={<><CameraOutlined />{'Camara'}</>} key='1'>
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
                        style={{ width: '60%' }}
                      />
                    </Row>
                  </TabPane>
                  <TabPane tab={<><ExpandOutlined />{'Pistola'}</>} key='2'>
                    <Form.Item label={'Id Usuario'}>
                      <Input
                        name={'searchCC'}
                        value={this.state.newCC}
                        onChange={this.changeCC}
                        autoFocus={true}
                      />
                    </Form.Item>
                    <Row justify='center' wrap gutter={8}>
                      <Col>
                        <Button type='primary' 
                         onClick={(e) => this.searchCC('qr', e)}>
                          Buscar
                        </Button>
                      </Col>
                      <Col>
                        <Button type='ghost' 
                         onClick={this.cleanInputSearch}>
                          Limpiar
                        </Button>
                      </Col>
                    </Row>
                  </TabPane>
                </Tabs>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Form.Item label={'Cédula'}>
                  <Input
                    name={'searchCC'}
                    value={this.state.newCC}
                    onChange={this.changeCC}
                    autoFocus={true}
                  />
                </Form.Item>
                <Row justify='center' wrap gutter={8}>
                  <Col>
                    <Button type='primary' onClick={this.searchCC}>
                      Buscar
                    </Button>
                  </Col>
                </Row>
              </React.Fragment>
            )}
            <p>{qrData.msg}</p>
        </Modal>
      </div>
    );
  }
}

export default QrModal;
