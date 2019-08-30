import React, {Component} from "react";
import NewCert from "./modalNewCert";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[
                {name:"asd",date:"dd/mm/yy"}
            ],
            modalCert:false,
            name:"",
            message:""
        }
    }

    componentDidMount() {
        //fetch certificados
    }

    newCert = () => {
        if(this.state.name.length>0){
            this.props.certTab({name:this.state.name});
            this.closeModal()
        }else{
            this.setState({message:"Por favor coloca un nombre"})
        }
    };

    onChange = e => {this.setState({name:e.target.value,message:""})};

    closeModal = () => {
        this.setState({modalCert:false,name:"",message:""})
    };

    editCert = (data) => {
        this.props.certTab(data)
    };

    deleteCert = () => {

    };

    render() {
        return (
            <React.Fragment>
                <div className="has-text-right">
                    <button className="button is-primary" onClick={e=>this.setState({modalCert:true})}>
                        <span className="icon"><i className="fas fa-plus"/></span>
                        <span className="text-button">Nuevo Certificado</span>
                    </button>
                </div>
                <div className="table">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha Creación</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.list.map((cert,key)=>{
                            return <tr key={key}>
                                <td>{cert.name}</td>
                                <td>{cert.date}</td>
                                <td>Edit</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
                {
                    this.state.modalCert && <NewCert modal={this.state.modalCert} name={this.state.name} onChange={this.onChange}
                                                     message={this.state.message} newCert={this.newCert} closeModal={this.closeModal}/>
                }
            </React.Fragment>
        )
    }
}

export default List
