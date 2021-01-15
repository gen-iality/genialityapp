import { firestore, fireStorage } from '../../helpers/firebase';
import { toast } from 'react-toastify';

export const saveFirebase = {
  async saveComment(author_id, comment, date, eventId, idPost) {},

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
      toast.warning('Los datos necesarios no se han registrado, por favor intenta de nuevo');
      console.log(e);
    }
  },

  async increaseLikes(postId, eventId, userId) {
    var docRef = await firestore
      .collection('adminPost')
      .doc(eventId)
      .collection('posts')
      .doc(postId);

    
    var docSnap = await docRef.get();
    var doc = docSnap.data();

    
    var count = doc['userLikes'].length; //cuenta la cantidad de usuarios que han dado like
    const array = doc['userLikes']; //asigna a un array los uauruarios que han dado like  
    
    // si el usuario actual no se encuntra en el array, lo guarda y suma al contador de like
    if(array.filter(user => user == userId).length == 0){
      array.push(userId)
     
      doc['userLikes'] = array
      doc['likes'] = count + 1;
      doc['id'] = docRef.id;
      await docRef.update(doc);
     
    }
    // si el usuario actual se encuentra en el array lo elimina y reduce el contador de like
    else{
      const newArray = array.filter(user => user !== userId)
      
      doc['userLikes'] = newArray
      doc['likes'] = count - 1;
      doc['id'] = docRef.id;
      await docRef.update(doc);

    }

    return doc;

  },

  async createComment(postId, eventId, comment, author) {
    // const data = {
    //   author: '',
    //   authorName: author.names ? author.names : author.name ? author.names : author.email,
    // };
    // var docRef = await firestore
    //   .collection('adminPost')
    //   .doc(eventId)
    //   .collection('posts')
    //   .doc(postId);
    // var docSnap = await docRef.get();
    // var doc = docSnap.data();
    // console.log('comments', doc);
    // doc['comments'] = doc.comments ? doc.comments + 1 : 1;
    // doc['id'] = docRef.id;
    // await docRef.update(doc);
    // let result = await firestore
    //   .collection("adminPost")
    //   .doc(eventId)
    //   .collection("comment")
    //   .doc(postId)
    //   .collection("comments")
    //   .add(data);
    //return result;
    //return doc;
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

      var querySnapshot = await query.get();
      if (querySnapshot) {
        querySnapshot.forEach(async function(doc) {
          await doc.ref.delete();
        });
      }
      return true;
    } catch (e) {
      console.log(e);
      toast.warning('La información aun no ha sido eliminada, por favor intenta de nuevo');
    }

    return true;
  },
};
