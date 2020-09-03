import React, { Component, Fragment } from "react";
import { EventFieldsApi } from "../../../helpers/request";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";
import EventContent from "../shared/content";
import EvenTable from "../shared/table";
import EventModal from "../shared/eventModal";
import DatosModal from "./modal";
import Dialog from "../../modal/twoAction";
import Loading from "../../loaders/loading";
import { Tabs } from 'antd';
import RelationField from './relationshipFields'

const { TabPane } = Tabs;

class Datos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: {},
            newField: false,
            loading: true,
            deleteModal: false,
            edit: false,
            fields: []
        };
        this.eventID = "";
        this.html = document.querySelector("html");
    }

    async componentDidMount() {
        await this.fetchFields()
    }

    orderFieldsByWeight = (extraFields) => {
        extraFields = extraFields.sort((a, b) =>
            (a.order_weight && !b.order_weight) || (a.order_weight && b.order_weight && a.order_weight < b.order_weight)
                ? -1
                : 1
        );
        return extraFields;
    };

    fetchFields = async () => {
        try {
            const { eventID } = this.props;
            this.eventID = eventID;
            let fields = await EventFieldsApi.getAll(eventID);
            fields = this.orderFieldsByWeight(fields);            

            this.setState({ fields, loading: false });
        } catch (e) {
            this.showError(e)
        }
    };

    //Agregar nuevo campo
    addField = () => {
        this.setState({ edit: false, modal: true })
    };
    //Guardar campo en el evento
    saveField = async (field) => {
        try {
            if (this.state.edit)
                await EventFieldsApi.editOne(field, field._id, this.eventID);
            // console.log(field,field._id,this.eventID);
            else await EventFieldsApi.createOne(field, this.eventID);
            await this.fetchFields();
            this.setState({ modal: false, edit: false, newField: false })
        } catch (e) {
            this.showError(e)
        }
    };
    //Cambiar obligatorio
    changeCheck = async (uuid, field) => {
        try {
            let mandatory = !field
            console.log(uuid, mandatory)
            await EventFieldsApi.editOne({ mandatory }, uuid, this.eventID);

            this.setState(prevState => {
                const list = prevState.fields.map(field => {
                    if (field.uuid === uuid) {
                        field.mandatory = !field.mandatory;
                        return field
                    } else return field;
                });
                return { fields: list }
            })

            this.fetchFields()
        } catch (e) {
            console.log(e)
        }

    };
    //Abrir modal para editar dato
    editField = (info) => {
        this.setState({ info, modal: true, edit: true })
    };
    //Borrar dato de la lista
    removeField = async () => {
        try {
            await EventFieldsApi.deleteOne(this.state.deleteModal, this.eventID);
            this.setState({ message: { ...this.state.message, class: 'msg_success', content: 'FIELD DELETED' } });
            await this.fetchFields();
            setTimeout(() => {
                this.setState({ message: {}, deleteModal: false });
            }, 800);
        } catch (e) {
            this.showError(e)
        }
    };
    closeModal = () => {
        this.html.classList.remove('is-clipped');
        this.setState({ inputValue: '', modal: false, info: {}, edit: false })
    };

    showError = (error) => {
        toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
        if (error.response) {
            console.log(error.response);
            const { status, data } = error.response;
            console.log('STATUS', status, status === 401);
            if (status === 401) this.setState({ timeout: true, loader: false });
            else this.setState({ serverError: true, loader: false, errorData: data })
        } else {
            let errorData = error.message;
            console.log('Error', error.message);
            if (error.request) {
                console.log(error.request);
                errorData = error.request
            };
            errorData.status = 708;
            this.setState({ serverError: true, loader: false, errorData })
        }
        console.log(error.config);
    };

    async toggleChange(id, field) {
        try {
            let visible = !field
            console.log(id, visible)
            await EventFieldsApi.editOne({ visible }, id, this.eventID);
            this.fetchFields()
        } catch (e) {
            console.log(e)
        }
    }

    async visibleByContacts(id, field) {
        try {
            let visibleByContacts = !field
            console.log(id, visibleByContacts)
            await EventFieldsApi.editOne({ visibleByContacts }, id, this.eventID);
            this.fetchFields()
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        const { fields, modal, edit, info } = this.state;
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="Configuración General" key="1">
                    <Fragment>
                        <EventContent title={"Recopilación de datos"} description={"Configure los datos que desea recolectar de los asistentes del evento"}
                            addAction={this.addField} addTitle={"Agregar dato"}>
                            {this.state.loading ? <Loading /> :
                                <EvenTable head={["Dato", "Tipo de Dato", "Obligatorio", "Visible solo contactos", "Visible solo admin", ""]}>
                                    <tr className="has-text-grey-light ">
                                        
                                        <td />
                                    </tr>
                                    <tr>
                                        <td className="has-text-grey-light ">Texto</td>
                                        <td className="has-text-grey-light ">Nombres</td>
                                        <td>
                                            <input className="is-checkradio is-primary" type="checkbox" id={"mandName"}
                                                checked={true} disabled={true} />
                                            <label className="checkbox" htmlFor={"mandName"} />
                                        </td>
                                        <td />
                                    </tr>
                                    {fields.map((field, key) => {
                                        return <tr key={key}>
                                            <td>{field.label ? field.label : field.label}</td>
                                            <td>{field.type ? field.type : field.type}</td>
                                            <td>
                                                <input className="is-checkradio is-primary" id={`mandatory${field.label}`}
                                                    type="checkbox" name={`mandatory`} checked={field.mandatory}
                                                    onChange={event => this.changeCheck(field.uuid ? field.uuid : field._id, field.mandatory)} />
                                                <label htmlFor={`mandatory${field.label}`}></label>
                                            </td>

                                            <td>
                                                <input className="is-checkradio is-primary" id={`visibleByContacts${field.label}`}
                                                    type="checkbox" name={`visibleByContacts`} checked={field.visibleByContacts}
                                                    onChange={event => this.visibleByContacts(field.uuid ? field.uuid : field._id, field.visibleByContacts)} />
                                                <label htmlFor={`visibleByContacts${field.label}`}></label>
                                            </td>

                                            <td>
                                                <input className="is-checkradio is-primary" id={`visibleByAdmin${field.label}`}
                                                    type="checkbox" name={`visibleByAdmin`} checked={field.visibleByAdmin}
                                                    onChange={event => this.toggleChange(field.uuid ? field.uuid : field._id, field.visibleByAdmin)} />
                                                <label htmlFor={`visibleByAdmin${field.label}`}></label>
                                            </td>

                                            <td>
                                                <button onClick={e => this.editField(field)}><span className="icon"><i
                                                    className="fas fa-edit" /></span></button>
                                                <button onClick={e => this.setState({ deleteModal: field._id })}><span
                                                    className="icon"><i className="fas fa-trash-alt" /></span></button>
                                            </td>
                                        </tr>
                                    })}
                                </EvenTable>
                            }
                        </EventContent>
                        {
                            modal &&
                            <EventModal modal={modal} title={edit ? 'Editar Dato' : 'Agregar Dato'} closeModal={this.closeModal}>
                                <DatosModal edit={edit} info={info} action={this.saveField} />
                            </EventModal>
                        }
                        {
                            this.state.deleteModal &&
                            <Dialog modal={this.state.deleteModal} title={'Borrar Dato'}
                                content={<p>Seguro de borrar este dato?</p>}
                                first={{ title: 'Borrar', class: 'is-dark has-text-danger', action: this.removeField }}
                                message={this.state.message}
                                second={{ title: 'Cancelar', class: '', action: this.closeDelete }} />
                        }
                    </Fragment >
                </TabPane>
                <TabPane tab="Campos Relacionados" key="2">
                    <RelationField eventId={this.props.eventID} fields={fields} />
                </TabPane>
            </Tabs>
        )
    }
}

export default Datos
