import React, {Component} from "react";
import {firestore} from "../../helpers/firebase";
import {CertsApi} from "../../helpers/request";

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
            ],
            disabled:true,
            toSearch:"",
            dataUser:{},
            message:false
        };
        this.usersRef = '';
        this.generateCert = this.generateCert.bind(this)
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

    searchCert = () => {
        this.usersRef.where("properties.cedula", "==", this.state.toSearch)
            .get()
            .then((snap)=>{
                if(snap.docs.length>0){
                    //Existe F25867078
                    const dataUser = snap.docs[0].data();
                    if(!dataUser.checked_in) this.setState({message:'Usuario no checkeado'});
                    else this.setState({dataUser})
                }else{
                    this.setState({message:'No se encontraron certificados para este documento'})
                }
            })
            .catch(function(error) {
                console.log("Error getting documents: ", error);
            });
    };

    async generateCert() {
        const certs = await CertsApi.byEvent(this.props.event._id);
    };

    render() {
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
                {this.state.dataUser.properties && <div className="box">
                    <h3>Certificado encontrado</h3>
                    <button className="button is-primary" onClick={this.generateCert}>Descargar</button>
                </div>}
            </section>
        )
    }
}

export default CertificadoLanding
