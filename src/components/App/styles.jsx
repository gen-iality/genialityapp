import React, { Component } from "react";
import ImageInput from "../shared/imageInput";
import axios from "axios/index";
import { toast } from "react-toastify";
import { Actions } from "../../helpers/request";
import { FormattedMessage } from "react-intl";
import { EventsApi } from "../../helpers/request";
import { Link } from "react-router-dom";
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import { app } from "../../helpers/firebase";
import ImageUploader from "react-images-upload";
import * as Cookie from "js-cookie";
import privateInstance from "../../helpers/request";
import { parseUrl } from "../../helpers/constants";
import { BaseUrl } from "../../helpers/constants";
import { SketchPicker } from "react-color";

class Styles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventId: this.props.eventId,
      loading: true,
      styles: {},
      isLoading: false,
      editIsVisible: false,
    };
    //Se establecen las funciones para su posterior uso
    this.saveEventImage = this.saveEventImage.bind(this);
    // this.saveMenuImage = this.saveMenuImage.bind(this)
    // this.saveBannerImage = this.saveBannerImage.bind(this)
    // this.saveBackgroundImage = this.saveBackgroundImage.bind(this)
    // this.saveFooterImage = this.saveFooterImage.bind(this)
    this.submit = this.submit.bind(this);
  }
  //Se consulta la api para traer los datos ya guardados y enviarlos al state
  async componentDidMount() {
    const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
    info.styles = info.styles ? info.styles : {};

    if (info.styles) {
      this.setState({
        styles: {
          brandPrimary: info.styles.brandPrimary || "#FFF",
          brandSuccess: info.styles.brandSuccess || "#FFF",
          brandInfo: info.styles.brandInfo || "#FFF",
          brandDanger: info.styles.brandDanger || "#FFF",
          containerBgColor: info.styles.containerBgColor || "#FFF",
          brandWarning: info.styles.brandWarning || "#FFF",
          toolbarDefaultBg: info.styles.toolbarDefaultBg || "#FFF",
          brandDark: info.styles.brandDark || "#FFF",
          brandLight: info.styles.brandLight || "#FFF",
          textMenu: info.styles.textMenu || "#FFF",
          activeText: info.styles.activeText || "#FFF",
          event_image: info.styles.event_image || null,
          banner_image: info.styles.banner_image || null,
          menu_image: info.styles.menu_image || null,
          BackgroundImage: info.styles.BackgroundImage || null,
          FooterImage: info.styles.FooterImage || null,
        },
      });
    }
  }

  //funciones para cargar imagenes y enviar un popup para avisar al usuario que la imagen ya cargo o cambiar la imagen
  saveEventImage(files, imageFieldName) {
    console.log(files);
    const file = files[0];
    let imageUrl = null;
    const url = "/api/files/upload",
      self = this;
    if (file) {
      this.setState({
        imageFile: file,
        event: { ...this.state.event, picture: null },
      });

      //envia el archivo de imagen como POST al API
      const uploaders = files.map((file) => {
        let data = new FormData();
        data.append("file", file);
        return Actions.post(url, data).then((image) => {
          console.log(image);
          if (image) imageUrl = image;
        });
      });
      this.setState({ isLoading: true });

      //cuando todaslas promesas de envio de imagenes al servidor se completan
      axios.all(uploaders).then((data) => {
        let temp = { ...this.state.styles };
        temp[imageFieldName] = imageUrl;
        this.setState({ styles: temp, isLoading: false });

        console.log("SUCCESSFULL DONE");
        self.setState({
          fileMsg: "Imagen subida con exito",
        });

        toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
      });
    } else {
      this.setState({ errImg: "Solo se permiten imágenes. Intentalo de nuevo" });
    }
  }

  // banner_image  BackgroundImage  FooterImage event_image

  //Se realiza una funcion asincrona submit para enviar los datos a la api
  async submit(e) {
    e.preventDefault();
    e.stopPropagation();

    const { eventId } = this.state;

    const self = this;
    this.state.data = { styles: this.state.styles };
    try {
      const info = await Actions.put(`/api/events/${eventId}`, this.state.data);
      console.log(this.state.data);
      this.setState({ loading: false });
      if (info._id) {
        toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />);
      } else {
        toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
        this.setState({ msg: "Cant Create", create: false });
      }
    } catch (error) {
      toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
      if (error.response) {
        console.log(this.state.data);
        console.log(error.response);
        const { status, data } = error.response;
        console.log("STATUS", status, status === 401);
        if (status === 401) this.setState({ timeout: true, loader: false });
        else this.setState({ serverError: true, loader: false, errorData: data });
      } else {
        let errorData = error.message;
        console.log("Error", error.message);
        console.log(this.state.styles);
        if (error.request) {
          console.log(error.request);
          errorData = error.request;
        }

        this.setState({ serverError: true, loader: false, errorData });
      }
      console.log(error.config);
    }
  }

  onColorChange = function(color, fieldName) {
    let temp = { ...this.state.styles };
    temp[fieldName] = color.hex;
    this.setState({ styles: temp });
  };

  handleClick = () => {
    this.setState({ editIsVisible: !this.state.editIsVisible });
  };

  render() {
    const { timeout } = this.state;

    //Se realizan estas constantes para optimizar mas el codigo,de esta manera se mapea en el markup para utilizarlo posteriormente
    const colorDrawer = [
      {
        title: "Elige El fondo de tu app",
        fieldColorName: "containerBgColor",
        editIsVisible: this.state.editIsVisible,
      },
      {
        title: "Elige un color para los botones",
        fieldColorName: "brandPrimary",
        editIsVisible: this.state.editIsVisible,
      },
      {
        title: "Elige un color para el menu",
        fieldColorName: "toolbarDefaultBg",
        editIsVisible: this.state.editIsVisible,
      },
      {
        title: "Elige un color para el texto del menu",
        fieldColorName: "textMenu",
        editIsVisible: this.state.editIsVisible,
      },
      {
        title: "Elige un color para item seleccionado del menu",
        fieldColorName: "activeText",
        editIsVisible: this.state.editIsVisible,
      },
    ];
    const imageDrawer = [
      { title: "Elige una imagen de logo", imageFieldName: "event_image" },
      { title: "Elige una imagen de encabezado de menu", imageFieldName: "menu_image" },
      { title: "Elige una imagen de fondo", imageFieldName: "BackgroundImage" },
      { title: "Elige una imagen para el boton de la seccion especial(opcional)", imageFieldName: "FooterImage" },
      { title: "Elige una imagen para el banner", imageFieldName: "banner_image" },
    ];

    return (
      <React.Fragment>
        <div className="columns general">
          <div className="column is-12">
            <h2 className="title-section">Configuracion de Estilos</h2>
            {colorDrawer.map((item, key) => (
              <div className="column inner-column" key={key}>
                {item.editIsVisible && (
                  <SketchPicker
                    color={this.state.styles[item.fieldColorName]}
                    onChangeComplete={(color) => {
                      this.onColorChange(color, item.fieldColorName);
                    }}
                  />
                )}
                <div>
                  <label className="label has-text-grey-light">{item.title}</label>
                  <input
                    type="color"
                    disabled
                    style={{ marginRight: "3%", width: "5%" }}
                    value={this.state.styles[item.fieldColorName]}
                  />
                  <button className="button" onClick={this.handleClick}>
                    {" "}
                    {this.state.editIsVisible ? "Desactivar" : "Activar"}
                  </button>
                </div>
              </div>
            ))}
            {imageDrawer.map((item, key) => (
              <div className="column inner-column" key={key}>
                <label className="label has-text-grey-light">{item.title}</label>
                <div className="control">
                  <ImageInput
                    picture={this.state.styles[item.imageFieldName]}
                    changeImg={(files) => {
                      this.saveEventImage(files, item.imageFieldName);
                    }}
                    errImg={this.state.errImg}
                    isLoading={this.state.isLoading}
                  />
                </div>
                {this.state.fileMsg && <p className="help is-success">{this.state.fileMsg}</p>}
              </div>
            ))}
            <button className="button is-primary" onClick={this.submit}>
              Guardar
            </button>
          </div>
        </div>
        {timeout && <LogOut />}
      </React.Fragment>
    );
  }
}

export default Styles;
