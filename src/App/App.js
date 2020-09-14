import React, { Component } from "react";
import { Provider } from "react-redux";
import * as Cookie from "js-cookie";
import { parseUrl } from "../helpers/constants";
import './App.less';
import { userContext } from "../containers/userContext";
import privateInstance, { Actions } from "../helpers/request";
import store from "../redux/store";
import MainRouter from "../containers/router";
import "bulma-spacing/css/bulma-spacing.min.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: { name: "albert" },
    };
  }
  /* TOKENS
  EVIUS: 10AM Domingo 26 
  eyJhbGciOiJSUzI1NiIsImtpZCI6IjVlOWVlOTdjODQwZjk3ZTAyNTM2ODhhM2I3ZTk0NDczZTUyOGE3YjUiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiZXZpdXMgY28iLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZXZpdXNhdXRoIiwiYXVkIjoiZXZpdXNhdXRoIiwiYXV0aF90aW1lIjoxNTg3OTE0MjAxLCJ1c2VyX2lkIjoiNU14bXdEUlZ5MWRVTEczb1NraWdFMXNoaTd6MSIsInN1YiI6IjVNeG13RFJWeTFkVUxHM29Ta2lnRTFzaGk3ejEiLCJpYXQiOjE1ODc5MTQyMDEsImV4cCI6MTU4NzkxNzgwMSwiZW1haWwiOiJldml1c0Bldml1cy5jbyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJldml1c0Bldml1cy5jbyJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.SpgxWQeZkzXCtI3JoHuVpSU_FxhC7bhLkMpe9foQAY10KkRGEvgLp0A2Wiah7B0QKPsgMv02apTsPgl6I9Y7drV4YTq_6JaCTTjJNAJII3ani1E9lgXyXbYww60SFzuO1HDFh3BL8qLtIm07KK8tncGloHfYBoI5PxFo9OIwS5672GWaAZHwQ_5MA4gBkRxl4I4IF-T5yOr8qqEOM4T7u1kdBlWtI1xx-YOgzDu-4usAd9b8tyk0yKYNfPqP3cCClXV9WoG51hWLzdjgjUPkdhoLXXa0-U2HqmjG_WtQTQkjtrQyFHV5q7piOemqNRGJbPNMUp3P1QYL-YQax7TYWg

  */

  componentDidMount() {
    let dataUrl = parseUrl(document.URL);
    if (dataUrl && dataUrl.token) {
      if (dataUrl.token) {
        Cookie.set("evius_token", dataUrl.token);
        privateInstance.defaults.params = {};
        privateInstance.defaults.params["evius_token"] = dataUrl.token;
      }
      if (dataUrl.refresh_token) {
        Actions.put("/api/me/storeRefreshToken", { refresh_token: dataUrl.refresh_token }).then((resp) => {
          console.log(resp);
        });
      }
    }
  }

  /*

  async componentDidMount() {
    return;
    let dataUrl = parseUrl(document.URL);
    let evius_token = null;

    //Si viene en la url fantastico | significa que el usuario se acaba de loguear
    if (dataUrl && dataUrl.token) {
      Cookie.set("evius_token", dataUrl.token);
      evius_token = dataUrl.token;

      //No se que es esto
      privateInstance.defaults.params = {};
      privateInstance.defaults.params["evius_token"] = dataUrl.token;
    }

    //Luego revisamos las cookies haber si esta el token
    if (!evius_token) {
      evius_token = Cookie.set("evius_token", Cookie.get("evius_token"));
    }

    if (!evius_token) {
      return;
    }

    try {
      const resp = await API.get(`/auth/currentUser?evius_token=${evius_token}`);
      //para que no se rompa
      if (!resp.data) return;
      const user = resp.data;
      //El usser de firebase viene con photoUrl y displayName
      //esto se hizo por compabilidad el algunos lados se esta usando user.name
      user.name = user.name ? user.name : user.displayName ? user.displayName : user.email;
      user.photo = user.photoUrl ? user.photoUrl : user.picture;
      //const organizations = await OrganizationApi.mine();

      this.setState({ user: user });
      console.log("user", user);
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

    //const resp = await API.get(`/auth/currentUser?evius_token=${evius_token}`);

    //Esto no tiene mucho sentido
    if (dataUrl && dataUrl.refresh_token) {
      Actions.put("/api/me/storeRefreshToken", { refresh_token: dataUrl.refresh_token }).then((resp) => {
        console.log(resp);
      });
    }
  }
*/
  render() {
    return (
      <userContext.Provider value={this.state.user}>
        <Provider store={store}>
          <MainRouter />
        </Provider>
      </userContext.Provider>
    );
  }
}

export default App;

/*      const resp = await API.get(`/auth/currentUser?evius_token=${evius_token}`);
      console.log("respuesta del server", resp);

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
*/
