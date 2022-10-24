import { firestore, fireStorage } from '../../helpers/firebase';
import { DispatchMessageService } from '../../context/MessageService';

export const saveFirebase = {
  async savePost(data, eventId) {
    try {
      if (data.urlImage) {
        var storageRef = fireStorage.ref();
        var imageName = Date.now();
        var imageRef = storageRef.child('images/' + imageName + '.png');
        var snapshot = await imageRef.putString(data.urlImage, 'data_url');
        var imageUrl = await snapshot.ref.getDownloadURL();

        data.urlImage = imageUrl;
      }

      var docRef = await firestore
        .collection('adminPost')
        .doc(`${eventId}`)
        .collection('posts')
        .add(data);

      var postSnapShot = await docRef.get();
      var post = postSnapShot.data();
      post.id = postSnapShot.id;

      return post;
    } catch (e) {
      DispatchMessageService({
        type: 'warning',
        msj: 'Los datos necesarios no se han registrado, por favor intenta de nuevo',
        action: 'show',
      });
    }
  },

  async increaseLikes(postId, eventId, userId) {
    var docRef = firestore
      .collection('adminPost')
      .doc(eventId)
      .collection('posts')
      .doc(postId);

    var docSnap = await docRef.get();
    var doc = docSnap.data();

    var count = doc['usersLikes'].length; //cuenta la cantidad de usuarios que han dado like
    const array = doc['usersLikes']; //asigna a un array los uauruarios que han dado like

    // si el usuario actual no se encuntra en el array, lo guarda y suma al contador de like
    if (array.filter((user) => user == userId).length == 0) {
      array.push(userId);

      doc['usersLikes'] = array;
      doc['likes'] = count + 1;
      doc['id'] = docRef.id;
      await docRef.update(doc);
    }
    // si el usuario actual se encuentra en el array lo elimina y reduce el contador de like
    else {
      const newArray = array.filter((user) => user !== userId);

      doc['usersLikes'] = newArray;
      doc['likes'] = count - 1;
      doc['id'] = docRef.id;
      await docRef.update(doc);
    }

    return doc;
  },

  async createComment(postId, eventId, comment, user) {
    /* console.log('USER COMMENTARIO==>', user); */
    const dataPost = [];
    var docRef = await firestore
      .collection('adminPost')
      .doc(eventId)
      .collection('posts')
      .doc(postId);
    var docSnap = await docRef.get();
    var doc = docSnap.data();

    doc['comments'] = doc.comments ? doc.comments + 1 : 1;
    doc['id'] = docRef.id;
    await docRef.update(doc);
    let posts = await firestore
      .collection('adminPost')
      .doc(eventId)
      .collection('posts')
      .orderBy('datePost', 'desc');
    //GUARDAR COMENTARIO
    let admincommentsRef = firestore
      .collection('adminPost')
      .doc(eventId)
      .collection('comment')
      .doc(postId)
      .collection('comments')
      .add({
        author: user._id,
        authorName: user.names || user.email,
        comment: comment,
        date: new Date(),
        idPost: postId,
        picture: user.picture || '',
      });

    /* let snapshot = await posts.get();
     snapshot.forEach((doc) => {
       var data = doc.data();
       data.id = doc.id;
 
       dataPost.push(data);
     });
     return dataPost;*/
  },

  async deletePost(postId, eventId) {
    try {
      await firestore
        .collection('adminPost')
        .doc(eventId)
        .collection('posts')
        .doc(postId)
        .delete();

      var query = firestore
        .collection('adminPost')
        .doc(eventId)
        .collection('comment')
        .doc(postId)
        .collection('comments');

      var queryPostId = firestore
        .collection('adminPost')
        .doc(eventId)
        .collection('comment')
        .doc(postId);

      var querySnapshot = await query.get();
      if (querySnapshot) {
        querySnapshot.forEach(async function(doc) {
          await doc.ref.delete();
        });
        queryPostId.delete();
      }
      return true;
    } catch (e) {
      DispatchMessageService({
        type: 'warning',
        msj: 'La información aun no ha sido eliminada, por favor intenta de nuevo',
        action: 'show',
      });
    }

    return true;
  },
};
