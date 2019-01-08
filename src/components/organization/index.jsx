import React, {Component} from 'react';
import { Route, NavLink, Redirect, Switch, withRouter } from "react-router-dom";
import Loading from "../loaders/loading";
import {OrganizationApi} from "../../helpers/request";
import LogOut from "../shared/logOut";
import OrganizationProfile from "./profile";
import Properties from "./properties";
import OrgUsers from "./users";
import OrgEvents from "./events";

class Organization extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true
        }
    }

    async componentDidMount() {
        let orgId = this.props.match.params.id;
        try {
            if(orgId === 'create'){
                const org= {name:'',location:{}, doc:{}, network:{facebook:'',twitter:'',instagram:'',linkedIn:''},email:'',nit:'',phone:''};
                this.setState({create:true,loading:false,org})
            }else{
                const org = await OrganizationApi.getOne(orgId);
                const resp = await OrganizationApi.events(orgId);
                org.location = org.location? org.location: {};
                org.doc = org.doc? org.doc: {};
                org.network = org.network ? org.network : {facebook:'',twitter:'',instagram:'',linkedIn:''};
                this.setState({org,loading:false,events:resp.data,valid:false});
            }
        }catch (e) {
            console.log(e.response);
            this.setState({timeout:true,loading:false});
        }
    }

    render() {
        const { match } = this.props;
        const { timeout, create, loading, org } = this.state;
        return (
            <React.Fragment>
                {
                    loading ? <Loading/>:
                        <section className="columns">
                            <aside className="column menu event-aside is-2 has-text-weight-bold">
                                <p className="subtitle">Organizacion:</p>
                                <p className="title has-text-weight-bold">
                                    {create?'Nueva organización':org.name}
                                </p>
                                {
                                    (!create) && (
                                        <div className={`is-hidden-mobile`}>
                                            <p className="menu-label has-text-centered-mobile">
                                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/profile`}>Detalles</NavLink>
                                            </p>
                                            <p className="menu-label has-text-centered-mobile">
                                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/properties`}>Campos</NavLink>
                                            </p>
                                            <p className="menu-label has-text-centered-mobile">
                                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/users`}>Usuarios</NavLink>
                                            </p>
                                            <p className="menu-label has-text-centered-mobile">
                                                <NavLink className="item" onClick={this.handleClick} activeClassName={"active"} to={`${match.url}/events`}>Eventos</NavLink>
                                            </p>
                                        </div>
                                    )
                                }
                            </aside>
                            <div className="column event-main is-10">
                                {
                                    this.props.loading?<p>Cargando</p>:<section className="section event-wrapper">
                                        <Switch>
                                            <Route exact path={`${match.url}/`} render={()=><Redirect to={`${match.url}/profile`} />}/>
                                            <Route exact path={`${match.url}/profile`} render={()=><OrganizationProfile org={org} />}/>
                                            <Route exact path={`${match.url}/properties`} render={()=><Properties org={org} />}/>
                                            <Protected exact path={`${match.url}/users`} component={OrgUsers} org={org} url={match.url}/>
                                            <Route exact path={`${match.url}/events`} render={()=><OrgEvents org={org} />}/>
                                            <Route component={NoMatch} />
                                        </Switch>
                                    </section>
                                }
                            </div>
                        </section>
                }
                {
                    timeout&&(<LogOut/>)
                }
            </React.Fragment>
        );
    }
}

function NoMatch({ location }) {
    return (
        <div>
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}

const Protected = ({ component: Component, org, url, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (org.user_properties && org.user_properties.length>0)?
                (<Component {...props} org={org}/>):
                (<Redirect push to={`${url}/profile`}/>)
        }
    />
);

const mapStateToProps = state => ({
    loading: state.states.loading,
    permissions: state.permissions,
    error: state.states.error
});

export default withRouter(Organization);