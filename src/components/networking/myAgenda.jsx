import { Avatar, Button, Card, Col, Modal, notification, Row, Spin, Tabs } from 'antd'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  matchPath,
  withRouter
} from "react-router-dom";
import moment from 'moment'
import { find, map, mergeRight, path, pathOr, propEq } from 'ramda'
import { isNonEmptyArray } from 'ramda-adjunct'
import React, { useEffect, useMemo, useState } from 'react'
import { firestore } from '../../helpers/firebase';

import { getDatesRange } from "../../helpers/utils"
import { deleteAgenda, getAcceptedAgendasFromEventUser } from "./services";

const { TabPane } = Tabs
const { Meta } = Card
const { confirm } = Modal

const refConfig = ( eventId ) => `events/${ eventId }`;


function ListadoCitas ( props ) {
  const { match } = props // coming from React Router v4.
  console.log( "props", props );
  return ( <div>

    <p>&gt;Listado citas</p>
    <Link to={ `${ match.path }/reunion` }>reunion: { `${ match.path }/reunion` }</Link>


  </div> )
}

function Reunion ( props ) {
  const { match } = props // coming from React Router v4.
  return ( <div>
    <p>&gt;Reunión</p>

    <Link to={ `${ match.path }/listadoCitas` }>listadoCitas: { `${ match.path }/listadoCitas` }</Link>

  </div> )
}

function MyAgenda ( { event, eventUser, currentEventUserId, eventUsers, ...props } ) {
  const [ loading, setLoading ] = useState( true )
  const [ enableMeetings, setEnableMeetings ] = useState( false )
  const [ acceptedAgendas, setAcceptedAgendas ] = useState( [] )
  const [ currentRoom, setCurrentRoom ] = useState( null )

  const eventDatesRange = useMemo( () => {
    return getDatesRange( event.date_start, event.date_end );
  }, [ event.date_start, event.date_end ] );

  useEffect( () => {
    if ( !event || !event._id ) return;

    firestore
      .collection( 'events' )
      .doc( event._id )
      .onSnapshot( function ( doc ) {
        console.log( "doc", doc.data() )
        setEnableMeetings( ( doc.data().enableMeetings ) ? true : false );
      } );
  }, [ event ] )


  useEffect( () => {
    if ( event._id && currentEventUserId && isNonEmptyArray( eventUsers ) ) {
      setLoading( true )
      getAcceptedAgendasFromEventUser( event._id, currentEventUserId )
        .then( ( agendas ) => {
          if ( isNonEmptyArray( agendas ) ) {
            const newAcceptedAgendas = map( ( agenda ) => {
              const agendaAttendees = path( [ 'attendees' ], agenda )
              const otherAttendeeId = isNonEmptyArray( agendaAttendees )
                ? find( attendeeId => attendeeId !== currentEventUserId, agendaAttendees )
                : null

              if ( otherAttendeeId ) {
                const otherEventUser = find( propEq( '_id', otherAttendeeId ), eventUsers )
                return mergeRight( agenda, { otherEventUser } )
              } else {
                return agenda
              }
            }, agendas )

            console.log( `#### currentEventUserId >>> '${ currentEventUserId }'` )
            console.log( '#### agendas >>>', agendas )
            console.log( '#### newAcceptedAgendas >>>', newAcceptedAgendas )
            console.log( '#### eventUsers >>>', eventUsers )
            setAcceptedAgendas( newAcceptedAgendas )
          }
        } )
        .catch( ( error ) => {
          console.error( error )
          notification.error( {
            message: 'Error',
            description: 'Obteniendo las citas del usuario'
          } )
        } )
        .finally( () => setLoading( false ) )
    }
  }, [ event._id, currentEventUserId, eventUsers ] )

  if ( loading ) {
    return (
      <Row align="middle" justify="center" style={ { height: 100 } }>
        <Spin />
      </Row>
    )
  }

  if ( currentRoom ) {
    let userName = (eventUser && eventUser.properties)?eventUser.properties.names: "Anonimo"+new Date().getTime()
    //https://video-app-1496-dev.twil.io/?UserName=vincent&URLRoomName=hola2&passcode=2877841496
    console.log("params",eventUser,currentRoom );

    return (
      <Row align="middle" justify="center" >
        <Col span={ 18 }>
          <Button
            type="primary"
            onClick={ () => { setCurrentRoom( null ) } }
          >
            Regresar al listado de citas
            </Button>

          <div className="aspect-ratio-box">
          <div className="aspect-ratio-box-inside">
          <iframe style={ { border: "2px solid blue" } }
            src={ "https://video-app-1496-dev.twil.io?UserName="+userName+"&URLRoomName="+currentRoom+"&passcode=6587971496" }
            allow="autoplay; fullscreen; camera *;microphone *"
            allowusermedia
            allowFullScreen
            className="iframe-zoom nuevo">
            <p>Your browser does not support iframes.</p>
          </iframe>
          </div>
          </div>

        </Col>
      </Row>
    )
  }

  return (
    <div>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      {/* <Switch>
          <Route path={props.match.url+"listadoCitas"} render={(props) => (
             <ListadoCitas {...props}/>
          )} />
            
            <Route path={props.match.url+"/reunion"} render={(props) => (
          
            <Reunion {...props}/>
            )} />
          
          <Route path={props.match.url+""} render={(props) => (
            <ListadoCitas {...props}/>
            )} />
        </Switch> */}




      { isNonEmptyArray( eventDatesRange ) ? (
        <Tabs>
          { eventDatesRange.map( ( eventDate, eventDateIndex ) => {
            const dayAgendas = acceptedAgendas.filter( ( { timestamp_start } ) => {
              const agendaDate = moment( timestamp_start ).format( 'YYYY-MM-DD' )
              return agendaDate === eventDate
            } )

            return (
              <TabPane
                tab={
                  <div style={ { textTransform: 'capitalize', fontWeight: 'bold' } }>
                    { moment( eventDate ).format( 'MMMM DD' ) }
                  </div> }
                key={ `event-date-${ eventDateIndex }-${ eventDate }` }
              >
                { isNonEmptyArray( dayAgendas )
                  ? dayAgendas.map( ( acceptedAgenda ) => (
                    <>
                      { eventUser && <div>{ eventUser._id }</div> }
                      <AcceptedCard
                        key={ `accepted-${ acceptedAgenda.id }` }
                        eventId={ event._id }
                        eventUser={ eventUser }
                        data={ acceptedAgenda }
                        enableMeetings={ enableMeetings }
                        setCurrentRoom={ setCurrentRoom }
                      />
                    </>
                  ) ) : (
                    <Card>{ 'No tienes citas agendadas para esta fecha' }</Card>
                  ) }

                  
              </TabPane>
            )
          } ) }
        </Tabs>
      ) : (
          <Card>{ 'No tienes citas actualmente' }</Card>
        ) }
    </div>
  )
}

function AcceptedCard ( { data, eventId, eventUser, enableMeetings, setCurrentRoom } ) {
  const [ loading, setLoading ] = useState( false )
  const [ deleted, setDeleted ] = useState( false )


  const userName = pathOr( '', [ 'otherEventUser', 'properties', 'names' ], data )
  const userEmail = pathOr( '', [ 'otherEventUser', 'properties', 'email' ], data )

  /** Entramos a la sala 1 a 1 de la reunión 
   * 
  */
  const accessMeetRoom = ( data, eventUser ) => {

    if ( !eventUser ) {
      alert( "Tenemos problemas con tu usuario, itenta recargar la página" );
      return;
    }
    let userName = eventUser.displayName || eventUser.properties.names || eventUser._id;
    let roomName = data.id;

    setCurrentRoom( roomName )

  }



  const deleteThisAgenda = () => {
    if ( !loading ) {
      setLoading( true )
      deleteAgenda( eventId, data.id )
        .then( () => setDeleted( true ) )
        .catch( ( error ) => {
          console.error( error )
          notification.error( {
            message: 'Error',
            description: 'Error eliminando la cita'
          } )
        } )
        .finally( () => setLoading( false ) )
    }
  }

  return (
    <Row justify="center" style={ { marginBottom: "20px" } }>
      <Card
        style={ { width: 600, textAlign: "left" } }
        bordered={ true }
      >
        <div style={ { marginBottom: '10px' } }>
          { 'Cita con: ' }
        </div>
        <Meta
          avatar={
            <Avatar>
              { userName
                ? userName.charAt( 0 ).toUpperCase()
                : userName }
            </Avatar>
          }
          title={ userName || "No registra nombre" }
          description={
            <div>
              <Row>
                <Col xs={ 18 }>
                  <p>
                    { userEmail || "No registra correo" }
                  </p>
                  { !!data.message && (
                    <p style={ { paddingRight: '20px' } }>
                      { 'Mensaje: ' }
                      { data.message }
                    </p>
                  ) }
                </Col>
                <Col xs={ 6 }>
                  <div style={ { textTransform: 'capitalize' } }>
                    { moment( data.timestamp_start ).format( 'MMMM DD' ) }
                  </div>
                  <div>
                    { moment( data.timestamp_start ).format( 'hh:mm a' ) }
                  </div>
                  <div>
                    { moment( data.timestamp_end ).format( 'hh:mm a' ) }
                  </div>
                </Col>
              </Row>
              { !deleted ? (
                <Row>
                  <Col>
                    <Button

                      type="primary"
                      disabled={ loading || !enableMeetings }
                      loading={ loading }
                      onClick={ () => { accessMeetRoom( data, eventUser ) } }
                    >
                      { enableMeetings ? 'Ingresar a reunión' : 'Reunión Cerrada' }
                    </Button>

                    <Button
                      type="danger"
                      disabled={ loading }
                      loading={ loading }
                      onClick={ () => {
                        confirm( {
                          title: 'Confirmar cancelación',
                          content: '¿Desea cancelar/eliminar esta cita?',
                          okText: 'Si',
                          cancelText: 'No',
                          onOk: deleteThisAgenda
                        } )
                      } }
                    >
                      { 'Cancelar' }
                    </Button>
                  </Col>
                </Row>
              ) : (
                  <Row>
                    { `Cita cancelada.` }
                  </Row>
                ) }
            </div>
          }
        />
      </Card>
    </Row>
  )
}

export default withRouter( MyAgenda )
