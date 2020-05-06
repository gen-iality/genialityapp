import firebase from "firebase";
import { firestore, fireStorage } from "../../helpers/firebase";
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
    console.log(typeof data.urlImage);

    try {
      if (data.urlImage) {
        var storageRef = fireStorage.ref();
        var imageName = Date.now();
        var imageRef = storageRef.child("images/" + imageName + ".png");
        var snapshot = await imageRef.putString(data.urlImage, "data_url");
        var imageUrl = await snapshot.ref.getDownloadURL();

        console.log("imageUrl", imageUrl);
        data.urlImage = imageUrl;
      }

      var docRef = await firestore
        .collection("adminPost")
        .doc(`${eventId}`)
        .collection("posts")
        .add(data);

      var postSnapShot = await docRef.get();
      var post = postSnapShot.data();
      post.id = postSnapShot.id;
      console.log("docRef", post);

      return post;
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
