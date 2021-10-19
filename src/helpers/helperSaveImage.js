import { fireStorage } from './firebase';

export const saveImageStorage = async (image) => {
  if (image) {
    var imageName = Date.now();
    var storageRef = fireStorage.ref();
    var imageRef = storageRef.child('images/' + imageName + '.png');
    var snapshot = await imageRef.putString(image, 'data_url');
    var imageUrl = await snapshot.ref.getDownloadURL();
    let urlImage = imageUrl;
    return urlImage;
  }
  return null;
};
