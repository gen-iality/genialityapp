import React, {Component} from "react";
import {firestore} from "../../helpers/firebase";

class CertificadoLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled:true,
            toSearch:"",
            dataUser:{},
            message:false
        };
        this.usersRef = ''
    }

    componentDidMount() {
        this.usersRef = firestore.collection(`${this.props.eventId}_event_attendees`);
    }

    onChange = (e) => {
        const {value} = e.target;
        this.setState({toSearch:value,disabled:!(value.length>4),message:false,dataUser:{}})
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
                    <button className="is-primary">Descargar</button>
                </div>}
            </section>
        )
    }
}

export default CertificadoLanding
