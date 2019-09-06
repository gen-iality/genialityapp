import React, {Component} from "react";
import {PointsApi} from "../../helpers/request";
import Moment from "moment";

class PointCheckin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roles:[]
        }
    }

    async componentDidMount() {
        const roles = await PointsApi.byEvent(this.props.eventID);
        this.setState({roles})
    }

    editRole = () => {

    }

    render() {
        return (<div style={{width:this.props.visible?'100%':'0%'}} className="overlay">
                <p className="close-btn action_pointer" onClick={e=>this.props.close(false)}>&times;</p>
                <div className="overlay-content">
                    <button className="button">Nuevo</button>
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Fecha Creación</th>
                            <th/>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.roles.map((cert,key)=>{
                            return <tr key={key}>
                                <td>{cert.name}</td>
                                <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                <td>
                                <span className="icon has-text-primary action_pointer"
                                      onClick={(e)=>{this.editRole(cert)}}><i className="fas fa-edit"/></span>
                                </td>
                                <td className='has-text-centered'>
                                <span className='icon has-text-danger action_pointer'
                                      onClick={(e)=>{this.setState({id:cert._id,deleteModal:true})}}><i className='far fa-trash-alt'/></span>
                                </td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default PointCheckin
