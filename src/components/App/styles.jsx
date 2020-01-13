import React, { Component } from 'react';
import ImageInput from "../shared/imageInput";
import axios from "axios/index";
import { toast } from 'react-toastify';
import { Actions } from "../../helpers/request";
import { FormattedMessage } from "react-intl";
import { EventsApi } from "../../helpers/request";
import { Link } from "react-router-dom";
import LoadingEvent from "../loaders/loadevent";
import EventCard from "../shared/eventCard";
import LogOut from "../shared/logOut";
import { app } from '../../helpers/firebase';
import ImageUploader from 'react-images-upload';
import * as Cookie from "js-cookie";
import privateInstance from "../../helpers/request";
import { parseUrl } from "../../helpers/constants";
import { BaseUrl } from "../../helpers/constants";

class Styles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventId: this.props.event,
            loading: true,
            styles: {},
            dates: {},
        };
            //Se establecen las funciones para su posterior uso
        this.saveEventImage = this.saveEventImage.bind(this)
        this.saveMenuImage = this.saveMenuImage.bind(this)
        this.saveBannerImage = this.saveBannerImage.bind(this)
        this.saveBackgroundImage = this.saveBackgroundImage.bind(this)
        this.submit = this.submit.bind(this)

    }
        //Se consulta la api para traer los datos ya guardados y enviarlos al state
    async componentDidMount() {
        const info = await Actions.getAll(`/api/events/${this.props.eventId}`);
        this.setState({
            dates: {
                brandPrimary: info.styles.brandPrimary,
                brandSuccess: info.styles.brandSuccess,
                brandInfo: info.styles.brandInfo,
                brandDanger: info.styles.brandDanger,
                containerBgColor: info.styles.containerBgColor,
                brandWarning: info.styles.brandWarning,
                toolbarDefaultBg: info.styles.toolbarDefaultBg,
                brandDark: info.styles.brandDark,
                brandLight: info.styles.brandLight,
                event_image: info.styles.event_image,
                banner_image: info.styles.banner_image,
                menu_image: info.styles.menu_image
            }
        })

        this.setState({
            path: info.styles.event_image
        })

        this.setState({
            pathBannerImage: info.styles.banner_image,
        })

        this.setState({
            pathImage: info.styles.menu_image
        })

        this.setState({
            pathBackgroundImage: info.styles.BackgroundImage
        })

        this.setState({
            styles: {
                brandPrimary: info.styles.brandPrimary,
                brandSuccess: info.styles.brandSuccess,
                brandInfo: info.styles.brandInfo,
                containerBgColor: info.styles.containerBgColor,
                brandDanger: info.styles.brandDanger,
                brandWarning: info.styles.brandWarning,
                brandDark: info.styles.brandDark,
                brandLight: info.styles.brandLight,
                toolbarDefaultBg: info.styles.toolbarDefaultBg,
                event_image: info.styles.event_image,
                banner_image: info.styles.banner_image,
                menu_image: info.styles.menu_image,
                BackgroundImage: info.styles.BackgroundImage
            }
        })

    }
        //Se envia la peitcion a la api para reconocer el token 
    componentWillMount() {
        let dataUrl = parseUrl(document.URL);
        if (dataUrl && dataUrl.token) {
            console.log(dataUrl);
            if (dataUrl.token) {
                Cookie.set("evius_token", dataUrl.token);
                privateInstance.defaults.params = {};
                privateInstance.defaults.params['evius_token'] = dataUrl.token;
            }
            if (dataUrl.refresh_token) {
                Actions.put('/api/me/storeRefreshToken', { refresh_token: dataUrl.refresh_token })
                    .then(resp => {
                        console.log(resp);
                    })
            }
        }
    }
        //funciones para cargar imagenes y enviar un popup para avisar al usuario que la imagen ya cargo o cambiar la imagen
    saveEventImage(files) {
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', path = [], self = this;
        if (file) {
            this.setState({
                imageFile: file,
                event: { ...this.state.event, picture: null }
            });

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file', file);
                return Actions.post(url, data).then((image) => {
                    console.log(image);
                    if (image) path.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(path);
                this.setState({ styles: { ...this.state.styles, event_image: path[0] } })
                console.log('SUCCESSFULL DONE');
                self.setState({
                    event: {
                        ...self.state.event,
                        picture: path[0]
                    }, fileMsg: 'Imagen subida con exito', imageFile: null, path
                });

                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
            });
        }
        else {
            this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
        }
    }

    saveBannerImage(files) {
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', pathBannerImage = [], self = this;
        if (file) {
            this.setState({
                imageFileFooter: file,
                event: { ...this.state.event, picture: null }
            });

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file', file);
                return Actions.post(url, data).then((image) => {
                    if (image) pathBannerImage.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(pathBannerImage);
                this.setState({ styles: { ...this.state.styles, banner_image: pathBannerImage[0] } })
                console.log('SUCCESSFULL DONE');
                self.setState({
                    event: {
                        ...self.state.event,
                        picture: pathBannerImage[0]
                    }, fileMsgFooter: 'Imagen subida con exito', imageFileFooter: null, pathBannerImage
                });

                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
            });
        }
        else {
            this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
        }
    }

    saveMenuImage(files) {
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', pathImage = [], self = this;
        if (file) {
            this.setState({
                imageFileImage: file,
                event: { ...this.state.event, picture: null }
            });

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file', file);
                return Actions.post(url, data).then((image) => {
                    console.log(image);
                    if (image) pathImage.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(pathImage);
                this.setState({ styles: { ...this.state.styles, menu_image: pathImage[0] } })
                console.log('SUCCESSFULL DONE');
                self.setState({
                    event: {
                        ...self.state.event,
                        picture: pathImage[0]
                    }, fileMsgLogo: 'Imagen subida con exito', imageFileImage: null, pathImage
                });

                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
            });
        }
        else {
            this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
        }
    }

    saveBackgroundImage(files) {
        console.log(files);
        const file = files[0];
        const url = '/api/files/upload', pathBackgroundImage = [], self = this;
        if (file) {
            this.setState({
                imageBackgroundImage: file,
                event: { ...this.state.event, picture: null }
            });

            //envia el archivo de imagen como POST al API    
            const uploaders = files.map(file => {
                let data = new FormData();
                data.append('file', file);
                return Actions.post(url, data).then((image) => {
                    console.log(image);
                    if (image) pathBackgroundImage.push(image);
                });
            });

            //cuando todaslas promesas de envio de imagenes al servidor se completan
            axios.all(uploaders).then((data) => {
                console.log(pathBackgroundImage);
                this.setState({ styles: { ...this.state.styles, BackgroundImage: pathBackgroundImage[0] } })
                console.log('SUCCESSFULL DONE');
                self.setState({
                    event: {
                        ...self.state.event,
                        picture: pathBackgroundImage[0]
                    }, fileMsgBackground: 'Imagen subida con exito', BackgroundImage: null, pathBackgroundImage
                });

                toast.success(<FormattedMessage id="toast.img" defaultMessage="Ok!" />);
            });
        }
        else {
            this.setState({ errImg: 'Solo se permiten imágenes. Intentalo de nuevo' });
        }
    }
        //Se realiza una funcion asincrona submit para enviar los datos a la api 
    async submit(e) {
        e.preventDefault();
        e.stopPropagation();

        const { eventId } = this.state;

        const self = this;
        // this.state.data.push(this.state.styles);
        this.state.data = { styles: this.state.styles };
        try {
            if (eventId) {
                const info = await Actions.put(`/api.evius.co/api/events/${this.props.eventId}`, this.state.data);
                this.props.updateEvent(info);
                console.log(this.state.data)
                this.setState({ loading: false });
                toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
            }
            else {
                console.log(this.state)
                const result = await Actions.put(`/api/events/${this.props.eventId}`, this.state.data);
                this.setState({ loading: false });
                if (result._id) {
                    window.location.replace(`${BaseUrl}/event/${this.props.eventId}/styles`);
                    toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                } else {
                    toast.warn(<FormattedMessage id="toast.warning" defaultMessage="Idk" />);
                    this.setState({ msg: 'Cant Create', create: false })
                }
            }
        }
        catch (error) {
            toast.error(<FormattedMessage id="toast.error" defaultMessage="Sry :(" />);
            if (error.response) {
                console.log(this.state.data)
                console.log(error.response);
                const { status, data } = error.response;
                console.log('STATUS', status, status === 401);
                if (status === 401) this.setState({ timeout: true, loader: false });
                else this.setState({ serverError: true, loader: false, errorData: data })
            } else {
                let errorData = error.message;
                console.log('Error', error.message);
                console.log(this.state.styles)
                if (error.request) {
                    console.log(error.request);
                    errorData = error.request
                };

                this.setState({ serverError: true, loader: false, errorData })
            }
            console.log(error.config);
        }
    }

    render() {
        const { timeout } = this.state;

        //Se realizan estas constantes para optimizar mas el codigo,de esta manera se mapea en el markup para utilizarlo posteriormente 
        const colorDrawer = [
            { name: 'ColorBtn', title: 'Elige un color para los botones', key: 1, value: this.state.dates.brandPrimary, change: (save) => { this.setState({ styles: { ...this.state.styles, brandPrimary: save.target.value } }) } },
            { name: 'ColorBackground', title: 'El fondo de tu app', key: 2, value: this.state.dates.containerBgColor, change: (save) => { this.setState({ styles: { ...this.state.styles, containerBgColor: save.target.value } }) } },
            { name: 'ColorMenu', title: 'Elige un color para el menu', key: 3, value: this.state.dates.toolbarDefaultBg, change: (save) => { this.setState({ styles: { ...this.state.styles, toolbarDefaultBg: save.target.value } }) } },
        ]
        const imageDrawer = [
            { name: 'EventImage', title: 'Elige una imagen de logo', key: 4, picture: this.state.path, imageFile: this.state.event_image, function: this.saveEventImage },
            { name: 'MenuImage', title: 'Elige una imagen de encabezado de menu', key: 5, picture: this.state.pathImage, imageFile: this.state.imageFileImage, function: this.saveMenuImage },
            { name: 'BannerImage', title: 'Elige una imagen para tu banner', key: 6, picture: this.state.pathBannerImage, imageFile: this.state.imageFileFooter, function: this.saveBannerImage },
            { name: 'BackgroundImage', title: 'Elige una imagen de fondo', key: 7, picture: this.state.pathBackgroundImage, imageFile: this.state.BackgroundImage, function: this.saveBackgroundImage },
        ]

        return (
            <React.Fragment>
                <div className="columns general">
                    <div className="column is-12">
                        <h2 className="title-section">Configuracion de Estilos</h2>
                        {
                            colorDrawer.map((item, key) => (
                                <div className="column inner-column" key={key}>
                                    <label className="label has-text-grey-light">{item.title}</label>
                                    <input type="color" disabled style={{ marginRight: "3%", borderRadius: "100%", width: "2.2%" }} value={item.value} />
                                    <input type="color" name="colorBtn" onChange={item.change} />
                                </div>
                            ))
                        }
                        {
                            imageDrawer.map((item, key) => (
                                <div className="column inner-column" key={key}>
                                    <label className="label has-text-grey-light">{item.title}</label>
                                    <div className="control">
                                        <ImageInput picture={item.picture} imageFile={item.imageFile}
                                            divClass={'drop-img'} content={<img src={item.picture} alt={'Imagen Perfil'} />}
                                            classDrop={'dropzone'} contentDrop={<button onClick={(e) => { e.preventDefault() }} className={`button is-primary is-inverted is-outlined ${item.imageFile ? 'is-loading' : ''}`}>Cambiar foto</button>}
                                            contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br /><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                            changeImg={item.function} errImg={this.state.errImg}
                                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: 250, width: '100%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10 }} />
                                    </div>
                                    {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                                </div>
                            ))
                        }
                        <button className="button is-primary" onClick={this.submit}>Guardar</button>
                    </div>
                </div>
                {timeout && (<LogOut />)}
            </React.Fragment>
        );
    }
}
export default Styles