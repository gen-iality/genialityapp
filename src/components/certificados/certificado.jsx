import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Moment from "moment"
import {firestore} from "../../helpers/firebase";
import * as jsPDF from 'jspdf';
import Dropzone from "react-dropzone";
import {toast} from "react-toastify";
import {CertsApi} from "../../helpers/request";
Moment.locale('es');

const html = document.querySelector("html");
const initContent = "<p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p><br></p><p>Certificamos que <br></p><p><br></p><p>[user.names], <br></p><p><br></p><p>participo con êxito de    evento</p><p><br></p><p> [event.name]</p><p><br></p><p>realizado del [event.start] al [event.end].</p><p><br></p><p><br></p><p>[event.venue], información.</p>";
let imagesLoaded = 0;
class Certificado extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tags:[
                {tag:'event.name', label:'Nombre del Evento', value:'name'},
                {tag:'event.start', label:'Fecha Inicio del Evento', value:'datetime_from'},
                {tag:'event.end', label:'Fecha Fin del Evento', value:'datetime_to'},
                {tag:'event.venue', label:'Lugar del Evento', value:'venue'},
                {tag:'event.address', label:'Dirección del Evento', value:'location.FormattedAddress'},
                {tag: 'user.names', label: 'Nombre(s) de asistente', value: 'names'},
                {tag: 'user.email', label: 'Correo de asistente', value: 'email'},
                {tag: 'ticket.name', label: 'Nombre del tiquete', value: 'ticket.title'},
            ],
            content:'',
            openTAG:false,
            newContent:false,
            imageFile:"data:image/png;base64,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9BZmkTcAAHD0BAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEBAABUIzAAAIBqBAYAAFCNwAAAAKoRGAAAQDUCAwAAqEZgAAAA1QgMAACgGoEB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",
            imageData:{}
        };
        this.saveCert = this.saveCert.bind(this)
    }

    componentDidMount() {
        const {user_properties} = this.props.event;
        let fields = user_properties.filter(item=>item.name!=="names"&&item.name!=="email");
        const list = [...this.state.tags];
        //Se llenan los tags con las propiedades de los attendees del evento
        fields.map(field=> list.push({
            tag:`user.${field.name}`,
            value:field.name,
            label:field.label}));
        this.setState({tags:list,content:this.props.data.content?this.props.data.content:initContent})
    }

    //Funciòn para manejar la imagen de fondo
    handleImage = (files) => {
        const file = files[0];
        if(file) {
            //Si la imagen cumple con el formato se crea el URL para mostrarlo
            this.setState({imageFile: URL.createObjectURL(file)});
            const self = this;
            //Se crea un elemento Image para convertir la image en Base64 y tener el tipo y el formato
            const i = new Image();
            i.onload = () => {
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    const imageData = {data:reader.result,full:file.type,type:file.type.split('/')[1]};
                    self.setState({imageData:imageData})
                }
            };
            i.src = file.preview
        }
        else toast.error("Solo se permiten imágenes. Intentalo de nuevo");
    };

    setContenedorRef = (node) => { this.contenedor = node };

    async saveCert(e) {
        try {
            //Si es un certtificado ya creado, solo se edita y se envìa la imagen nueva y el contenido
            if(this.props.data.content){
                const data = {
                    content:this.contenedor.innerHTML,
                    background: this.state.imageData.data ? this.state.imageData.data : this.state.imageFile
                };
                await CertsApi.editOne(data, this.props.data._id);
                toast.info("Certificado Actualizado");
            }else{
                //Si es un certificado nuevo, se crea el name y rol con las porpiedades del padre, mas imagen y contenido
                const data = {
                    name: this.props.data.name,
                    rol_id: this.props.data.rol,
                    content: this.contenedor.innerHTML,
                    event_id: this.props.event._id,
                    background: this.state.imageData.data ? this.state.imageData.data : this.state.imageFile
                };
                await CertsApi.create(data);
                toast.success("Certificado Creado");
            }
        }catch (e) {
            console.log(e);
        }
    };

    previewCert = (e) => {
        const {imageData,imageFile} = this.state;
        const {event} = this.props;
        //Parseo de fechas para facil lectura
        event.datetime_from = Moment(event.datetime_from).format('DD/MM/YYYY');
        event.datetime_to = Moment(event.datetime_to).format('DD/MM/YYYY');
        //Se trae el contenido del textArea
        let content =  this.contenedor.innerHTML;
        //Se hace una consulta al firestore para traer un solo usuario para llenar el preview
        const userRef = firestore.collection(`${event._id}_event_attendees`);
        userRef.orderBy("updated_at", "desc")
            .limit(1)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                    const oneUser = querySnapshot.docs[0].data();
                    //Se mapea el listado de tags para llenarlo de acuerdo si es evento, propiedad o tiquete
                    this.state.tags.map(item=>{
                        let value;
                        if(item.tag.includes('event.')) value = event[item.value];
                        else if(item.tag.includes('ticket.')) value = oneUser.ticket.title ? oneUser.ticket.title : 'Sin Tiquete';
                        else value = oneUser.properties[item.value];
                        return content = content.replace(`[${item.tag}]`,value)
                    });
                    //El contenido es un HTML entonces se reemplazan las etiquetas y los espacios para quedar un arreglo
                    //de solo texto. Esto facilita la creaciòn de PDF
                    content = content.match(/<p>(.*?)<\/p>/g).map(i=>i.replace(/<\/?p>/g,''));
                    content = content.map(i=>i.replace(/<\/?br>/g,''));
                    this.setState({newContent:content},()=>{
                        this.img1 = this.loadImage(imageData.data ? imageData.data : imageFile, this.drawImg);
                    })
                } else {
                    alert("Para mirar el preview hay que tener un asistente si quiera");
                    return null;
                }
            });
    };

    handleTAG = (open) => {
        this.setState({openTAG:open});
        if(open) html.classList.add('is-clipped');
        else html.classList.remove('is-clipped');
    };

    drawImg = () => {
        const {imageData } = this.state;
        const self = this;
        let posY = 100;
        imagesLoaded += 1;
        if(imagesLoaded === 1) {
            const canvas = document.createElement("canvas");
            canvas.width = 1100;
            canvas.height = 743;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(this.img1, 0, 0, canvas.width, canvas.height);
            for(let i = 0; i < self.state.newContent.length; i++) {
                const item = self.state.newContent[i];
                const txtWidth = ctx.measureText(item).width;
                ctx.font = "bold 32px Arial";
                wrapText(ctx, item, (canvas.width/2) - (txtWidth/2), posY, 700, 28);
                posY += 10;
            }
            const combined = new Image();
            combined.src = canvas.toDataURL(imageData.data ? imageData.full : 'image/png');
            const pdf = new jsPDF({orientation: 'landscape'});
            pdf.addImage(combined.src, imageData.type ? imageData.type.toUpperCase() : 'PNG', 0, 0);
            pdf.save("certificado.pdf");
            imagesLoaded = 0;
            self.setState({newContent:false})
        }
    }

    loadImage = (src, onload) => {
        var img = new Image();
        img.onload = onload;
        img.src = src;
        return img;
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
                                <button className="button" onClick={e=>{this.handleTAG(true)}}>Tags disponibles</button>
                            </div>
                            <div className="level-item">
                                <Dropzone onDrop={this.handleImage} accept="image/*" className="zone">
                                    <button className="button">Imagen de Fondo</button>
                                </Dropzone>
                            </div>
                            <div className="level-item">
                                <button className="button" onClick={this.previewCert}>Preview</button>
                            </div>
                            <div className="level-item">
                                <button className="button" onClick={this.props.listTab}>Regresar</button>
                            </div>
                            <div className="level-item">
                                <button className="button is-primary" onClick={this.saveCert}>{this.props.data.content?'Editar':'Guardar'}</button>
                            </div>
                        </div>
                    </nav>
                    <div className="contenedor">
                        <img src={this.state.imageFile} alt="background-cert" className="bg"/>
                        <div className="texto-certificado" id="contentCert"
                             dangerouslySetInnerHTML={{__html:this.state.content}}
                             contentEditable={true} ref={this.setContenedorRef}>
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
                                    <button className="delete is-large" aria-label="close" onClick={e=>{this.handleTAG(false)}}/>
                                </header>
                                <section className="modal-card-body tags-certificado">
                                    <p>Use etiquetas para ingresar información referente al evento o los asistentes</p>
                                    <dl>
                                        {this.state.tags.map( (item, key) => {
                                            return <React.Fragment key={key}>
                                                <dt> <code>{item.tag}</code> </dt>
                                                <dd> {item.label} </dd>
                                            </React.Fragment>
                                        } )}
                                    </dl>
                                </section>
                                <footer className="modal-card-foot">
                                    <button className="button is-text" onClick={e=>{this.handleTAG(false)}}>Cerrar</button>
                                </footer>
                            </div>
                        </div>
                }
            </React.Fragment>
        )
    }
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for(var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y+40);
}

export default withRouter(Certificado)
