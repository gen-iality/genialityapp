import React, { Component } from "react";
import ImageInput from "../shared/imageInput";
import axios from "axios/index";
import { toast } from "react-toastify";
import { Actions } from "../../helpers/request";
import { FormattedMessage } from "react-intl";
import LogOut from "../shared/logOut";
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
      //Se realizan estas constantes para optimizar mas el codigo,de esta manera se mapea en el markup para utilizarlo posteriormente
      colorDrawer: [
        {
          title: "Elige aquí el color de fondo que deseas para la pagina.",
          fieldColorName: "containerBgColor",
          editIsVisible: false,
        },
        {
          title: "Elige aquí el color de fondo que deseas para el menu.",
          fieldColorName: "toolbarDefaultBg",
          editIsVisible: false,
        },

        // Se comentan porque no se necesitan por el momento.

        // {
        //   title: "Elige un color para los botones",
        //   fieldColorName: "brandPrimary",
        //   editIsVisible: false,
        // },
        // {
        //   title: "Elige un color para el texto del menu",
        //   fieldColorName: "textMenu",
        //   editIsVisible: false,
        // },
        // {
        //   title: "Elige un color para item seleccionado del menu",
        //   fieldColorName: "activeText",
        //   editIsVisible: false,
        // },
      ],
    };
    //Se establecen las funciones para su posterior uso
    this.saveEventImage = this.saveEventImage.bind(this);
    this.submit = this.submit.bind(this);

    this.imageDrawer = [

      // Se comenta porque no se necesitan por el momento.
      // { title: "Elige una imagen de logo", imageFieldName: "event_image" },
      {
        title: "Elige el logo que deseas para el menu de la pagina.",
        imageFieldName: "menu_image"
      },
      {
        title: "Elige la imagen que deseas mostrar en el banner de la pagina.",
        imageFieldName: "banner_image"
      },
      {
        title: "Elige la imagen de fondo que deseas para la pagina. (Fondo opcional)",
        imageFieldName: "BackgroundImage"
      },
      {
        title: "Si deseas agregar un boton extra al final del menu, elige aquí una imagen. (Boton opcional)",
        imageFieldName: "FooterImage",
      },

    ];
  }
  //Se consulta la api para traer los datos ya guardados y enviarlos al state
  async componentDidMount() {
    const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
    info.styles = info.styles ? info.styles : {};

    if (info.styles) {
      this.setState({
        styles: {
          brandPrimary: info.styles.brandPrimary || "#FFFFFF",
          brandSuccess: info.styles.brandSuccess || "#FFFFFF",
          brandInfo: info.styles.brandInfo || "#FFFFFF",
          brandDanger: info.styles.brandDanger || "#FFFFFF",
          containerBgColor: info.styles.containerBgColor || "#FFFFFF",
          brandWarning: info.styles.brandWarning || "#FFFFFF",
          toolbarDefaultBg: info.styles.toolbarDefaultBg || "#FFFFFF",
          brandDark: info.styles.brandDark || "#FFFFFF",
          brandLight: info.styles.brandLight || "#FFFFFF",
          textMenu: info.styles.textMenu || "#FFFFFF",
          activeText: info.styles.activeText || "#FFFFFF",
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

  onColorChange = function (color, fieldName) {
    let temp = { ...this.state.styles };
    temp[fieldName] = color.hex;
    this.setState({ styles: temp });
  };

  handleClickSelectColor = (key) => {
    //react recomiendo copiar las cosas antes de modificarlas
    //Copiamos el array ColorDrawer a uno nuevo usando el spread operator (...)
    let newColorDrawer = [...this.state.colorDrawer];
    //invertimos el valor de editIsVisible del elemento clikeado indicado por key
    newColorDrawer[key].editIsVisible = !newColorDrawer[key].editIsVisible;
    //Actualizamos el estado
    this.setState({ colorDrawer: newColorDrawer });
  };

  render() {
    const { timeout } = this.state;

    return (
      <React.Fragment>
        <div className="columns general">
          <div className="column is-12">
            <h2 className="title-section">Configuración de Estilos</h2>
            {this.state.colorDrawer.map((item, key) => (
              <div className="column inner-column" key={key}>
                {item.editIsVisible && (
                  <SketchPicker
                    color={this.state.styles[item.fieldColorName]}
                    onChangeComplete={(color) => {
                      this.onColorChange(color, item.fieldColorName);
                    }}
                  />
                )}
                <div onClick={() => this.handleClickSelectColor(key)}>
                  <label className="label has-text-grey-light">{item.title}</label>
                  <input
                    type="color"
                    disabled
                    style={{ marginRight: "3%", width: "5%" }}
                    value={this.state.styles[item.fieldColorName]}
                    onChange={() => { }}
                  />
                  <button className="button"> {item.editIsVisible ? "Seleccionar" : "Escoger"}</button>
                </div>
              </div>
            ))}
            {this.imageDrawer.map((item, key) => (
              <div className="column inner-column" key={key}>
                <label className="label has-text-grey-light">{item.title}</label>
                <div className="control">
                  <ImageInput
                    picture={this.state.styles[item.imageFieldName]}
                    changeImg={(files) => {
                      this.saveEventImage(files, item.imageFieldName);
                    }}
                    errImg={this.state.errImg}
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
