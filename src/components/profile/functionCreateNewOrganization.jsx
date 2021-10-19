import { saveImageStorage } from '../../helpers/helperSaveImage';
import { OrganizationApi } from '../../helpers/request';
import { message } from 'antd';
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
  const loading = message.loading({
    duration: 90,
    key: 'loading',
    content: 'Estamos creando la organización.',
  });

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
    /** se trae la function fetchItem desde el main.jsx para poder actualizar la data */
    await props.fetchItem();
    props.resetFields();
    if (response?._id) {
      message.destroy(loading.key);
      message.success('Organización creada correctamente');
      props.closeModal(false);
    } else {
      message.error('La organización no pudo ser creada');
      this.props.closeModal(false);
    }
  };

  sendData();
};

export default functionCreateNewOrganization;
