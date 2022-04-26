// this function validates us if there is an error in a page to load in an ifrmae
export const urlErrorCodeValidation = (url: string, ignoreFirebaseStorage: boolean) => {
  // Se valida firebase storage url ya que esta siempre devuelve 400 en este request de muestreo
  const firebaseStorageValidation = url.includes('firebase');

  if (ignoreFirebaseStorage && firebaseStorageValidation) return false;

  let http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();

  if (http.status < 400) return false;
  else return true;
};
