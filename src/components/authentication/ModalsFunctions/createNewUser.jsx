import { saveImageStorage } from '../../../helpers/helperSaveImage';
import { UsersApi } from '@helpers/request';
import { message } from 'antd';
import { DispatchMessageService } from '../../../context/MessageService';

const createNewUser = async (props) => {
  const { picture, email, names, password, resetFields, setModalInfo, setOpenOrCloseTheModalFeedback, cEvent } = props;
  const pictureDefault = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  function sendDataFinished() {
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    resetFields();
  }
  const uploadLogo = async () => {
    const selectedLogo = picture && picture !== '' ? picture[0].thumbUrl : null;

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
      password: password !== '' ? password : undefined,
    };
    try {
      let response = await UsersApi.createUser(body);
      if (response._id) {
        /* setModalInfo({
          status: 'success',
          title: `Bienvenido ${response.names}`,
          description: 'Tu registro ha sido exitoso',
        });
      setOpenOrCloseTheModalFeedback(true);
      sendDataFinished();*/
        return 1;
      }
    } catch (e) {
      //PERMITE VALIDAR CUANDO EL EMAIL ES INCORRECTO
      if (e.response.status == 422 && e.response.data.errors.email[0] !== 'email ya ha sido registrado.') {
        return 2;
      }
      const registeredEmail = e.response.data.errors.email[0];
      if (registeredEmail === 'email ya ha sido registrado.') {
        return 0;
      }
    }
  };

  let resp = await sendData();
  return resp;
};

export default createNewUser;
