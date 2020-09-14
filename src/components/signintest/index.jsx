import React from 'react';
import { userContext } from '../../containers/userContext';
export default () => {

    // http://localhost:3000/?apiKey=AIzaSyATmdx489awEXPhT8dhTv4eQzX3JW308vc&oobCode=e4W2VepAbeejxCxZZyD4sM-YmdQO5sT2P6lpGv_N068AAAFxrAyQag&mode=signIn&lang=es
    // Confirm the link is a sign-in with email link.
    // if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    //     Additional state parameters can also be passed via URL.
    //     This can be used to continue the user's intended action before triggering
    //     the sign-in operation.
    //     Get the email if available. This should be available if the user completes
    //     the flow on the same device where they started it.
    //     var email = window.localStorage.getItem('emailForSignIn');
    //     if (!email) {
    //       User opened the link on a different device. To prevent session fixation
    //       attacks, ask the user to provide the associated email again. For example:
    //       email = window.prompt('Please provide your email for confirmation');
    //     }
    //     The client SDK will parse the code from the link for you.
    //     firebase.auth().signInWithEmailLink(email, window.location.href)
    //       .then(function(result) {
    //         Clear email from storage.
    //         window.localStorage.removeItem('emailForSignIn');
    //         You can access the new user via result.user
    //         Additional user info profile not available via:
    //         result.additionalUserInfo.profile == null
    //         You can check if the user is new or existing:
    //         result.additionalUserInfo.isNewUser
    //       })
    //       .catch(function(error) {
    //         Some error occurred, you can inspect the code: error.code
    //         Common errors could be invalid email and invalid or expired OTPs.
    //       });
    //   }






    return (
        <userContext.Consumer>
            {(value) => (<h2 className="is-size-2 bold-text">Sign In Test {value.name}</h2>)}
        </userContext.Consumer>
    )
}