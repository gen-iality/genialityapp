import { saveImageStorage } from '../../../helpers/helperSaveImage';
import { UsersApi } from '../../../helpers/request';
import { message } from 'antd';
const createNewUser = (props) => {
  const { picture, email, names, password, resetFields, setModalInfo, setOpenOrCloseTheModalFeedback } = props;

  const pictureDefault = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  message.loading({
    duration: 90,
    key: 'loading',
    content: 'Se está registrando el usuario.',
  });

  function sendDataFinished() {
    message.destroy('loading');
    resetFields();
  }
  const uploadLogo = async () => {
    const selectedLogo = picture !== null ? picture[0].thumbUrl : null;

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
      const response = await UsersApi.createUser(body);
      if (response?._id)
        setModalInfo({
          status: 'success',
          title: `Bienvenido ${response.names}`,
          description: 'Tu registro ha sido exitoso',
        });
      setOpenOrCloseTheModalFeedback(true);
      sendDataFinished();
    } catch (e) {
      // console.log(e.response);
      const registeredEmail = e.response.data.errors.email[0];
      if (registeredEmail === 'email ya ha sido registrado.') {
        setModalInfo({
          status: 'error',
          title: `Lo sentimos ${names}`,
          description: `El email ${email}, ya se encuentra registrado en nuestra plataforma`,
        });
      }
      setOpenOrCloseTheModalFeedback(true);
      sendDataFinished();
    }
  };

  sendData();
};

export default createNewUser;
