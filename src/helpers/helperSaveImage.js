import { fireStorage } from './firebase';

export const saveImageStorage = async (image) => {
  if (image) {
    const imageName = Date.now();
    const storageRef = fireStorage.ref();
    const imageRef = storageRef.child('images/' + imageName + '.png');
    const snapshot = await imageRef.putString(image, 'data_url');
    const imageUrl = await snapshot.ref.getDownloadURL();
    const urlImage = imageUrl;
    return urlImage;
  }
  return null;
};
