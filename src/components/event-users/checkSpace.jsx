import React, {Component} from "react";
import {FormattedDate, FormattedMessage, FormattedTime} from "react-intl";
import {IoIosCamera, IoIosQrScanner} from "react-icons/io";
import {FaCamera} from "react-icons/fa";
import QrReader from "react-qr-reader";
import {firestore} from "../../helpers/firebase";
import {toast} from "react-toastify";

const html = document.querySelector("html");
class CheckSpace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrData:{},
            facingMode:"environment",
            tabActive:"camera",
            newCC:""
        };
        this.txtInput = React.createRef();
    }

    changeType = (type) => {
        this.setState({tabActive:type},()=>{
            if(type == "qr")this.txtInput.current.focus();
        });
    };

    closeQr = () => {
        this.setState({qrData:{...this.state.qrData,msg:'',user:null},newCC:'',tabActive:"camera"},()=>{
            this.props.closeModal()
        });
        html.classList.remove('is-clipped');
    };

    //Camera functions
    handleScan = (data) => {
        if (data) {
            const { eventID, userReq, space } = this.props;
            const user = userReq.find(item=>item._id === data);
            const qrData = {};
            if(user) {
                qrData.msg = 'User found';
                qrData.user = user;
                if(user.spaces && user.spaces[space._id]){
                    this.setState({qrData});
                }else {
                    const userRef = firestore.collection(`${eventID}_event_attendees`).doc(user._id);
                    const data = {updated_at: new Date()};
                    data[`spaces.${space._id}`] = true;
                    userRef.update(data)
                        .then(() => {
                            const spaces = user.spaces ? Object.assign(user.spaces, {[space._id]: true}) : {[space._id]: true};
                            qrData.user = Object.assign(qrData.user, {spaces});
                            this.setState({qrData});
                            console.log("Document successfully updated!");
                        })
                        .catch(error => {
                            console.error("Error updating document: ", error);
                            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
                        });
                }
            }
            else{
                qrData.msg = 'User not found';
                qrData.another = true;
                qrData.user = null;
                this.setState({qrData})
            }
        }
    };
    handleError = (err) => {
        console.error(err);
    };

    //Gun functions
    changeCC = (e) => {
        const {value} = e.target;
        const checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
        this.setState({newCC:value},()=>{
            if(checkForHexRegExp.test(value)) {
                setTimeout(()=>{
                    this.handleScan(value);
                },1000)
            }else{
                this.setState({gunMsj:"Por favor ingresa un código correcto"})
            }
        })
    };
    //Bottom functions
    readOther = () => {
        this.setState({qrData:{...this.state.qrData,msg:'',user:null},newCC:""})
    };
    editUser = (user) => {
        this.closeQr();
        this.props.openEditModalUser(user);
    };

    render() {
        const {qrData,facingMode,gunMsj} = this.state;
        const {space,spacesEvent} = this.props;
        return (
            <div className={`modal is-active`}>
                <div className="modal-background"/>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Lector QR - Sala: {space.name}</p>
                        <button className="delete is-large" aria-label="close" onClick={this.closeQr}/>
                    </header>
                    <section className="modal-card-body">
                        {
                            qrData.user ?
                                <div>
                                    {qrData.user.checked_in && (<div>
                                        <h1 className="title">Usuario Chequeado</h1>
                                        <h2 className="subtitle">Fecha: <FormattedDate value={qrData.user.checked_at.toDate()}/> - <FormattedTime value={qrData.user.checked_at.toDate()}/></h2>
                                    </div>)}
                                    <p>ID: {qrData.user._id}</p>
                                    <p>Nombre: {qrData.user.names}</p>
                                    <p>Correo: {qrData.user.email}</p>
                                    {spacesEvent.map(space=><p key={space._id}>{space.name}: {qrData.user.spaces[space._id]?"SI":"NO"}</p>)}
                                </div>:
                                <React.Fragment>
                                    <div className="tabs is-centered tab-qr">
                                        <ul>
                                            <li className={`${this.state.tabActive === 'camera' ? 'is-active' : ''}`}
                                                onClick={e=>this.changeType('camera')}>
                                                <a>
                                                    <div className="icon is-medium"><IoIosCamera/></div>
                                                    <span>Cámara</span>
                                                </a>
                                            </li>
                                            <li className={`${this.state.tabActive === 'qr' ? 'is-active' : ''}`}
                                                onClick={e=>this.changeType('qr')}>
                                                <a>
                                                    <div className="icon is-medium"><IoIosQrScanner/></div>
                                                    <span>Pistola</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    {
                                        this.state.tabActive==="camera" ?
                                            <React.Fragment>
                                                <div className="field">
                                                    <div className="control has-icons-left">
                                                        <div className="select">
                                                            <select value={facingMode} onChange={e => this.setState({ facingMode: e.target.value })}>
                                                                <option value="user">Selfie</option>
                                                                <option value="environment">Rear</option>
                                                            </select>
                                                        </div>
                                                        <div className="icon is-small is-left"><FaCamera/></div>
                                                    </div>
                                                </div>
                                                <div className="columns is-mobile is-centered qr">
                                                    <QrReader
                                                        delay={500}
                                                        facingMode={facingMode}
                                                        onError={this.handleError}
                                                        onScan={this.handleScan}
                                                        style={{ width: "60%" }}
                                                        className={"column is-half is-offset-one-quarter"}
                                                    />
                                                </div>
                                            </React.Fragment>:
                                            <div style={{textAlign:"center"}}>
                                                <div className="field">
                                                    <div className="control">
                                                        <label className={`label has-text-grey-light is-capitalized required`}>Código</label>
                                                        <input className="input" name={'searchCC'} ref={this.txtInput} value={this.state.newCC} onChange={this.changeCC} autoFocus={true}/>
                                                    </div>
                                                    {gunMsj&&<div className="msg"><p className="msg_error">{gunMsj}</p></div>}
                                                </div>
                                                <button className="button is-info is-large" onClick={e=> this.handleScan(this.state.newCC)}>Buscar</button>
                                            </div>
                                    }
                                </React.Fragment>
                        }
                        <p>{qrData.msg}</p>
                    </section>
                    <footer className="modal-card-foot">
                        {
                            qrData.user&&(
                                <React.Fragment>
                                    <button className="button is-info" onClick={e=>{this.editUser(qrData.user)}}>Edit User</button>
                                    <button className="button" onClick={this.readOther}>Read Other</button>
                                </React.Fragment>
                            )
                        }
                    </footer>
                </div>
            </div>
        )
    }
}

export default CheckSpace
