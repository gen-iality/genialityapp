import React, { Component, Fragment, useState, useEffect } from "react";
import { Card, Button, Alert } from "antd";
import WithUserEventRegistered from "../shared/withUserEventRegistered";
import { AgendaApi } from "../../helpers/request";
import { firestore } from "../../helpers/firebase";
import Moment from "moment";
import { Avatar } from "antd";
//const { Meta } = Card;

const MeetingConferenceButton = ( { activity, toggleConference, usuarioRegistrado, event } ) => {
    const [ infoActivity, setInfoActivity ] = useState( {} );
    const [ infoEvent, setInfoEvent ] = useState( {} );

    useEffect( () => {
        setInfoActivity( activity );
        setInfoEvent( event )
    }, [ activity ] );

    switch ( infoActivity.habilitar_ingreso ) {
        case "open_meeting_room":
            return (
                <>
                    {( usuarioRegistrado && event.visibility === "ORGANIZATION" ) || event.visibility !== "ORGANIZATION" ? (
                        <>
                            <Button
                                size="large"
                                type="primary"
                                className="buttonVirtualConference"
                                onClick={ () => {
                                    toggleConference( true, infoActivity.meeting_id, infoActivity );
                                } }>
                                Ingresa aquí
                        </Button>

                        </>
                    ) : (
                            <>
                                <Button
                                    size="large"
                                    type="primary"
                                    className="buttonVirtualConference"
                                    disabled='true'
                                >
                                    Ingreso privado
                                </Button>

                            </>
                        ) }
                </>
            );


        case "closed_meeting_room":
            return <Alert message="El ingreso se habilitará minutos antes del evento" type="warning" showIcon />;

        case "ended_meeting_room":
            return <Alert message="El evento ha terminado" type="info" showIcon />;

        default:
            return <Alert message="Cargando..." type="warning" showIcon />;
    }
};

class VirtualConference extends Component {
    constructor( props ) {
        super( props );
        this.state = {
            data: [],
            infoAgendaArr: [],
            currentUser: this.props.currentUser || undefined,
            usuarioRegistrado: this.props.usuarioRegistrado || undefined,
            event: this.props.event || undefined,
            survey: [],
        };
    }

    async componentDidMount () {
        if ( !this.props.event ) return;
        let filteredAgenda = await this.filterVirtualActivities( this.props.event._id );
        this.setState( { infoAgendaArr: filteredAgenda } );
    }

    async componentDidUpdate ( prevProps ) {

        //Cargamos solamente los espacios virtuales de la agenda

        //Si aún no ha cargado el evento no podemos hacer nada más
        if ( !this.props.event ) return;

        //Revisamos si el evento sigue siendo el mismo, no toca cargar nada
        if ( prevProps.event && this.props.event._id === prevProps.event._id ) return;

        let filteredAgenda = await this.filterVirtualActivities( this.props.event._id );
        this.setState( { event: this.props.event, usuarioRegistrado: this.props.usuarioRegistrado, infoAgendaArr: filteredAgenda }, this.listeningStateMeetingRoom );

    }

    listeningStateMeetingRoom = () => {
        let { infoAgendaArr } = this.state;
        infoAgendaArr.forEach( ( activity, index, arr ) => {
            firestore
                .collection( "events" )
                .doc( this.props.event._id )
                .collection( "activities" )
                .doc( activity._id )
                .onSnapshot( ( infoActivity ) => {
                    if ( !infoActivity.exists ) return;
                    let { habilitar_ingreso } = infoActivity.data();
                    let updatedActivityInfo = { ...arr[ index ], habilitar_ingreso };

                    arr[ index ] = updatedActivityInfo;

                    arr.forEach( ( activity, index, arr ) => {
                        firestore
                            .collection( 'languageState' )
                            .doc( activity._id )
                            .onSnapshot( ( info ) => {
                                if ( !info.exists ) return;
                                let { related_meetings } = info.data();
                                let updatedActivityInfo = { ...arr[ index ], related_meetings };

                                arr[ index ] = updatedActivityInfo;
                                this.setState( { infoAgendaArr: arr } );
                            } );
                    } );
                    this.setState( { infoAgendaArr: arr } );
                } );

        } );
    };


    async filterVirtualActivities ( event_id ) {
        let infoAgendaArr = [];
        if ( !event_id ) return infoAgendaArr;
        const infoAgenda = await AgendaApi.byEvent( event_id );

        //Mostramos solamente las conferencias que tengan una sala virtual asignada
        for ( const prop in infoAgenda.data ) {
            if ( infoAgenda.data[ prop ].meeting_id ||  infoAgenda.data[ prop ].vimeo_id) {
                infoAgendaArr.push( infoAgenda.data[ prop ] );
            } 
        }

        return infoAgendaArr;
    }

    render () {
        const { infoAgendaArr, event, usuarioRegistrado } = this.state;
        const { toggleConference } = this.props;
        if ( !infoAgendaArr || infoAgendaArr.length <= 0 ) return null;
        return (
            <Fragment>
                {
                    <div>
                        {/* <Card bordered={ true }>
                            <span>Sesiones</span>
                        </Card> */}

                        { infoAgendaArr.filter((item)=> {return item.habilitar_ingreso && (item.habilitar_ingreso == "open_meeting_room" ||item.habilitar_ingreso == "closed_meeting_room" ) }).map( ( item, key ) => ( 
                            <div key={ key } >
                                <Card
                                    avatar={ <Avatar src="" /> }
                                    bordered={ true } style={ { marginBottom: "3%" } }>
                                    {/* Experimento de estilo <Meta
                                        avatar={ <><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /> <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></> }
                                        title="Card titlesfas fdas dfa sdf asdf as as as df"
                                        description="This is the description"
                                    /> */}
                                    <h1 style={ { fontSize: "120%", fontWeight: "Bold" } }>{ item.name }</h1>
                                    <p>
                                        { Moment( item.datetime_start ).format( "D " ) }<span>&nbsp;de&nbsp;</span>
                                        { item.datetime_start && ( ( Moment( item.datetime_start ).format( "MMMM" ) ).charAt( 0 ).toUpperCase() ) }
                                        { item.datetime_start && ( ( Moment( item.datetime_start ).format( "MMMM" ) ).slice( 1 ) ) }

                                        <span>&nbsp;&nbsp;&nbsp;</span>
                                        { Moment( item.datetime_start ).format( "h:mm A" ) } { " - " }
                                        { Moment( item.datetime_end ).format( "h:mm A" ) }
                                    </p>

                                    { item.hosts && <div className="Virtual-Conferences">
                                        { item.hosts.map( ( host, key ) => {
                                            return (
                                                <div style={ { margin: "0px 14px" } } key={ key }>
                                                    <Avatar src={ host.image } />
                                                    <div >{ host.name }</div>
                                                </div>
                                            )
                                        } ) }
                                    </div>
                                    }



                                    <MeetingConferenceButton activity={ item } toggleConference={ toggleConference } event={ event } usuarioRegistrado={ usuarioRegistrado } />
                                    { item.related_meetings && item.related_meetings.map( ( item, key ) => (
                                        <>
                                            { item.state === 'open_meeting_room' && (
                                                <Button
                                                    disabled={ item.meeting_id || item.vimeo_id ? false : true }
                                                    onClick={ () =>
                                                        toggleConference( true, item.meeting_id ? item.meeting_id : item.vimeo_id, item )
                                                    }
                                                    type='primary'
                                                    className='button-Agenda'
                                                    key={ key }>
                                                    {item.informative_text }
                                                </Button>
                                            ) }
                                            { item.state === 'closed_meeting_room' && (
                                                <Alert message={ `La  ${ item.informative_text } no ha iniciado` } type='info' />
                                            ) }

                                            { item.state === 'ended_meeting_room' && (
                                                <Alert message={ `La ${ item.informative_text } ha terminado` } type='info' />
                                            ) }
                                        </>
                                    ) ) }
                                </Card>
                            </div>
                        
                                            
                        ) ) }
                    </div>
                }
            </Fragment>
        );
    }
}

export default WithUserEventRegistered( VirtualConference );
