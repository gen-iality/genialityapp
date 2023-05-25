import { StateMessage } from '@context/MessageService'
import { fireStorage } from '@helpers/firebase'

export const deleteFireStorageData = async (fileUrl: string) => {
  let theFileWasDeleted = ''
  try {
    // Create a reference to the file to delete
    const fileRef = fireStorage.refFromURL(fileUrl)

    /** Skip template directory */
    const fileRefPath: string = fileRef.fullPath
    const nameFileRefDirectory: string = fileRefPath.split('/')[0]
    if (nameFileRefDirectory === 'template') {
      // File deleted successfully
      theFileWasDeleted = 'file deleted successfully'
      StateMessage.show(null, 'success', theFileWasDeleted)
      return
    }

    // Delete the file using the delete() method
    try {
      await fileRef
        .delete()
        .then(function () {
          // File deleted successfully
          theFileWasDeleted = 'file deleted successfully'
          StateMessage.show(null, 'success', theFileWasDeleted)
        })
        .catch(function (error: any) {
          // Some Error occurred
          theFileWasDeleted = `error deleting file - ${error}`
          StateMessage.show(null, 'error', theFileWasDeleted)
        })
    } catch (error) {
      theFileWasDeleted = `unexpected error - ${error}`
      StateMessage.show(null, 'error', theFileWasDeleted)
    }
  } catch (error) {
    theFileWasDeleted = `unexpected error - ${error}`
    StateMessage.show(null, 'error', theFileWasDeleted)
  }

  return theFileWasDeleted
}
