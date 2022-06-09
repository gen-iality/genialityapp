import { fireStorage } from '@/helpers/firebase';

export const deleteFireStorageData = async (fileUrl: string) => {
  let theFileWasDeleted = '';
  try {
    // Create a reference to the file to delete
    let fileRef = fireStorage.refFromURL(fileUrl);

    // The reference is validated so as not to show a 404 by console in case a file is deleted and it is not saved and by chance the file is loaded and it is deleted again
    const validatorTypeRef = fileRef;

    if (typeof validatorTypeRef !== 'string') return 'the reference does not exist';

    // Delete the file using the delete() method
    await fileRef
      .delete()
      .then(function() {
        // File deleted successfully
        theFileWasDeleted = 'file deleted successfully';
      })
      .catch(function(error: any) {
        // Some error occurred
        theFileWasDeleted = 'error deleting file';
      });
  } catch (error) {
    theFileWasDeleted = 'unexpected error';
  }

  return theFileWasDeleted;
};
