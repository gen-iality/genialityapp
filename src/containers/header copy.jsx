import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import * as Cookie from "js-cookie";
import { ApiUrl, AuthUrl, icon } from "../helpers/constants";
import API, { OrganizationApi } from "../helpers/request";
import { FormattedMessage } from "react-intl";
import LogOut from "../components/shared/logOut";
import ErrorServe from "../components/modal/serverError";
import LetterAvatar from "../components/shared/letterAvatar";
import UserStatusAndMenu from "../components/shared/userStatusAndMenu";
import { connect } from "react-redux";
import { addLoginInformation, showMenu } from "../redux/user/actions";
import Menu from "../components/events/shared/menu";

import { Layout } from "antd";

class Header extends Component {
  constructor(props) {
    super(props);
    this.props.history.listen((location, action) => {
      this.handleMenu(location);
    });

    this.state = {
      selection: [],
      organizations: [],
      name: "user",
      user: false,
      menuOpen: false,
      timeout: false,
      modal: false,
      loader: true,
      create: false,
      valid: true,
      serverError: false,
      showAdmin: false,
      showEventMenu: false,
      tabEvtType: true,
      tabEvtCat: true
    };
  }

  async componentDidMount() {
    let evius_token = Cookie.get("evius_token");
    if (!evius_token) {
      this.setState({ user: false, loader: false });
      return;
    }

    try {
      const resp = await API.get(`/auth/currentUser?evius_token=${Cookie.get("evius_token")}`);
      if (resp.status === 200 || resp.status === 201 || resp.status === 202) {
        const data = resp.data;
        const name = data.name ? data.name : data.displayName ? data.displayName : data.email;
        const photo = data.photoUrl ? data.photoUrl : data.picture;
        const organizations = await OrganizationApi.mine();

        this.setState(
          { name, photo, uid: data.uid, id: data._id, user: true, cookie: evius_token, loader: false, organizations },
          () => {
            this.props.dispatch(addLoginInformation(data));
          }
        );
        this.handleMenu(this.props.location);
      } else {
        this.setState({ timeout: true, loader: false });
      }
    } catch (error) {
      if (error.response) {
        console.log(error.response);
        const { status, data } = error.response;
        console.log("STATUS", status, status === 401);
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = {};
        console.log("Error", error.message);
        if (error.message) {
          errorData.message = error.message;
        } else if (error.request) {
          console.log(error.request);
          errorData.message = JSON.stringify(error.request);
        }
        errorData.status = 708;
        this.setState({ serverError: true, loader: false, errorData });
      }
      console.log(error.config);
    }
  }

  handleMenu = location => {
    const splited = location.pathname.split("/");
    if (splited[1] === "") {
      this.setState({ showAdmin: false, menuOpen: false });
    } else if (splited[1] === "event") {
      this.setState({ showAdmin: true, showEventMenu: false, menuOpen: false });
      window.scrollTo(0, 0);
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.loginInfo.name !== prevProps.loginInfo.name ||
      this.props.loginInfo.picture !== prevProps.loginInfo.picture
    ) {
      const name = this.props.loginInfo.name;
      const photo = this.props.loginInfo.picture;
      this.setState({ name, photo, user: true });
    }
  }

  logout = () => {
    Cookie.remove("token");
    Cookie.remove("evius_token");
    window.location.replace(`${AuthUrl}/logout`);
  };

  openMenu = () => {
    console.log("estado menu", this.state.menuOpen);
    this.setState(menuState => {
      return { menuOpen: !menuState.menuOpen, filterOpen: false };
    });
  };

  goReport = e => {
    e.preventDefault();
    window.location.replace(`${ApiUrl}/events/reports`);
  };

  handleMenuEvent = () => {
    this.setState({ showEventMenu: true }, () => {
      this.props.dispatch(showMenu());
    });
  };

  render() {
    const { timeout, serverError, errorData, photo, name, showAdmin, showEventMenu } = this.state;
    const { eventMenu, location } = this.props;
    return (
      <Layout.Header style={{ position: "fixed", zIndex: 1, width: "100%", backgroundColor: "#FDFDFD" }}>
        <div className="navbar-brand">
          {/*evius LOGO */}
          <Link className="navbar-item" to={"/"}>
            <div className="icon-header" dangerouslySetInnerHTML={{ __html: icon }} />
          </Link>

          {/* Menú de administrar un evento (esto debería aparecer en un evento no en todo lado) */}
          {showAdmin && (
            <div className="navbar-item" data-target="navbarBasicExample">
              <p>
                <span className="icon icon-menu" onClick={this.handleMenuEvent}>
                  <i className="fas fa-th"></i>
                </span>
                <span className="icon-menu" onClick={this.handleMenuEvent}>
                  Administrar evento
                </span>
              </p>
            </div>
          )}
          {/* Menú administrativo del evento */}
          {showAdmin && showEventMenu && (
            <div id="navbarBasicExample" className={`is-hidden-desktop navbar-menu ${eventMenu ? "is-active" : ""}`}>
              <div className="navbar-start">
                <Menu match={location.pathname} />
              </div>
            </div>
          )}

          <a
            onClick={this.openMenu}
            role="button"
            class="navbar-burger burger is-active"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className={this.state.menuOpen ? "navbar-menu" : "navbar-menu is-active"}>
          <div class="navbar-start">
            <a class="navbar-item">Home</a>

            <a class="navbar-item">Documentation</a>

            <div class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link">More</a>

              <div class="navbar-dropdown">
                <a class="navbar-item">About</a>
                <a class="navbar-item">Jobs</a>
                <a class="navbar-item">Contact</a>
                <hr class="navbar-divider" />
                <a class="navbar-item">Report an issue</a>
              </div>
            </div>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-primary">
                  <strong>Sign up</strong>
                </a>
                <a class="button is-light">Log in</a>
              </div>
            </div>
          </div>
        </div>

        {timeout && <LogOut />}
        {serverError && <ErrorServe errorData={errorData} />}
      </Layout.Header>
    );
  }
}

const mapStateToProps = state => ({
  categories: state.categories.items,
  types: state.types.items,
  loginInfo: state.user.data,
  eventMenu: state.user.menu,
  permissions: state.permissions,
  error: state.categories.error
});

export default connect(mapStateToProps)(withRouter(Header));
