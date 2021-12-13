import { app } from './firebase';

export async function GetTokenUserFirebase() {
  return new Promise((resolve, reject) => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then(async function(idToken) {
          resolve(idToken);
        });
      } else {
        reject('unauthenticated user');
      }
    });
  });
}
