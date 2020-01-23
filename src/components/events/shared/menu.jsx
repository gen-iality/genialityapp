import React, {Component,Fragment} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {rolPermissions} from "../../../helpers/constants";

class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            generalTab:true,
            peopleTab:true,
            commTab:true,
            checkInTab:true,
            ticketTab:true,
            stylesTab:true,
            url:""
        };
    }

    handleClick = (e) => {
        if(!navigator.onLine) e.preventDefault();
    };

    componentDidMount() {
        const {pathname} = this.props.location;
        const splitted = pathname.split('/');
        this.setState({url:"/"+ splitted[1] + "/" + splitted[2]})
    }

    componentDidUpdate(prevProps) {
        const {match} = this.props;
        if(this.props.match.url !== prevProps.match.url) {
            this.setState({url:match.url});
        }
    }

    render(){
        const {permissions} = this.props;
        const {generalTab,peopleTab,commTab,checkInTab,ticketTab,stylesTab,url} = this.state;
        return (
            <Fragment>
                <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({generalTab:!generalTab})}}>
                    <span className="item has-text-grey">Configuración General</span>
                    <span className="icon"><i className={`${generalTab?'up':'down'}`}/></span>
                </p>
                {
                    generalTab && (
                        <ul className="menu-list">
                            <li>
                                <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/main`}>Datos del evento</NavLink>
                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/styles`}>Estilos</NavLink> 
                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/configurationApp`}>Configuraciòn de la app</NavLink>
                                {/* <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/surveys`}>Encuestas</NavLink> */}
                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/notificationsApp`}>Notificaciones</NavLink>
                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/news`}>Noticias de la Aplicación</NavLink>
                            </li>
                            {
                                permissions.data.ids.includes(rolPermissions.admin_staff._id) &&
                                <Fragment>
                                    <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/agenda`}>Programación</NavLink></li>
                                    <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/espacios`}>Espacios</NavLink></li>
                                    <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/certificados`}>Certificados</NavLink></li>
                                    <li><NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/pages`}>Agregar sección</NavLink></li> 
                                </Fragment>
                            }
                        </ul>
                    )
                }
                <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({peopleTab:!peopleTab})}}>
                    <span className="item has-text-grey">Personas</span>
                    <span className="icon"><i className={`${peopleTab?'up':'down'}`}/></span>
                </p>
                {
                    peopleTab && (
                        <ul className="menu-list">
                            {
                                permissions.data.ids.includes(rolPermissions.admin_staff._id) &&
                                <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/staff`}>Organizadores</NavLink></li>
                            }
                            <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/speakers`}>Conferencistas</NavLink></li>
                            {
                                permissions.data.ids.includes(rolPermissions.admin_invitations._id) &&
                                <Fragment>
                                    <li><NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/invitados`}>Lista de invitados</NavLink></li>
                                    <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/tipo-asistentes`}>Tipo de asistentes</NavLink></li>
                                </Fragment>
                            }
                        </ul>
                    )
                }
                <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({commTab:!commTab})}}>
                    <span className="item has-text-grey">Comunicaciones</span>
                    <span className="icon"><i className={`${commTab?'up':'down'}`}/></span>
                </p>
                {
                    commTab && (
                        <ul className="menu-list">
                            {
                                permissions.data.ids.includes(rolPermissions.admin_invitations._id) &&
                                <Fragment>
                                                                      
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/invitaciones`}>Invitaciones</NavLink>
                                    </li>   
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/correos`}>Correos</NavLink>
                                    </li>
                                      
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/encuestas`}>Encuestas Clientes</NavLink>
                                    </li>  <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/encuestasasesores`}>Encuestas Asesores</NavLink>
                                    </li>
                                </Fragment>
                            }
                        </ul>
                    )
                }
                {
                    permissions.data.ids.includes(rolPermissions.checkin._id) &&
                        <Fragment>
                            <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({checkInTab:!checkInTab})}}>
                                <span className="item has-text-grey">Check In</span>
                                <span className="icon"><i className={`${checkInTab?'up':'down'}`}/></span>
                            </p>
                            {
                                checkInTab && (
                                    <ul className="menu-list">
                                        <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/datos`}>Datos de asistentes</NavLink></li>
                                        {
                                            permissions.data.ids.includes(rolPermissions.admin_badge._id) &&
                                            <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/badge`}>Escarapela</NavLink></li>
                                        }
                                        <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/assistants`}>Check In</NavLink></li>
                                        <li><NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/checkin-actividad`}>Check In por Actividad</NavLink></li>
                                    </ul>
                                )
                            }
                        </Fragment>
                }
                {
                    permissions.data.ids.includes(rolPermissions.admin_ticket._id) &&
                    <Fragment>
                        <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({ticketTab:!ticketTab})}}>
                            <span className="item has-text-grey">Entradas</span>
                            <span className="icon"><i className={`${ticketTab?'up':'down'}`}/></span>
                        </p>
                        {
                            ticketTab && (
                                <ul className="menu-list">
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/ticket`}>Administrar entradas</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/orders`}>Pedidos</NavLink>
                                    </li>
                                </ul>
                            )
                        }
                    </Fragment>
                }

                <p className="menu-label has-text-centered-mobile">
                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/dashboard`}>Estadísticas del evento</NavLink>
                </p>
            </Fragment>
        )
    }

}

const mapStateToProps = state => ({
    permissions: state.permissions
});

export default connect(mapStateToProps)(withRouter(Menu))