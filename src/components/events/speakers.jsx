import React, { Component } from "react";
import { AgendaApi, SpeakersApi, ActivityBySpeaker } from "../../helpers/request";

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

                target.querySelector('.modal-close').addEventListener('click', function (e) {
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
                                    <div className="card-content">
                                        <div className="media">
                                            <div className="media-content">
                                                <p className="title is-4">{speaker.name}</p>
                                                <p className="subtitle is-6">{speaker.profession}</p>
                                            </div>
                                            <button className="button is-primary modal-button" onClick={() => this.modal(speaker._id, speaker.image, speaker.name, speaker.profession, speaker.description)} key={key} data-target="#myModal" aria-haspopup="true">Descripcion</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {/* Modal de Speakers para mostrar la información del conferencista junto con sus actividades */}
                <div className="modal" id="myModal">
                    <div className="modal-background"></div>

                    {/* Contenedor para nombre y profesion del conferencista*/}
                    <div className="modal-content">
                        <div className="box">
                            <div className="media">
                                <div className="media-left">
                                    <figure className="image is-48x48">
                                        <img src={infoSpeaker.imagen} alt="Placeholder image" />
                                    </figure>
                                </div>
                                <div className="media-content">
                                    <p className="title is-4">{infoSpeaker.nombre}</p>
                                    <p className="subtitle is-6">{infoSpeaker.cargo}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenedor para descripcion (Hice esta cochinada ya que infoSpeaker.description 
                        viene como etiqueta <p></p> desde base de datos.
                        no me dejaba juntarla en un solo contenedor.
                        Se mapea tambien las actividades por Speaker 
                    */}
                    <div className="modal-content">
                        <div className="box" dangerouslySetInnerHTML={{ __html: infoSpeaker.descripcion }} />
                        {
                            activityesBySpeaker.map((activities, key) => (
                                <div key={key} style={{ marginTop: "5%", marginBottom: "5%" }} class="card">
                                    <header class="card-header">
                                        <p class="card-header-title">
                                            {activities.name}
                                        </p>
                                    </header>
                                    <div class="card-content">
                                        <div>
                                            <p>{activities.datetime_start}</p>
                                            <p>{activities.datetime_end}</p>
                                        </div>
                                        <div class="content">
                                            <div dangerouslySetInnerHTML={{ __html: activities.description }} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <button className="modal-close is-large" aria-label="close"></button>
                </div>
            </div>
        )
    }
}

export default Speakers