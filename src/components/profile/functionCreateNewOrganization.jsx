import { saveImageStorage } from '../../helpers/helperSaveImage';
import { OrganizationApi } from '../../helpers/request';

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

  const uploadLogo = async () => {
    if (props.logo !== null && props.logo.length > 0) {
      const urlOfTheUploadedImage =
        //   await saveImageStorage(props.logo.fileList[0].thumbUrl);
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXAFdyWWUZrK2dG6oJBLkhcSZFl6tAE-qYBg&usqp=CAU';
      return urlOfTheUploadedImage;
    }
    return null;
  };

  const sendData = async () => {
    const imageUrl = await uploadLogo();
    const dataStyles = { ...styles, event_image: imageUrl };
    // console.log('10. data STYLOS ', dataStyles);
    const body = {
      name: props.name,
      styles: dataStyles,
    };
    console.log('10. BODY  ==>> ', body);
    // const data = await OrganizationApi.createOrganization(body);
  };

  sendData();
};

export default functionCreateNewOrganization;
