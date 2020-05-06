import firebase from "firebase";
import { firestore } from "../../helpers/firebase";
import { toast } from "react-toastify";

export const saveFirebase = {
  async saveComment(email, comments, date, eventId, idPost) {
    const data = {
      author: email,
      comment: comments,
      date: date,
      idPost: idPost,
    };

    //console.log(data)
    firestore
      .collection("adminPost")
      .doc(`${eventId}`)
      .collection("comment")
      .doc(`${idPost}`)
      .collection("comments")
      .add(data);
    //console.log(await addComment)
  },

  async savePost(data, eventId) {
    try {
      firestore
        .collection("adminPost")
        .doc(`${eventId}`)
        .collection("posts")
        .add(data);
    } catch (e) {
      toast.warning("Los datos necesarios no se han registrado, por favor intenta de nuevo");
      console.log(e);
    }
  },

  async deletePost(postId, eventId) {
    try {
      firestore
        .collection("adminPost")
        .doc(`${eventId}`)
        .collection("posts")
        .doc(`${postId}`)
        .delete();

      // const comment = firestore.collection('adminPost').doc(`${eventId}`).collection('comment').doc(`${postId}`).delete();
      // console.log(await comment)

      var query = firestore
        .collection("adminPost")
        .doc(`${eventId}`)
        .collection("comment")
        .doc(`${postId}`)
        .collection("comments");
      query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.delete();
        });
      });
    } catch (e) {
      toast.warning("La información aun no ha sido eliminada, por favor intenta de nuevo");
    }
  },
};
