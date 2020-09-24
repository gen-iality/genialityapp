import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { RolAttApi } from "../../helpers/request";
import EventContent from "../events/shared/content";
import SearchComponent from "../shared/searchTable";
import EvenTable from "../events/shared/table";
import { fieldNameEmailFirst, handleRequestError, parseData2Excel, sweetAlert } from "../../helpers/utils";
import { firestore } from "../../helpers/firebase";
import Loading from "../loaders/loading";
import Pagination from "../shared/pagination";
import { FormattedDate, FormattedMessage, FormattedTime } from "react-intl";
import CheckSpace from "../event-users/checkSpace";
import XLSX from "xlsx";
import { toast } from "react-toastify";
import { Activity } from "../../helpers/request";

const html = document.querySelector( "html" );

class CheckAgenda extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            loading: true,
            attendees: [],
            toShow: [],
            eventFields: [],
            pageOfItems: [],
            total: 0,
            checkIn: 0,
            qrModal: false,
            clearSearch: false,
            changeItem: false
        };
        this.firestoreRef = firestore.collection( `/${ this.props.event._id }_event_attendees` );
    }

    async componentDidMount () {

        try {
            const { event } = this.props;
            const agendaID = this.props.match.params.id;
            let { checkIn, changeItem } = this.state;
            const properties = event.user_properties;
            //Se traen roles para usarlos en la lista
            const rolesList = await RolAttApi.byEvent( this.props.event._id );
            //Parse de campos para mostrar primero el nombre, email y luego el resto
            const eventFields = fieldNameEmailFirst( properties );
            this.setState( { eventFields, rolesList, agendaID, eventID: event._id } );
            let newList = [ ...this.state.attendees ];

            newList = await Activity.getActivyAssitantsAdmin( this.props.event._id, agendaID );
            newList = newList.map( ( item ) => {
                let attendee = item.attendee ? item.attendee : {"properties":{email:item.user.email, names:item.user.displayName}};
                item = {...item, ...attendee }
                return item
            } )

            console.log( "attendees", newList );
            this.setState( ( prevState ) => {
                
                return { attendees: newList, toShow:newList, loading: false, total: newList.length, checkIn, changeItem, clearSearch: !prevState.clearSearch }
            } );

        } catch ( error ) {
            const errorData = handleRequestError( error );
            this.setState( { timeout: true, errorData } );
        }
    }

    //Se deja de escuchar el firestore para disminuir recursos
    componentWillUnmount () {
        this.firestoreRef = "";
    }

    //FN para exportar listado a excel
    exportFile = async ( e ) => {
        e.preventDefault();
        e.stopPropagation();
        //Se trae el listado total y se ordenan por fecha de creación
        const attendees = [ ...this.state.attendees ].sort( ( a, b ) => b.created_at - a.created_at );
        const data = await parseData2Excel( attendees, this.state.eventFields );
        const ws = await XLSX.utils.json_to_sheet( data );
        const wb = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet( wb, ws, "Asistentes" );
        await XLSX.writeFile( wb, `asistentes_actividad_${ this.props.location.state.name }.xls` );
    };

    //FN Modal, abre y cierra
    checkModal = () => {
        html.classList.add( 'is-clipped' );
        this.setState( ( prevState ) => {
            return { qrModal: !prevState.qrModal }
        } );
    };
    closeQRModal = () => {
        html.classList.remove( 'is-clipped' );
        this.setState( ( prevState ) => {
            return { qrModal: !prevState.qrModal }
        } );
    };

    //FN para checkin
    checkIn = ( id ) => {
        const { eventID, agendaID, attendees } = this.state;
        //Se busca en el listado total con el id
        const user = attendees.find( ( { attendee_id } ) => attendee_id === id );
        //Sino está chequeado se chequea
        if ( !user.checked_in ) {
            const userRef = firestore.collection( `/${ this.props.event._id }_event_attendees` ).doc( user._id );
            userRef.update( {
                updated_at: new Date(),
                checked_in: true,
                checked_at: new Date()
            } )
                .then( () => {
                    console.log( "Document successfully updated!" );
                    toast.success( "Usuario Chequeado" );
                } )
                .catch( error => {
                    console.error( "Error updating document: ", error );
                    toast.error( <FormattedMessage id="toast.error" defaultMessage="Sry :(" /> );
                } );
        }
    };

    //Paginación
    onChangePage = ( pageOfItems ) => {
        this.setState( { pageOfItems: pageOfItems } );
    };
    //Mostrar resultado
    searchResult = ( data ) => {
        !data ? this.setState( { toShow: [] } ) : this.setState( { toShow: data } )
    };
    //Listar usuarios en la tabla
    renderRows = () => {
        const items = [];
        const { eventFields } = this.state;
        const limit = eventFields.length;
        this.state.pageOfItems.map( ( item, key ) => {
            return items.push( <tr key={ key }>
                <td>
                    {
                        ( item.checked_in && item.checked_at ) ? <p><FormattedDate value={ item.checked_at.toDate() } /> <FormattedTime value={ item.checked_at.toDate() } /></p>
                            : <div>
                                <input className="is-checkradio is-primary is-small" id={ "checkinUser" + item._id } disabled={ item.checked_in }
                                    type="checkbox" name={ "checkinUser" + item._id } checked={ item.checked_in } onChange={ ( e ) => { this.checkIn( item.attendee_id ) } } />
                                <label htmlFor={ "checkinUser" + item._id } />
                            </div>
                    }
                </td>
                {
                    eventFields.slice( 0, limit ).map( ( field, key ) => {
                        let value;
                        switch ( field.type ) {
                            case "boolean":
                                value = (item.properties && item.properties[ field.name ]) ? 'SI' : 'NO';
                                break;
                            case "complex":
                                value = <span className="icon has-text-grey action_pointer" data-tooltip={ "Detalle" }
                                    onClick={ () => this.showMetaData( (item.properties && item.properties[ field.name ])? item.properties[ field.name ] : "" ) }><i className="fas fa-eye" /></span>;
                                break;
                            default:
                                value = (item.properties && item.properties[ field.name ])? item.properties[ field.name ] : "";
                        }
                        return <td key={ `${ item._id }_${ field.name }` }><span className="is-hidden-desktop">{ field.label }:</span> { value }</td>
                    } )
                }
            </tr> )
        } );
        return items
    };
    //Modal para mostrar info extra
    showMetaData = ( value ) => {
        html.classList.add( 'is-clipped' );
        let content = "";
        Object.keys( value ).map( key => content += `<p><b>${ key }:</b> ${ value[ key ] }</p>` );
        sweetAlert.simple( "Información", content, "Cerrar", "#1CDCB7", () => {
            html.classList.remove( 'is-clipped' );
        } )
    };

    goBack = () => this.props.history.goBack();

    render () {
        const { attendees, toShow, loading, eventFields, total, checkIn, qrModal, eventID, agendaID } = this.state;
        if ( !this.props.location.state ) return this.goBack();
        return (
            <Fragment>
                <EventContent title={ `CheckIn: ${ this.props.location.state.name }` } closeAction={ this.goBack } classes={ "checkin" }>
                    <div className="columns is-mobile buttons-g">
                        <div className="checkin-warning ">

                        </div>
                        <div className="columns checkin-tags-wrapper">
                            <div className="checkin-tags is-5 columns">
                                <div className="is-2">
                                    <div className="tags is-centered">
                                        <span className="tag is-primary">{ checkIn }</span>
                                        <span className="tag is-white">Ingresados</span>
                                    </div>
                                </div>
                                <div className="is-2">
                                    <div className="tags is-centered">
                                        <span className="tag is-light">{ total }</span>
                                        <span className="tag is-white">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="is-flex-touch columns">
                            {
                                attendees.length > 0 && (
                                    <div className="column is-narrow has-text-centered export button-c is-centered">
                                        <button className="button" onClick={ this.exportFile }>
                                            <span className="icon">
                                                <i className="fas fa-download" />
                                            </span>
                                            <span className="text-button">Exportar</span>
                                        </button>
                                    </div>
                                )
                            }
                            <div className="column is-narrow has-text-centered button-c is-centered">
                                <button className="button is-inverted" onClick={ this.checkModal }>
                                    <span className="icon">
                                        <i className="fas fa-qrcode"></i>
                                    </span>
                                    <span className="text-button">Leer Código QR</span>
                                </button>
                            </div>
                        </div>
                        <div className="search column is-5 is-full-mobile">
                            <SearchComponent data={ attendees } kind={ 'user' } placeholder={ "" } classes={ "field" } searchResult={ this.searchResult } />
                        </div>
                    </div>
                    <div className="checkin-table">
                        { loading ? <Fragment>
                            <Loading />
                            <h2 className="has-text-centered">Cargando...</h2>
                        </Fragment> :
                            <div className="table-wrapper">
                                <div className="table-container">
                                    <EvenTable head={ [ "CheckIn", ...eventFields.map( ( { label } ) => label ) ] }>
                                        {
                                            this.renderRows()
                                        }
                                    </EvenTable>
                                </div>
                                <Pagination
                                    items={ toShow }
                                    change={ this.state.changeItem }
                                    onChangePage={ this.onChangePage }
                                />
                            </div> }
                    </div>
                </EventContent>
                {qrModal && <CheckSpace list={ attendees } closeModal={ this.closeQRModal } eventID={ eventID } agendaID={ agendaID } checkIn={ this.checkIn } /> }
            </Fragment>
        )
    }
}

export default withRouter( CheckAgenda )
