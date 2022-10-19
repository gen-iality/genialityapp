import { Component, createRef } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { IoIosCamera, IoIosQrScanner } from 'react-icons/io';
import { FaCamera } from 'react-icons/fa';
import QrReader from 'react-qr-reader';
import { firestore } from '@helpers/firebase';
import { toast } from 'react-toastify';
import { handleRequestError } from '@helpers/utils';
import { Modal, Tabs, Form, Select, Row, Col, Input, Button } from 'antd';
import { CameraOutlined, ExpandOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Option } = Select;

class CheckSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qrData: {},
      facingMode: 'user',
      tabActive: 'camera',
      newCC: '',
    };
    this.txtInput = createRef();
  }

  changeType = (type) => {
    this.setState({ tabActive: type }, () => {
      if (type === 'qr') this.txtInput.current.focus();
    });
  };

  closeQr = () => {
    this.setState({ qrData: { ...this.state.qrData, msg: '', user: null }, newCC: '', tabActive: 'camera' }, () => {
      this.props.closeModal();
    });
  };

  //Camera functions
  handleScan = (data) => {
    if (data) {
      const { list } = this.props;
      const user = list.find(({ attendee_id }) => attendee_id === data);
      const qrData = {};
      if (user) {
        qrData.msg = 'User found';
        qrData.user = user;
        qrData.another = false;
        this.setState({ qrData }, () => {
          this.props.checkIn(data);
        });
      } else {
        qrData.msg = 'User not found';
        qrData.another = true;
        qrData.user = {};
        this.setState({ qrData, newCC: data });
      }
    }
  };
  handleError = (err) => {
    console.error(err);
  };

  //Gun functions
  changeCC = (e) => {
    let { value } = e.target;
    value = value.toLowerCase();
    const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    this.setState({ newCC: value }, () => {
      if (value.length > 0) {
        if (checkForHexRegExp.test(value)) {
          setTimeout(() => {
            this.handleScan(value);
          }, 1000);
        } else {
          this.setState({ gunMsj: 'Por favor  escanea un código válido para ejecutar la búsqueda' });
        }
      } else {
        this.setState({ gunMsj: '' });
      }
    });
  };
  //Bottom functions
  readOther = () => {
    this.setState({ qrData: { ...this.state.qrData, msg: '', user: null }, newCC: '' });
  };

  addUser = () => {
    const { eventID, agendaID } = this.props;
    const userRef = firestore.collection(`${eventID}_event_attendees`).doc(this.state.newCC);
    userRef
      .get()
      .then((doc) => {
        const agendaRef = firestore.collection(`event_activity_attendees/${eventID}/activities/${agendaID}/attendees`);
        agendaRef
          .add({
            activity_id: agendaID,
            attendee_id: doc.id,
            created_at: new Date(),
            properties: doc.data().properties,
            rol: doc.data().rol ? doc.data().rol : '',
            rol_id: doc.data().rol_id ? doc.data().rol_id : '',
            updated_at: new Date(),
            checked_in: true,
            checked_at: new Date(),
          })
          .then(() => {
            toast.success('Asistente agregado');
            this.setState({ qrData: {} });
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
            toast.error(handleRequestError(error));
          });
      })
      .catch((error) => {
        toast.error(handleRequestError(error));
      });
  };

  render() {
    const { qrData, facingMode, gunMsj } = this.state;
    return (
      <div>
        <Modal
          title={'Lector QR'}
          visible={qrData}
          onCancel={this.closeQr}
          footer={[
            <>
              {qrData.user && (
                <Button type='primary' onClick={this.readOther}>
                  Leer QR
                </Button>
              )}
            </>,
            <>
              {qrData.another && (
                <Button type='primary' onClick={this.addUser}>
                  Agregar asistente
                </Button>
              )}
            </>,
          ]}>
          {!qrData.another && (
            <>
              {qrData.user ? (
                <div>
                  {qrData.user.checked_in && (
                    <div>
                      <h1 className='title'>Usuario inscrito</h1>
                      <h2 className='subtitle'>
                        Fecha: <FormattedDate value={qrData.user.checked_at.toDate()} /> -{' '}
                        <FormattedTime value={qrData.user.checked_at.toDate()} />
                      </h2>
                    </div>
                  )}
                  <p>ID: {qrData.user.attendee_id}</p>
                  <p>Nombre: {qrData.user.properties.names}</p>
                  <p>Correo: {qrData.user.properties.email}</p>
                </div>
              ) : (
                <>
                  <Tabs defaultActiveKey='1'>
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
                          style={{ width: '60%' }}
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
                      <Form.Item label={'Código'}>
                        <Input
                          name={'searchCC'}
                          ref={this.txtInput}
                          value={this.state.newCC}
                          onChange={this.changeCC}
                          autoFocus={true}
                        />
                        {gunMsj && (
                          <div className='msg'>
                            <p className='msg_error'>{gunMsj}</p>
                          </div>
                        )}
                      </Form.Item>
                      <Row justify='center' wrap gutter={8}>
                        <Col>
                          <Button type='primary' onClick={() => this.handleScan(this.state.newCC)}>
                            Buscar
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>
                  </Tabs>
                </>
              )}
            </>
          )}
        </Modal>
        {/* <div className={`modal is-active`}>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Lector QR</p>
              <button className='delete is-large' aria-label='close' onClick={this.closeQr} />
            </header>
            <section className='modal-card-body'>
              {!qrData.another && (
                <>
                  {qrData.user ? (
                    <div>
                      {qrData.user.checked_in && (
                        <div>
                          <h1 className='title'>Usuario chequeado</h1>
                          <h2 className='subtitle'>
                            Fecha: <FormattedDate value={qrData.user.checked_at.toDate()} /> -{' '}
                            <FormattedTime value={qrData.user.checked_at.toDate()} />
                          </h2>
                        </div>
                      )}
                      <p>ID: {qrData.user.attendee_id}</p>
                      <p>Nombre: {qrData.user.properties.names}</p>
                      <p>Correo: {qrData.user.properties.email}</p>
                    </div>
                  ) : (
                    <>
                      <div className='tabs is-centered tab-qr'>
                        <ul>
                          <li
                            className={`${this.state.tabActive === 'camera' ? 'is-active' : ''}`}
                            onClick={() => this.changeType('camera')}>
                            <a>
                              <div className='icon is-medium'>
                                <IoIosCamera />
                              </div>
                              <span>Cámara</span>
                            </a>
                          </li>
                          <li
                            className={`${this.state.tabActive === 'qr' ? 'is-active' : ''}`}
                            onClick={() => this.changeType('qr')}>
                            <a>
                              <div className='icon is-medium'>
                                <IoIosQrScanner />
                              </div>
                              <span>Pistola</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                      {this.state.tabActive === 'camera' ? (
                        <>
                          <div className='field'>
                            <div className='control has-icons-left'>
                              <div className='select'>
                                <select
                                  value={facingMode}
                                  onChange={(e) => this.setState({ facingMode: e.target.value })}>
                                  <option value='user'>Selfie</option>
                                  <option value='environment'>Rear</option>
                                </select>
                              </div>
                              <div className='icon is-small is-left'>
                                <FaCamera />
                              </div>
                            </div>
                          </div>
                          <div className='columns is-mobile is-centered qr'>
                            <QrReader
                              delay={500}
                              facingMode={facingMode}
                              onError={this.handleError}
                              onScan={this.handleScan}
                              style={{ width: '60%' }}
                              className={'column is-half is-offset-one-quarter'}
                            />
                          </div>
                        </>
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <div className='field'>
                            <div className='control'>
                              <label className={`label has-text-grey-light is-capitalized required`}>Código</label>
                              <input
                                className='input'
                                name={'searchCC'}
                                ref={this.txtInput}
                                value={this.state.newCC}
                                onChange={this.changeCC}
                                autoFocus={true}
                              />
                            </div>
                            {gunMsj && (
                              <div className='msg'>
                                <p className='msg_error'>{gunMsj}</p>
                              </div>
                            )}
                          </div>
                          <button className='button is-info is-large' onClick={() => this.handleScan(this.state.newCC)}>
                            Buscar
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              <p>{qrData.msg}</p>
            </section>
            <footer className='modal-card-foot'>
              {qrData.user && (
                <button className='button' onClick={this.readOther}>
                  Leer QR
                </button>
              )}
              {qrData.another && (
                <button className='button' onClick={this.addUser}>
                  Agregar asistente
                </button>
              )}
            </footer>
          </div>
        </div> */}
      </div>
    );
  }
}

export default CheckSpace;
