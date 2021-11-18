import React, { Component } from 'react';
import Moment from "moment";

class EmailPrev extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const icon = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1128 193" style="enable-background:new 0 0 1128 193;" xml:space="preserve"><g><path style="fill:#50D3C9" d="M318.4,8.6l-68,174.7c-0.8,2.3-2,3.1-4.3,3.1h-4.8c-2.5,0-3.6-0.8-4.3-2.8l-68-175c-0.8-1.8-0.3-3.1,2-3.1h4.8\tc3.8,0,4.8,0.5,5.6,2.8l56.6,146.4c2.3,6.4,4.3,13.8,5.6,17.1h0.8c1.3-3.3,3.1-10.4,5.3-17.1L305.9,8.4c0.8-2.3,2-2.8,5.6-2.8h4.8\tC318.9,5.6,319.2,6.8,318.4,8.6"/><path style="fill:#50D3C9" d="M396.8,5.6h5.3c2.3,0,3.1,0.8,3.1,3.3v174.2c0,2.5-0.8,3.3-3.1,3.3h-5.3c-2.6,0-3.3-0.8-3.3-3.3V8.9\tC393.5,6.3,394.3,5.6,396.8,5.6"/><path style="fill:#50D3C9" d="M563.6,179.3c37.2,0,55.3-21.1,55.3-54V8.9c0-2.5,0.8-3.3,3.1-3.3h5.6c2.3,0,3.1,0.8,3.1,3.3v116.4\tc0,39.5-22.1,64.9-67,64.9c-45.1,0-67.2-25.5-67.2-64.9V8.9c0-2.5,0.8-3.3,3.3-3.3h5.3c2.3,0,3.1,0.8,3.1,3.3v116.4\tC508.1,158.1,526.1,179.3,563.6,179.3"/><path style="fill:#50D3C9" d="M779,2c34.1,0,53.5,12.5,66.7,39.5c1.3,2.3,0.5,3.6-1.5,4.3l-5.1,2.3c-2,0.8-2.8,0.8-4.1-1.5\tc-11.5-22.7-27.5-33.4-56-33.4c-32.9,0-52,14.3-52,38.7c0,30.1,28.3,34.9,57.1,38c31.1,3.6,63.4,8.9,63.4,48.1\tc0,33.1-22.9,52-67.2,52c-35.7,0-56.3-14.3-68.5-44.6c-1-2.6-0.8-3.6,1.8-4.6l4.8-1.8c2.3-0.8,3.1-0.5,4.3,2\tc11,25.7,29,37.7,57.6,37.7c36.7,0,55.5-13.2,55.5-40.2c0-30-26.5-33.9-54.2-37.2c-31.8-3.8-66.5-9.2-66.5-48.6\tC715,21.6,738.7,2,779,2"/><path style="fill:#50D3C9" d="M108.2,17.8H3.7C3.3,17.8,3,17.4,3,17V5.8C3,5.4,3.3,5,3.7,5h104.4c0.4,0,0.7,0.3,0.7,0.7V17\tC108.9,17.4,108.6,17.8,108.2,17.8"/><path style="fill:#50D3C9" d="M108.2,102.3H3.7c-0.4,0-0.7-0.3-0.7-0.7V90.3c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7v11.2\tC108.9,101.9,108.6,102.3,108.2,102.3"/><path style="fill:#50D3C9" d="M108.2,186.8H3.7c-0.4,0-0.7-0.3-0.7-0.7v-11.2c0-0.4,0.3-0.7,0.7-0.7h104.4c0.4,0,0.7,0.3,0.7,0.7V186\tC108.9,186.5,108.6,186.8,108.2,186.8"/><rect x="3" y="161.3" style="fill:#50D3C9" width="12.7" height="15.4"/><text transform="matrix(1 0 0 1 871.8398 189.939)"><tspan x="0" y="0" style="fill:#50D3C9;font-family:\'Montserrat\';font-size:122.7092px;letter-spacing:24;">.C</tspan><tspan x="159.4" y="0" style="fill:#50D3C9;font-family:\'Montserrat\';font-size:122.7092px;letter-spacing:24;">O</tspan></text></g></svg>';
        return (
            <div className="has-text-centered">
                <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }} />
                <p>
                    Hola <strong>invitado</strong>, haz sido invitad@ a
                    <br />
                    <strong>{this.props.event.name}</strong>
                </p>
                <div className="columns">
                    <div className="column">
                        <div className="columns rsvpDate">
                            <div className="column">
                                <p>Fecha Inicio</p>
                                <p className="date">{Moment(this.props.event.datetime_from).format('DD MMM, YYYY')}</p>
                            </div>
                            <div className="column">
                                <span className="icon is-large has-text-grey">
                                    <i className="far fa-calendar-alt fa-2x" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="columns">
                            <div className="column">
                                <p>Hora</p>
                                <p>{Moment(this.props.event.datetime_from).format('HH:mm')}</p>
                            </div>
                            <div className="column">
                                <span className="icon is-large has-text-grey">
                                    <i className="far fa-clock fa-2x" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="columns">
                    <div className="column">
                        <div className="columns rsvpDate">
                            <div className="column">
                                <p>Fecha Fin</p>
                                <p className="date">{Moment(this.props.event.datetime_to).format('DD MMM, YYYY')}</p>
                            </div>
                            <div className="column">
                                <span className="icon is-large has-text-grey">
                                    <i className="far fa-calendar-alt fa-2x" />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="columns">
                            <div className="column">
                                <p>Hora</p>
                                <p>{Moment(this.props.event.datetime_to).format('HH:mm')}</p>
                            </div>
                            <div className="column">
                                <span className="icon is-large has-text-grey">
                                    <i className="far fa-clock fa-2x" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <span className="icon is-large has-text-primary">
                        <i className="fas fa-map-marker-alt fa-3x" />
                    </span>
                    <span>
                        Ubicación del evento<br />{this.props?.event?.location?.FormattedAddress}
                    </span>
                </div>
                <p>
                    <button className="button is-primary is-medium is-rounded">Confirmar asistencia</button>
                </p>
                <div className="imgRsvp">
                    <img src={this.props.item.image ? this.props.item.image : this.props.event.image} alt={'Imagen Perfil'} />
                </div>
                <div dangerouslySetInnerHTML={{
                    __html: this.props.item.message
                }} />
            </div>
        );
    }
}

export default EmailPrev;