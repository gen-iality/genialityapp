import React, { Component } from "react";
import FileBase64 from 'react-file-base64';
import { toast } from "react-toastify";
import firebase from 'firebase';
import { firestore } from "../../helpers/firebase";
import TimeStamp from "react-timestamp";
import { saveFirebase } from "./helpers"

class Wall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: "https://firebasestorage.googleapis.com/v0/b/eviusauth.appspot.com/o/avatar0.png?alt=media&token=26ace5bb-f91f-45ca-8461-3e579790f481",
            files: [],
            urlPost: "",
            comment: "",
            fileName: "",
            dataPost: [],
            dataComment: [],
            idPostComment: []
        }
        this.savePost = this.savePost.bind(this)
        this.cancelUpload = this.cancelUpload.bind(this)
        this.previewImage = this.previewImage.bind(this)
        this.comments = this.comments.bind(this)
    }

    //Se monta el componente getPost antes
    componentDidMount = async () => {
        this.getPost()
    }

    // se obtienen los comentarios, Se realiza la muestra del modal y se envian los datos a dataComment del state
    async getComments(postId) {
        document.querySelectorAll('.modal-button').forEach(function (el) {
            el.addEventListener('click', function () {
                var target = document.querySelector(el.getAttribute('data-target'));

                target.classList.add('is-active');

                target.querySelector('.modal-close').addEventListener('click', function () {
                    target.classList.remove('is-active');
                });
            });
        });

        const dataComment = [];

        let admincommentsRef = firestore.collection('adminPost').doc(`${this.props.event._id}`).collection('comment').doc(`${postId}`).collection('comments')
        let query = admincommentsRef.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No hay ningun comentario');
                this.setState({ dataComment:[] })
                return;
            }
            snapshot.forEach(doc => {
                dataComment.push({
                    id: doc.id,
                    comment: doc.data().comment,
                    idPost: doc.data().idPost,
                    author: doc.data().author
                })
                this.setState({ dataComment })
            });
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }

    //Se obtienen los post para mapear los datos, no esta en ./helpers por motivo de que la promesa que retorna firebase no se logra pasar por return
    async getPost() {
        const dataPost = [];

        let adminPostRef = firestore.collection('adminPost').doc(`${this.props.event._id}`).collection('posts')
        let query = adminPostRef.get().then(snapshot => {
            if (snapshot.empty) {
                toast.error('No hay ningun post');
                return;
            }
            snapshot.forEach(doc => {
                dataPost.push({
                    id: doc.id,
                    author: doc.data().author,
                    urlImage: doc.data().urlImage,
                    post: doc.data().post,
                    datePost: doc.data().datePost
                })

                this.setState({ dataPost })
            });
        }).catch(err => {
            console.log('Error getting documents', err);
        });
    }

    //Funcion para guardar el post, Se recoge la informacion y se envia a ./helpers, se valida si trae imagen o no
    async savePost() {
        const image = document.getElementById("image").files[0]
        if (!image) {
            const text = document.getElementById("postText").value
            //savepost se realiza para publicar el post sin imagen
            saveFirebase.savePost(text, this.props.event.author.email, this.props.event._id)
        } else {
            // let imageUrl = this.saveImage(image)
            let imageUrl = saveFirebase.saveImage(this.props.event._id, image)
            console.log("Datos de imagen obtenidos")
            const text = document.getElementById("postText").value
            //savePostImage se realiza para publicar el post con imagen
            saveFirebase.savePostImage(imageUrl, text, this.props.event.author.email, this.props.event._id)
        }
    }

    //Se salva el comentario, el proceso se encuentra en ./helpers.js 
    async saveComment(idPost) {
        let email = this.props.event.author.email
        let eventId = this.props.event._id
        let comments = document.getElementById("comment").value
        saveFirebase.saveComment(email, eventId, comments, idPost)
    }

    //Funcion para limpiar el files e image los cuales muestran el preview de la imagen
    cancelUpload() {
        this.setState({ files: [], image: [] })
    }

    //Funcion para observar la imagen antes de publicarla
    previewImage(event) {
        console.log(URL.createObjectURL(event.target.files[0]))

        this.setState({
            image: URL.createObjectURL(event.target.files[0])
        })
    }

    //Funcion para eliminar post
    async deletePost(postId) {
        saveFirebase.deletePost(postId, this.props.event._id)
    }

    render() {
        const { dataPost, dataComment, texto, image } = this.state
        return (
            <div>
                <div className="columns is-mobile">
                    <div className="column is-12">
                        {/* Se valida si hay imagen para mostrar o no */}
                        <input type="file" id="image" onChange={this.previewImage} />
                        <div>
                            {
                                image ?
                                    <div className="column is-6 card-image">
                                        <figure className="image is-4by3">
                                            <img src={image} alt="Placeholder image" />
                                            <button className="button is-primary" onClick={this.cancelUpload}>Cancelar</button>
                                        </figure>
                                    </div> :
                                    <p></p>
                            }
                        </div>
                        {/* Aqui se termina la muestra de la informacion */}

                        {/* se crea input para agregar un comentario al post */}
                        <div>
                            <label className="label">Comentario</label>
                            <input className="input" id="postText" type="text" />
                        </div>
                        {/* se finaliza input de comentario */}

                        <div>
                            <button onClick={this.savePost}>Guardar</button>
                        </div>

                        {/* se guarda la informacion */}
                    </div>
                </div>

                {/* se mapean los datos que provienen de firebase del post            */}
                <div className="columns is-6">
                    {dataPost.map((post, key) => (
                        <div className="card column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd" key={key}>
                            <div className="card-image">
                                <figure className="image is-4by3">
                                    {
                                        post.urlImage ?
                                            <img src={post.urlImage[0]} alt="Placeholder image" />
                                            :
                                            <div />
                                    }

                                </figure>
                                <TimeStamp date={post.datePost.seconds} />
                            </div>
                            {/* Se muestra en card los post registrados */}
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-left">
                                        <figure className="image is-48x48">
                                            <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <p className="title is-4">{post.author}</p>
                                        <p className="subtitle is-6">{post.post}</p>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    <div className="column is-6">
                                        <label className="label">Responder</label>
                                        <input className="input" id="comment" />
                                        <button onClick={e => { this.saveComment(post.id) }} className={`button is-primary`}>Enviar</button>
                                        <button onClick={e => { this.deletePost(post.id) }} className={`button is-danger`}>Eliminar</button>
                                    </div>

                                    {/* se mapean los comentarios los cuales estan pendientes por validacion        */}
                                    <div className="column is-5">
                                        <button className="button is-primary modal-button" onClick={e => { this.getComments(post.id) }} data-target="#myModal" aria-haspopup="true">Comentarios</button>

                                        <div className="modal" id="myModal">
                                            <div className="modal-background"></div>
                                            <div className="modal-content">
                                                <div className="box">
                                                    <div className="column is-12">
                                                        {
                                                            dataComment.map((commentier, key) => (
                                                                <div className="card" key={key} style={{ marginBottom: "4%" }}>

                                                                    <header className="card-header">
                                                                        <p className="card-header-title">
                                                                            {
                                                                                <p>{commentier.author}</p>
                                                                            }
                                                                        </p>
                                                                    </header>
                                                                    <div className="card-content">
                                                                        <div className="content">
                                                                            <br />
                                                                            <p>{commentier.comment}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="modal-close is-large" aria-label="close"></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Se termina de mapear los datos de post */}
                </div>
            </div>
        )
    }
}

export default Wall