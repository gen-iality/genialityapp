import { saveImageStorage } from '@helpers/helperSaveImage';
import { UsersApi } from '@helpers/request';

/**
 * Use this constants to know how the creating process went.
 */

export const CREATE_NEW_USER_FAIL = 'CREATE_NEW_USER_FAIL'
export const CREATE_NEW_USER_SUCCESS = 'CREATE_NEW_USER_SUCCESS'
export const CREATE_NEW_USER_FAIL_BECAUSE_EMAIL = 'CREATE_NEW_USER_FAIL_BECAUSE_EMAIL'

export type UserDataType = {
  picture: any,
  email: string,
  names: string,
  password: string,
}

export type CreateNewUserResultType = {
  user: any | null,
  status: string,
  message: string,
}

/**
 * Upload the picture to FireStorage and return the picture URL.
 * 
 * @param picture A picture object that has to have a thumbUrl attrib.
 * @param defaultPictureURL A default picture URL.
 * @returns Final picture URL.
 */
const uploadLogo = async (picture: any, defaultPictureURL: string): Promise<string> => {
  const selectedLogo = picture?.[0]?.thumbUrl ?? null;

  if (selectedLogo) {
    const urlOfTheUploadedImage = await saveImageStorage(selectedLogo);

    if (urlOfTheUploadedImage !== null)
      return urlOfTheUploadedImage;
  }

  return defaultPictureURL;
};

/**
 * Create a new user and return an user registration status.
 * @param userData Info about the user registration process.
 * @returns An object that contains: user, status and message
 */
const createNewUser = async (userData: UserDataType, onFinish?: () => void): Promise<CreateNewUserResultType> => {
  const { picture, email, names, password } = userData;

  const defaultPicture = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  const pictureURL = await uploadLogo(picture, defaultPicture);

  const body = {
    picture: pictureURL,
    email,
    names,
    password: password || undefined,
  };

  let isErrorByExistentEmail = false
  let errorMessage = 'Error inesperado al registrar el usuario'

  try {
    const response = await UsersApi.createUser(body);
    if (response._id) {
      onFinish && onFinish()
      // HAHA! I remember when Juan change 1 for `response`, now some bugs happen
      return {
        user: response,
        status: CREATE_NEW_USER_SUCCESS,
        message: 'Usuario registrado',
      };
    }
  } catch (e: any) {
    // Permite validar cuando el email es incorrecto
    const registeredEmail = e.response.data.errors.email[0];
    errorMessage = registeredEmail

    // NOTE: I think that this way to check if the issues was because the email, is awful
    if (e.response.status == 422 && registeredEmail !== 'email ya ha sido registrado.') {
      isErrorByExistentEmail = false;
    } else if (registeredEmail === 'email ya ha sido registrado.') {
      isErrorByExistentEmail = true;
    }
  }

  return {
    user: null,
    status: isErrorByExistentEmail ? CREATE_NEW_USER_FAIL_BECAUSE_EMAIL : CREATE_NEW_USER_FAIL,
    message: errorMessage,
  };
};

export default createNewUser;
