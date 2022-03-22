import { saveImageStorage } from '../../helpers/helperSaveImage';
import { OrganizationApi } from '../../helpers/request';
import { DispatchMessageService } from '../../context/MessageService';

const functionCreateNewOrganization = (props) => {
  const styles = {
    buttonColor: '#FFF',
    banner_color: '#FFF',
    menu_color: '#FFF',
    banner_image: null,
    menu_image: null,
    brandPrimary: '#FFFFFF',
    brandSuccess: '#FFFFFF',
    brandInfo: '#FFFFFF',
    brandDanger: '#FFFFFF',
    containerBgColor: '#ffffff',
    brandWarning: '#FFFFFF',
    toolbarDefaultBg: '#FFFFFF',
    brandDark: '#FFFFFF',
    brandLight: '#FFFFFF',
    textMenu: '#555352',
    activeText: '#FFFFFF',
    bgButtonsEvent: '#FFFFFF',
    banner_image_email: null,
    BackgroundImage: null,
    FooterImage: null,
    banner_footer: null,
    mobile_banner: null,
    banner_footer_email: null,
    show_banner: 'true',
    show_card_banner: false,
    show_inscription: false,
    hideDatesAgenda: true,
    hideDatesAgendaItem: false,
    hideHoursAgenda: false,
    hideBtnDetailAgenda: true,
    loader_page: 'no',
    data_loader_page: null,
  };

  DispatchMessageService({
    type: 'loading',
    key: 'loading',
    msj: !props.newEventWithoutOrganization
      ? 'Estamos creando la organización.'
      : 'Redirigiendo al creador de eventos rápidos',
    duration: 90,
    action: 'show',
  });

  function linkToCreateNewEvent(menuRoute) {
    window.location.href = `${window.location.origin}${menuRoute}`;
  }

  function sendDataFinished() {
    DispatchMessageService({
      key: 'loading',
      action: 'destroy',
    });
    props.closeModal(false);
  }
  const uploadLogo = async () => {
    const selectedLogo = props.logo !== null ? props.logo[0].thumbUrl : null;

    if (selectedLogo) {
      const urlOfTheUploadedImage = await saveImageStorage(selectedLogo);

      return urlOfTheUploadedImage;
    }
    return null;
  };

  const sendData = async () => {
    const imageUrl = await uploadLogo();
    const dataStyles = { ...styles, event_image: imageUrl };
    const body = {
      name: props.name,
      styles: dataStyles,
    };

    const response = await OrganizationApi.createOrganization(body);

    /** si el usuario no tiene una org, primero se crea y despues se redirige al creador de eventos sencillo */
    if (props.newEventWithoutOrganization) {
      if (response?._id) {
        sendDataFinished();
        linkToCreateNewEvent(`/create-event/${response.author}/?orgId=${response._id}`);
      } else {
        sendDataFinished();
        DispatchMessageService({
          type: 'error',
          msj: 'Error al redirigir al creador de eventos rápidos',
          action: 'show',
        });
      }
    } else {
      props.fetchItem && (await props.fetchItem());
      /** se trae la function fetchItem desde el main.jsx para poder actualizar la data */
      props.resetFields && props.resetFields();
      if (response?._id) {
        sendDataFinished();
        DispatchMessageService({
          type: 'success',
          msj: 'Organización creada correctamente',
          action: 'show',
        });
      } else {
        sendDataFinished();
        DispatchMessageService({
          type: 'error',
          msj: 'La organización no pudo ser creada',
          action: 'show',
        });
      }
    }
  };

  sendData();
};

export default functionCreateNewOrganization;
