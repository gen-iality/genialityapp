import React, {Component} from "react";
import {withRouter} from "react-router-dom";

class Certificado extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="editor-certificado">
                <nav className="level">
                    <div className="level-left">
                        <div className="level-item">
                            <p className="subtitle is-5">
                                <strong>{this.props.data.name}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <button className="button is-info">Tags disponibles</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-link">Imagen de Fondo</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-primary">Preview</button>
                        </div>
                        <div className="level-item">
                            <button className="button">Cancelar</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-success">Guardar</button>
                        </div>
                    </div>
                </nav>
                <div className="contenedor">
                    <img src="" alt="background-image" className="bg"/>
                    <div className="texto-certificado">
                        <p>&nbsp;</p>
                        <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
                        <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>Certificamos
                        que <strong>participante.nome}</strong>, participou com êxito do
                        evento evento.titulo} realizado em evento.data.realizacao}, na cidade de evento.cidade},
                        contabilizando carga horária total de evento.carga.horaria} horas.</p><p>&nbsp;</p>
                        <p>&nbsp;</p><p>evento.cidade},
                        informe a data aqui.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Certificado)
