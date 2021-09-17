import React, { useState } from 'react';
import { useEffect } from 'react';
import { getCurrentUser } from '../helpers/request';

export const CurrentUserContext = React.createContext();

let initialContextState = { status: 'LOADING', value: null };

export function CurrentUserProvider({ children }) {
   const [currentUser, setCurrentUser] = useState(initialContextState);
   const anonymousUserPhotoProfile = 'https://bit.ly/3zdPzgR';

   useEffect(async () => {
      let dataUser = await getCurrentUser();

      if (!dataUser) {
         firebase
            .auth()
            .signInAnonymously()
            .then((anonymousUser) => {
               if (anonymousUser) {
                  //nombre aleatorio para el anonimo
                  const userUid = anonymousUser.user.uid;
                  const anonymousName = `Anonimo-${userUid.substr(1, 5)}`;
                  // Updates the user attributes:
                  anonymousUser.user
                     .updateProfile({
                        // <-- Update Method here

                        displayName: anonymousName,
                        photoURL: anonymousUserPhotoProfile,
                     })
                     .then(
                        function() {
                           // Profile updated successfully!
                           const anonymousUserData = {
                              isAnonymous: anonymousUser.user.isAnonymous,
                              names: anonymousUser.user.displayName,
                              picture: anonymousUser.user.photoURL,
                              uid: anonymousUser.user.uid,
                              _id: anonymousUser.user.uid,
                           };
                           setCurrentUser({ status: 'LOADING', value: anonymousUserData });
                        },
                        function(error) {
                           // An error happened.
                        }
                     );
               }
            })
            .catch((error) => {
               var errorCode = error.code;
               var errorMessage = error.message;
               // ...
            });
      } else {
         setCurrentUser({ status: 'LOADING', value: dataUser });
      }
   }, []);

   return <CurrentUserContext.Provider value={currentUser}>{children}</CurrentUserContext.Provider>;
}

export function UseCurrentUser() {
   const contextuser = React.useContext(CurrentUserContext);
   if (!contextuser) {
      throw new Error('currentUser debe estar dentro del proveedor');
   }

   return contextuser;
}
