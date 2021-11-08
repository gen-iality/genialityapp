import React, { Component } from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';
import { FaCamera } from 'react-icons/fa';
import { IoIosQrScanner, IoIosCamera } from 'react-icons/io';
import QrReader from 'react-qr-reader';
import { firestore } from '../../helpers/firebase';

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
      <div className={`modal is-active`}>
        <div className='modal-background' />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>{typeScanner === 'scanner-qr' ? 'Lector QR' : 'Lector de Documento'}</p>
            <button className='delete is-large' aria-label='close' onClick={this.closeQr} />
          </header>
          <section className='modal-card-body'>
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
                <div className='tabs is-centered tab-qr'>
                  <ul>
                    <li
                      className={`${this.state.tabActive === 'camera' ? 'is-active' : ''}`}
                      onClick={() => this.setState({ tabActive: 'camera' })}>
                      <a>
                        <div className='icon is-medium'>
                          <IoIosCamera />
                        </div>
                        <span>Cámara</span>
                      </a>
                    </li>
                    <li
                      className={`${this.state.tabActive === 'qr' ? 'is-active' : ''}`}
                      onClick={() => this.setState({ tabActive: 'qr' })}>
                      <a>
                        <div className='icon is-medium'>
                          <IoIosQrScanner />
                        </div>
                        <span>Pistola</span>
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  {tabActive === 'camera' ? (
                    <React.Fragment>
                      <div className='field'>
                        <div className='control has-icons-left'>
                          <div className='select'>
                            <select value={facingMode} onChange={(e) => this.setState({ facingMode: e.target.value })}>
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
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className='field'>
                        <div className='control'>
                          <label className={`label has-text-grey-light is-capitalized required`}>Id Usuario</label>
                          <input
                            className='input'
                            name={'searchCC'}
                            value={this.state.newCC}
                            onChange={this.changeCC}
                            autoFocus={true}
                          />
                        </div>
                      </div>
                      <div className='field is-grouped'>
                        <button className='button is-info is-fullwidth' onClick={(e) => this.searchCC('qr', e)}>
                          Buscar
                        </button>
                        <button className='button is-fullwidth' onClick={this.cleanInputSearch}>
                          Limpiar
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div>
                  {
                    <React.Fragment>
                      <div className='field'>
                        <div className='control'>
                          <label className={`label has-text-grey-light is-capitalized required`}>Cédula</label>
                          <input
                            className='input'
                            name={'searchCC'}
                            value={this.state.newCC}
                            onChange={this.changeCC}
                            autoFocus={true}
                          />
                        </div>
                      </div>
                      <button className='button is-info is-fullwidth' onClick={this.searchCC}>
                        Buscar
                      </button>
                    </React.Fragment>
                  }
                </div>
              </React.Fragment>
            )}
            <p>{qrData.msg}</p>
          </section>
          <footer className='modal-card-foot'>
            {qrData.user && (
              <React.Fragment>
                {!qrData.another && (
                  <button
                    className='button is-success'
                    onClick={() => {
                      this.props.checkIn(qrData.user._id,qrData.user);
                    }}>
                    Check User
                  </button>
                )}
                <button
                  className='button'
                  onClick={() => {
                    this.editQRUser(qrData.user);
                  }}>
                  Edit User
                </button>
                <button className='button' onClick={this.readQr}>
                  Read Other
                </button>
              </React.Fragment>
            )}
          </footer>
        </div>
      </div>
    );
  }
}

export default QrModal;
