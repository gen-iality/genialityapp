import { fireStorage } from '@/helpers/firebase';

export const deleteImageData = async (image: string) => {
  try {
    const imageUrlRefArr = image?.split('/');
    const imageRef = `${imageUrlRefArr[4]}/${imageUrlRefArr[5]}/${imageUrlRefArr[6]}`;
    var removeRef = fireStorage.ref().child(imageRef as string);
    await removeRef.delete();
  } catch (error) {
    return `Error de tipo: ${error}`;
  }
};
