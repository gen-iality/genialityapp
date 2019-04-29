import React, {Component} from 'react';
import {Link, NavLink, withRouter} from 'react-router-dom';
import * as Cookie from "js-cookie";
import {ApiUrl, AuthUrl, icon, rolPermissions} from "../helpers/constants";
import API, {OrganizationApi} from "../helpers/request"
import {FormattedMessage} from 'react-intl';
import LogOut from "../components/shared/logOut";
import ErrorServe from "../components/modal/serverError";
import LetterAvatar from "../components/shared/letterAvatar";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import {addLoginInformation} from "../redux/user/actions";

class Header extends Component {
    constructor(props) {
        super(props);
        this.props.history.listen((location, action) => {
            console.log("on route change");
            this.handleMenu(location)
        });
        this.state = {
            selection: [],
            organizations: [],
            filterEvius: 0,
            name: 'user',
            user: false,
            menuOpen: false,
            filterOpen: false,
            timeout: false,
            modal: false,
            loader: true,
            create: false,
            valid: true,
            serverError: false,
            tabEvtType:true,
            tabEvtCat: true,
        };
    }

    componentDidMount(){
        let evius_token = Cookie.get('evius_token');
        if(!evius_token) {
            this.setState({user:false,loader:false});
        }
        else {
            API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`)
                .then((resp) => {
                    if(resp.status === 200){
                        const data = resp.data;
                        const name = (data.name) ? data.name: data.displayName? data.displayName: data.email;
                        const photo = (data.photoUrl) ? data.photoUrl : data.picture;
                        OrganizationApi.mine()
                            .then((organizations)=>{
                                this.setState({name,photo,uid:data.uid,id:data._id,user:true,cookie:evius_token,loader:false,organizations},()=>{
                                    this.props.addLoginInformation(data);
                                });
                            })
                            .catch(error => {
                                if (error.response) {
                                    console.log(error.response);
                                    const {status,data} = error.response;
                                    console.log('STATUS',status,status === 401);
                                    if(status === 401) this.setState({timeout:true,loader:false});
                                    else this.setState({serverError:true,loader:false,errorData:data})
                                } else {
                                    let errorData = error.message;
                                    console.log('Error', error.message);
                                    if(error.request) {
                                        console.log(error.request);
                                        errorData = error.request
                                    }
                                    errorData.status = 708;
                                    this.setState({serverError:true,loader:false,errorData})
                                }
                                console.log(error.config);
                            });
                        this.handleMenu(this.props.location)
                    }else{
                        this.setState({timeout:true,loader:false});
                    }
                })
                .catch(error => {
                    if (error.response) {
                        console.log(error.response);
                        const {status,data} = error.response;
                        console.log('STATUS',status,status === 401);
                        if(status === 401) this.setState({timeout:true,loader:false});
                        else this.setState({serverError:true,loader:false,errorData:data})
                    } else {
                        let errorData = error.message;
                        console.log('Error', error.message);
                        if(error.request) {
                            console.log(error.request);
                            errorData = error.request
                        };
                        errorData.status = 708;
                        this.setState({serverError:true,loader:false,errorData})
                    }
                    console.log(error.config);
                });
        }
    }

    handleMenu = (location) => {
        const splited = location.pathname.split('/');
        if(splited[1]===""){
            this.setState({filterEvius:1})
        }else if(splited[1]==="event"){
            this.setState({filterEvius:2,eventUrl:splited[2]})
        }else this.setState({filterEvius:0});
        window.scrollTo(0, 0);
        this.setState({menuOpen:false,filterOpen:false})
    }

    componentDidUpdate(prevProps) {
        if ((this.props.loginInfo.name !== prevProps.loginInfo.name) || (this.props.loginInfo.picture !== prevProps.loginInfo.picture)) {
            const name = this.props.loginInfo.name;
            const photo = this.props.loginInfo.picture;
            this.setState({name,photo,user:true})
        }
    }

    logout = () => {
        Cookie.remove("token");
        Cookie.remove("evius_token");
        window.location.replace(`${AuthUrl}/logout`);
    };

    openMenu = () => {
        this.setState((menuState) => {
            return {menuOpen:!menuState.menuOpen,filterOpen:false}
        });
    };
    
    openFilter = () => {
        this.setState((filterState) => {
            return {filterOpen:!filterState.filterOpen,menuOpen:false}
        });
    };

    goReport = (e) => {
        e.preventDefault();
        window.location.replace(`${ApiUrl}/events/reports`);
    };

    render() {
        const { timeout, serverError, filterEvius, errorData, photo, name } = this.state;
        const { categories, types, permissions } = this.props;
        const menuEvius = [
            '',
            <React.Fragment>
                <p className="navbar-item has-text-weight-bold has-text-grey-dark" onClick={(e)=>{this.setState({tabEvtType:!this.state.tabEvtType})}}>
                    <span>Tipo de Evento</span>
                    <span className="icon"><i className={`${this.state.tabEvtType?'up':'down'}`}/></span>
                </p>
                {
                    this.state.tabEvtType && (
                        <ul>
                            {
                                types.map((item,key)=>{
                                    return <li key={key} className="navbar-item has-text-weight-bold has-text-grey-light">
                                        {item.label}
                                    </li>
                                })
                            }
                        </ul>
                    )
                }
                <hr className="navbar-divider"/>
                <p className="navbar-item has-text-weight-bold has-text-grey-dark" onClick={(e)=>{this.setState({tabEvtCat:!this.state.tabEvtCat})}}>
                    <span>Categor�a</span>
                    <span className="icon"><i className={`${this.state.tabEvtCat?'up':'down'}`}/></span>
                </p>
                {
                    this.state.tabEvtCat && (
                        <ul>
                            {
                                categories.map((item,key)=>{
                                    return <li key={key} className="navbar-item has-text-weight-bold has-text-grey-light">
                                        {item.label}
                                    </li>
                                })
                            }
                        </ul>
                    )
                }
            </React.Fragment>,
            <React.Fragment>
                <p className="navbar-item has-text-weight-bold has-text-grey-dark">Evento</p>
                <p className="navbar-item has-text-centered-mobile">
                    <NavLink className="item has-text-weight-bold has-text-grey-light" onClick={this.handleClick} activeClassName={"active"} to={`main`}>General</NavLink>
                </p>
                {
                    permissions.items.includes(rolPermissions.admin_staff) &&
                    <ul className="menu-list">
                        <li>
                            <NavLink className={'item has-text-weight-bold has-text-grey-lighter'} onClick={this.handleClick} activeClassName={'active'} to={`roles`}>Staff</NavLink>
                        </li>
                    </ul>
                }
                {
                    (permissions.items.includes(rolPermissions.admin_invitations) || permissions.items.includes(rolPermissions.history_invitations)) &&
                        <p className="navbar-item has-text-centered-mobile" onClick={(e)=>{this.setState({userTab:!this.state.userTab})}}>
                            <span className="item has-text-weight-bold has-text-grey-light">Invitaciones</span>
                            <span className="icon">
                                <i className={`${this.state.userTab?'up':'down'}`}/>
                            </span>
                        </p>
                }
                {
                    (this.state.userTab && permissions.items.includes(rolPermissions.admin_invitations)) && (
                        <ul className="menu-list">
                            <li>
                                <NavLink className={'item has-text-weight-bold has-text-grey-lighter'} onClick={this.handleClick} activeClassName={'active'} to={`rsvp`}>Enviar</NavLink>
                            </li>
                            {
                                permissions.items.includes(rolPermissions.history_invitations) &&
                                <li>
                                    <NavLink className={'item has-text-weight-bold has-text-grey-lighter'} onClick={this.handleClick} activeClassName={'active'} to={`messages`}>Historial</NavLink>
                                </li>
                            }
                        </ul>
                    )
                }
                {
                    permissions.items.includes(rolPermissions.admin_ticket) &&
                        <p className="navbar-item has-text-centered-mobile">
                            <NavLink className="item has-text-weight-bold has-text-grey-light" onClick={this.handleClick} activeClassName={"active"} to={`ticket`}>General</NavLink>
                        </p>
                }
                <p className="navbar-item has-text-centered-mobile">
                    <NavLink className="item has-text-weight-bold has-text-grey-light" onClick={this.handleClick} activeClassName={'active'} to={`assistants`}>Asistentes</NavLink>
                </p>
                {
                    permissions.items.includes(rolPermissions.admin_badge) &&
                        <ul className="menu-list">
                            <li>
                                <NavLink className={'item has-text-weight-bold has-text-grey-lighter'} onClick={this.handleClick} activeClassName={'active'} to={`badge`}>Escarapela</NavLink>
                            </li>
                        </ul>
                }
            </React.Fragment>
        ];
        return (
            <React.Fragment>
                <header>
                    <nav className="navbar is-fixed-top has-shadow is-spaced has-text-centered-mobile">
                        <div className="navbar-brand">
                            <Link className="navbar-item" to={'/'}>
                                <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }}/>
                            </Link>
                            {
                                !this.state.loader && <React.Fragment>
                                    {
                                        !this.state.user && <div className="navbar-item is-hidden-desktop">
                                            <button className="button is-primary has-text-weight-bold" onClick={this.logout}>
                                                <FormattedMessage id="header.login" defaultMessage="Sign In"/>
                                            </button>
                                        </div>
                                    }
                                    <div className={`navbar-burger ${this.state.menuOpen ? "is-active" : ""}`}  data-target="mainMenu" onClick={this.openMenu}>
                                        {
                                            (this.state.user && photo) ? <img src={photo} alt={`avatar_${name}`} className="author-image"/>
                                                : <LetterAvatar name={name}/>
                                        }
                                    </div>
                                </React.Fragment>
                            }
                        </div>
                        <div id="mainMenu" className={`navbar-menu ${this.state.menuOpen ? "is-active" : ""}`}>
                            <div className="navbar-end">
                                {
                                    this.state.loader ?
                                    <div><FormattedMessage id="header.wait" defaultMessage="Tico..."/></div>:
                                    this.state.user ?
                                        <React.Fragment>
                                            {
                                                photo ? <img src={photo} alt={`avatar_${name}`} className="author-image is-hidden-mobile"/>
                                                    : <LetterAvatar name={name}/>
                                            }
                                            <div className="navbar-item is-hoverable has-dropdown has-text-weight-bold">
                                                <a className="navbar-link has-text-grey-light is-hidden-mobile">
                                                    {this.state.name}
                                                </a>
                                                <div className="navbar-dropdown is-right">
                                                    <Link className="navbar-item item-sub has-text-weight-bold has-text-grey-dark" to={`/profile/${this.state.id}`}>
                                                        <FormattedMessage id="header.profile" defaultMessage="Profile"/>
                                                    </Link>
                                                    <hr className="navbar-divider"/>
                                                    <Link className="navbar-item item-sub has-text-weight-bold has-text-grey-dark" to={`/profile/${this.state.id}#events`}>
                                                        <FormattedMessage id="header.my_events" defaultMessage="Eventos"/>
                                                    </Link>
                                                    <hr className="navbar-divider"/>
                                                    <Link className="navbar-item item-sub has-text-weight-bold has-text-grey-dark" to={`/profile/${this.state.id}#events`}>
                                                        <FormattedMessage id="header.my_tickets" defaultMessage="Ticket"/>
                                                    </Link>
                                                    {/*
                                                    <p className="navbar-item has-text-weight-bold has-text-grey-dark">
                                                        <FormattedMessage id="header.org" defaultMessage="Org"/>
                                                    </p>
                                                    {
                                                        this.state.organizations.map((org,key)=>{
                                                            return  <Link className="navbar-item item-sub has-text-weight-bold has-text-grey-light" to={`/organization/${org.id}`} key={key}>
                                                                {org.name}
                                                            </Link>
                                                        })
                                                    }
                                                    <Link className="navbar-item item-sub has-text-weight-bold has-text-grey-light" to={`/organization/create`}><FormattedMessage id="header.org_create" defaultMessage="+"/></Link>
                                                    */}
                                                    
                                {
                                    this.state.user &&
                                    <div className="navbar-item has-text-weight-bold has-text-grey-light">
                                        <Link to={'/event/new_event'}>
                                            <button className="button is-primary has-text-weight-bold">
                                                <FormattedMessage id="header.create_event" defaultMessage="Create Event"/>
                                            </button>
                                        </Link>
                                    </div>
                                }
                                                    <hr className="navbar-divider"/>
                                                    <a className="navbar-item has-text-weight-bold has-text-grey-light" onClick={this.logout}>
                                                        <FormattedMessage id="header.logout" defaultMessage="Log Out"/>
                                                    </a>
                                                </div>
                                            </div>
                                        </React.Fragment>:
                                        <div className="navbar-item">
                                            <button className="button is-primary has-text-weight-bold" onClick={this.logout}>
                                                <FormattedMessage id="header.login" defaultMessage="Sign In"/>
                                            </button>
                                        </div>
                                }
                            </div>
                        </div>
                        {/*<div id="filterMenu" className={`is-hidden-desktop navbar-menu ${this.state.filterOpen ? "is-active" : ""}`}>
                            <div className="navbar-dropdown">
                                {menuEvius[filterEvius]}
                            </div>
                        </div>*/}
                    </nav>
                </header>
                {timeout&&(<LogOut/>)}
                {serverError&&(<ErrorServe errorData={errorData}/>)}
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    addLoginInformation: bindActionCreators(addLoginInformation, dispatch)
});

const mapStateToProps = state => ({
    categories: state.categories.items,
    types: state.types.items,
    loginInfo: state.user.data,
    permissions: state.permissions,
    error: state.categories.error});

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Header));