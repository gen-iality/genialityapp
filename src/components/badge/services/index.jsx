import { BadgeApi } from '../../../helpers/request';

export const getInitialValues = async (event, setValues, setQrExist) => {
  if (event) {
    const resp = await BadgeApi.get(event._id);
    if (resp._id) {
      let badgesFilter = resp.BadgeFields.filter((i) => i.qr || (!i.qr && i.id_properties));
      setValues(badgesFilter);
      let qr = badgesFilter.find((bagde) => bagde.qr === true);
      if (qr) setQrExist(true);
    }
  }
};

export const saveBadge = async (event, badges, message) => {
  if (event) {
    let data = {
      fields_id: event._id,
      BadgeFields: badges,
    };
    try {
      const resp = await BadgeApi.create(data);

      if (resp._id) {
        message.success('Escarapela guardada');
      } else {
        message.warning('Ocurrio algo');
      }
    } catch (err) {
      console.log(err.response);
      message.error('Error al guardar', err.response);
    }
  }
};
