import { Component } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { FaCamera } from 'react-icons/fa';
import { IoIosQrScanner, IoIosCamera } from 'react-icons/io';
import QrReader from 'react-qr-reader';
import { firestore } from '../../helpers/firebase';
import { Modal, Row, Col, Tabs, Button, Select, Input, Form, Typography, Alert } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';
import { DispatchMessageService } from '@/context/MessageService';
import axios from 'axios';
import { useRequest } from '@/services/useRequest';

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

  handleSearchByCc = (cedula, usersRef) => {
    axios.get(`${ApiUrl}${useRequest.EventUsers.getEventUserByCedula(cedula, this.props.eventID)}`).then((res) => {
      console.log('res', res);
      let idUser = res.data.data[0]?._id || null;
      usersRef
        .where('_id', '==', `${idUser}`)
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
              console.log('docdata', doc.data());
              qrData.another = !!qrData.user.checked_in;
              this.setState({ qrData });
            });
          }
        })
        .catch(() => {
          this.setState({ found: 0 });
        });
    });
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
              const user = { ...doc.data(), checked_in: doc.data().properties?.checked_in };
              qrData.msg = 'User found';
              qrData.user = user;
              qrData.another = !!qrData.user.checked_in;
              this.setState({ qrData });
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

  changeCC = (e) => {
    //this.setState({ newCC: '' });
    e.preventDefault();
    const { value } = e.target;
    let acumulador = '';
    let contador = 0;
    let cedula = 0;
    if (contador == 0) {
      cedula = value;
      contador++;
    }
    for (let i = 0; i < value.length; i++) {
      if (value[i] != ' ') {
        acumulador = acumulador + value[i];
        contador++;
      } else if (value[i] == ' ') {
        cedula = acumulador;
        acumulador = '';
        contador++;
      }

      var cedulaOnlynumbers = cedula.match(/(\d+)/);
      this.setState({ newCC: Number(cedulaOnlynumbers[0]) });
    }
  };

  editQRUser = (user) => {
    this.closeQr();
    this.props.openEditModalUser(user);
  };

  // Limpia el input al escanear un codigo que no esta registrado
  cleanInputSearch = () => {
    this.setState({ newCC: '' });
  };

  /* function that saves the user's checkIn. If the user's checkIn was successful,
will show the checkIn information in the popUp. If not, it will show an error message.*/
  userCheckIn = async (user) => {
    const theUserWasChecked = await this.props.checkIn(user._id, user);

    if (theUserWasChecked) {
      setTimeout(() => {
        this.handleScan(user._id);
      }, 500);
      return;
    }

    DispatchMessageService({
      type: 'error',
      msj: 'Lo sentimos, hubo un error al registrar el checkIn del usuario',
      action: 'show',
    });
  };

  render() {
    const { qrData, facingMode, tabActive } = this.state;
    const { fields, typeScanner } = this.props;

    return (
      <div>
        <Modal
          visible={qrData}
          onCancel={this.closeQr}
          footer={[
            <>
              {qrData.user && !qrData.another && (
                <Button
                  type='primary'
                  onClick={() => {
                    this.userCheckIn(qrData.user);
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
          ]}>
          <Title level={4} type='secondary'>
            {typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}
          </Title>
          {qrData.user ? (
            <div>
              {qrData.user.checked_in && (
                <div>
                  <Title level={3} type='secondary'>
                    Usuario Chequeado
                  </Title>
                  <Title level={5}>
                    El checkIn se llevó a cabo el día: <FormattedDate value={qrData.user.checked_at.toDate()} /> a las{' '}
                    <FormattedTime value={qrData.user.checked_at.toDate()} /> horas
                  </Title>
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
                  <Form.Item label={'Id Usuario'}>
                    <Input
                      allowClear
                      value={this.state.newCC}
                      onChange={(value) => this.changeCC(value)}
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
                </TabPane>
              </Tabs>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Form.Item label={'Cédula'}>
                <Input
                  allowClear
                  value={this.state.newCC}
                  onChange={(value) => this.changeCC(value)}
                  name={'searchCC'}
                  autoFocus
                />
              </Form.Item>
              <Row justify='center' wrap gutter={8}>
                <Col>
                  <Button type='primary' onClick={this.searchCC}>
                    Buscar
                  </Button>
                </Col>
                <Col>
                  <Button type='ghost' onClick={() => this.cleanInputSearch()}>
                    Limpiar
                  </Button>
                </Col>
              </Row>
            </React.Fragment>
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
        </Modal>
      </div>
    );
  }
}

export default QrModal;
