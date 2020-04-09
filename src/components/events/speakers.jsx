import React, { Component } from "react";

//custom
import { AgendaApi, SpeakersApi, ActivityBySpeaker } from "../../helpers/request";
import { Card } from 'antd';

const { Meta } = Card;

class Speakers extends Component {
    constructor(props) {
        //Se realiza constructor para traer props desde landing.jsx
        super(props);
        this.state = {
            speakers: [],
            infoSpeaker: [],
            activityesBySpeaker: []
        }
    }

    async componentDidMount() {
        //Se hace la consulta a la api de speakers
        let speakers = await SpeakersApi.byEvent(this.props.eventId);
        //Se envia al estado para acceder desde ahí a los datos
        this.setState({ speakers });
        //Se comprueban los datos desde el estado
        // console.log(this.state.speakers)
    }

    async activitySpeakers(id) {
        //Se consulta la api para traer la informacion de actividades por conferencista
        let InfoActivityesBySpeaker = await ActivityBySpeaker.byEvent(this.props.eventId, id)
        //Se manda al estado la consulta
        this.setState({
            activityesBySpeaker: InfoActivityesBySpeaker.data
        })
    }

    modal(id, image, name, profession, description) {
        //Se llama esta funcion para cargar la consulta de actividades por conferencista
        this.activitySpeakers(id)
        // Se envian los datos al estado para mostrarlos en el modal, Esto para hacer el modal dinamico
        this.setState({
            infoSpeaker: {
                imagen: image,
                nombre: name,
                cargo: profession,
                descripcion: description
            }
        })
        //Se realiza la funcionalidad de la activacion del modal ya que bulma no tiene soporte javascript
        document.querySelectorAll('.modal-button').forEach(function (el) {
            el.addEventListener('click', function () {
                var target = document.querySelector(el.getAttribute('data-target'));
                var html = document.querySelector('html');

                target.classList.add('is-active');

                target.querySelector('.delete').addEventListener('click', function (e) {
                    e.preventDefault();
                    target.classList.remove('is-active');
                    html.classList.remove('is-active');
                });
            });
        });
    }

    render() {
        const { speakers, infoSpeaker, activityesBySpeaker } = this.state
        return (
            <div>
                <div className="columns container-calendar-speaker">
                    <div className="column calendar-speakers">
                        {/* Mapeo de datos para mostrar los Speakers */}
                        {
                            speakers.map((speaker, key) => (
                                <div className="card" key={key}>
                                    <div className="card-image">
                                        <figure className="image is-square">
                                            <img src={speaker.image} alt="Placeholder image" />
                                        </figure>
                                    </div>
                                    <div className="content-information-speakers"> 
                                        <div className="information-speakers">                                
                                            <span className="title is-5">{speaker.name}</span>
                                            <br/>
                                            <p className="">{speaker.profession}</p> 
                                        </div>                               
                                        <div>
                                            <button style={{ paddingLeft: "1.25em", paddingRight: "1.25em", borderRadius: "3px", display: "inline-block" }} className="button is-primary modal-button" onClick={() => this.modal(speaker._id, speaker.image, speaker.name, speaker.profession, speaker.description)} key={key} data-target="#myModal" aria-haspopup="true">Descripción</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/* Modal de Speakers para mostrar la información del conferencista junto con sus actividades */}
                <div className="modal" id="myModal" style={{ zIndex: 1000 }}>
                    <div className="modal-background"></div>
                        <div className="modal-card"> 
                        
                        {/* Contenedor para nombre y profesion del conferencista*/}
                        <div className="modal-card-head is-block" style={{ paddingTop:"1.5rem", minHeight: "40%"}}>
                            <p className="modal-card-title has-text-right">
                                <button className="delete" aria-label="close"></button>
                            </p>
                            <br/>
                            <div className="media">
                                <figure className="media-left image is-128x128">
                                    <img src={infoSpeaker.imagen} alt="Placeholder image" />
                                </figure> 

                                <div className="media-content ">
                                    <span className="title is-3">{infoSpeaker.nombre}</span>
                                    <p className="is-4">{infoSpeaker.cargo}</p>
                                </div>    
                            </div>                         
                        </div>

                        {/* Contenedor para descripcion 
                            Se mapea tambien las actividades por Speaker 
                        */}
                        <div className="modal-card-body">                                                  
                       
                            <div className="has-text-left"  dangerouslySetInnerHTML={{ __html: infoSpeaker.descripcion }} />
                            {
                                activityesBySpeaker.map((activities, key) => (
                                    <div key={key}>

                                            <div class="content">
                                                <br/>
                                                <br/>
                                                <p className="title is-5 has-text-left">{activities.name}</p>
                                                <p className="title is-6 has-text-left">{activities.datetime_start} - {activities.datetime_end}</p>
                                                <br/>
                                                <div className="has-text-left"  dangerouslySetInnerHTML={{ __html: activities.description }} />
                                            </div>
                                        </div>
                                ))
                            }
                        </div>
                        <footer class="modal-card-foot"> </footer>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default Speakers