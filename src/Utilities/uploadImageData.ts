import { StateMessage } from '@context/MessageService'
import { handleRequestError, uploadImage } from '@helpers/utils'

export const uploadImageData = async (image: string | object) => {
  let imagenUrl = null
  if (image && typeof image === 'object') {
    try {
      imagenUrl = await uploadImage(image)
    } catch (e) {
      imagenUrl = null
      StateMessage.show(
        null,
        'error',
        `Error al guardar la imagen: ${handleRequestError(e).message}`,
        8,
      )
    }
  }
  if (typeof image === 'string') {
    imagenUrl = image
  }
  return imagenUrl
}
