import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import MediumEditor from 'medium-editor';
import * as html2canvas from "html2canvas";
import * as jsPDF from 'jspdf';
import Dropzone from "react-dropzone";
import {toast} from "react-toastify";

class Certificado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageFile:"https://even3.blob.core.windows.net/certificados/Certificado-02.jpg",
            imageData:{}
        };
        this.elementEdit = null;
        this.editor = {};
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleImage = (files) => {
        const file = files[0];
        if(file) {
            this.setState({imageFile: URL.createObjectURL(file)});
            const self = this;
            const i = new Image();
            i.onload = () => {
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    const imageData = {data:reader.result,type:file.type.split('/')[1]};
                    self.setState({imageData:imageData})
                }
            };

            i.src = file.preview
        }
        else toast.error("Solo se permiten imágenes. Intentalo de nuevo");
    };

    setContenedorRef = (node) => { this.contenedor = node };

    handleClickOutside = (e) => {
        if ( ( this.contenedor && this.contenedor.contains(e.target) ) ) {
            this.elementEdit = e.target;
            this.editor = new MediumEditor(this.elementEdit,{
                placeholder: false,
                buttonLabels:true,
                toolbar:{
                    buttons:['bold','italic','underline']
                }});
        }else {
            this.elementEdit = null;
        }
    };

    saveCert = (e) => {
        console.log(this.contenedor.innerHTML);
    };

    previewCert = (e) => {
        const {imageData} = this.state;
        html2canvas(document.querySelector("#contenedorCert"), {logging:true,useCORS:true})
            .then((canvas) => {
                const contentData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'landscape'
                });
                if(imageData.data) pdf.addImage(imageData.data, imageData.type.toUpperCase(), 0, 0);
                pdf.addImage(contentData, 'PNG', 0, 0);
                pdf.save("download.pdf");
            });
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
                            <Dropzone onDrop={this.handleImage} accept="image/*" className="zone">
                                <button className="button is-link">Imagen de Fondo</button>
                            </Dropzone>
                        </div>
                        <div className="level-item">
                            <button className="button is-primary" onClick={this.previewCert}>Preview</button>
                        </div>
                        <div className="level-item">
                            <button className="button" onClick={this.props.listTab}>Cancelar</button>
                        </div>
                        <div className="level-item">
                            <button className="button is-success" onClick={this.saveCert}>Guardar</button>
                        </div>
                    </div>
                </nav>
                <div className="contenedor">
                    <div className="texto-certificado" id={"contenedorCert"} contentEditable={true} ref={this.setContenedorRef}>
                        <img src={this.state.imageFile} alt="background-image" className="bg"/>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
                        <p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p>
                        <p>Certificamos que <strong>[participante.nome]</strong>, participou com êxito do
                        evento [evento.titulo] realizado em [evento.data.realizacao], na cidade de [evento.cidade],
                        contabilizando carga horária total de [evento.carga.horaria] horas.</p>
                        <p>&nbsp;</p>
                        <p>&nbsp;</p>
                        <p>[evento.cidade], informe a data aqui.</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Certificado)
