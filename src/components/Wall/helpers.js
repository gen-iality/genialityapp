import firebase from 'firebase';
import { firestore } from "../../helpers/firebase";
import { toast } from "react-toastify";

export const saveFirebase = {
    async saveImage(eventId, image) {
        //Se abre la conexion a firebase
        const ref = firebase.storage().ref();
        //se crea una referencia tipo child para guardar las imagenes del post en el storage
        const uploadTask = ref.child(`imagesPost/${eventId}/${image.name}`).put(image)

        //Se hace una constante para realizar push de la url 
        const urlImage = []

        //se consulta la url mediante uploadTask.snapshot.ref.getDownloadURL(),
        // y se ejecuta la funcion para poder obtener dicha url 
        await uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            urlImage.push(downloadURL)
        })
        // se retorna la url de la imagen del post para poder guardar la imagen como url
        return urlImage
    },

    async saveComment(email, eventId, comments, idPost) {
        const data = {
            author: email,
            comment: comments,
            idPost: idPost
        }

        console.log(data)

        let addComment = firestore.collection('adminPost').doc(`${eventId}`).collection('comment').doc(`${idPost}`).collection('comments').add(data)
        console.log(await addComment)
        toast.success("Datos Guardados")
        window.location.reload()
    },

    async savePost(text, authorPost, eventId) {
        let data = {
            post: text,
            author: authorPost,
            datePost: new Date()
        };

        console.log(data)
        let addDoc = firestore.collection('adminPost').doc(`${eventId}`).collection('posts').add(data)
        toast.success("Datos Guardados")
        window.location.reload()
    },
    async savePostImage(imageUrl, text, author, eventId) {
        let data = {
            urlImage: await imageUrl,
            post: text,
            author: author,
            datePost: new Date()
        };

        console.log(data)
        let addDoc = firestore.collection('adminPost').doc(`${eventId}`).collection('posts').add(data)
        toast.success("Datos Guardados")
        window.location.reload()
    },
    async deletePost(postId, eventId) {
        firestore.collection('adminPost').doc(`${eventId}`).collection('posts').doc(`${postId}`).delete();

        // const comment = firestore.collection('adminPost').doc(`${eventId}`).collection('comment').doc(`${postId}`).delete();
        // console.log(await comment)

        var query = firestore.collection('adminPost').doc(`${eventId}`).collection('comment').doc(`${postId}`).collection('comments');
        query.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });
        })

        toast.success("Dato eliminado")
        // window.location.reload()
    }
}