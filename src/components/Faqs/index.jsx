import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { FaqsApi, Actions } from "../../helpers/request";
import Loading from "../loaders/loading";
import Moment from "moment";
import ReactQuill from "react-quill";
import {toolbarEditor } from "../../helpers/constants";
import EventContent from "../events/shared/content";
import EvenTable from "../events/shared/table";
import TableAction from "../events/shared/tableAction";
import { handleRequestError, sweetAlert } from "../../helpers/utils";
import axios from "axios/index";
import ImageInput from "../shared/imageInput";
import { toast } from 'react-toastify';
import { FormattedMessage } from "react-intl";

class FAQS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event: this.props.event,
            list: [],
            data: {},
            id: '',
            deleteID: '',
            title: '',
            content: '',
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
        const data = await FaqsApi.byEvent(this.props.eventId);
        this.setState({ list: data, loading: false })
        console.log(data)
    };

    onChange = (e) => {
        const titles = document.getElementById("title").value;
        const desc = document.getElementById("desc").value;

        this.setState({ title: titles, content: desc })
    };

    newRole = () => {
        if (!this.state.list.find(({ _id }) => _id === "new")) {
            this.setState(state => {
                const list = state.list.concat({ title: '', content: '', _id: 'new' });
                return { list, id: 'new' };
            });
        }
    };

    removeNewRole = () => {
        this.setState(state => {
            const list = state.list.filter(item => item._id !== "new");
            return { list, id: "", title: "", content: "" };
        });
    };

    saveRole = async () => {
        try {
            if (this.state.id !== 'new') {
                await FaqsApi.editOne({ title: this.state.title, content: this.state.content }, this.state.id, this.props.eventId);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.title = state.title;
                            item.content = state.content;
                            toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                            return item;
                        } else return item;
                    });
                    return { list, id: "", title: "", content: "" };
                });
            } else {
                const newRole = await FaqsApi.create({ title: this.state.title, content: this.state.content }, this.props.eventId);
                this.setState(state => {
                    const list = state.list.map(item => {
                        if (item._id === state.id) {
                            item.title = newRole.title;
                            item.content = newRole.content;
                            item.created_at = newRole.created_at;
                            item._id = newRole._id;
                            toast.success(<FormattedMessage id="toast.success" defaultMessage="Ok!" />)
                            return item;
                        } else return item;
                    });
                    return { list, id: "", title: "", content: "" };
                });
            }
        } catch (e) {
            console.log(e);

        }
    };

    editItem = (cert) => this.setState({ id: cert._id, title: cert.title, content: cert.content });

    removeItem = (id) => {
        sweetAlert.twoButton(`Está seguro de borrar este espacio`, "warning", true, "Borrar", async (result) => {
            try {
                if (result.value) {
                    sweetAlert.showLoading("Espera (:", "Borrando...");
                    await FaqsApi.deleteOne(id, this.props.eventId);
                    this.setState(state => ({ id: "", title: "", content: "" }));
                    this.fetchItem();
                    sweetAlert.hideLoading();
                }
            } catch (e) {
                sweetAlert.showError(handleRequestError(e))
            }
        });
    }
    chgTxt = content => this.setState({ event: { ...this.state.event, content: content } });

    goBack = () => this.props.history.goBack();

    render() {
        const { event } = this.state;
        return (
            <React.Fragment>
                <div className="column is-12">
                    <EventContent title="Preguntas Frecuentes" closeAction={this.goBack} description_complete={"Agregue o edite las Preguntas Frecuentes que se muestran en la aplicación"} addAction={this.newRole} addTitle={"Nuevo espacio"}>
                        {this.state.loading ? <Loading /> :
                            <EvenTable head={["Titulo", "Contenido", ""]}>
                                {this.state.list.map((cert, key) => {
                                    return <tr key={key}>
                                        <td>
                                            {
                                                this.state.id === cert._id ?
                                                    <input type="text" id="title" value={this.state.title} onChange={this.onChange} /> :
                                                    <p>{cert.title}</p>
                                            }
                                        </td>

                                        <td>
                                            {
                                                this.state.id === cert._id ?
                                                    // <textarea id="desc" value={this.state.content} onChange={this.onChange} /> :
                                                    // <div className="control">
                                                    //     <ReactQuill id="desc" value={cert.content} modules={toolbarEditor} onChange={this.chgTxt} />
                                                    // </div>:
                                                    <ReactQuill id="desc" value={cert.content} onChange={this.onChange} />:
                                                    <p>{cert.content}</p>
                                            }

                                        </td>

                                        <td>{Moment(cert.created_at).format("DD/MM/YYYY")}</td>
                                        <TableAction id={this.state.id} object={cert} saveItem={this.saveRole} editItem={this.editItem}
                                            removeNew={this.removeNewRole} removeItem={this.removeItem} discardChanges={this.discardChanges} />
                                    </tr>
                                })}
                            </EvenTable>
                        }
                    </EventContent>
                </div>
            </React.Fragment>
        )
    }
}

export default FAQS
