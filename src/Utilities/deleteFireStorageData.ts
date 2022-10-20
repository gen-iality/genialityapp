import { DispatchMessageService } from '@context/MessageService';
import { fireStorage } from '@helpers/firebase';

export const deleteFireStorageData = async (fileUrl: string) => {
  let theFileWasDeleted = '';
  try {
    // Create a reference to the file to delete
    const fileRef = fireStorage.refFromURL(fileUrl);

    /** Skip template directory */
    const fileRefPath: string = fileRef.fullPath;
    const nameFileRefDirectory: string = fileRefPath.split('/')[0];
    if (nameFileRefDirectory === 'template') {
      // File deleted successfully
      theFileWasDeleted = 'file deleted successfully';
      DispatchMessageService({
        type: 'success',
        msj: theFileWasDeleted,
        action: 'show',
      });
      return;
    }

    // Delete the file using the delete() method
    try {
      await fileRef
        .delete()
        .then(function() {
          // File deleted successfully
          theFileWasDeleted = 'file deleted successfully';
          DispatchMessageService({
            type: 'success',
            msj: theFileWasDeleted,
            action: 'show',
          });
        })
        .catch(function(error: any) {
          // Some Error occurred
          theFileWasDeleted = `error deleting file - ${error}`;
          DispatchMessageService({
            type: 'error',
            msj: theFileWasDeleted,
            action: 'show',
          });
        });
    } catch (error) {
      theFileWasDeleted = `unexpected error - ${error}`;
      DispatchMessageService({
        type: 'error',
        msj: theFileWasDeleted,
        action: 'show',
      });
    }
  } catch (error) {
    theFileWasDeleted = `unexpected error - ${error}`;
    DispatchMessageService({
      type: 'error',
      msj: theFileWasDeleted,
      action: 'show',
    });
  }

  return theFileWasDeleted;
};
