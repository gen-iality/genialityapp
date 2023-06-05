import { fireStorage } from './firebase'

/**
 * save an imagen in FireStorage.
 * @param {Image} image IDK what type of file should be this
 * @returns the image url
 */
export const saveImageStorage = async (image) => {
  if (image) {
    const imageName = Date.now()
    const storageRef = fireStorage.ref()
    const imageRef = storageRef.child('images/' + imageName + '.png')
    const snapshot = await imageRef.putString(image, 'data_url')
    return await snapshot.ref.getDownloadURL()
  }
  return null
}
