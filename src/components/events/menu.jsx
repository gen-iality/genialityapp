import React, {Component,Fragment} from "react";
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {rolPermissions} from "../../helpers/constants";

class Menu extends Component {
    constructor(props){
        super(props);
        this.state = {
            generalTab:true,
            guestTab:true,
            ticketTab:true,
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
        if(this.props.match !== prevProps.match) {
            this.setState({url:match.url});
        }
    }

    render(){
        const {permissions} = this.props;
        const {generalTab,guestTab,ticketTab,url} = this.state;
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
                                <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/main`}>Datos del evento</NavLink>
                            </li>
                            {
                                permissions.items.includes(rolPermissions.admin_staff._id) &&
                                <li>
                                    <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${url}/pages`}>Contenido</NavLink>
                                </li>
                            }
                            <li>
                                <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/datos`}>Recopilación de datos</NavLink>
                            </li>
                            {
                                permissions.items.includes(rolPermissions.admin_staff._id) &&
                                <Fragment>
                                    <li><NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/espacios`}>Programa y salas</NavLink></li>
                                    <li><NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/staff`}>Organizadores</NavLink></li>
                                </Fragment>
                            }
                            {
                                permissions.items.includes(rolPermissions.admin_badge._id) &&
                                <Fragment>
                                    <li>
                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/badge`}>Escarapela</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/certificados`}>Certificados</NavLink>
                                    </li>
                                </Fragment>
                            }
                        </ul>
                    )
                }
                <p className="menu-label has-text-centered-mobile" onClick={(e)=>{this.setState({guestTab:!guestTab})}}>
                    <span className="item has-text-grey">Invitados</span>
                    <span className="icon"><i className={`${guestTab?'up':'down'}`}/></span>
                </p>
                {
                    guestTab && (
                        <ul className="menu-list">
                            {
                                permissions.items.includes(rolPermissions.admin_invitations._id) &&
                                <Fragment>
                                    <li>
                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/rsvp`}>Lista de invitados</NavLink>
                                    </li>
                                    <li>
                                        <NavLink className={'item is-size-6'} onClick={this.handleClick} activeClassName={'active'} to={`${url}/invitaciones`}>Invitaciones</NavLink>
                                    </li>
                                </Fragment>
                            }
                            <li>
                                <NavLink className="item" onClick={this.handleClick} activeClassName={'active'} to={`${url}/assistants`}>Check In</NavLink>
                            </li>
                        </ul>
                    )
                }
                {
                    permissions.items.includes(rolPermissions.admin_ticket._id) &&
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
