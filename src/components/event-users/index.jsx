import React, { Component, Fragment } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import XLSX from "xlsx";
import { toast } from 'react-toastify';
import { firestore } from "../../helpers/firebase";
import { BadgeApi, RolAttApi } from "../../helpers/request";
import UserModal from "../modal/modalUser";
import ErrorServe from "../modal/serverError";
import SearchComponent from "../shared/searchTable";
import Pagination from "../shared/pagination";
import Loading from "../loaders/loading";
import 'react-toastify/dist/ReactToastify.css';
import QrModal from "./qrModal";
import { fieldNameEmailFirst, handleRequestError, parseData2Excel, sweetAlert } from "../../helpers/utils";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";

const html = document.querySelector("html");
class ListEventUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            userReq: [],
            pageOfItems: [],
            listTickets: [],
            usersRef: firestore.collection(`${props.event._id}_event_attendees`),
            pilaRef: firestore.collection('pila'),
            total: 0,
            checkIn: 0,
            extraFields: [],
            spacesEvents: [],
            addUser: false,
            editUser: false,
            deleteUser: false,
            loading: true,
            importUser: false,
            modalPoints: false,
            pages: null,
            message: { class: '', content: '' },
            sorted: [],
            rolesList: [],
            facingMode: 'user',
            qrData: {},
            clearSearch: false,
            changeItem: false,
            errorData: {},
            badgeEvent: {},
            serverError: false,
            stage: '',
            ticket: '',
            tabActive: 'camera',
            ticketsOptions: [],
            scanner: 'first'
        };
    }


    addDefaultLabels = extraFields => {
      extraFields = extraFields.map(field => {
        field["label"] = field["label"] ? field["label"] : field["name"];
        return field;
      });
      return extraFields;
    };
  
    orderFieldsByWeight = (extraFields) => {
      extraFields = extraFields.sort((a, b) =>
      (a.order_weight && !b.order_weight) ||
      (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
        ? -1
        : 1
    );
    return extraFields;
    };     

    async componentDidMount() {
        try {
            const { event } = this.props;
            const properties = event.user_properties;
            const rolesList = await RolAttApi.byEvent(this.props.event._id);
            const badgeEvent = await BadgeApi.get(this.props.event._id);
            let extraFields = fieldNameEmailFirst(properties);
            extraFields = this.addDefaultLabels(extraFields);
            extraFields = this.orderFieldsByWeight(extraFields);


            const listTickets = event.tickets ? [...event.tickets] : [];
            let { checkIn, changeItem } = this.state;

            this.setState({ extraFields, rolesList, badgeEvent });
            const { usersRef, ticket, stage } = this.state;
            
            
            let newItems = [...this.state.userReq];

            /** 
             * escuchamos los cambios a los datos en la base de datos directamente 
             * 
            */
            this.userListener = usersRef.orderBy("updated_at", "desc").onSnapshot({
                        // Listen for document metadata changes
                        //includeMetadataChanges: true
                    },(snapshot) => {
                let user, acompanates = 0;
                snapshot.docChanges().forEach((change) => {
                    /* change structure: type: "added",doc:doc,oldIndex: -1,newIndex: 0*/
                    console.log("cambios", change)
                    user = change.doc.data();
                    user._id = change.doc.id;
                    user.rol_name = user.rol_name ? user.rol_name : user.rol_id ? rolesList.find(({ name, _id }) => _id === user.rol_id ? name : "") : "";
                    user.created_at = (typeof user.created_at === "object") ? user.created_at.toDate() : 'sinfecha';
                    user.updated_at = (user.updated_at.toDate) ? user.updated_at.toDate() : new Date();
                    user.tiquete = listTickets.find(ticket => ticket._id === user.ticket_id);

                    switch (change.type) {
                        case "added":
                            if (user.checked_in) checkIn += 1;
                            change.newIndex === 0 ? newItems.unshift(user) : newItems.push(user);
                            if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates, 10);
                            break;
                        case "modified":
                            if (user.checked_in) checkIn += 1;
                            newItems.unshift(user);
                            newItems.splice(change.oldIndex + 1, 1);
                            changeItem = !changeItem;
                            break;
                        case "removed":
                            if (user.checked_in) checkIn -= 1;
                            newItems.splice(change.oldIndex, 1);
                            break;
                        default:
                            break;
                    }
                });
                this.setState((prevState) => {
                    const usersToShow = (ticket.length <= 0 || stage.length <= 0) ? [...newItems].slice(0, 50) : [...prevState.users];
                    return {
                        userReq: newItems, auxArr: newItems, users: usersToShow, changeItem, listTickets,
                        loading: false, total: newItems.length + acompanates, checkIn, clearSearch: !prevState.clearSearch
                    }
                });
            }, (error => {
                console.log(error);
                this.setState({ timeout: true, errorData: { message: error, status: 708 } });
            }));
        } catch (error) {
            const errorData = handleRequestError(error);
            this.setState({ timeout: true, errorData });
        }
    }

    componentWillUnmount() {
        this.userListener();
        //this.pilaListener()
    }

    exportFile = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('aqui');
        const attendees = [...this.state.userReq].sort((a, b) => b.created_at - a.created_at);
        const data = await parseData2Excel(attendees, this.state.extraFields);
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Asistentes");
        XLSX.writeFile(wb, `asistentes_${this.props.event.name}.xls`);
    };

    addUser = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return { editUser: !prevState.editUser, edit: false }
        });
    };

    modalUser = () => {
        html.classList.remove('is-clipped');
        this.setState((prevState) => {
            return { editUser: !prevState.editUser, edit: undefined }
        });
    };

    checkModal = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return { qrModal: !prevState.qrModal }
        });
    };
    closeQRModal = () => {
        html.classList.add('is-clipped');
        this.setState((prevState) => {
            return { qrModal: !prevState.qrModal }
        });
    };

    checkIn = (id) => {
        const { userReq, qrData } = this.state;
        const { event } = this.props;
        qrData.another = true;
        const self = this;

        // Busca el usuario con el id que se pasa
        let pos = userReq.map((e) => { return e._id; }).indexOf(id);
        if (pos >= 0) {
            //users[pos] = user;
            const userRef = firestore.collection(`${event._id}_event_attendees`).doc(id);
            if (!userReq[pos].checked_in) {

                // Actualiza el contador de usuarios checkeados
                self.setState((prevState) => {
                    return { checkIn: prevState.checkIn + 1, qrData } 
                });

                // Actualiza el usuario en la base de datos
                userRef.update({
                    updated_at: new Date(),
                    checked_in: true,
                    checked_at: new Date()
                })
                
                    .then(() => {
                        console.log("Document successfully updated!");
                        toast.success("Usuario Chequeado");
                    })
                    .catch(error => {
                        console.error("Error updating document: ", error);
                        toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
                    });
            }
        }
    };

    onChangePage = (pageOfItems) => {
        this.setState({ pageOfItems: pageOfItems });
    };

    showMetaData = (value) => {
        html.classList.add('is-clipped');
        let content = "";
        Object.keys(value).map(key => content += `<p><b>${key}:</b> ${value[key]}</p>`);
        sweetAlert.simple("Información", content, "Cerrar", "#1CDCB7", () => {
            html.classList.remove('is-clipped');
        })
    };

    renderRows = () => {
        const items = [];
        const { extraFields, spacesEvent } = this.state;
        const limit = extraFields.length;
        this.state.pageOfItems.map((item, key) => {
            return items.push(<tr key={key}>
                <td>
                    <span className="icon has-text-grey action_pointer" data-tooltip={"Editar"}
                        onClick={(e) => { this.openEditModalUser(item) }}><i className="fas fa-edit" /></span>
                </td>
                <td>
                    {
                        (item.checked_in && item.checked_at) ? <p><FormattedDate value={item.checked_at.toDate()} /> <FormattedTime value={item.checked_at.toDate()} /></p>
                            : <div>
                                <input className="is-checkradio is-primary is-small" id={"checkinUser" + item._id} disabled={item.checked_in}
                                    type="checkbox" name={"checkinUser" + item._id} checked={item.checked_in} onChange={(e) => { this.checkIn(item._id) }} />
                                <label htmlFor={"checkinUser" + item._id} />
                            </div>
                    }
                </td>
                {
                    extraFields.slice(0, limit).map((field, key) => {
                        let value;
                        switch (field.type) {
                            case "boolean":
                                value = item.properties[field.name] ? 'SI' : 'NO';
                                break;
                            case "complex":
                                value = <span className="icon has-text-grey action_pointer" data-tooltip={"Detalle"}
                                    onClick={() => this.showMetaData(item.properties[field.name])}><i className="fas fa-eye" /></span>;
                                break;
                            default:
                                value = item.properties[field.name]
                        }
                        return <td key={`${item._id}_${field.name}_${key}`}><span className="is-hidden-desktop">{field.label}:</span> {value}</td>
                    })
                }
                <td>{item.tiquete ? item.tiquete.title : 'SIN TIQUETE'}</td>
            </tr>)
        })
        return items
    };

    openEditModalUser = (item) => {
        html.classList.add('is-clipped');
        this.setState({ editUser: true, selectedUser: item, edit: true })
    }

    changeStage = (e) => {
        const { value } = e.target;
        const { event: { tickets } } = this.props;
        if (value === '') {
            let check = 0, acompanates = 0;
            this.setState({ checkIn: 0, total: 0 }, () => {
                const list = this.state.userReq;
                list.forEach(user => {
                    if (user.checked_in) check += 1;
                    if (user.properties.acompanates && /^\d+$/.test(user.properties.acompanates)) acompanates += parseInt(user.properties.acompanates, 10);
                });
                this.setState((state) => {
                    return { users: state.auxArr.slice(0, 50), ticket: '', stage: value, total: list.length + acompanates, checkIn: check }
                });
            })
        }
        else {
            const options = tickets.filter(ticket => ticket.stage_id === value);
            this.setState({ stage: value, ticketsOptions: options });
        }
    };
    changeTicket = (e) => {
        const { value } = e.target;
        let check = 0, acompanates = 0;
        this.setState({ checkIn: 0, total: 0 }, () => {
            const list = value === '' ? this.state.userReq : [...this.state.userReq].filter(user => user.ticket_id === value);
            list.forEach(user => {
                if (user.checked_in) check += 1;
                if (user.properties.acompanates && user.properties.acompanates.match(/^[0-9]*$/)) acompanates += parseInt(user.properties.acompanates, 10);
            });
            const users = value === '' ? [...this.state.auxArr].slice(0, 50) : list;
            this.setState({ users, ticket: value, checkIn: check, total: list.length + acompanates });
        })
    };

    //Search records at third column
    searchResult = (data) => {
        !data ? this.setState({ users: [] }) : this.setState({ users: data })
    };

    handleChange = (e) => {
        this.setState({ typeScanner: e.target.value })
        this.checkModal()
    };

    // Set options in dropdown list
    clearOption = () => {
        this.setState({ typeScanner: 'options' })
    }

    render() {
        const { timeout, userReq, users, total, checkIn, extraFields, spacesEvent, editUser, stage, ticket, ticketsOptions } = this.state;
        const { event: { event_stages } } = this.props;
        return (
            <React.Fragment>
                <EventContent classes="checkin" title={"Check In"}>
                    <div className="checkin-warning ">
                        <p className="is-size-7 is-full-mobile">Se muestran los primeros 50 usuarios, para verlos todos porfavor descargar el excel o realizar una búsqueda.</p>
                    </div>

                    <div className="columns checkin-tags-wrapper is-flex-touch">
                        <div className="is-3 column">
                            <div className="tags" style={{ flexWrap: 'nowrap' }}>
                                <span className="tag is-primary">{checkIn}</span>
                                <span className="tag is-white">Ingresados</span>
                            </div>
                        </div>
                        <div className="is-2 column">
                            <div className="tags" style={{ flexWrap: 'nowrap' }}>
                                <span className="tag is-light">{total}</span>
                                <span className="tag is-white">Total</span>
                            </div>
                        </div>
                    </div>

                    <div className="columns">
                        <div className="is-flex-touch columns container-options">
                            <div className="column is-narrow has-text-centered button-c is-centered">
                                <button className="button is-primary" onClick={this.addUser}>
                                    <span className="icon">
                                        <i className="fas fa-user-plus"></i>
                                    </span>
                                    <span className="text-button">Agregar Usuario</span>
                                </button>
                            </div>
                            {
                                userReq.length > 0 && (
                                    <div className="column is-narrow has-text-centered export button-c is-centered">
                                        <button className="button" onClick={this.exportFile}>
                                            <span className="icon">
                                                <i className="fas fa-download" />
                                            </span>
                                            <span className="text-button">Exportar</span>
                                        </button>
                                    </div>
                                )
                            }
                            <div className="column">
                                <div class="select is-primary">
                                    <select name={"type-scanner"} value={this.state.typeScanner} defaultValue={this.state.typeScanner} onChange={this.handleChange}>
                                        <option value="options">Escanear...</option>
                                        <option value='scanner-qr'>Escanear QR</option>
                                        <option value='scanner-document'>Escanear Documento</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="search column">
                            <SearchComponent style={{ marginLeft: '40px' }} placeholder={""} data={userReq} kind={'user'} event={this.props.event._id} searchResult={this.searchResult} clear={this.state.clearSearch} />
                        </div>
                    </div>
                    {
                        (event_stages && event_stages.length > 0) &&
                        <div className='filter'>
                            <button className="button icon-filter">
                                <span className="icon">
                                    <i className="fas fa-filter"></i>
                                </span>
                                <span className="text-button">Filtrar</span>
                            </button>
                            <div className='filter-menu'>
                                <p className='filter-help'>Filtra Usuarios por Tiquete</p>
                                <div className="columns">
                                    <div className="column field">
                                        <div className="control">
                                            <label className="label">Etapa</label>
                                            <div className="control">
                                                <div className="select">
                                                    <select value={stage} onChange={this.changeStage} name={'stage'}>
                                                        <option value={''}>Escoge la etapa...</option>
                                                        {
                                                            event_stages.map((item, key) => {
                                                                return <option key={key} value={item.stage_id}>{item.title}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column field">
                                        <div className="control">
                                            <label className="label">Tiquete</label>
                                            <div className="control">
                                                <div className="select">
                                                    <select value={ticket} onChange={this.changeTicket} name={'stage'}>
                                                        <option value={''}>Escoge el tiquete...</option>
                                                        {
                                                            ticketsOptions.map((item, key) => {
                                                                return <option key={key} value={item._id}>{item.title}</option>
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="checkin-table">
                        {this.state.loading ? <Fragment>
                            <Loading />
                            <h2 className="has-text-centered">Cargando...</h2>
                        </Fragment> :
                            <div className="table-wrapper">
                                <div className="table-container">
                                    <EvenTable head={["", "Check", ...extraFields.map(({ label }) => label), "Tiquete"]}>
                                        {
                                            this.renderRows()
                                        }
                                    </EvenTable>
                                </div>
                                <Pagination
                                    items={users}
                                    change={this.state.changeItem}
                                    onChangePage={this.onChangePage}
                                />
                            </div>}
                    </div>
                </EventContent>
                {(!this.props.loading && editUser) &&
                    <UserModal handleModal={this.modalUser} modal={editUser} eventId={this.props.eventId}
                        ticket={ticket} tickets={this.state.listTickets} rolesList={this.state.rolesList}
                        value={this.state.selectedUser} checkIn={this.checkIn} badgeEvent={this.state.badgeEvent}
                        extraFields={this.state.extraFields} spacesEvent={spacesEvent} edit={this.state.edit} />
                }
                {this.state.qrModal && <QrModal fields={extraFields} userReq={userReq} typeScanner={this.state.typeScanner} clearOption={this.clearOption} checkIn={this.checkIn} eventID={this.props.event._id}
                    closeModal={this.closeQRModal} openEditModalUser={this.openEditModalUser} />}
                {timeout && (<ErrorServe errorData={this.state.errorData} />)}
            </React.Fragment>
        );
    }
}

export default ListEventUser;
