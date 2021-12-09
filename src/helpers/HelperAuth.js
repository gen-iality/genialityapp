import { app } from './firebase';

export async function GetTokenUserFirebase() {
  let response = app.auth().onAuthStateChanged((user) => {
    if (user) {
      user.getIdToken().then(async function(idToken) {
        return idToken;
      });
    }
  });

  return response;
}
