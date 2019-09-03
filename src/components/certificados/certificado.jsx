import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import * as html2canvas from "html2canvas";
import * as jsPDF from 'jspdf';
import Dropzone from "react-dropzone";
import {toast} from "react-toastify";

class Certificado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:{
                'event.name' : 'Nombre del Evento',
                'event.start' : 'Fecha Inicio del Evento',
                'event.end' : 'Fecha Fin del Evento',
                'event.venue' : 'Lugar del Evento',
                'event.address' : 'Dirección del Evento',
                'user.names' : 'Nombre(s) de asistente',
                'user.email' : 'Correo de asistente',
            },
            openTAG:false,
            imageFile:"https://even3.blob.core.windows.net/certificados/Certificado-02.jpg",
            imageData:{}
        };
        this.elementEdit = null;
        this.editor = {};
    }

    componentDidMount() {
        const {user_properties} = this.props.event;
        let fields = user_properties.filter(item=>item.name!=="names"&&item.name!=="email");
        const list = Object.assign({},this.state.tags);
        fields.map(field=> list[`user.${field.name}`] = field.label );
        this.setState({tags:list})
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
            <React.Fragment>
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
                                <button className="button is-info" onClick={e=>{this.setState({openTAG:true})}}>Tags disponibles</button>
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
                            <p>Certificamos que <strong>[user.names]</strong>, participo con êxito de
                                evento [event.name] realizado del [event.start] al [event.end].</p>
                            <p>&nbsp;</p>
                            <p>&nbsp;</p>
                            <p>[event.venue], información.</p>
                        </div>
                    </div>
                </div>
                {
                    this.state.openTAG &&
                        <div className={`modal ${this.state.openTAG ? "is-active" : ""}`}>
                            <div className="modal-background"/>
                            <div className="modal-card">
                                <header className="modal-card-head">
                                    <p className="modal-card-title">Etiquetas Disponibles</p>
                                    <button className="delete is-large" aria-label="close" onClick={e=>{this.setState({openTAG:false})}}/>
                                </header>
                                <section className="modal-card-body tags-certificado">
                                    <p>Use etiquetas para ingresar información referente al evento o los asistentes</p>
                                    <dl>
                                        {Object.keys(this.state.tags).map( key => {
                                            return <React.Fragment key={key}>
                                                <dt> <code>{key}</code> </dt>
                                                <dd> {this.state.tags[key]} </dd>
                                            </React.Fragment>
                                        } )}
                                    </dl>
                                </section>
                                <footer className="modal-card-foot">
                                    <button className="button is-text" onClick={e=>{this.setState({openTAG:false})}}>Cerrar</button>
                                </footer>
                            </div>
                        </div>
                }
            </React.Fragment>
        )
    }
}

export default withRouter(Certificado)
