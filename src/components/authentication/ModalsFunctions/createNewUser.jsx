import { saveImageStorage } from '../../../helpers/helperSaveImage';
import { UsersApi } from '../../../helpers/request';
import { message } from 'antd';
const createNewUser = async (props) => {
  const { picture, email, names, password, resetFields, setModalInfo, setOpenOrCloseTheModalFeedback } = props;

  const pictureDefault = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  function sendDataFinished() {
    message.destroy('loading');
    resetFields();
  }
  const uploadLogo = async () => {
    const selectedLogo = picture !== null && picture != '' ? picture[0].thumbUrl : null;

    if (selectedLogo) {
      const urlOfTheUploadedImage = await saveImageStorage(selectedLogo);

      return urlOfTheUploadedImage;
    }
    return pictureDefault;
  };

  const sendData = async () => {
    const imageUrl = await uploadLogo();

    const body = {
      picture: imageUrl,
      email: email,
      names: names,
      password: password,
    };
    try {
      let response = await UsersApi.createUser(body);
      if (response){
        /* setModalInfo({
          status: 'success',
          title: `Bienvenido ${response.names}`,
          description: 'Tu registro ha sido exitoso',
        });
      setOpenOrCloseTheModalFeedback(true);
      sendDataFinished();*/
        return true;
      }
    } catch (e) {
      // console.log(e.response);
      const registeredEmail = e.response.data.errors.email[0];
      if (registeredEmail === 'email ya ha sido registrado.') {
        return false;
      }
    }
  };

  let resp = await sendData();
  return resp;
};

export default createNewUser;
