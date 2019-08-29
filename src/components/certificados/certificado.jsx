import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Dropzone from "react-dropzone";
import {toast} from "react-toastify";

class Certificado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditor:true,
            imageFile:"https://even3.blob.core.windows.net/certificados/Certificado-02.jpg"
        };
        this.elementEdit = null;
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleImage = (files) => {
        const file = files[0];
        if(file) this.setState({imageFile: URL.createObjectURL(file)});
        else toast.error("Solo se permiten imágenes. Intentalo de nuevo");
    };

    setContenedorRef = (node) => { this.contenedor = node };

    handleClickOutside = (e) => {
        if ( ( this.contenedor && this.contenedor.contains(e.target) ) ) {
            this.elementEdit = e.target;
            this.setState({showEditor:true});
        }else {
            if( e.target.classList.contains("icon") || e.target.classList.contains("editor-element") || e.target.classList.contains("fas") ){
                this.setState({showEditor:true});
            }else{
                this.elementEdit = null;
                this.setState({showEditor:false});
            }
        }
    };

    editClick = (action) => {
      this.setState({showEditor:true});
      this.elementEdit.style.marginLeft = "30px"
    };

    render() {
        console.log(this.elementEdit);
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
                            <Dropzone onDrop={this.handleImage} accept=".png,.jpeg" className="zone">
                                <button className="button is-link">Imagen de Fondo</button>
                            </Dropzone>
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
                {this.state.showEditor&&<div className="editor">
                    <div className="edit-option">
                        <div className="edit-element">Font Family</div>
                    </div>
                    <div className="edit-option">
                        <div className="edit-element">Font Sizes</div>
                    </div>
                    <div className="edit-option">
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-tint"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-paint-roller"/></span></div>
                    </div>
                    <div className="edit-option">
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-bold"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-italic"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-underline"/></span></div>
                    </div>
                    <div className="edit-option">
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-align-right"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-align-center"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-align-left"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-align-justify"/></span></div>
                    </div>
                    <div className="edit-option">
                        <div className="edit-element" onClick={e=>{this.editClick('indent')}}>
                            <span className="icon"><i className="fas fa-indent"/></span></div>
                        <div className="edit-element">
                            <span className="icon"><i className="fas fa-outdent"/></span></div>
                    </div>
                </div>}
                <div className="contenedor">
                    <img src={this.state.imageFile} alt="background-image" className="bg"/>
                    <div className="texto-certificado" contentEditable={true} ref={this.setContenedorRef}>
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
