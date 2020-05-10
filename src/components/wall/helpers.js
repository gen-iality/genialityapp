import firebase from "firebase";
import { firestore, fireStorage } from "../../helpers/firebase";
import { toast } from "react-toastify";

export const saveFirebase = {
  async saveComment(author_id, comment, date, eventId, idPost) {},

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

  async increaseLikes(postId, eventId) {
    console.log("newPost", postId, eventId);
    var docRef = await firestore
      .collection("adminPost")
      .doc(eventId)
      .collection("posts")
      .doc(postId);

    var docSnap = await docRef.get();

    var doc = docSnap.data();
    console.log("postId", doc, postId, docRef, docSnap);
    doc["likes"] = doc.likes ? doc.likes + 1 : 1;
    doc["id"] = docRef.id;
    await docRef.update(doc);
    return doc;
  },

  async createComment(postId, eventId, comment, authorId, authorName) {
    console.log("newPost", postId, eventId);
    var docRef = await firestore
      .collection("adminPost")
      .doc(eventId)
      .collection("posts")
      .doc(postId);

    var docSnap = await docRef.get();

    var doc = docSnap.data();
    console.log("postId", doc, postId, docRef, docSnap);
    doc["comments"] = doc.comments ? doc.comments + 1 : 1;
    doc["id"] = docRef.id;
    await docRef.update(doc);

    //await saveComment(author_id, comment, date, eventId, idPost)
    const data = {
      authorId: authorId,
      authorName: authorName || "Anónimo",
      comment: comment,
      date: new Date().toString(),
      idPost: postId,
    };

    //console.log(data)
    let result = await firestore
      .collection("adminPost")
      .doc(eventId)
      .collection("comment")
      .doc(postId)
      .collection("comments")
      .add(data);
    //return result;

    return doc;
  },

  async deletePost(postId, eventId) {
    try {
      await firestore
        .collection("adminPost")
        .doc(eventId)
        .collection("posts")
        .doc(postId)
        .delete();

      var query = firestore
        .collection("adminPost")
        .doc(eventId)
        .collection("comment")
        .doc(postId)
        .collection("comments");

      var querySnapshot = await query.get();
      if (querySnapshot) {
        querySnapshot.forEach(async function(doc) {
          await doc.ref.delete();
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      toast.warning("La información aun no ha sido eliminada, por favor intenta de nuevo");
    }

    return true;
  },
};
