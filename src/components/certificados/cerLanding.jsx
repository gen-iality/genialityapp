import React, {Component} from "react";
import {firestore} from "../../helpers/firebase";
import {CertsApi} from "../../helpers/request";
import Moment from "moment";
import * as jsPDF from "jspdf";

class CertificadoLanding extends Component {
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
            disabled:true,
            toSearch:"",
            dataUser:[],
            message:false
        };
        this.usersRef = '';
        this.generateCert = this.generateCert.bind(this);
        this.searchCert = this.searchCert.bind(this)
    }

    componentDidMount() {
        const {user_properties} = this.props.event;
        let fields = user_properties.filter(item=>item.name!=="names"&&item.name!=="email");
        const list = [...this.state.tags];
        fields.map(field=> list.push({
            tag:`user.${field.name}`,
            value:field.name,
            label:field.label}));
        this.usersRef = firestore.collection(`${this.props.event._id}_event_attendees`);
        this.setState({tags:list});
    }

    onChange = (e) => {
        const {value} = e.target;
        this.setState({toSearch:value,disabled:!(value.length>0),message:false,dataUser:{}})
    };

    async searchCert () {
        try{
            const {tickets} = this.props;
            //Busca por cedula primero
            let record = await this.usersRef.where("properties.cedula", "==", this.state.toSearch).get();
            //Si no encuentra busca por email
            if(record.docs.length<=0)
                record = await this.usersRef.where("properties.email", "==", this.state.toSearch).get();
            //Si encuentra sigue secuencia
            if(record.docs.length>0){
                const dataUser = record.docs.map(doc=>{
                    const data = doc.data();
                    data.ticket = data.ticket_id ? tickets.find(ticket=>ticket._id === data.ticket_id).title : 'Sin Tiquete';
                    return data;
                });
                //Para generar el certificado el usuario tiene que estar checkqueado !!checked_in
                //if(!dataUser.checked_in) this.setState({message:'Usuario no checkeado'});
                this.setState({dataUser})
            }else{
                this.setState({message:'No se encontraron certificados para este documento'})
            }
        }catch (error) {
            console.log("Error getting documents: ", error);
        }
    };

    async generateCert(dataUser) {
        const {event} = this.props;
        const certs = await CertsApi.byEvent(event._id);
        event.datetime_from = Moment(event.datetime_from).format('DD/MM/YYYY');
        event.datetime_to = Moment(event.datetime_to).format('DD/MM/YYYY');
        //Se trae lcertificado que concuerde con el rol_id, si no tiene rol_id tra el certificado sin rol_id
        const rolCert = dataUser.rol_id ? certs.find(cert=>cert.rol_id === dataUser.rol_id) : certs.find(cert=>!cert.rol_id);
        if(rolCert && rolCert.content) {
            let content = rolCert.content;
            this.state.tags.map(item => {
                let value;
                if (item.tag.includes('event.')) value = event[item.value];
                else if (item.tag.includes('ticket.')) value = dataUser.ticket;
                else value = dataUser.properties[item.value];
                return content = content.replace(`[${item.tag}]`, value)
            });
            content = content.match(/<p>(.*?)<\/p>/g).map(i => i.replace(/<\/?p>/g, ''));
            content = content.map(i => i.replace(/<\/?br>/g, ''));
            this.img = this.loadImage(rolCert.background, () => {
                this.drawImg(rolCert.background, content)
            });
        }else{
            alert("No hay plantillas de certificados. Contactese con el admin");
        }
    }

    drawImg = (bckImg,newContent) => {
        let posY = 100;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 1100;
        canvas.height = 743;
        const type = bckImg.split(';')[0].split('/')[1];
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
        for(let i = 0; i < newContent.length; i++) {
            const item = newContent[i];
            const txtWidth = ctx.measureText(item).width;
            ctx.font = "bold 32px Arial";
            wrapText(ctx, item, (canvas.width/2) - (txtWidth/2), posY, 700, 28);
            posY += 10;
        }
        const combined = new Image();
        combined.src = canvas.toDataURL('image/'+type);
        const pdf = new jsPDF({orientation: 'landscape'});
        pdf.addImage(combined.src, type.toUpperCase(), 0, 0);
        pdf.save("certificado_"+this.props.event.name+".pdf");
    }

    loadImage = (src, onload) => {
        var img = new Image();
        img.onload = onload;
        img.src = src;
        return img;
    }

    render() {
        const {dataUser} = this.state;
        return (
            <section>
                <div className="field has-addons">
                    <div className="control is-expanded">
                        <input className="input is-fullwidth" type="text" onChange={this.onChange} placeholder="Ingresa tu documento para buscar tu certificado"/>
                    </div>
                    <div className="control">
                        <button className="button is-primary" onClick={this.searchCert} disabled={this.state.disabled}>
                            Buscar
                        </button>
                    </div>
                </div>
                {this.state.message && <p>{this.state.message}</p>}
                {dataUser.length > 0 && <div className="box">
                    <h3>Usuario encontrado</h3>
                    {
                        dataUser.filter(user=>user.checked_in).map(user=>(
                            <button className="button is-primary" onClick={e=>this.generateCert(user)}>Descargar Certifcado - {user.ticket}</button>
                        ))
                    }
                </div>}
            </section>
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

export default CertificadoLanding
