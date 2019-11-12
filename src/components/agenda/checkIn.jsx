import React, {Component, Fragment} from "react";
import {withRouter} from "react-router-dom";
import {RolAttApi} from "../../helpers/request";
import EventContent from "../events/shared/content";
import SearchComponent from "../shared/searchTable";
import EvenTable from "../events/shared/table";
import {fieldNameEmailFirst, handleRequestError, sweetAlert} from "../../helpers/utils";
import {firestore} from "../../helpers/firebase";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import {FormattedDate, FormattedMessage, FormattedTime} from "react-intl";
import CheckSpace from "../event-users/checkSpace";
import XLSX from "xlsx";
import {toast} from "react-toastify";

const html = document.querySelector("html");

class CheckAgenda extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
            attendees:[],
            toShow:[],
            eventFields:[],
            pageOfItems:[],
            total:0,
            checkIn:0,
            qrModal:false,
            clearSearch:false,
            changeItem: false
        };
        this.firestoreRef = firestore.collection(`event_activity_attendees/${this.props.event._id}/activities/${this.props.match.params.id}/attendees`);
    }

    async componentDidMount() {
        try{
            const { event } = this.props;
            const agendaID = this.props.match.params.id;
            let {checkIn,changeItem} = this.state;
            const properties = event.user_properties;
            const rolesList = await RolAttApi.byEvent(this.props.event._id);
            const eventFields = fieldNameEmailFirst(properties);
            this.setState({ eventFields, rolesList, agendaID, eventID: event._id });
            let newList = [...this.state.attendees];
            this.firestoreRef.orderBy("updated_at","desc").onSnapshot((snapshot)=> {
                let user;
                snapshot.docChanges().forEach((change)=> {
                    user = change.doc.data();
                    user._id = change.doc.id;
                    user.created_at = (typeof user.created_at === "object")?user.created_at.toDate():'sinfecha';
                    user.updated_at = (user.updated_at.toDate)? user.updated_at.toDate(): new Date();
                    switch (change.type) {
                        case "added":
                            if(user.checked_in) checkIn += 1;
                            change.newIndex === 0 ? newList.unshift(user) : newList.push(user);
                            break;
                        case "modified":
                            if(user.checked_in) checkIn += 1;
                            newList.unshift(user);
                            newList.splice(change.oldIndex+1, 1);
                            changeItem = !changeItem;
                            break;
                        case "removed":
                            if(user.checked_in) checkIn -= 1;
                            newList.splice(change.oldIndex, 1);
                            break;
                        default:
                            break;
                    }
                });
                this.setState((prevState) => {
                    const toShow = [...newList].slice(0,50);
                    return {attendees: newList, toShow, loading: false,total: newList.length, checkIn, changeItem, clearSearch: !prevState.clearSearch}
                });
            },(error => {
                console.log(error);
                this.setState({timeout:true,errorData:{message:error,status:708}});
            }));
        }catch (error) {
            const errorData = handleRequestError(error);
            this.setState({timeout:true,errorData});
        }
    }

    componentWillUnmount() {
        this.firestoreRef = "";
    }

    exportFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const attendees = [...this.state.attendees].sort((a, b) => b.created_at - a.created_at);
        const data = parseData(attendees);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
        XLSX.writeFile(wb, `usuarios_${this.props.event.name}.xls`);
    };

    checkModal = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return {qrModal:!prevState.qrModal}
        });
    };
    closeQRModal = () => {
        html.classList.remove('is-clipped');
        this.setState((prevState) => {
            return {qrModal:!prevState.qrModal}
        });
    };

    checkIn = (id) => {
        const {eventID,agendaID,attendees} = this.state;
        const user = attendees.find(({attendee_id})=>attendee_id === id);
        if(!user.checked_in){
            const userRef = firestore.collection(`event_activity_attendees/${eventID}/activities/${agendaID}/attendees`).doc(user._id);
            userRef.update({
                updated_at: new Date(),
                checked_in: true,
                checked_at: new Date()
            })
                .then(()=> {
                    console.log("Document successfully updated!");
                    toast.success("Usuario Chequeado");
                })
                .catch(error => {
                    console.error("Error updating document: ", error);
                    toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :("/>);
                });
        }
    };

    //Paginación
    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };
    //Mostrar resultado
    searchResult = (data) => {
        !data ? this.setState({toShow:[]}) : this.setState({toShow:data})
    };
    //Listar usuarios en la tabla
    renderRows = () => {
        const items = [];
        const {eventFields} = this.state;
        const limit = eventFields.length;
        this.state.pageOfItems.map((item,key)=>{
            return items.push(<tr key={key}>
                <td>
                    {
                        (item.checked_in && item.checked_at) ? <p><FormattedDate value={item.checked_at.toDate()}/> <FormattedTime value={item.checked_at.toDate()}/></p>
                            :<div>
                                <input className="is-checkradio is-primary is-small" id={"checkinUser"+item._id} disabled={item.checked_in}
                                       type="checkbox" name={"checkinUser"+item._id} checked={item.checked_in} onChange={(e)=>{this.checkIn(item.attendee_id)}}/>
                                <label htmlFor={"checkinUser"+item._id}/>
                            </div>
                    }
                </td>
                {
                    eventFields.slice(0, limit).map((field,key)=>{
                        let value;
                        switch (field.type) {
                            case "boolean":
                                value = item.properties[field.name] ? 'SI' : 'NO';
                                break;
                            case "complex":
                                value = <span className="icon has-text-grey action_pointer" data-tooltip={"Detalle"}
                                              onClick={()=>this.showMetaData(item.properties[field.name])}><i className="fas fa-eye"/></span>;
                                break;
                            default:
                                value = item.properties[field.name]
                        }
                        return <td key={`${item._id}_${field.name}`}><span className="is-hidden-desktop">{field.label}:</span> {value}</td>
                    })
                }
            </tr>)
        });
        return items
    };
    //Modal para mostrar info extra
    showMetaData = (value) => {
        html.classList.add('is-clipped');
        let content = "";
        Object.keys(value).map(key=>content+=`<p><b>${key}:</b> ${value[key]}</p>`);
        sweetAlert.simple("Información", content, "Cerrar", "#1CDCB7", ()=>{
            html.classList.remove('is-clipped');
        })
    };

    goBack = () => this.props.history.goBack();

    render() {
        const {attendees,toShow,loading,eventFields,total,checkIn,qrModal} = this.state;
        if(!this.props.location.state) return this.goBack();
        return (
            <Fragment>
                <EventContent title={`CheckIn: ${this.props.location.state.name}`} closeAction={this.goBack} classes={"agenda-list"}>
                    <div className="columns">
                        <div className="search column is-7">
                            <SearchComponent data={attendees} kind={'user'} placeholder={""} classes={"field"} searchResult={this.searchResult}/>
                        </div>
                        <div className="column is-5">
                            <div className="columns is-mobile is-multiline">
                                <div className="column is-narrow">
                                    <div className="tags is-centered">
                                        <span className="tag is-primary">{checkIn}</span>
                                        <span className="tag is-white">Ingresados</span>
                                    </div>
                                </div>
                                <div className="column is-narrow">
                                    <div className="tags is-centered">
                                        <span className="tag is-light">{total}</span>
                                        <span className="tag is-white">Registrados</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns is-mobile buttons-g">
                        {
                            attendees.length>0 && (
                                <div className="column is-narrow has-text-centered export button-c">
                                    <button className="button" onClick={this.exportFile}>
                                                <span className="icon">
                                                    <i className="fas fa-download"/>
                                                </span>
                                        <span className="text-button">Exportar</span>
                                    </button>
                                </div>
                            )
                        }
                        <div className="column is-narrow has-text-centered button-c">
                            <button className="button is-inverted" onClick={this.checkModal}>
                                        <span className="icon">
                                            <i className="fas fa-qrcode"></i>
                                        </span>
                                <span className="text-button">Leer Código QR</span>
                            </button>
                        </div>
                    </div>
                    <div style={{maxWidth:"1000px"}}>
                        {loading ? <Fragment>
                                <Loading/>
                                <h2 className="has-text-centered">Cargando...</h2>
                            </Fragment>:
                            <Fragment>
                                <div style={{overflowX:"auto"}}>
                                    <EvenTable head={["CheckIn", ...eventFields.map(({label})=>label)]}>
                                        {
                                            this.renderRows()
                                        }
                                    </EvenTable>
                                </div>
                                <Pagination
                                    items={toShow}
                                    change={this.state.changeItem}
                                    onChangePage={this.onChangePage}
                                />
                            </Fragment>}
                    </div>
                </EventContent>
                {qrModal && <CheckSpace list={attendees} closeModal={this.closeQRModal} checkIn={this.checkIn}/>}
            </Fragment>
        )
    }
}

const parseData = (data) => {
    let info = [];
    data.map((item,key) => {
        info[key] = {};
        Object.keys(item.properties).map((obj, i) => {
            let str = item.properties[obj];
            if(typeof str === "number") str = str.toString();
            if(typeof str === "object") str = JSON.stringify(str);
            if(typeof str === "boolean") str = str ? "TRUE" : "FALSE";
            if (str && /[^a-z]/i.test(str)) str = str.toUpperCase();
            return info[key][obj] = str
        });
        if(item.rol) info[key]['rol'] = item.rol.label ? item.rol.label.toUpperCase() : item.rol.toUpperCase();
        info[key]['checkIn'] = item.checked_in?item.checked_in:'FALSE';
        info[key]['Hora checkIn'] = item.checked_at?item.checked_at.toDate():'';
        info[key]['Actualizado'] = item.updated_at;
        info[key]['Creado'] = item.created_at;
        return info
    });
    return info
};

export default withRouter(CheckAgenda)
