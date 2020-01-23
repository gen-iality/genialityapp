import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NewsFeed, Actions } from "../../helpers/request";
import Loading from "../loaders/loading";
import Moment from "moment";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import TableAction from "../events/shared/tableAction";
import { handleRequestError, sweetAlert } from "../../helpers/utils";
import axios from "axios/index";
import ImageInput from "../shared/imageInput";
import { toast } from 'react-toastify';
import { FormattedMessage } from "react-intl";

class Espacios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            list: [],
            data: {},
            id: '',
            deleteID: '',
            name: '',
            description: '',
            news: '',
            isLoading: false,
            loading: true
        };
    }

    componentDidMount() {
        this.fetchItem();
    }

    changeImg = (files) => {
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
    };

    fetchItem = async () => {
        const data = await NewsFeed.byEvent(this.props.eventId);
        this.setState({ list: data, loading: false })
    };

    onChange = (e) => {
        const names = document.getElementById("name").value;
        const desc = document.getElementById("desc").value;
        const notice = document.getElementById("news").value;

        this.setState({ name: names, description: desc, news: notice })
    };

    newRole = () => {
        if (!this.state.list.find(({ _id }) => _id === "new")) {
            this.setState(state => {
                const list = state.list.concat({ name: '', description: '', news: '', pricture: '', created_at: new Date(), _id: 'new' });
                return { list, id: 'new' };
            });
        }
    };

    removeNewRole = () => {
        this.setState(state => {
            const list = state.list.filter(item => item._id !== "new");
            return { list, id: "", name: "", description: "", news: "", picture: "" };
        });
    };

    saveRole = async () => {
        try {
            if (this.state.id !== 'new') {
                await NewsFeed.editOne({ name: this.state.name, description: this.state.description, news: this.state.news, picture: this.state.path }, this.state.id, this.props.eventId);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.name = state.name;
                            item.description = state.description;
                            item.news = state.news;
                            item.picture = state.path;
                            toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                            return item;
                        } else return item;
                    });
                    return { list, id: "", name: "", description: "", news: "" };
                });
            } else {
                const newRole = await NewsFeed.create({ name: this.state.name, description: this.state.description, news: this.state.news, picture: this.state.path }, this.props.eventId);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.name = newRole.name;
                            item.description = newRole.description;
                            item.news = newRole.news;
                            item.picture = newRole.path;
                            item.created_at = newRole.created_at;
                            item._id = newRole._id;
                            toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                            return item;
                        } else return item;
                    });
                    return { list, id: "", name: "", description: "", news: "" };
                });
            }
        } catch (e) {
            console.log(e);
        }
    };

    editItem = (cert) => this.setState({ id: cert._id, name: cert.name, description: cert.description, news: cert.news, picture: cert.picture });

    removeItem = (id) => {
        sweetAlert.twoButton(`Está seguro de borrar este espacio`, "warning", true, "Borrar", async (result) => {
            try {
                if (result.value) {
                    sweetAlert.showLoading("Espera (:", "Borrando...");
                    await NewsFeed.deleteOne(id, this.props.eventId);
                    this.setState(state => ({ id: "", name: "", description: "", news: "", picture: "" }));
                    this.fetchItem();
                    sweetAlert.hideLoading();
                }
            } catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        });
    }



    goBack = () => this.props.history.goBack();

    render() {
        const { event } = this.state;
        return (
            <React.Fragment>
                <EventContent title="Espacios" closeAction={this.goBack} description={"Agregue o edite las personas que son conferencistas"} addAction={this.newRole} addTitle={"Nuevo espacio"}>
                    <div className="column is-11">
                        {this.state.loading ? <Loading /> :
                            <EvenTable head={["Nombre", "Descripción", "Noticia", "Imagen", "", ""]}>
                                {this.state.list.map((cert, key) => {
                                    return <tr key={key}>
                                        <td>
                                            {
                                                this.state.id === cert._id ?
                                                    <input type="text" id="name" value={this.state.name} onChange={this.onChange} /> :
                                                    <p>{cert.name}</p>
                                            }
                                        </td>

                                        <td>
                                            {
                                                this.state.id === cert._id ?
                                                    <input type="text" id="desc" value={this.state.description} onChange={this.onChange} /> :
                                                    <p>{cert.description}</p>
                                            }

                                        </td>
                                        <td>
                                            {
                                                this.state.id === cert._id ?
                                                    <input type="text" id="news" value={this.state.news} onChange={this.onChange} /> :
                                                    <p>{cert.news}</p>
                                            }
                                        </td>

                                        <td>
                                            <td>
                                                {
                                                    this.state.id === cert._id ?
                                                        <div className="control">
                                                            <div className="column is-5">
                                                                <ImageInput picture={this.state.picture} imageFile={this.state.imageFile}
                                                                    divClass={'drop-img'} content={<img src={this.state.picture} alt={'Imagen Perfil'} />}
                                                                    classDrop={'dropzone'} contentDrop={<button onClick={(e) => { e.preventDefault() }} className={`button is-primary is-inverted is-outlined ${this.state.imageFile ? 'is-loading' : ''}`}>Cambiar foto</button>}
                                                                    contentZone={<div className="has-text-grey has-text-weight-bold has-text-centered"><span>Subir foto</span><br /><small>(Tamaño recomendado: 1280px x 960px)</small></div>}
                                                                    changeImg={this.changeImg} errImg={this.state.errImg}
                                                                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: "50%", width: '40%', borderWidth: 2, borderColor: '#b5b5b5', borderStyle: 'dashed', borderRadius: 10 }} />
                                                                {this.state.fileMsg && (<p className="help is-success">{this.state.fileMsg}</p>)}
                                                            </div>
                                                        </div> :

                                                        <p className="column is-5">{cert.picture}</p>
                                                }
                                            </td>

                                        </td>
                                        <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                        <TableAction id={this.state.id} object={cert} saveItem={this.saveRole} editItem={this.editItem}
                                            removeNew={this.removeNewRole} removeItem={this.removeItem} discardChanges={this.discardChanges} />
                                    </tr>
                                })}
                            </EvenTable>
                        }
                    </div>
                </EventContent>
            </React.Fragment>
        )
    }
}

export default withRouter(Espacios)
